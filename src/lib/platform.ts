import { seedData } from './seed';

type ApiResponse<T=any> = { data: T };
type MessageHandler = (message:any)=>void;
type Subscription = { entity_type:string; entity_id:string };

// In-memory mock DB using localStorage
const getDB = () => {
  if (typeof window === 'undefined') return seedData;
  const stored = localStorage.getItem('yatralink_db');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('yatralink_db', JSON.stringify(seedData));
  return seedData;
};

const saveDB = (db: any) => {
  if (typeof window === 'undefined') return;
  db.updated_at = Date.now();
  localStorage.setItem('yatralink_db', JSON.stringify(db));
};

class Connection {
  connectionId = crypto.randomUUID();
  ready = Promise.resolve();
  private listeners = new Set<MessageHandler>();
  private subscriptions = new Map<string,Subscription>();

  constructor(){
    connections.set(this.connectionId,this);
  }
  onMessage(fn:MessageHandler){ this.listeners.add(fn); }
  onOpen(_fn:()=>void){}
  onClose(_fn:()=>void){}
  onError(_fn:(err:any)=>void){}
  add(type:string,id:string){ this.subscriptions.set(`${type}:${id}`,{entity_type:type,entity_id:id}); }
  remove(type:string,id:string){ this.subscriptions.delete(`${type}:${id}`); }
  disconnect(){ this.listeners.clear(); connections.delete(this.connectionId); }
  
  // Local mock trigger
  trigger(entity_type: string, entity_id: string, data: any) {
    const key = `${entity_type}:${entity_id}`;
    if(!this.subscriptions.has(key)) return;
    const message = {v:1,type:'entity.update',payload:{entity_type,entity_id,data}};
    this.listeners.forEach(fn=>fn(message));
  }
}

const connections = new Map<string,Connection>();

async function request(method:string,url:string,data?:any):Promise<ApiResponse>{
  // Simulate network delay
  await new Promise(r => setTimeout(r, 150));
  
  if(url==='/api/subscriptions' && method==='POST'){
    const conn=connections.get(data?.connection_id); conn?.add(data?.entity_type,data?.entity_id); return {data:{ok:true}};
  }
  if(url==='/api/subscriptions/remove' && method==='POST'){
    const conn=connections.get(data?.connection_id); conn?.remove(data?.entity_type,data?.entity_id); return {data:{ok:true}};
  }
  
  const db = getDB();
  
  try {
    // Auth routes
    if(url === '/api/demo-auth/login' && method === 'POST') {
      const user = db.users.find((u: any) => u.email === data.email && u.password === data.password);
      if(!user) throw new Error('Invalid email or password.');
      return { data: { session_id: user.email, user: { email: user.email, name: user.name, role: user.role } } };
    }
    if(url === '/api/demo-auth/session' && method === 'GET') {
      const user = db.users.find((u: any) => u.email === data?.session_id);
      if(!user) throw new Error('Session expired.');
      return { data: { user: { email: user.email, name: user.name, role: user.role } } };
    }
    if(url === '/api/demo-auth/logout' && method === 'POST') {
      return { data: { ok: true } };
    }
    
    // Management Routes
    if(url === '/api/management/state' && method === 'GET') {
      const user = db.users.find((u: any) => u.email === data?.session_id);
      if(!user) throw new Error('Session expired.');
      
      let state = {
        places: db.places,
        experiences: db.experiences,
        bookings: db.bookings,
        operators: db.operators,
        crowdSites: db.crowdSites,
        slots: db.slots,
        reviews: db.reviews,
        updated_at: db.updated_at
      };
      
      if(user.role === 'superadmin') {
        return { data: { state, role: user.role } };
      } else if (user.role === 'operator') {
        const op = db.operators.find((o:any) => o.email === user.email);
        if(!op) throw new Error('No operator profile.');
        const scoped = {
          ...state,
          places: [],
          crowdSites: [],
          experiences: state.experiences.filter((e:any) => e.operatorId === op.id),
          bookings: state.bookings.filter((b:any) => b.operatorId === op.id),
          operators: state.operators.filter((o:any) => o.id === op.id),
          slots: state.slots.filter((sl:any) => sl.operatorId === op.id),
          reviews: state.reviews.filter((rv:any) => rv.operatorId === op.id)
        };
        return { data: { state: scoped, role: user.role, operator_id: op.id } };
      }
      throw new Error('Not authorized for management state.');
    }
    
    if(url === '/api/management/action' && method === 'POST') {
      const user = db.users.find((u: any) => u.email === data?.session_id);
      const action = data.action;
      const p = data.payload || {};
      const id = p.id;
      
      if(action === 'place.update') {
        const place = db.places.find((x:any) => x.id === id);
        if(place) {
          if(p.status) place.status = p.status;
          // emit update
          connections.forEach(c => c.trigger('management', 'shared', { updated_at: Date.now() }));
        }
      } else if (action === 'experience.status') {
        const exp = db.experiences.find((x:any) => x.id === id);
        if(exp) exp.status = p.status;
      }
      
      saveDB(db);
      
      // Return updated state
      const state = {
        places: db.places,
        experiences: db.experiences,
        bookings: db.bookings,
        operators: db.operators,
        crowdSites: db.crowdSites,
        slots: db.slots,
        reviews: db.reviews,
        updated_at: db.updated_at
      };
      return { data: { state } };
    }
    
    throw new Error('API route not implemented in mock.');
    
  } catch (err: any) {
    err.status = err.status || 500;
    err.data = { error: err.message };
    throw err;
  }
}

export const api={
  get:(url:string,data?:any)=>request('GET',url,data),
  post:(url:string,data?:any)=>request('POST',url,data),
  put:(url:string,data?:any)=>request('PUT',url,data),
  delete:(url:string,data?:any)=>request('DELETE',url,data),
};
export const ws={connect:()=>new Connection()};
