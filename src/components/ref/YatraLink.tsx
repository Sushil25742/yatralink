import { useEffect,useRef,useState } from 'react';
import { api,ws } from './lib/platform';
import { MapContainer,TileLayer,Polyline,Marker } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeft,ArrowRight,Bell,Bookmark,CalendarDays,Check,CheckCircle2,ChevronRight,CircleDollarSign,Clock,Compass,Filter,Gift,Grid3X3,Heart,HelpCircle,Home,Landmark,Leaf,LogOut,MapPinned,MapPin,Minus,Navigation,Palette,Plus,Route,Search,Settings,Share2,ShieldCheck,SlidersHorizontal,Sparkles,Star,Store,User,Users,Utensils,X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';import './yatralink.css';
import { PAGE_LIBRARY,type ProductPage } from './pageLibrary';import ProductScreenRenderer from './ProductScreenRenderer';
type CrowdLevel='low'|'moderate'|'high'|'critical';type Screen='home'|'search'|'map'|'quiet'|'alert'|'filters'|'plan'|'itinerary'|'place'|'experiences'|'experience'|'booking'|'confirmed'|'bookings'|'points'|'impact'|'profile'|'privacy'|'notifications';type Portal='traveler'|'productMap'|'catalog';
type Booking={id:string;experienceTitle?:string;date?:string;time:string;guests:number;amount:number;status:string};type Experience={id:string;title:string;price:number;capacity?:number;rating:string;category:string;image:string;subtitle:string;duration:string};type Place={id:string;name:string;category:string;zone:string;status:string;crowd:string;capacity:number;visits:number;lat:number;lng:number};type Crowd={id:string;name:string;level:string;score:number;wait:string;lat:number;lng:number;source:string};type Slot={id:string;experienceId:string;operatorId:string;day:string;time:string;available:boolean;capacity:number;booked:number};type PublicMap={nodes:{id:string;name:string;type:string;lat:number;lng:number}[];routes:{id:string;name:string;node_ids:string[];published:boolean}[]};type SettingsState={name:string;language:string;crowd_alerts:boolean;location_sharing:boolean;accessibility:string;travel_pace:string;dark_mode:boolean};
type TripItem={time:string;end_time:string;title:string;category:string;location:string;duration_minutes:number;estimated_cost:number;crowd_strategy:string;reason:string;transport_to_next:string;notes:string};type TripDay={day:number;date:string;theme:string;estimated_cost:number;items:TripItem[]};type TripPlan={title:string;summary:string;destinations:string[];currency:string;total_estimated_cost:number;assumptions:string[];days:TripDay[]};
const images={heritage:'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=82',craft:'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=82',food:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82',city:'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=900&q=82'};const imageFor=(c:string)=>c==='Craft'?images.craft:c==='Food'?images.food:c==='Art'?images.city:images.heritage;const crowdInfo:Record<CrowdLevel,{label:string;score:number;wait:string}>={low:{label:'Low',score:28,wait:'Comfortable now'},moderate:{label:'Moderate',score:52,wait:'15–25 min'},high:{label:'High',score:78,wait:'40–50 min'},critical:{label:'Critical',score:92,wait:'Avoid for now'}};const norm=(v:string):CrowdLevel=>['low','high','critical'].includes(v.toLowerCase())?v.toLowerCase() as CrowdLevel:'moderate';const hav=(a:{lat:number;lng:number},b:{lat:number;lng:number})=>{const r=6371,d1=(b.lat-a.lat)*Math.PI/180,d2=(b.lng-a.lng)*Math.PI/180,q=Math.sin(d1/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(d2/2)**2;return 2*r*Math.asin(Math.sqrt(q))};const iso=(off:number)=>{const d=new Date();d.setDate(d.getDate()+off);return d.toISOString().slice(0,10)};
function Logo(){return <div className='brand'><span><MapPinned/></span><strong>Yatra<b>Link</b></strong></div>}function Pill({level}:{level:CrowdLevel}){return <span className={'crowd-pill crowd-pill--' + level}><i/>{crowdInfo[level].label}</span>}function Primary({children,onClick,disabled}:{children:React.ReactNode;onClick?:()=>void;disabled?:boolean}){return <button className='btn primary' onClick={onClick} disabled={disabled}>{children}</button>}function Secondary({children,onClick}:{children:React.ReactNode;onClick?:()=>void}){return <button className='btn secondary' onClick={onClick}>{children}</button>}
function DynamicMap({places,crowds,routes,selected,onSelect}:{places:Place[];crowds:Crowd[];routes:PublicMap;selected:string;onSelect:(id:string)=>void}){
  const userLat = 27.6715;
  const userLng = 85.3225;
  const pts=(ids:string[])=>ids.map(id=>routes.nodes.find(n=>n.id===id)).filter(Boolean).map(n=>[n!.lat,n!.lng] as [number,number]);

  return (
    <MapContainer center={[27.6737,85.3245]} zoom={15} zoomControl={false} className='map-canvas'>
      <TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'/>
      
      {routes.routes.map(r=>{
        const p=pts(r.node_ids);
        return p.length>1?<Polyline key={r.id} positions={p} pathOptions={{color:'#0c716f',weight:4,dashArray:'6 6'}}/>:null;
      })}

      <Marker position={[userLat, userLng]} icon={L.divIcon({
        className: 'user-location-pin',
        html: `<div class="user-pulse-dot"><div class="user-halo"></div><div class="user-core"></div></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })} />

      {places.map(p=>{
        const c=crowds.find(x=>x.id===p.id);
        const l=norm(c?.level||p.crowd);
        const isSel=selected===p.id;
        const badgeColor = l === 'high' ? '#EF4444' : l === 'moderate' ? '#F59E0B' : '#22C55E';
        const badgeText = l === 'high' ? 'High Crowd' : l === 'moderate' ? 'Moderate Crowd' : 'Low Crowd';
        
        const pinIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div class="map-pin-card ${isSel ? 'selected' : ''}">
              <img src="${imageFor(p.category)}" alt="${p.name}" class="pin-img"/>
              <div class="pin-text">
                <strong class="pin-title">${p.name}</strong>
                <span class="pin-badge" style="background: ${badgeColor}15; color: ${badgeColor}; border: 1px solid ${badgeColor}30;">
                  <i style="background: ${badgeColor};"></i> ${badgeText}
                </span>
              </div>
            </div>
          `,
          iconSize: [118, 32],
          iconAnchor: [59, 16]
        });

        return (
          <Marker 
            key={p.id} 
            position={[p.lat, p.lng]} 
            icon={pinIcon} 
            eventHandlers={{click: ()=>onSelect(p.id)}}
          />
        );
      })}
    </MapContainer>
  );
}
export default function YatraLink({sessionId,user,onSettings,onLogout}:{sessionId:string;user:{name:string;email:string;role:string};onSettings:()=>void;onLogout:()=>void}){const [portal,setPortal]=useState<Portal>('traveler'),[screen,setScreen]=useState<Screen>('home'),[places,setPlaces]=useState<Place[]>([]),[crowds,setCrowds]=useState<Crowd[]>([]),[slots,setSlots]=useState<Slot[]>([]),[experiences,setExperiences]=useState<Experience[]>([]),[bookings,setBookings]=useState<Booking[]>([]),[points,setPoints]=useState(650),[publicMap,setPublicMap]=useState<PublicMap>({nodes:[],routes:[]}),[settings,setSettings]=useState<SettingsState|null>(null),[selectedPlace,setSelectedPlace]=useState('place-patan'),[selectedExp,setSelectedExp]=useState<Experience|null>(null),[time,setTime]=useState(''),[guests,setGuests]=useState(2),[error,setError]=useState(''),[q,setQ]=useState(''),[filters,setFilters]=useState({crowd:'All',interest:'All',budget:5000}),[geo,setGeo]=useState<{lat:number;lng:number}|null>(null),[geoLabel,setGeoLabel]=useState('Patan pilot center'),[quietAdded,setQuietAdded]=useState<string[]>([]),[placeTab,setPlaceTab]=useState('History'),[category,setCategory]=useState('All'),[catalogPage,setCatalogPage]=useState<ProductPage|null>(null),[rewardMsg,setRewardMsg]=useState('');const [planner,setPlanner]=useState({destinations:'Patan, Bhaktapur, Kathmandu',startDate:iso(1),endDate:iso(3),dailyStart:'09:00',dailyEnd:'18:00',budget:12000,interests:'Heritage, local food, crafts',pace:'Balanced',transport:'Walk + local taxi',crowdPreference:'Avoid peak crowds',travelGroup:'Solo traveler',dietary:'Local Newari & Authentic',accessibility:'Standard walking',mustVisit:'Patan Durbar Square, Golden Temple',notes:'Prefer authentic artisan encounters and quiet spots.'});const [aiPlan,setAiPlan]=useState<TripPlan|null>(null),[aiLoading,setAiLoading]=useState(false),[aiError,setAiError]=useState('');const conn=useRef<ReturnType<typeof ws.connect>|null>(null);
  const load=()=>api.get('/api/state',{session_id:sessionId}).then(({data})=>{setBookings(data.bookings||[]);setPoints(data.points||650);setPlaces(data.places||[]);setCrowds(data.crowdSites||[]);setSlots(data.slots||[]);setPublicMap(data.publicMap||{nodes:[],routes:[]});const ex=(data.experiences||[]).map((e:any)=>({id:e.id,title:e.title,price:Number(e.price),capacity:e.capacity,rating:String(e.rating||'New'),category:e.category,image:imageFor(e.category),subtitle:e.category==='Craft'?'Learn from a local maker':e.category==='Food'?'Taste a local kitchen experience':'Explore living heritage with a local host',duration:e.category==='Craft'?'45 min':e.category==='Food'?'60 min':'90 min'}));setExperiences(ex);setSelectedExp(old=>ex.find((x:Experience)=>x.id===old?.id)||ex[0]||null)});useEffect(()=>{load();api.get('/api/user-settings',{session_id:sessionId}).then(({data})=>{setSettings(data.settings);setPlanner(p=>({...p,pace:data.settings.travel_pace||p.pace}))});const c=ws.connect();conn.current=c;c.onMessage(m=>{if(m?.type==='entity.update'&&['inventory','crowd'].includes(m.payload?.entity_type))load()});c.ready.then(()=>{if(c.connectionId){api.post('/api/subscriptions',{entity_type:'inventory',entity_id:'public',connection_id:c.connectionId});api.post('/api/subscriptions',{entity_type:'crowd',entity_id:'patan-durbar',connection_id:c.connectionId})}});return()=>c.disconnect()},[sessionId]);useEffect(()=>{const sync=()=>{const f=PAGE_LIBRARY.find(p=>p.route===location.hash||('#/product/' + p.id)===location.hash);if(f?.role==='Traveler'){setCatalogPage(f);setPortal('catalog')}else if(location.hash==='#/screens')setPortal('productMap')};sync();addEventListener('hashchange',sync);return()=>removeEventListener('hashchange',sync)},[]);
  const go=(s:Screen)=>{setPortal('traveler');setScreen(s);scrollTo({top:0,behavior:'smooth'})};const currentPlace=places.find(p=>p.id===selectedPlace)||places[0];const currentCrowd=crowds.find(c=>c.id===currentPlace?.id);const currentLevel=norm(currentCrowd?.level||currentPlace?.crowd||'Moderate');const openCatalog=(p:ProductPage)=>{setCatalogPage(p);setPortal('catalog');location.hash=p.route};const confirmBooking=async()=>{if(!selectedExp||!time)return setError('Choose an available time before booking.');setError('');try{const {data}=await api.post('/api/bookings',{session_id:sessionId,experienceId:selectedExp.id,time,guests});setBookings(data.bookings);setPoints(data.points);setSlots(data.slots);go('confirmed')}catch(err:any){setError(err?.message||'That time is no longer available.')}};const savePrivacy=async(v:boolean)=>{if(!settings)return;const next={...settings,location_sharing:v};setSettings(next);await api.put('/api/user-settings',{session_id:sessionId,settings:next})};const redeem=async(cost:number,label:string)=>{try{const {data}=await api.post('/api/rewards/redeem',{session_id:sessionId,cost,label});setPoints(data.points);setRewardMsg(label + ' redeemed. This redemption persists.')}catch(err:any){setRewardMsg(err?.message||'Unable to redeem.')}};const generate=async()=>{setAiLoading(true);setAiError('');try{const {data}=await api.post('/api/ai-plan',{session_id:sessionId,...planner});setAiPlan(data.plan);go('itinerary')}catch(err:any){setAiError(err?.message||'AI planner is temporarily unavailable.')}finally{setAiLoading(false)}};
  function Frame({children}:{children:React.ReactNode}){const show=['home'].includes(screen);return <div className='mobile-shell'><div className='mobile-content'>{children}</div>{show&&<button className='quiet-fab' onClick={()=>go('quiet')}><Leaf/>Quiet nearby</button>}<nav className='mobile-nav'>{([['home','Home',<Home/>],['map','Map',<MapPin/>],['plan','Journey',<Route/>],['bookings','Bookings',<CalendarDays/>],['profile','Profile',<User/>]] as [Screen,string,React.ReactNode][]).map(([s,l,i])=><button key={s} className={screen===s?'active':''} onClick={()=>go(s)}>{i}<span>{l}</span></button>)}</nav></div>}
 function Header({title,back='home',right}:{title:string;back?:Screen;right?:React.ReactNode}){return <header className='phone-header'><button onClick={()=>go(back)}><ArrowLeft/></button><strong>{title}</strong><div>{right}</div></header>}
 function HomeView(){
  const low = crowds.filter(c=>c.level==='Low').length || 12;
  const mod = crowds.filter(c=>c.level==='Moderate').length || 18;
  const high = crowds.filter(c=>['High','Critical'].includes(c.level)).length || 7;
  return (
    <Frame>
      <div className='home-page'>
        <header>
          <Logo/>
          <button onClick={()=>go('notifications')}>
            <Bell size={20}/>
            <span className='badge-dot'/>
          </button>
        </header>

        <div className='greeting-banner'>
          <div className='greeting-tag'>
            <span>✨</span> Patan Heritage Explorer
          </div>
          <h1>Namaste, {user?.name || 'Aarav'}! 👋</h1>
          <p>Where shall we explore today?</p>
        </div>

        <div className='search-box-wrap'>
          <button className='search-box' onClick={()=>go('search')}>
            <Search size={18} color='#0C5A56'/>
            <span>Search places, experiences...</span>
            <span className='target-btn'><Navigation size={15}/></span>
          </button>
        </div>

        <div className='quick-filter-scroll'>
          {[
            ['All', '🔥'],
            ['Heritage', '🏛️'],
            ['Food', '🍱'],
            ['Crafts', '🎨'],
            ['Spiritual', '🕉️'],
            ['Quiet', '🌿']
          ].map(([cat, icon]) => (
            <button
              key={cat}
              className={filters.interest === cat || (cat==='All'&&filters.interest==='All') ? 'active' : ''}
              onClick={()=>{
                if (cat === 'Quiet') { go('quiet'); }
                else { setFilters({...filters, interest: cat}); go('search'); }
              }}
            >
              <span>{icon}</span> {cat}
            </button>
          ))}
        </div>

        <section>
          <div className='section-title'>
            <h2>Live Crowd Overview</h2>
            <button onClick={()=>go('map')}>See map <ChevronRight size={14}/></button>
          </div>
          <div className='crowd-grid'>
            <button onClick={()=>{setFilters({...filters,crowd:'Low'});go('search')}} className='crowd-card low'>
              <div className='icon-circle'><Users size={16}/></div>
              <strong>Low</strong>
              <span>{low} Places</span>
              <span className='wait-tag'>&lt; 15m wait</span>
            </button>
            <button onClick={()=>{setFilters({...filters,crowd:'Moderate'});go('search')}} className='crowd-card moderate'>
              <div className='icon-circle'><Users size={16}/></div>
              <strong>Moderate</strong>
              <span>{mod} Places</span>
              <span className='wait-tag'>15–30m wait</span>
            </button>
            <button onClick={()=>{setFilters({...filters,crowd:'High'});go('search')}} className='crowd-card high'>
              <div className='icon-circle'><Users size={16}/></div>
              <strong>High</strong>
              <span>{high} Places</span>
              <span className='wait-tag'>40–50m wait</span>
            </button>
          </div>
        </section>

        <section>
          <div className='section-title'>
            <h2>Top Picks Near You</h2>
            <button onClick={()=>go('quiet')}>Quiet nearby <ChevronRight size={14}/></button>
          </div>
          <div className='place-grid'>
            {(places.length ? places : [
              {id:'place-patan',name:'Patan Durbar Square',category:'Heritage',crowd:'High'},
              {id:'place-golden',name:'Golden Temple (Patan)',category:'Spiritual',crowd:'Moderate'},
              {id:'place-mangal',name:'Mangal Bazaar',category:'Craft',crowd:'Low'}
            ]).slice(0,3).map((p, idx)=>(
              <button key={p.id} className='place-card-item' onClick={()=>{setSelectedPlace(p.id);go('map')}}>
                <div className='img-wrap'>
                  <img src={imageFor(p.category)} alt={p.name}/>
                  <div className='img-badge'>
                    <Pill level={norm(crowds.find(c=>c.id===p.id)?.level||p.crowd)}/>
                  </div>
                </div>
                <div className='card-content'>
                  <strong>{p.name}</strong>
                  <span className='dist'><MapPin size={11} color='#0C5A56'/> {idx === 0 ? '2.1 km away' : idx === 1 ? '1.5 km away' : '1.2 km away'}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className='section-title'>
            <h2>Local Experiences</h2>
            <button onClick={()=>go('experiences')}>See all <ChevronRight size={14}/></button>
          </div>
          <div className='experience-grid'>
            {(experiences.length ? experiences : [
              {id:'exp-1',title:'Woodcarving Workshop',price:800,duration:'45 min',rating:'4.8 (120)',image:images.craft,category:'Craft',subtitle:'Learn from a local maker',capacity:8},
              {id:'exp-2',title:'Newari Lunch Experience',price:1200,duration:'60 min',rating:'4.9 (96)',image:images.food,category:'Food',subtitle:'Taste authentic cuisine',capacity:10},
              {id:'exp-3',title:'Heritage Walk (Patan)',price:600,duration:'90 min',rating:'4.7 (80)',image:images.heritage,category:'Culture',subtitle:'Guided historical tour',capacity:15}
            ]).slice(0,3).map(e=>(
              <button key={e.id} className='exp-card-item' onClick={()=>{setSelectedExp(e as Experience);go('experience')}}>
                <div className='img-wrap'>
                  <img src={e.image} alt={e.title}/>
                </div>
                <div className='card-content'>
                  <strong>{e.title}</strong>
                  <div className='price-line'>NPR {e.price} • {e.duration}</div>
                  <div className='rating-line'><Star size={11} fill='#D97706' color='#D97706'/> {e.rating}</div>
                </div>
              </button>
            ))}
          </div>

          <button className='ai-cta' onClick={()=>go('plan')}>
            <div className='sparkle-icon'><Sparkles size={22}/></div>
            <div>
              <strong>Plan your trip with AI ✨</strong>
              <span>Custom itinerary grounded in live inventory &amp; crowds</span>
            </div>
            <ArrowRight size={20}/>
          </button>

          <div className='live-radar-ticker'>
            <span className='ticker-dot'/>
            <span><b>Live Radar:</b> Patan Durbar Square crowd pressure is High. Golden Temple is currently calm.</span>
          </div>
        </section>
      </div>
    </Frame>
  );
}

function SearchView(){
  const x=q.toLowerCase();
  const ps=places.filter(p=>(!x||(p.name + ' ' + p.category).toLowerCase().includes(x))&&(filters.crowd==='All'||p.crowd===filters.crowd)&&(filters.interest==='All'||p.category===filters.interest));
  const es=experiences.filter(e=>(!x||(e.title + ' ' + e.category).toLowerCase().includes(x))&&e.price<=filters.budget&&(filters.interest==='All'||e.category===filters.interest));
  return (
    <Frame>
      <Header title='Search & Explore'/>
      <div className='phone-body'>
        <label className='search-input'>
          <Search size={18} color='#0C5A56'/>
          <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder='Search places, experiences, crafts...'/>
          {q && <button style={{border:0, background:'transparent'}} onClick={()=>setQ('')}><X size={16} color='#94A3B8'/></button>}
        </label>

        <button className='filter-summary' onClick={()=>go('filters')}>
          <Filter size={13}/> Filters Active: {filters.crowd} Crowd • {filters.interest} • NPR ≤ {filters.budget}
        </button>

        <div className='section-title'>
          <h2>Heritage Destinations ({ps.length})</h2>
        </div>
        {ps.map(p=>(
          <button className='result-row' key={p.id} onClick={()=>{setSelectedPlace(p.id);go('map')}}>
            <MapPin size={18} color='#0C5A56'/>
            <div>
              <strong>{p.name}</strong>
              <span>{p.category} · {p.zone}</span>
            </div>
            <Pill level={norm(p.crowd)}/>
            <ChevronRight size={16} color='#94A3B8'/>
          </button>
        ))}

        <div className='section-title' style={{marginTop: '24px'}}>
          <h2>Local Experiences ({es.length})</h2>
        </div>
        {es.map(e=>(
          <button className='result-row' key={e.id} onClick={()=>{setSelectedExp(e);go('experience')}}>
            <Store size={18} color='#0C5A56'/>
            <div>
              <strong>{e.title}</strong>
              <span>{e.category} · NPR {e.price}</span>
            </div>
            <ChevronRight size={16} color='#94A3B8'/>
          </button>
        ))}
      </div>
    </Frame>
  );
}

function FiltersView(){
  return (
    <Frame>
      <Header title='Search Filters' back='search' right={<button style={{border:0, background:'transparent'}} onClick={()=>go('search')}><X size={20}/></button>}/>
      <div className='phone-body'>
        <h3 style={{fontSize: '14px', fontWeight: '800', marginBottom: '10px'}}>Live Crowd Density</h3>
        <div className='chips'>
          {['Low','Moderate','High','All'].map(x=>(
            <button className={filters.crowd===x?'active':''} key={x} onClick={()=>setFilters({...filters,crowd:x})}>{x}</button>
          ))}
        </div>

        <h3 style={{fontSize: '14px', fontWeight: '800', margin: '20px 0 10px'}}>Interest Category</h3>
        <div className='chips'>
          {['Heritage','Food','Crafts','Spiritual','Culture','Art & History','Nature'].map(x=>(
            <button className={filters.interest===x?'active':''} key={x} onClick={()=>setFilters({...filters,interest:x})}>{x}</button>
          ))}
        </div>

        <div style={{margin: '24px 0'}}>
          <h3 style={{fontSize: '14px', fontWeight: '800', marginBottom: '8px'}}>Budget Range (NPR)</h3>
          <div style={{fontSize: '12px', color: '#64748B', fontWeight: '600', marginBottom: '10px'}}>
            Up to <b>NPR {filters.budget.toLocaleString()}</b> per experience
          </div>
          <input type='range' min='500' max='5000' step='500' style={{width: '100%', accentColor: 'var(--teal-primary)'}} value={filters.budget} onChange={e=>setFilters({...filters,budget:Number(e.target.value)})}/>
        </div>

        <div className='dual-actions-bar' style={{marginTop: '28px'}}>
          <Secondary onClick={()=>setFilters({crowd:'All',interest:'All',budget:5000})}>Reset All</Secondary>
          <Primary onClick={()=>go('search')}>Apply Filters</Primary>
        </div>
      </div>
    </Frame>
  );
}

function MapView(){
  return (
    <Frame>
      <div className='map-page'>
        <div className='map-top'>
          <button className='search-bar' onClick={()=>go('search')}>
            <Search size={18} color='#0C5A56'/>
            <span>Search places, experiences, map pins...</span>
            <SlidersHorizontal size={18} color='#64748B' style={{marginLeft: 'auto'}}/>
          </button>
          <div className='cat-pills'>
            {['All','Heritage','Food','Crafts','Spiritual'].map(c=>(
              <button key={c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c}</button>
            ))}
          </div>
        </div>

        <div className='map-controls-stack'>
          <button className='map-ctrl-btn' onClick={()=>setGeoLabel('GPS Recalibrated')} title='Re-center map'><Navigation size={18}/></button>
          <button className='map-ctrl-btn' onClick={()=>go('quiet')} title='Quiet nearby spots'><Leaf size={18}/></button>
        </div>

        <DynamicMap places={places} crowds={crowds} routes={publicMap} selected={selectedPlace} onSelect={id=>setSelectedPlace(id)}/>

        <div className='map-sheet'>
          <div className='map-sheet-hero'>
            <img src={imageFor(currentPlace?.category || 'Heritage')} alt={currentPlace?.name}/>
            <div>
              <h2>{currentPlace?.name || 'Patan Durbar Square'}</h2>
              <Pill level={currentLevel}/>
              <p>⏱ <b>Est. Wait:</b> {currentCrowd?.wait || '40 – 50 min'}</p>
            </div>
          </div>
          <div className='dual-actions-bar' style={{margin: '12px 0 0', padding: 0, border: 0}}>
            <Secondary onClick={()=>go('alert')}>See Alternatives</Secondary>
            <Primary onClick={()=>go('place')}>View Details &amp; Nav</Primary>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function AlertView(){
  return (
    <Frame>
      <Header title='Crowd Alert' back='map'/>
      <div className='phone-body'>
        <div className='alert-hero-banner'>
          <div className='alert-icon-ring'>
            <Users size={32}/>
          </div>
          <h1>High Crowd Pressure Detected!</h1>
          <p>
            <b>{currentPlace?.name || 'Patan Durbar Square'}</b> currently has heavy foot traffic (~40-50 min wait). We recommend visiting one of these verified calmer spots.
          </p>
        </div>

        <div className='section-title'>
          <h2>Recommended Alternatives</h2>
          <button onClick={()=>go('quiet')}>View map <ChevronRight size={14}/></button>
        </div>

        {(places.filter(p=>p.id!==currentPlace?.id).slice(0,3).length ? places.filter(p=>p.id!==currentPlace?.id).slice(0,3) : [
          {id:'p1',name:'Woodcarving Workshop',category:'Craft',crowd:'Low'},
          {id:'p2',name:'Golden Temple (Patan)',category:'Spiritual',crowd:'Moderate'},
          {id:'p3',name:'Mangal Bazaar',category:'Craft',crowd:'Low'}
        ]).map((p, idx)=>(
          <button className='alt-row' key={p.id} onClick={()=>{setSelectedPlace(p.id);go('map')}}>
            <img src={imageFor(p.category)} alt=''/>
            <div>
              <strong>{p.name}</strong>
              <Pill level={norm(crowds.find(c=>c.id===p.id)?.level||p.crowd)}/>
              <span>⏱ {idx === 0 ? '5 min walk • 450 m' : idx === 1 ? '7 min walk • 600 m' : '8 min walk • 650 m'}</span>
            </div>
            <ChevronRight size={18} color='#94A3B8'/>
          </button>
        ))}

        <div style={{marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <Primary onClick={()=>go('quiet')}>Update My Journey ✨</Primary>
          <Secondary onClick={()=>go('map')}>Keep Original Stop</Secondary>
        </div>
      </div>
    </Frame>
  );
}

function QuietView(){
  const origin=geo||{lat:27.6738,lng:85.3232};
  const rows=places.map(p=>{const km=hav(origin,p),c=crowds.find(x=>x.id===p.id);return{...p,km,level:norm(c?.level||p.crowd),wait:c?.wait||'Estimate unavailable',source:c?.source||'Live Sensor Stream'}}).filter(p=>['low','moderate'].includes(p.level)).sort((a,b)=>(a.level==='low'?0:1)-(b.level==='low'?0:1)||a.km-b.km);
  const locate=()=>navigator.geolocation?.getCurrentPosition(p=>{setGeo({lat:p.coords.latitude,lng:p.coords.longitude});setGeoLabel('Using your current GPS location')},()=>setGeoLabel('Patan pilot center'));

  return (
    <Frame>
      <Header title='Less Crowded Nearby'/>
      <div className='phone-body'>
        <div className='quiet-intro-card'>
          <div className='icon-box'>
            <Leaf size={26}/>
          </div>
          <div>
            <h1>Find Calmer Heritage Spots</h1>
            <p>Sorted by crowd density, then shortest distance.</p>
            <small style={{fontSize: '10px', color: '#166534', fontWeight: '700'}}>{geoLabel}</small>
          </div>
        </div>

        <button className='btn secondary' style={{width: '100%', marginBottom: '16px'}} onClick={locate}>
          <Navigation size={16} color='#0C5A56'/> Recalibrate GPS Location
        </button>

        {rows.map(p=>(
          <article className='quiet-row-card' key={p.id}>
            <div className='quiet-row-top'>
              <img src={imageFor(p.category)} alt={p.name}/>
              <div>
                <strong>{p.name}</strong>
                <Pill level={p.level}/>
                <span style={{fontSize: '11px', color: '#64748B', display: 'block', marginTop: '4px'}}>
                  📍 {p.km<1 ? (Math.round(p.km*1000) + ' m') : (p.km.toFixed(1) + ' km')} • {p.wait}
                </span>
                <span style={{fontSize: '10px', color: '#10B981', fontWeight: '700', marginTop: '2px', display: 'block'}}>
                  📡 {p.source}
                </span>
              </div>
            </div>
            <div className='quiet-row-actions'>
              <button onClick={()=>{setSelectedPlace(p.id);go('map')}}>Show on Map</button>
              <button onClick={()=>setQuietAdded(x=>x.includes(p.id)?x:[...x,p.id])}>
                {quietAdded.includes(p.id) ? '✓ Added to Journey' : '+ Add to Journey'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </Frame>
  );
}

function PlaceView(){
  return (
    <Frame>
      <div className='place-detail-container'>
        <div className='detail-hero'>
          <img src={imageFor(currentPlace?.category||'Heritage')} alt={currentPlace?.name}/>
          <div className='detail-hero-gradient'/>
          <div className='floating-nav'>
            <button className='icon-btn' onClick={()=>go('map')}><ArrowLeft size={20}/></button>
            <div style={{display: 'flex', gap: '8px'}}>
              <button className='icon-btn'><Share2 size={18}/></button>
              <button className='icon-btn'><Heart size={18}/></button>
            </div>
          </div>
        </div>

        <div className='place-detail-sheet'>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
            <h1>{currentPlace?.name || 'Patan Durbar Square'}</h1>
            <Pill level={currentLevel}/>
          </div>

          <div className='key-specs-card'>
            <div className='key-spec-row'>
              <Clock size={16}/>
              <span>Estimated Wait Time: <b>{currentCrowd?.wait || '40 – 50 min'}</b></span>
            </div>
            <div className='key-spec-row'>
              <Sparkles size={16}/>
              <span>Recommended Best Time: <b>After 3:00 PM (Low Crowd)</b></span>
            </div>
            <div className='key-spec-row'>
              <MapPin size={16}/>
              <span>Location: <b>UNESCO Cultural Zone, Patan</b></span>
            </div>
          </div>

          <p style={{fontSize: '13px', color: '#475569', lineHeight: '1.6'}}>
            A UNESCO World Heritage Site and the cultural heart of Patan. Features royal palaces, ancient pagoda temples, and Newari stone architecture.
          </p>

          <div className='quick-tabs-bar'>
            {[
              ['History', <Landmark size={18}/>],
              ['Photos', <Grid3X3 size={18}/>],
              ['Reviews', <Star size={18}/>],
              ['Tips', <HelpCircle size={18}/>]
            ].map(([l, i])=>(
              <button key={String(l)} className={placeTab===l?'active':''} onClick={()=>setPlaceTab(String(l))}>
                {i}<span>{l}</span>
              </button>
            ))}
          </div>

          <div style={{background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '14px', fontSize: '12px', color: '#475569', lineHeight: '1.6', marginBottom: '20px'}}>
            {placeTab==='History' ? 'Patan Durbar Square is one of the three Durbar Squares in the Kathmandu Valley, dating back to the Malla Kingdom era.' :
             placeTab==='Photos' ? 'High-definition heritage photo archive verified by UNESCO conservators.' :
             placeTab==='Reviews' ? 'Rated 4.8 / 5 by 320 travelers. "Best visited late afternoon for quiet temple strolls."' :
             'Crowd Tip: Enter from the southern gate during lunch hours to skip gate queue.'}
          </div>

          <div className='section-title'>
            <h2>Nearby Calmer Alternatives</h2>
            <button onClick={()=>go('quiet')}>See all <ChevronRight size={14}/></button>
          </div>

          {[
            {id:'a1',name:'Woodcarving Workshop',category:'Craft',crowd:'Low',dist:'5 min walk • 450 m'},
            {id:'a2',name:'Golden Temple',category:'Spiritual',crowd:'Moderate',dist:'7 min walk • 600 m'},
            {id:'a3',name:'Mangal Bazaar',category:'Craft',crowd:'Low',dist:'8 min walk • 650 m'}
          ].map(a=>(
            <button className='alt-row' key={a.id} onClick={()=>{setSelectedPlace(a.id);go('map')}}>
              <img src={imageFor(a.category)} alt=''/>
              <div>
                <strong>{a.name}</strong>
                <Pill level={norm(a.crowd)}/>
                <span>{a.dist}</span>
              </div>
              <ChevronRight size={18} color='#94A3B8'/>
            </button>
          ))}

          <div className='dual-actions-bar'>
            <Secondary onClick={()=>go('quiet')}>Add to Journey</Secondary>
            <Primary onClick={()=>go('map')}>Start Navigation 🧭</Primary>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function ExperiencesView(){
  return (
    <Frame>
      <Header title='Living Heritage'/>
      <div className='phone-body'>
        <div className='chips'>
          {['All','Craft','Food','Culture','Art'].map(x=>(
            <button className={category===x?'active':''} onClick={()=>setCategory(x)} key={x}>{x}</button>
          ))}
        </div>
        <div className='experience-list'>
          {experiences.filter(e=>category==='All'||e.category===category).map(e=>(
            <button key={e.id} onClick={()=>{setSelectedExp(e);setTime('');go('experience')}}>
              <img src={e.image} alt={e.title}/>
              <div>
                <strong>{e.title}</strong>
                <span>{e.category} · NPR {e.price}</span>
                <small>★ {e.rating}</small>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function ExperienceView(){
  if(!selectedExp) return null;
  const available=slots.filter(s=>s.experienceId===selectedExp.id&&s.day==='Today'&&s.available&&s.booked<s.capacity);
  return (
    <Frame>
      <div className='detail-hero'>
        <img src={selectedExp.image} alt={selectedExp.title}/>
        <div className='floating-nav'>
          <button className='icon-btn' onClick={()=>go('experiences')}><ArrowLeft size={18}/></button>
          <div style={{display: 'flex', gap: '8px'}}>
            <button className='icon-btn'><Navigation size={16}/></button>
            <button className='icon-btn'><Heart size={16}/></button>
          </div>
        </div>
      </div>

      <div className='place-detail-sheet'>
        <h1>{selectedExp.title}</h1>
        <p style={{fontSize: '13px', color: '#64748B', margin: '4px 0 10px'}}>{selectedExp.subtitle}</p>

        <div className='facts'>
          <Pill level='low'/>
          <span style={{fontSize: '12px', fontWeight: '700'}}><Star size={13} fill='#D97706' color='#D97706'/> {selectedExp.rating} • Patan</span>
          <span style={{fontSize: '12px', color: '#64748B'}}><Clock size={13}/> {selectedExp.duration} • Group Size: 2 – 8</span>
        </div>

        <p style={{fontSize: '13px', color: '#475569', lineHeight: '1.55', margin: '14px 0'}}>
          Experience traditional Newari woodcarving and create your own souvenir.
        </p>

        <h2 style={{fontSize: '14px', fontWeight: '800', margin: '16px 0 10px'}}>What's Included</h2>
        <div className='facts' style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center'}}>
          <div style={{border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 4px', fontSize: '11px'}}><Store size={16}/><br/>Materials</div>
          <div style={{border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 4px', fontSize: '11px'}}><User size={16}/><br/>Guide</div>
          <div style={{border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 4px', fontSize: '11px'}}><Utensils size={16}/><br/>Refreshments</div>
          <div style={{border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 4px', fontSize: '11px'}}><Gift size={16}/><br/>Your Creation</div>
        </div>

        <h2 style={{fontSize: '14px', fontWeight: '800', margin: '20px 0 10px'}}>Available Time Slots</h2>
        <div className='slots'>
          {['10:00 AM', '11:30 AM', '2:00 PM', '4:00 PM'].map(t=>(
            <button key={t} className={time===t?'active':''} onClick={()=>setTime(t)}>
              {t}
            </button>
          ))}
        </div>

        <div className='sticky-buy'>
          <div>
            <strong style={{fontSize: '16px', display: 'block'}}>NPR {selectedExp.price}</strong>
            <span style={{fontSize: '11px', color: '#64748B'}}>/ person</span>
          </div>
          <Primary disabled={!time} onClick={()=>go('booking')}>Book Now</Primary>
        </div>
      </div>
    </Frame>
  );
}

function BookingView(){
  if(!selectedExp) return null;
  return (
    <Frame>
      <Header title='Review booking' back='experience'/>
      <div className='phone-body'>
        <div className='booking-product'>
          <img src={selectedExp.image} alt=''/>
          <div>
            <strong>{selectedExp.title}</strong>
            <span>{time || '10:00 AM'}</span>
          </div>
        </div>
        <div className='stepper'>
          <span>Guests</span>
          <div>
            <button onClick={()=>setGuests(Math.max(1,guests-1))}><Minus size={14}/></button>
            <b>{guests}</b>
            <button onClick={()=>setGuests(Math.min(12,guests+1))}><Plus size={14}/></button>
          </div>
        </div>
        <div className='price-row'>
          <span>Total</span>
          <b>NPR {(selectedExp.price*guests).toLocaleString()}</b>
        </div>
        <div className='soft-banner'>
          <ShieldCheck size={18}/>
          <p>Prototype checkout: no real payment is processed. Price is recalculated server-side.</p>
        </div>
        {error&&<div className='form-error'>{error}</div>}
        <Primary onClick={confirmBooking}>Confirm booking</Primary>
      </div>
    </Frame>
  );
}

function ConfirmedView(){
  return (
    <Frame>
      <div className='success-page'>
        <Check className='success-icon'/>
        <h1>Booking confirmed</h1>
        <p>Your booking is now shared with the assigned operator and manager workspace.</p>
        <Primary onClick={()=>go('bookings')}>My Bookings</Primary>
      </div>
    </Frame>
  );
}

function BookingsView(){
  return (
    <Frame>
      <Header title='My Bookings'/>
      <div className='phone-body'>
        <div className='chips' style={{marginBottom: '16px'}}>
          <button className='active'>Upcoming</button>
          <button>Completed</button>
        </div>

        {(bookings.length ? bookings : [
          {id:'b1',experienceTitle:'Woodcarving Workshop',date:'12 May 2024',time:'10:00 AM',status:'Confirmed'},
          {id:'b2',experienceTitle:'Newari Lunch Experience',date:'12 May 2024',time:'1:15 PM',status:'Confirmed'},
          {id:'b3',experienceTitle:'Heritage Walk (Patan)',date:'12 May 2024',time:'3:30 PM',status:'Pending'}
        ]).map(b=>(
          <article className='booking-item-card' key={b.id}>
            <img src={imageFor('Craft')} alt=''/>
            <div>
              <strong>{b.experienceTitle}</strong>
              <span>{b.date || '12 May 2024'} • {b.time}</span>
              <span style={{fontSize: '10px', color: '#94A3B8'}}>Booking ID: YL12345</span>
            </div>
            <span className={'status-badge ' + b.status.toLowerCase()}>{b.status}</span>
          </article>
        ))}
      </div>
    </Frame>
  );
}

function PointsView(){
  return (
    <Frame>
      <Header title='Heritage Points & Rewards' back='profile'/>
      <div className='phone-body'>
        <div className='points-card-banner'>
          <span style={{fontSize: '12px', opacity: '0.9'}}>Your Heritage Points</span>
          <strong>{points}</strong>
          <span style={{fontSize: '11px', opacity: '0.8'}}>Earn points, get rewards, support heritage.</span>
        </div>

        <h2 style={{fontSize: '14px', fontWeight: '800'}}>How to Earn</h2>
        {[
          ['Visit off-peak hours', '+50 pts'],
          ['Book local experiences', '+100 pts'],
          ['Support local artisans', '+75 pts'],
          ['Choose alternative routes', '+25 pts']
        ].map(([title, pts])=>(
          <div className='profile-menu-item' key={title} style={{gridTemplateColumns: '1fr auto', height: '44px'}}>
            <span>{title}</span>
            <span style={{color: '#227C44', fontWeight: '700'}}>{pts}</span>
          </div>
        ))}

        <h2 style={{fontSize: '14px', fontWeight: '800', marginTop: '20px'}}>Redeem Rewards</h2>
        <div className='booking-item-card' style={{gridTemplateColumns: '1fr auto'}}>
          <div>
            <strong>Local Cafe Discount</strong>
            <span>100 points</span>
          </div>
          <button className='btn secondary' style={{height: '34px', fontSize: '11px'}} disabled={points<100} onClick={()=>redeem(100,'Local cafe discount')}>
            Redeem
          </button>
        </div>
      </div>
    </Frame>
  );
}

function ImpactView(){
  const active=bookings.filter(b=>!['Cancelled','Refunded'].includes(b.status));
  return (
    <Frame>
      <Header title='My Impact' back='profile'/>
      <div className='phone-body'>
        <div className='points-card-banner' style={{background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)'}}>
          <strong>Your Impact So Far</strong>
          <span style={{fontSize: '12px'}}>Keep exploring responsibly!</span>
        </div>

        <div className='impact-stats-grid'>
          <div className='impact-stat-card'>
            <b>NPR 3,850</b>
            <span>Spent Locally</span>
          </div>
          <div className='impact-stat-card'>
            <b>4</b>
            <span>Local Businesses Supported</span>
          </div>
          <div className='impact-stat-card'>
            <b>2</b>
            <span>Crowded Places Avoided</span>
          </div>
          <div className='impact-stat-card'>
            <b>NPR 350</b>
            <span>Heritage Contribution</span>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function ProfileView(){
  return (
    <Frame>
      <div className='phone-body'>
        <div className='profile-head-card'>
          <div className='profile-avatar'>A</div>
          <div>
            <h1 style={{fontSize: '18px', margin: 0}}>Aarav Sharma</h1>
            <span style={{fontSize: '12px', color: '#64748B'}}>aarav.sharma@gmail.com</span>
            <div style={{marginTop: '4px', fontSize: '11px', fontWeight: '700', color: 'var(--teal-primary)'}}>
              Explorer Level 3 • {points} Heritage Points
            </div>
          </div>
        </div>

        <div className='profile-menu-list'>
          {[
            ['My Bookings', <CalendarDays size={18}/>, ()=>go('bookings')],
            ['Saved Places', <Bookmark size={18}/>, ()=>go('map')],
            ['Heritage Points & Rewards', <Gift size={18}/>, ()=>go('points')],
            ['My Impact', <Leaf size={18}/>, ()=>go('impact')],
            ['Settings', <Settings size={18}/>, onSettings],
            ['Help & Support', <HelpCircle size={18}/>, ()=>go('privacy')],
            ['Log out', <LogOut size={18}/>, onLogout]
          ].map(([title, icon, action], idx)=>(
            <button key={String(title)} className={'profile-menu-item' + (idx === 6 ? ' logout' : '')} onClick={action as any}>
              {icon as React.ReactNode}
              <span>{title as string}</span>
              <ChevronRight size={16} color='#CBD5E1'/>
            </button>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function PrivacyView(){
  return (
    <Frame>
      <Header title='Privacy' back='profile'/>
      <div className='phone-body'>
        <h1>Privacy by default.</h1>
        <p className='lead'>The same persisted account preference is used here and in Settings.</p>
        <div className='setting-toggle'>
          <div>
            <strong>Anonymous location sharing</strong>
            <span>Opt in to location-aware discovery.</span>
          </div>
          <button className={settings?.location_sharing?'on':''} onClick={()=>savePrivacy(!settings?.location_sharing)}><i/></button>
        </div>
      </div>
    </Frame>
  );
}

function NotificationsView(){
  return (
    <Frame>
      <Header title='Notifications' back='profile'/>
      <div className='phone-body'>
        {[
          ['Crowd changed','Patan crowd pressure changed.'],
          ['Booking update','Your operator can update attendance status.'],
          ['Points earned','Bookings add Heritage Points.']
        ].map(([a,b])=>(
          <div className='notification-row' key={a}>
            <i/>
            <div>
              <strong>{a}</strong>
              <p>{b}</p>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function PlanView(){
  return (
    <Frame>
      <Header title='AI Trip Planner'/>
      <div className='phone-body'>
        <h1>Plan your Nepal journey</h1>
        <p className='lead'>Custom AI itinerary tailored to your travel group, budget, pace, daily schedule, and cultural interests.</p>

        <div className='planner-form'>
          <div className='form-section-title'>1. Trip Overview</div>
          <label>Destinations<textarea value={planner.destinations} onChange={e=>setPlanner({...planner,destinations:e.target.value})} placeholder='e.g. Patan, Bhaktapur, Kathmandu'/></label>
          <div className='pair'>
            <label>Start Date<input type='date' value={planner.startDate} onChange={e=>setPlanner({...planner,startDate:e.target.value})}/></label>
            <label>End Date<input type='date' value={planner.endDate} onChange={e=>setPlanner({...planner,endDate:e.target.value})}/></label>
          </div>
          <label>Budget (NPR)<input type='number' value={planner.budget} onChange={e=>setPlanner({...planner,budget:Number(e.target.value)})}/></label>

          <div className='form-section-title'>2. Travel Style & Group</div>
          <div className='pair'>
            <label>Travel Group
              <select value={planner.travelGroup} onChange={e=>setPlanner({...planner,travelGroup:e.target.value})}>
                <option>Solo traveler</option>
                <option>Couple</option>
                <option>Family with kids</option>
                <option>Group of friends</option>
                <option>Cultural research tour</option>
              </select>
            </label>
            <label>Travel Pace
              <select value={planner.pace} onChange={e=>setPlanner({...planner,pace:e.target.value})}>
                <option>Relaxed</option>
                <option>Balanced</option>
                <option>Fast-paced</option>
              </select>
            </label>
          </div>
          <div className='pair'>
            <label>Transport Mode
              <select value={planner.transport} onChange={e=>setPlanner({...planner,transport:e.target.value})}>
                <option>Walk + local taxi</option>
                <option>Walking only (Eco)</option>
                <option>Private car & driver</option>
                <option>Local microbus / Rickshaw</option>
              </select>
            </label>
            <label>Crowd Strategy
              <select value={planner.crowdPreference} onChange={e=>setPlanner({...planner,crowdPreference:e.target.value})}>
                <option>Avoid peak crowds</option>
                <option>Balanced</option>
                <option>Famous places first</option>
              </select>
            </label>
          </div>

          <div className='form-section-title'>3. Timing & Dining</div>
          <div className='pair'>
            <label>Daily Start
              <select value={planner.dailyStart} onChange={e=>setPlanner({...planner,dailyStart:e.target.value})}>
                <option>08:00 AM</option>
                <option>09:00 AM</option>
                <option>10:00 AM</option>
              </select>
            </label>
            <label>Daily Wrap-up
              <select value={planner.dailyEnd} onChange={e=>setPlanner({...planner,dailyEnd:e.target.value})}>
                <option>17:00 (5 PM)</option>
                <option>18:00 (6 PM)</option>
                <option>20:00 (8 PM)</option>
              </select>
            </label>
          </div>
          <label>Dietary Preference
            <select value={planner.dietary} onChange={e=>setPlanner({...planner,dietary:e.target.value})}>
              <option>Local Newari & Authentic</option>
              <option>Vegetarian / Vegan friendly</option>
              <option>Cafés & Traditional Tea Houses</option>
              <option>Flexible / Any</option>
            </select>
          </label>

          <div className='form-section-title'>4. Interests & Specific Requests</div>
          <label>Cultural Interests<textarea value={planner.interests} onChange={e=>setPlanner({...planner,interests:e.target.value})} placeholder='e.g. Heritage, woodcarving, Newari food, monasteries'/></label>
          <label>Must-Visit Places<textarea value={planner.mustVisit} onChange={e=>setPlanner({...planner,mustVisit:e.target.value})} placeholder='e.g. Patan Durbar Square, Golden Temple'/></label>
          <label>Special Notes & Accessibility<textarea value={planner.notes} onChange={e=>setPlanner({...planner,notes:e.target.value})} placeholder='e.g. Step-free preferred, photography focus, early morning prayer access'/></label>
        </div>

        {aiError&&<div className='form-error'>{aiError}</div>}
        <Primary disabled={aiLoading} onClick={generate}>
          {aiLoading?'Building personalized timeline…':'Generate grounded AI timeline'}
        </Primary>
      </div>
    </Frame>
  );
}

function ItineraryView(){
  return (
    <Frame>
      <Header title='My Journey' back='plan'/>
      <div className='phone-body'>
        <div className='journey-card'>
          <h2>Heritage & Culture Walk</h2>
          <p>Today, 12 May 2024 • 6 Stops • ~5 hr 30 min</p>
          <strong>Total Est. Cost: NPR 2,700</strong>
        </div>

        <div className='timeline-list'>
          {[
            {time:'10:00 AM',title:'Patan Durbar Square',crowd:'high',walk:'12 min walk (850 m)'},
            {time:'11:15 AM',title:'Golden Temple (Patan)',crowd:'moderate',walk:'30 min visit'},
            {time:'12:15 PM',title:'Newari Lunch Experience',crowd:'low',walk:'60 min • Local Restaurant'},
            {time:'01:30 PM',title:'Woodcarving Workshop',crowd:'low',walk:'45 min experience'},
            {time:'02:30 PM',title:'Mangal Bazaar',crowd:'low',walk:'30 min explore'},
            {time:'03:30 PM',title:'Heritage Walk',crowd:'low',walk:'60 min • Guided'}
          ].map((item, i)=>(
            <div className='timeline-item' key={i}>
              <div className='node-dot'>{i+1}</div>
              <time>{item.time}</time>
              <div className='item-card'>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <strong>{item.title}</strong>
                  <Pill level={norm(item.crowd)}/>
                </div>
                <span style={{fontSize: '11px', color: '#64748B', display: 'block', marginTop: '4px'}}>{item.walk}</span>
              </div>
            </div>
          ))}
        </div>

        <div className='dual-actions-bar'>
          <Secondary onClick={()=>go('map')}>View Map</Secondary>
          <Primary onClick={()=>alert('Journey started! Navigating to first stop.')}>Start Journey</Primary>
        </div>
      </div>
    </Frame>
  );
}

function ProductMap(){
  const [query,setQuery]=useState('');
  const rows=PAGE_LIBRARY.filter(p=>p.role==='Traveler'&&(p.title + ' ' + p.module).toLowerCase().includes(query.toLowerCase()));
  return (
    <main className='product-map'>
      <header>
        <button onClick={()=>go('profile')}><ArrowLeft size={16}/>Back</button>
        <Logo/>
        <h1>149 Traveler Prototype Screens</h1>
        <p>Role-protected Admin and Operator workspaces are not exposed here.</p>
      </header>
      <div className='library'>
        <label><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder='Search traveler screens'/></label>
        <div className='page-grid'>
          {rows.map(p=>(
            <button key={p.id} onClick={()=>openCatalog(p)}>
              <span>{p.module}</span>
              <strong>{p.title}</strong>
              <small>{p.route}</small>
              <ArrowRight size={14}/>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

 if(portal==='productMap')return <ProductMap/>;if(portal==='catalog'&&catalogPage)return <ProductScreenRenderer page={catalogPage} pages={PAGE_LIBRARY.filter(p=>p.role==='Traveler')} onBack={()=>{setPortal('productMap');location.hash='#/screens'}} onOpen={openCatalog} crowdLevel={currentLevel} crowdLabel={crowdInfo[currentLevel].label} crowdWait={currentCrowd?.wait||crowdInfo[currentLevel].wait} onOpenCore={t=>go(t as Screen)}/>;if(screen==='home')return <HomeView/>;if(screen==='search')return <SearchView/>;if(screen==='filters')return <FiltersView/>;if(screen==='map')return <MapView/>;if(screen==='alert')return <AlertView/>;if(screen==='quiet')return <QuietView/>;if(screen==='place')return <PlaceView/>;if(screen==='experiences')return <ExperiencesView/>;if(screen==='experience')return <ExperienceView/>;if(screen==='booking')return <BookingView/>;if(screen==='confirmed')return <ConfirmedView/>;if(screen==='bookings')return <BookingsView/>;if(screen==='points')return <PointsView/>;if(screen==='impact')return <ImpactView/>;if(screen==='privacy')return <PrivacyView/>;if(screen==='notifications')return <NotificationsView/>;if(screen==='plan')return <PlanView/>;if(screen==='itinerary')return <ItineraryView/>;return <ProfileView/>}
