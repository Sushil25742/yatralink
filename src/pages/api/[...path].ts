import type { VercelRequest,VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { randomBytes,scryptSync,timingSafeEqual } from 'node:crypto';
import OpenAI from 'openai';

type Role='traveler'|'operator'|'superadmin'|'engineer';
type Session={id:string;email:string;name:string;role:Role;expires_at:string};
const url=process.env.SUPABASE_URL;
const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!serviceKey) console.warn('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
const db=createClient(url||'https://invalid.local',serviceKey||'invalid',{auth:{persistSession:false,autoRefreshToken:false}});
const openai=process.env.OPENAI_API_KEY?new OpenAI({apiKey:process.env.OPENAI_API_KEY,baseURL:process.env.OPENAI_BASE_URL||undefined}):null;
const json=(res:VercelResponse,status:number,data:any)=>res.status(status).json(data);
const fail=(res:VercelResponse,status:number,error:string)=>json(res,status,{error});
const body=(req:VercelRequest)=>typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
const normalizedPath=(req:VercelRequest)=>{const p=req.query.path;return `/api/${Array.isArray(p)?p.join('/'):String(p||'')}`};
const localDate=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kathmandu',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const secureHash=(password:string,salt:string)=>scryptSync(password,salt,32).toString('hex');
const verify=(hash:string,salt:string,password:string)=>{const a=Buffer.from(hash,'hex'),b=Buffer.from(secureHash(password,salt),'hex');return a.length===b.length&&timingSafeEqual(a,b)};

async function getSession(id?:string):Promise<Session|null>{
  if(!id)return null;
  const {data}=await db.from('sessions').select('*').eq('id',id).maybeSingle();
  if(!data)return null;
  if(new Date(data.expires_at).getTime()<Date.now()){await db.from('sessions').delete().eq('id',id);return null;}
  return data as Session;
}
async function sessionOr(res:VercelResponse,id?:string,roles?:Role[]){const s=await getSession(id);if(!s){fail(res,401,'Sign in required.');return null}if(roles&&!roles.includes(s.role)){fail(res,403,'This workspace is not available for your role.');return null}return s}
async function createSession(user:{email:string;name:string;role:Role}){const expires=new Date(Date.now()+86400000).toISOString();const {data,error}=await db.from('sessions').insert({email:user.email,name:user.name,role:user.role,expires_at:expires}).select('*').single();if(error)throw error;return data as Session}
async function emit(entity_type:string,entity_id:string,payload:any){await db.from('realtime_events').insert({entity_type,entity_id,payload})}

const expOut=(x:any)=>({id:x.id,title:x.title,operatorId:x.operator_id,category:x.category,price:x.price,capacity:x.capacity,status:x.status,bookings:x.bookings,rating:x.rating});
const bookingOut=(x:any)=>({id:x.id,guest:x.guest,userEmail:x.user_email,experienceId:x.experience_id,experienceTitle:x.experience_title,operatorId:x.operator_id,date:x.date,time:x.time,guests:x.guests,amount:x.amount,status:x.status,createdAt:new Date(x.created_at).getTime()});
const crowdOut=(x:any)=>({id:x.id,name:x.name,level:x.level,score:x.score,wait:x.wait,lat:x.lat,lng:x.lng,source:x.source,updatedAt:new Date(x.updated_at).getTime()});
const slotOut=(x:any)=>({id:x.id,experienceId:x.experience_id,operatorId:x.operator_id,day:x.day,time:x.time,available:x.available,capacity:x.capacity,booked:x.booked});
const reviewOut=(x:any)=>({id:x.id,experienceId:x.experience_id,operatorId:x.operator_id,guest:x.guest,rating:x.rating,text:x.text,reply:x.reply});
async function readState(){
  const [places,experiences,bookings,operators,crowd,slots,reviews]=await Promise.all([
    db.from('places').select('*').order('name'),db.from('experiences').select('*').order('title'),db.from('bookings').select('*').order('created_at',{ascending:false}),db.from('operators').select('*').order('business'),db.from('crowd_sites').select('*').order('name'),db.from('slots').select('*').order('time'),db.from('reviews').select('*').order('id')
  ]);
  for(const r of [places,experiences,bookings,operators,crowd,slots,reviews])if(r.error)throw r.error;
  return {places:places.data||[],experiences:(experiences.data||[]).map(expOut),bookings:(bookings.data||[]).map(bookingOut),operators:operators.data||[],crowdSites:(crowd.data||[]).map(crowdOut),slots:(slots.data||[]).map(slotOut),reviews:(reviews.data||[]).map(reviewOut),updated_at:Date.now()};
}
async function operatorByEmail(email:string){const {data}=await db.from('operators').select('*').ilike('email',email).maybeSingle();return data}
async function publishedMap(){
  const {data:routes}=await db.from('engineer_routes').select('*').eq('engineer_email','hemanta@engineer.com').eq('published',true);
  const ids=Array.from(new Set((routes||[]).flatMap((r:any)=>r.node_ids||[])));
  let nodes:any[]=[];if(ids.length){const r=await db.from('engineer_nodes').select('*').eq('engineer_email','hemanta@engineer.com').in('id',ids);nodes=r.data||[]}
  return {nodes:(nodes||[]).map(n=>({id:n.id,name:n.name,type:n.type,lat:n.lat,lng:n.lng})),routes:(routes||[]).map(r=>({id:r.id,name:r.name,node_ids:r.node_ids,published:r.published}))};
}
async function travelerPayload(email:string){
  const state=await readState();
  const bookings=state.bookings.filter(b=>b.userEmail?.toLowerCase()===email.toLowerCase());
  const {data:redemptions}=await db.from('reward_redemptions').select('cost').ilike('email',email);
  const spent=(redemptions||[]).reduce((s:number,r:any)=>s+Number(r.cost||0),0);
  const active=bookings.filter(b=>!['Cancelled','Refunded'].includes(b.status));
  const verified=new Set(state.operators.filter((o:any)=>o.status==='Verified').map((o:any)=>o.id));
  const patan=state.crowdSites.find(c=>c.id==='place-patan')||state.crowdSites[0];
  return {crowd:{site_id:'patan-durbar',level:String(patan?.level||'Moderate').toLowerCase(),score:patan?.score||52,wait:patan?.wait||'15–25 min',source:patan?.source||'Demo estimate',updated_at:patan?.updatedAt||Date.now()},bookings,points:Math.max(0,650+active.length*100-spent),places:state.places.filter((p:any)=>p.status==='Active'),experiences:state.experiences.filter(e=>e.status==='Published'&&verified.has(e.operatorId)),crowdSites:state.crowdSites,slots:state.slots,publicMap:await publishedMap()};
}
function crowdMeta(level:string){return ({Low:[28,'Comfortable now'],Moderate:[52,'15–25 min'],High:[78,'40–50 min'],Critical:[92,'Avoid for now']} as Record<string,[number,string]>)[level]||[52,'15–25 min']}

async function authRoutes(req:VercelRequest,res:VercelResponse,path:string){
  if(path==='/api/demo-auth/login'&&req.method==='POST'){
    const {email='',password=''}=body(req);if(!email||!password)return fail(res,400,'Email and password are required.');
    const {data:user}=await db.from('users_custom').select('*').ilike('email',String(email).trim()).maybeSingle();
    if(!user||!verify(user.password_hash,user.password_salt,String(password)))return fail(res,401,'Invalid email or password.');
    const {data:settings}=await db.from('user_settings').select('name').ilike('email',user.email).maybeSingle();const name=settings?.name||user.name;
    const session=await createSession({email:user.email,name,role:user.role});return json(res,200,{session_id:session.id,user:{email:user.email,name,role:user.role}});
  }
  if(path==='/api/demo-auth/signup'&&req.method==='POST'){
    const {name='',email='',password=''}=body(req);const e=String(email).trim().toLowerCase(),n=String(name).trim();if(!n||!e||!password)return fail(res,400,'Name, email and password are required.');if(!/^\S+@\S+\.\S+$/.test(e))return fail(res,400,'Enter a valid email address.');if(String(password).length<6)return fail(res,400,'Password must be at least 6 characters.');
    const {data:exists}=await db.from('users_custom').select('email').eq('email',e).maybeSingle();if(exists)return fail(res,409,'An account with this email already exists.');
    const salt=randomBytes(16).toString('hex'),hash=secureHash(String(password),salt);const {error}=await db.from('users_custom').insert({email:e,name:n,role:'traveler',password_hash:hash,password_salt:salt});if(error)return fail(res,500,'Unable to create account.');
    await db.from('user_settings').insert({email:e,name:n});const session=await createSession({email:e,name:n,role:'traveler'});return json(res,200,{session_id:session.id,user:{email:e,name:n,role:'traveler'}});
  }
  if(path==='/api/demo-auth/session'&&req.method==='GET'){
    const s=await getSession(String(req.query.session_id||''));if(!s)return fail(res,401,'Session expired.');const {data:settings}=await db.from('user_settings').select('name').eq('email',s.email).maybeSingle();const name=settings?.name||s.name;return json(res,200,{user:{email:s.email,name,role:s.role}});
  }
  if(path==='/api/demo-auth/logout'&&req.method==='POST'){const {session_id}=body(req);if(session_id)await db.from('sessions').delete().eq('id',session_id);return json(res,200,{ok:true})}
  return false;
}

async function settingsRoutes(req:VercelRequest,res:VercelResponse,path:string){
  if(path==='/api/user-settings'&&req.method==='GET'){
    const s=await sessionOr(res,String(req.query.session_id||''));if(!s)return true;let {data}=await db.from('user_settings').select('*').eq('email',s.email).maybeSingle();if(!data){data={email:s.email,name:s.name,language:'English',crowd_alerts:true,location_sharing:false,accessibility:'Standard',travel_pace:'Balanced',dark_mode:false};await db.from('user_settings').insert(data)}return json(res,200,{settings:data});
  }
  if(path==='/api/user-settings'&&req.method==='PUT'){
    const input=body(req);const s=await sessionOr(res,input.session_id);if(!s)return true;const next=input.settings||{};const {data:current}=await db.from('user_settings').select('*').eq('email',s.email).maybeSingle();const record={email:s.email,name:String(next.name??current?.name??s.name).slice(0,80),language:String(next.language??current?.language??'English').slice(0,30),crowd_alerts:Boolean(next.crowd_alerts??current?.crowd_alerts??true),location_sharing:Boolean(next.location_sharing??current?.location_sharing??false),accessibility:String(next.accessibility??current?.accessibility??'Standard').slice(0,50),travel_pace:String(next.travel_pace??current?.travel_pace??'Balanced').slice(0,30),dark_mode:Boolean(next.dark_mode??current?.dark_mode??false),updated_at:new Date().toISOString()};const r=await db.from('user_settings').upsert(record,{onConflict:'email'}).select('*').single();if(r.error)return fail(res,500,'Settings could not be saved.');await Promise.all([db.from('users_custom').update({name:record.name}).eq('email',s.email),db.from('sessions').update({name:record.name}).eq('id',s.id)]);return json(res,200,{settings:r.data});
  }
  return false;
}

async function engineerRoutes(req:VercelRequest,res:VercelResponse,path:string){
  if(path==='/api/engineer-map'&&req.method==='GET'){
    const s=await sessionOr(res,String(req.query.session_id||''),['engineer','superadmin']);if(!s)return true;const email=s.role==='superadmin'?'hemanta@engineer.com':s.email;const [n,r]=await Promise.all([db.from('engineer_nodes').select('*').eq('engineer_email',email),db.from('engineer_routes').select('*').eq('engineer_email',email)]);return json(res,200,{map:{nodes:(n.data||[]).map(x=>({id:x.id,name:x.name,type:x.type,lat:x.lat,lng:x.lng})),routes:(r.data||[]).map(x=>({id:x.id,name:x.name,node_ids:x.node_ids,published:x.published}))}});
  }
  if(path==='/api/engineer-map'&&req.method==='PUT'){
    const input=body(req);const s=await sessionOr(res,input.session_id,['engineer','superadmin']);if(!s)return true;const email=s.role==='superadmin'?'hemanta@engineer.com':s.email;const nodes=Array.isArray(input.nodes)?input.nodes.slice(0,250):[],routes=Array.isArray(input.routes)?input.routes.slice(0,250):[];await db.from('engineer_routes').delete().eq('engineer_email',email);await db.from('engineer_nodes').delete().eq('engineer_email',email);if(nodes.length){const n=nodes.map((x:any)=>({id:String(x.id),engineer_email:email,name:String(x.name).slice(0,100),type:String(x.type).slice(0,40),lat:Number(x.lat),lng:Number(x.lng)}));const r=await db.from('engineer_nodes').insert(n);if(r.error)return fail(res,500,'Unable to save map nodes.')}if(routes.length){const rr=routes.map((x:any)=>({id:String(x.id),engineer_email:email,name:String(x.name).slice(0,160),node_ids:(x.node_ids||[]).map(String).slice(0,20),published:Boolean(x.published)}));const r=await db.from('engineer_routes').insert(rr);if(r.error)return fail(res,500,'Unable to save routes.')}await emit('inventory','public',{updated_at:Date.now(),kind:'engineer_map'});return json(res,200,{map:{nodes,routes}});
  }
  return false;
}

async function travelerRoutes(req:VercelRequest,res:VercelResponse,path:string){
  if(path==='/api/state'&&req.method==='GET'){const s=await sessionOr(res,String(req.query.session_id||''),['traveler']);if(!s)return true;return json(res,200,await travelerPayload(s.email))}
  if(path==='/api/bookings'&&req.method==='POST'){
    const input=body(req);const s=await sessionOr(res,input.session_id,['traveler']);if(!s)return true;const guests=Number(input.guests);if(!input.experienceId||!input.time||!Number.isInteger(guests)||guests<1||guests>12)return fail(res,400,'Experience, time and valid guest count are required.');const r=await db.rpc('create_yatralink_booking',{p_email:s.email,p_guest:s.name,p_experience_id:String(input.experienceId),p_time:String(input.time),p_guests:guests});if(r.error){const m=r.error.message.includes('not_enough_seats')?'Not enough seats remain for that time.':r.error.message.includes('slot_unavailable')?'That time is not available.':'This booking could not be completed.';return fail(res,409,m)}await emit('management','shared',{updated_at:Date.now(),kind:'booking'});await emit('inventory','public',{updated_at:Date.now(),kind:'booking'});const p=await travelerPayload(s.email);return json(res,200,{booking:bookingOut(r.data),points:p.points,bookings:p.bookings,slots:p.slots});
  }
  if(path==='/api/rewards/redeem'&&req.method==='POST'){
    const input=body(req);const s=await sessionOr(res,input.session_id,['traveler']);if(!s)return true;const cost=Math.max(1,Math.min(10000,Number(input.cost||0)));const label=String(input.label||'Reward').slice(0,100);const p=await travelerPayload(s.email);if(p.points<cost)return fail(res,409,`You need ${cost-p.points} more points.`);const r=await db.from('reward_redemptions').insert({email:s.email,label,cost});if(r.error)return fail(res,500,'Reward could not be redeemed.');const next=await travelerPayload(s.email);return json(res,200,{points:next.points,message:`${label} redeemed.`});
  }
  return false;
}

async function managementRoutes(req:VercelRequest,res:VercelResponse,path:string){
  if(path==='/api/management/state'&&req.method==='GET'){
    const s=await sessionOr(res,String(req.query.session_id||''),['superadmin','operator']);if(!s)return true;const state=await readState();if(s.role==='superadmin')return json(res,200,{state,role:s.role});const op=await operatorByEmail(s.email);if(!op)return fail(res,403,'No operator profile is assigned to this account.');const scoped={...state,places:[],crowdSites:[],experiences:state.experiences.filter(e=>e.operatorId===op.id),bookings:state.bookings.filter(b=>b.operatorId===op.id),operators:state.operators.filter((o:any)=>o.id===op.id),slots:state.slots.filter(sl=>sl.operatorId===op.id),reviews:state.reviews.filter(rv=>rv.operatorId===op.id)};return json(res,200,{state:scoped,role:s.role,operator_id:op.id});
  }
  if(path==='/api/management/action'&&req.method==='POST'){
    const input=body(req);const s=await sessionOr(res,input.session_id,['superadmin','operator']);if(!s)return true;const admin=s.role==='superadmin',op=s.role==='operator'?await operatorByEmail(s.email):null;if(s.role==='operator'&&!op)return fail(res,403,'No operator profile is assigned to this account.');const p=input.payload||{},id=String(p.id||'');let inventory=false,crowdEvent:any=null;
    try{
      switch(input.action){
        case 'place.create':{if(!admin)return fail(res,403,'Admin access required.');const name=String(p.name||'').trim();if(!name)return fail(res,400,'Place name is required.');const pid=`place-${Date.now()}`;await db.from('places').insert({id:pid,name,category:String(p.category||'Heritage'),zone:String(p.zone||'Patan'),status:'Active',crowd:'Low',capacity:Math.max(1,Number(p.capacity||500)),visits:0,lat:Number(p.lat||27.673),lng:Number(p.lng||85.325)});await db.from('crowd_sites').insert({id:pid,name,level:'Low',score:28,wait:'Comfortable now',lat:Number(p.lat||27.673),lng:Number(p.lng||85.325),source:'Demo estimate'});inventory=true;break}
        case 'place.update':{if(!admin)return fail(res,403,'Admin access required.');const update:any={};for(const k of ['name','category','zone','status'])if(p[k]!=null)update[k]=String(p[k]);if(p.capacity!=null)update.capacity=Math.max(1,Number(p.capacity));await db.from('places').update(update).eq('id',id);inventory=true;break}
        case 'place.delete':{if(!admin)return fail(res,403,'Admin access required.');await db.from('crowd_sites').delete().eq('id',id);await db.from('places').delete().eq('id',id);inventory=true;break}
        case 'experience.create':{const title=String(p.title||'').trim();if(!title)return fail(res,400,'Experience title is required.');const operatorId=s.role==='operator'?op!.id:String(p.operatorId||'');const {data:verified}=await db.from('operators').select('id').eq('id',operatorId).eq('status','Verified').maybeSingle();if(!verified)return fail(res,400,'Choose a verified operator.');const eid=`exp-${Date.now()}`,capacity=Math.max(1,Number(p.capacity||8)),status=s.role==='operator'?'Pending':'Published';await db.from('experiences').insert({id:eid,title,operator_id:operatorId,category:String(p.category||'Culture'),price:Math.max(0,Number(p.price||500)),capacity,status,bookings:0,rating:0});await db.from('slots').insert([{id:`${eid}-10`,experience_id:eid,operator_id:operatorId,day:'Today',time:'10:00 AM',available:true,capacity,booked:0},{id:`${eid}-14`,experience_id:eid,operator_id:operatorId,day:'Today',time:'2:00 PM',available:true,capacity,booked:0}]);inventory=true;break}
        case 'experience.update':{const {data:x}=await db.from('experiences').select('*').eq('id',id).maybeSingle();if(!x)return fail(res,404,'Experience not found.');if(s.role==='operator'&&x.operator_id!==op!.id)return fail(res,403,'Operator can only edit own experiences.');await db.from('experiences').update({title:String(p.title??x.title),category:String(p.category??x.category),price:Math.max(0,Number(p.price??x.price)),capacity:Math.max(1,Number(p.capacity??x.capacity))}).eq('id',id);inventory=true;break}
        case 'experience.status':{const {data:x}=await db.from('experiences').select('*').eq('id',id).maybeSingle();if(!x)return fail(res,404,'Experience not found.');if(s.role==='operator'&&x.operator_id!==op!.id)return fail(res,403,'Operator can only manage own experiences.');let status=String(p.status||x.status);if(s.role==='operator'&&status==='Published')return fail(res,403,'Admin approval is required to publish.');if(s.role==='operator'&&x.status==='Paused'&&status==='Pending')status='Pending';await db.from('experiences').update({status}).eq('id',id);inventory=true;break}
        case 'booking.status':{const {data:x}=await db.from('bookings').select('*').eq('id',id).maybeSingle();if(!x)return fail(res,404,'Booking not found.');if(s.role==='operator'&&x.operator_id!==op!.id)return fail(res,403,'Operator can only manage own bookings.');const r=await db.rpc('update_yatralink_booking_status',{p_booking_id:id,p_status:String(p.status||x.status)});if(r.error)throw r.error;inventory=true;break}
        case 'operator.status':{if(!admin)return fail(res,403,'Admin access required.');await db.from('operators').update({status:String(p.status||'Verified')}).eq('id',id);inventory=true;break}
        case 'availability.toggle':{const {data:x}=await db.from('slots').select('*').eq('id',id).maybeSingle();if(!x)return fail(res,404,'Time slot not found.');if(s.role==='operator'&&x.operator_id!==op!.id)return fail(res,403,'Operator can only manage own availability.');await db.from('slots').update({available:Boolean(p.available)}).eq('id',id);inventory=true;break}
        case 'availability.create':{if(s.role!=='operator')return fail(res,403,'Operator access required.');const exp=String(p.experienceId||'');const {data:x}=await db.from('experiences').select('*').eq('id',exp).maybeSingle();if(!x||x.operator_id!==op!.id)return fail(res,403,'Choose one of your experiences.');const time=String(p.time||'').trim();if(!time)return fail(res,400,'Time is required.');const sid=`slot-${Date.now()}`;await db.from('slots').insert({id:sid,experience_id:exp,operator_id:op!.id,day:String(p.day||'Today'),time,available:true,capacity:Math.max(1,Number(p.capacity||x.capacity)),booked:0});inventory=true;break}
        case 'review.reply':{if(s.role!=='operator')return fail(res,403,'Operator access required.');const {data:x}=await db.from('reviews').select('*').eq('id',id).maybeSingle();if(!x||x.operator_id!==op!.id)return fail(res,403,'Operator can only reply to own reviews.');await db.from('reviews').update({reply:String(p.reply||'').slice(0,500)}).eq('id',id);break}
        case 'crowd.site':{if(!admin)return fail(res,403,'Admin access required.');const level=String(p.level||'Moderate');const [score,wait]=crowdMeta(level);const {data:x}=await db.from('crowd_sites').select('*').eq('id',id).maybeSingle();if(!x)return fail(res,404,'Crowd site not found.');await Promise.all([db.from('crowd_sites').update({level,score,wait,source:'Destination manager demo signal',updated_at:new Date().toISOString()}).eq('id',id),db.from('places').update({crowd:level}).eq('id',id)]);crowdEvent={level:level.toLowerCase(),score,wait,source:'Destination manager demo signal',updated_at:Date.now()};inventory=true;break}
        default:return fail(res,400,'Unknown management action.');
      }
    }catch(err:any){console.error(err);return fail(res,500,'That action could not be completed.');}
    await emit('management','shared',{updated_at:Date.now(),kind:input.action});if(inventory)await emit('inventory','public',{updated_at:Date.now(),kind:input.action});if(crowdEvent&&id==='place-patan')await emit('crowd','patan-durbar',crowdEvent);
    const state=await readState();if(admin)return json(res,200,{state});const scoped={...state,places:[],crowdSites:[],experiences:state.experiences.filter(e=>e.operatorId===op!.id),bookings:state.bookings.filter(b=>b.operatorId===op!.id),operators:state.operators.filter((o:any)=>o.id===op!.id),slots:state.slots.filter(sl=>sl.operatorId===op!.id),reviews:state.reviews.filter(rv=>rv.operatorId===op!.id)};return json(res,200,{state:scoped});
  }
  return false;
}

function buildFallbackPlan(safe: any, places: any[], exps: any[]) {
  const days = [];
  const start = new Date(safe.startDate);
  for (let i = 0; i < safe.days; i++) {
    const curDate = new Date(start.getTime() + i * 86400000).toISOString().split('T')[0];
    const place1 = places[i % Math.max(1, places.length)] || { name: 'Patan Durbar Square', category: 'Heritage Site' };
    const place2 = places[(i + 1) % Math.max(1, places.length)] || { name: 'Golden Temple (Hiranya Varna Mahavihar)', category: 'Heritage Site' };
    const exp = exps[i % Math.max(1, exps.length)] || { title: 'Traditional Newari Woodcarving Workshop', price: 1200, category: 'Workshop' };
    
    days.push({
      day: i + 1,
      date: curDate,
      theme: i === 0 ? 'Heritage & Sacred Spaces Exploration' : i === 1 ? 'Artisan Encounters & Traditional Craft' : 'Living Culture & Culinary Discovery',
      estimated_cost: (Number(exp.price) || 1200) + 800,
      items: [
        {
          time: safe.dailyStart || '09:00',
          end_time: '11:30',
          title: place1.name,
          category: place1.category || 'Heritage Site',
          location: place1.name,
          duration_minutes: 150,
          estimated_cost: 500,
          crowd_strategy: 'Visit during morning low-crowd window',
          reason: 'Optimal morning lighting and low queue times',
          transport_to_next: '10 min walking link',
          notes: 'Grounded YatraLink heritage site visit'
        },
        {
          time: '12:00',
          end_time: '14:00',
          title: exp.title,
          category: exp.category || 'Workshop',
          location: 'Patan Artisan Quarter',
          duration_minutes: 120,
          estimated_cost: Number(exp.price) || 1200,
          crowd_strategy: 'Reserved local experience slot',
          reason: 'Direct interaction with master local craftspeople',
          transport_to_next: '15 min walking link',
          notes: 'Supports authentic local heritage business'
        },
        {
          time: '14:30',
          end_time: '16:30',
          title: place2.name,
          category: place2.category || 'Heritage Site',
          location: place2.name,
          duration_minutes: 120,
          estimated_cost: 300,
          crowd_strategy: 'Afternoon quiet window',
          reason: 'Serene courtyard atmosphere and architecture',
          transport_to_next: 'Walking return',
          notes: 'Grounded YatraLink cultural exploration'
        }
      ]
    });
  }
  return {
    title: `${safe.destinations} ${safe.days}-Day Cultural Journey`,
    summary: `A personalized ${safe.days}-day cultural itinerary in ${safe.destinations} balancing heritage exploration, local artisan workshops, and crowd-aware travel timing.`,
    destinations: safe.destinations,
    currency: 'NPR',
    total_estimated_cost: days.reduce((sum, d) => sum + d.estimated_cost, 0),
    assumptions: ['Prices in NPR', 'Grounded in active YatraLink verified inventory', 'Crowd strategies optimized for travel comfort'],
    days
  };
}

async function aiRoute(req:VercelRequest,res:VercelResponse,path:string){
  if(path!=='/api/ai-plan'||req.method!=='POST')return false;const input=body(req);const s=await sessionOr(res,input.session_id,['traveler']);if(!s)return true;if(!String(input.destinations||'').trim()||!input.startDate||!input.endDate)return fail(res,400,'Destination and trip dates are required.');const a=new Date(`${input.startDate}T00:00:00Z`),b=new Date(`${input.endDate}T00:00:00Z`),days=Math.floor((b.getTime()-a.getTime())/86400000)+1;if(!Number.isFinite(days)||days<1)return fail(res,400,'End date must be on or after the start date.');if(days>14)return fail(res,400,'Plan up to 14 days at a time.');
  const state=await readState(),routes=await publishedMap();const places=state.places.filter((p:any)=>p.status==='Active').map((p:any)=>({...p,crowd:state.crowdSites.find(c=>c.id===p.id)?.level||'Unknown',wait:state.crowdSites.find(c=>c.id===p.id)?.wait||'Unknown',source:state.crowdSites.find(c=>c.id===p.id)?.source||'Unknown'}));const exps=state.experiences.filter(e=>e.status==='Published').map(e=>({...e,available_times:state.slots.filter(sl=>sl.experienceId===e.id&&sl.available&&sl.booked<sl.capacity).map(sl=>sl.time)}));const clip=(v:any,n:number)=>String(v||'').slice(0,n);const safe={destinations:clip(input.destinations,300),startDate:input.startDate,endDate:input.endDate,dailyStart:input.dailyStart||'09:00',dailyEnd:input.dailyEnd||'18:00',budget:Math.max(0,Math.min(Number(input.budget||0),500000)),interests:clip(input.interests,300),pace:clip(input.pace,40),transport:clip(input.transport,80),crowdPreference:clip(input.crowdPreference,80),travelGroup:clip(input.travelGroup,80),dietary:clip(input.dietary,80),accessibility:clip(input.accessibility,80),mustVisit:clip(input.mustVisit,400),notes:clip(input.notes,500),days};const instructions='You are the YatraLink AI Trip Planner. Build a realistic, culturally respectful Nepal itinerary from the supplied YatraLink inventory. Prefer exact supplied place and experience names. Treat crowd values as live only when their source says Destination manager demo signal; otherwise explicitly call them demo estimates. Respect available_times for experiences. Never invent verified opening hours, ticket fees, sensor data or transport schedules. Published engineer routes may be used as known special-place walking links. Return ONLY valid JSON with keys title, summary, destinations, currency, total_estimated_cost, assumptions, days. Each day must have day,date,theme,estimated_cost,items. Each item must have time,end_time,title,category,location,duration_minutes,estimated_cost,crowd_strategy,reason,transport_to_next,notes.';const prompt=`User preferences: ${JSON.stringify(safe)}\nYatraLink places: ${JSON.stringify(places)}\nBookable experiences: ${JSON.stringify(exps)}\nPublished special-place routes: ${JSON.stringify(routes)}\nCreate every day in the requested range. Currency is NPR.`;
  if(openai){
    try{const response=await (openai.responses ? openai.responses.create({model:process.env.OPENAI_MODEL||'gpt-5.6-luna',instructions,input:prompt,max_output_tokens:7600}) : openai.chat.completions.create({model:process.env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'system',content:instructions},{role:'user',content:prompt}]}));const raw=('output_text' in response ? (response as any).output_text : (response as any).choices[0].message.content).trim().replace(/^```json\s*/i,'').replace(/```$/,'').trim();const plan=JSON.parse(raw);if(Array.isArray(plan.days)&&plan.days.length)return json(res,200,{plan,generated_at:Date.now(),grounded_places:places.length,grounded_experiences:exps.length});}catch(err){console.error('AI LLM failed, using grounded fallback generator',err);}
  }
  const fallbackPlan = buildFallbackPlan(safe, places, exps);
  return json(res,200,{plan:fallbackPlan,generated_at:Date.now(),grounded_places:places.length,grounded_experiences:exps.length});
}

export default async function handler(req:VercelRequest,res:VercelResponse){
  res.setHeader('Cache-Control','no-store');
  if(!url||!serviceKey)return fail(res,503,'Backend is not configured. Add Supabase environment variables in Vercel.');
  const path=normalizedPath(req);
  try{
    const handlers=[authRoutes,settingsRoutes,engineerRoutes,travelerRoutes,managementRoutes,aiRoute];
    for(const h of handlers){const handled=await h(req,res,path);if(handled!==false)return;}
    if(path==='/api/_healthcheck')return json(res,200,{ok:true,platform:'vercel',database:'supabase'});
    if(path==='/api/subscriptions'||path==='/api/subscriptions/remove')return json(res,200,{ok:true});
    if(path==='/api/reset')return fail(res,403,'Global reset is disabled in the showcase.');
    return fail(res,404,'API route not found.');
  }catch(err){console.error(err);return fail(res,500,'Unexpected server error.');}
}
