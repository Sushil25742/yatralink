import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { api, ws } from './lib/platform';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import {
  Activity, ArrowDownToLine, BarChart3, Bell, BookOpen, CalendarDays, Check,
  ChevronRight, CircleDollarSign, Clock, Edit3, Eye, Home, LayoutDashboard,
  MapPin, MessageSquare, MoreHorizontal, Plus, RefreshCw, Search, Settings,
  ShieldCheck, Star, Store, TicketCheck, Trash2, TrendingUp, UserRoundCheck,
  Users, X, Download, AlertCircle, ArrowUpRight, ArrowDownRight, Upload,
  LineChart, PieChart as PieChartIcon, FileText, Send, Filter, Pause, Copy
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar, LineChart as RechartsLineChart, Line
} from 'recharts';
import 'leaflet/dist/leaflet.css';
import './management.css';

type Role = 'operator' | 'superadmin' | 'traveler';
type User = { name: string; email: string; role: Role; joined?: string; status?: string };

type Place = { id: string; name: string; category: string; zone: string; status: string; crowd: string; capacity: number; visits: number; lat: number; lng: number };
type Experience = { id: string; title: string; operatorId: string; category: string; price: number; capacity: number; status: string; bookings: number; rating: number };
type Booking = { id: string; guest: string; experienceId: string; experienceTitle?: string; operatorId: string; date: string; time: string; guests: number; amount: number; status: string };
type Operator = { id: string; name: string; business: string; email: string; status: string; experiences: number; rating: number; revenue: number; applied?: string };
type CrowdSite = { id: string; name: string; level: string; score: number; wait: string; lat: number; lng: number; source?: string; capacity?: number };
type Slot = { id: string; experienceId: string; operatorId: string; day: string; time: string; available: boolean; capacity: number; booked: number };
type Review = { id: string; guest: string; rating: number; text: string; reply: string; date: string; experience: string };

type State = {
  places: Place[];
  experiences: Experience[];
  bookings: Booking[];
  operators: Operator[];
  crowdSites: CrowdSite[];
  slots: Slot[];
  reviews: Review[];
  users: User[];
  updated_at: number;
};

type AdminView = 'overview' | 'places' | 'experiences' | 'bookings' | 'operators' | 'crowd' | 'users' | 'analytics' | 'reviews' | 'reports' | 'settings' | 'notifications' | 'operator-applications';
type OperatorView = 'overview' | 'experiences' | 'bookings' | 'calendar' | 'customers' | 'reviews' | 'payouts' | 'analytics' | 'settings';

const money = (n: number) => `NPR ${Math.round(n).toLocaleString()}`;
const crowdClass = (x: string) => x.toLowerCase().replace(/\s+/g, '-');
const kathmanduDate = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kathmandu', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

function Brand() {
  return (
    <div className='mc-brand'>
      <span><MapPin size={20} strokeWidth={2.5} /></span>
      <strong>YatraLink</strong>
    </div>
  );
}

function Badge({ children, tone = 'neutral', dot = true }: { children: ReactNode; tone?: string; dot?: boolean }) {
  return (
    <span className={`mc-badge mc-badge--${tone}`}>
      {dot && <div className="dot" />}
      {children}
    </span>
  );
}

export default function ManagementConsole({ sessionId, user, onSettings, onLogout }: { sessionId: string; user: User; onSettings: () => void; onLogout: () => void }) {
  const [state, setState] = useState<State | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(false);
  const isAdmin = user.role === 'superadmin';
  const [adminView, setAdminView] = useState<AdminView>('overview');
  const [operatorView, setOperatorView] = useState<OperatorView>('overview');
  const connRef = useRef<ReturnType<typeof ws.connect> | null>(null);

  // Mock users for the Users Management screen
  const load = () => api.get('/api/management/state', { session_id: sessionId })
    .then(({ data }) => {
      // Inject mock users if missing
      if (!data.state.users) {
         data.state.users = [
           { name: 'Rahul Sharma', email: 'rahul@example.com', role: 'traveler', joined: '21 May 2025', status: 'Active' },
           { name: 'Anita Gurung', email: 'anita@example.com', role: 'traveler', joined: '20 May 2025', status: 'Active' },
           { name: 'Sushil', email: 'sushil@example.com', role: 'superadmin', joined: '01 Jan 2025', status: 'Active' },
           { name: 'Heritage Walks', email: 'heritage@example.com', role: 'operator', joined: '15 Apr 2025', status: 'Active' },
           { name: 'Himalayan Treks', email: 'himalayan@example.com', role: 'operator', joined: '08 Apr 2025', status: 'Active' },
           { name: 'Spiritual Nepal', email: 'spiritual@example.com', role: 'operator', joined: '02 May 2025', status: 'Inactive' }
         ];
      }
      if (!data.state.reviews) {
         data.state.reviews = [
           { id: '1', guest: 'Rahul Sharma', rating: 5, text: 'Amazing experience! The guide was knowledgeable.', date: '21 May 2025', experience: 'Patan Heritage Walk', reply: '' },
           { id: '2', guest: 'Anita Gurung', text: 'Very peaceful and spiritual experience.', rating: 4, date: '19 May 2025', experience: 'Spiritual Nepal', reply: '' },
           { id: '3', guest: 'David Brown', text: 'Well organized tour. Highly recommended!', rating: 5, date: '18 May 2025', experience: 'Boudhanath Stupa', reply: '' }
         ];
      }
      setState(data.state);
    })
    .catch(() => setError('Unable to load this workspace.'))
    .finally(() => setLoading(false));

  useEffect(() => {
    load();
    const conn = ws.connect();
    connRef.current = conn;
    conn.onMessage(m => {
      if (m?.type === 'entity.update' && m.payload?.entity_type === 'management') load();
    });
    conn.ready.then(() => {
      if (conn.connectionId) {
        api.post('/api/subscriptions', { session_id: sessionId, entity_type: 'management', entity_id: 'shared', connection_id: conn.connectionId });
      }
    });
    return () => conn.disconnect();
  }, [sessionId]);

  useEffect(() => {
    const sync = () => {
      const h = location.hash;
      if (isAdmin && h.startsWith('#/manager/')) {
        const v = h.split('/')[2] as AdminView;
        if (['overview', 'places', 'experiences', 'bookings', 'operators', 'crowd', 'users', 'analytics', 'reviews', 'reports', 'settings', 'notifications', 'operator-applications'].includes(v)) setAdminView(v);
      } else if (!isAdmin && h.startsWith('#/operator/')) {
        const v = h.split('/')[2] as OperatorView;
        if (['overview', 'experiences', 'bookings', 'calendar', 'customers', 'reviews', 'payouts', 'analytics', 'settings'].includes(v)) setOperatorView(v);
      }
    };
    sync();
    addEventListener('hashchange', sync);
    return () => removeEventListener('hashchange', sync);
  }, [isAdmin]);

  const act = async (action: string, payload: Record<string, unknown> = {}) => {
    setError('');
    
    // UI-only mock intercepts
    if (action === 'add_operator' && state) {
      const op = {
        id: 'op_' + Date.now(),
        name: payload.business as string,
        business: payload.business as string,
        email: payload.email as string,
        experiences: 0,
        status: 'Pending',
        rating: 0,
        revenue: 0,
        applied: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      setState({
        ...state,
        operators: [op, ...state.operators]
      });
      return true;
    }

    try {
      const { data } = await api.post('/api/management/action', { session_id: sessionId, action, payload });
      // Restore mocks if overwritten
      if (!data.state.users) data.state.users = state?.users || [];
      if (!data.state.reviews) data.state.reviews = state?.reviews || [];
      setState(data.state);
      return true;
    } catch (err: any) {
      setError(err?.message || 'That action could not be completed.');
      return false;
    }
  };

  if (loading && !state) return <div className='mc-loading'><RefreshCw className='spin' size={32} />Opening workspace…</div>;
  if (!state) return <div className='mc-loading'>{error || 'Workspace unavailable.'}</div>;

  const operator = state.operators[0];
  const navAdmin = (v: AdminView) => { setAdminView(v); location.hash = `#/manager/${v}`; };
  const navOperator = (v: OperatorView) => { setOperatorView(v); location.hash = v === 'overview' ? '#/operator' : `#/operator/${v}`; };

  return (
    <div className='mc-shell'>
      {isAdmin ? <SidebarAdmin active={adminView} nav={navAdmin} logout={onLogout} /> : <SidebarOperator active={operatorView} nav={navOperator} logout={onLogout} />}
      
      <main className='mc-main'>
        <header className='mc-topbar'>
          <div>
            <h1>{isAdmin ? adminTitles[adminView][0] : operatorTitles[operatorView][0]}</h1>
            <p>{isAdmin ? adminTitles[adminView][1] : operatorTitles[operatorView][1]}</p>
          </div>
          <div className='mc-topbar__actions'>
            <button className='mc-icon' onClick={() => navAdmin('notifications')}>
              <Bell size={20}/>
              <span className="mc-icon-dot"/>
            </button>
            <button className='mc-icon' onClick={() => navAdmin('settings')}><Settings size={20}/></button>
            <div className='mc-user'>
              <span className='mc-avatar'>{user.name[0]}</span>
              <div>
                <strong>{user.name}</strong>
                <small>{isAdmin ? 'Destination Manager' : 'Local Operator'}</small>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className='mc-error'>
            <div><strong>Error:</strong> {error}</div>
            <button onClick={() => setError('')}><X size={16}/></button>
          </div>
        )}

        <section className='mc-content'>
          {isAdmin ? <AdminRouter view={adminView} state={state} act={act} nav={navAdmin} /> : <OperatorRouter view={operatorView} state={state} operator={operator} act={act} nav={navOperator} />}
        </section>
      </main>
    </div>
  );
}

const adminTitles: Record<AdminView, [string, string]> = {
  overview: ['Dashboard', 'Welcome back, Sushil! Here\'s what\'s happening today.'],
  places: ['Places', 'Manage heritage sites, zones and visitor-facing status.'],
  experiences: ['Experiences', 'Manage all operator experiences and activities.'],
  bookings: ['Bookings', 'View and manage all bookings.'],
  operators: ['Operators', 'Manage all local operators and their status.'],
  crowd: ['Crowd Monitoring', 'Real-time crowd status of major places.'],
  users: ['Users', 'Manage all platform users.'],
  analytics: ['Analytics', 'Detailed insights and reports.'],
  reviews: ['Reviews', 'Manage visitor reviews and ratings.'],
  reports: ['Reports', 'Download and manage reports.'],
  settings: ['Settings', 'Manage platform settings and preferences.'],
  notifications: ['Notifications', 'System notifications and alerts.'],
  'operator-applications': ['Operator Applications', 'Review and manage operator applications.']
};

const operatorTitles: Record<OperatorView, [string, string]> = {
  overview: ['Operator overview', 'Today’s bookings, capacity and earnings at a glance.'],
  experiences: ['My Experiences', 'Create, manage and grow your experiences.'],
  bookings: ['Bookings', 'Prepare for guests and update attendance.'],
  calendar: ['Calendar', 'View and manage your scheduled experiences and bookings.'],
  customers: ['Customers', 'Manage your customers and relationships.'],
  reviews: ['Reviews', 'Read guest feedback and respond.'],
  payouts: ['Payouts', 'Review booking value and statements.'],
  analytics: ['Analytics', 'Detailed insights into your performance.'],
  settings: ['Settings', 'Manage your business profile and preferences.']
};

function SidebarAdmin({ active, nav, logout }: { active: AdminView; nav: (v: AdminView) => void; logout: () => void }) {
  const mainItems: [AdminView, string, ReactNode][] = [
    ['overview', 'Overview', <LayoutDashboard size={20}/>],
    ['places', 'Places', <MapPin size={20}/>],
    ['experiences', 'Experiences', <BookOpen size={20}/>],
    ['bookings', 'Bookings', <TicketCheck size={20}/>],
    ['operators', 'Operators', <Users size={20}/>],
    ['crowd', 'Crowd', <Activity size={20}/>],
    ['users', 'Users', <UserRoundCheck size={20}/>],
    ['analytics', 'Analytics', <BarChart3 size={20}/>],
    ['reviews', 'Reviews', <Star size={20}/>],
    ['reports', 'Reports', <FileText size={20}/>],
    ['settings', 'Settings', <Settings size={20}/>]
  ];
  return (
    <aside className='mc-sidebar'>
      <div className='mc-sidebar__head'>
        <Brand />
        <small>Destination Manager</small>
      </div>
      <nav>
        {mainItems.map(([v, l, i]) => (
          <button key={v} className={active === v ? 'active' : ''} onClick={() => nav(v)}>
            {i}<span>{l}</span>
          </button>
        ))}
      </nav>
      <div className='mc-sidebar__foot'>
        <button onClick={logout}><ArrowDownToLine size={20} style={{transform: 'rotate(-90deg)'}}/>Sign out</button>
      </div>
    </aside>
  );
}

function SidebarOperator({ active, nav, logout }: { active: OperatorView; nav: (v: OperatorView) => void; logout: () => void }) {
  const items: [OperatorView, string, ReactNode][] = [
    ['overview', 'Overview', <LayoutDashboard size={20}/>],
    ['experiences', 'Experiences', <BookOpen size={20}/>],
    ['bookings', 'Bookings', <TicketCheck size={20}/>],
    ['customers', 'Customers', <Users size={20}/>],
    ['calendar', 'Calendar', <CalendarDays size={20}/>],
    ['reviews', 'Reviews', <Star size={20}/>],
    ['payouts', 'Payouts', <CircleDollarSign size={20}/>],
    ['analytics', 'Analytics', <BarChart3 size={20}/>],
    ['settings', 'Settings', <Settings size={20}/>]
  ];
  return (
    <aside className='mc-sidebar'>
      <div className='mc-sidebar__head'>
        <Brand />
        <small>Operator Studio</small>
      </div>
      <nav>
        {items.map(([v, l, i]) => (
          <button key={v} className={active === v ? 'active' : ''} onClick={() => nav(v)}>
            {i}<span>{l}</span>
          </button>
        ))}
      </nav>
      <div className='mc-sidebar__foot'>
        <button onClick={logout}><ArrowDownToLine size={20} style={{transform: 'rotate(-90deg)'}}/>Sign out</button>
      </div>
    </aside>
  );
}

function AdminRouter({ view, state, act, nav }: { view: AdminView; state: State; act: (a: string, p?: Record<string, unknown>) => Promise<boolean>; nav: (v: AdminView) => void }) {
  if (view === 'places') return <PlacesPage state={state} act={act} />;
  if (view === 'experiences') return <ExperiencesPage state={state} act={act} />;
  if (view === 'bookings') return <BookingsPage state={state} act={act} admin />;
  if (view === 'operators') return <OperatorsPage state={state} act={act} nav={nav} />;
  if (view === 'crowd') return <CrowdPage state={state} act={act} />;
  if (view === 'users') return <UsersPage state={state} act={act} />;
  if (view === 'analytics') return <AnalyticsPage state={state} />;
  if (view === 'reviews') return <ReviewsPage state={state} act={act} />;
  if (view === 'reports') return <ReportsPage />;
  if (view === 'settings') return <SettingsPage />;
  if (view === 'notifications') return <NotificationsPage />;
  if (view === 'operator-applications') return <OperatorApplicationsPage state={state} />;
  return <AdminOverview state={state} nav={nav} />;
}

// ---------------------------------------------
// 1. DASHBOARD OVERVIEW
// ---------------------------------------------
function AdminOverview({ state, nav }: { state: State; nav: (v: AdminView) => void }) {
  const chartData = [
    { name: '16 May', Bookings: 100 },
    { name: '17 May', Bookings: 150 },
    { name: '18 May', Bookings: 140 },
    { name: '19 May', Bookings: 120 },
    { name: '20 May', Bookings: 180 },
    { name: '21 May', Bookings: 250 },
    { name: '22 May', Bookings: 190 },
  ];

  const pieData = [
    { name: 'Online payments', value: 185350, color: '#10B981', pct: '75%' },
    { name: 'Cash payments', value: 62430, color: '#F59E0B', pct: '25%' },
  ];

  return (
    <>
      <div className='mc-stats'>
        <div className='mc-stat-card'>
          <div className='mc-stat-content'>
            <span className='mc-stat-label' style={{display: 'flex', alignItems: 'center', gap: 8}}><TicketCheck size={16}/> Total Bookings</span>
            <span className='mc-stat-value'>1,248</span>
            <div className='mc-stat-trend up'>+12.5%</div>
          </div>
        </div>
        <div className='mc-stat-card'>
          <div className='mc-stat-content'>
            <span className='mc-stat-label' style={{display: 'flex', alignItems: 'center', gap: 8}}><CircleDollarSign size={16}/> Revenue</span>
            <span className='mc-stat-value'>NPR 2,45,380</span>
            <div className='mc-stat-trend up'>+18.2%</div>
          </div>
        </div>
        <div className='mc-stat-card'>
          <div className='mc-stat-content'>
            <span className='mc-stat-label' style={{display: 'flex', alignItems: 'center', gap: 8}}><Users size={16}/> Active Operators</span>
            <span className='mc-stat-value'>86</span>
            <div className='mc-stat-trend up'>+8.2%</div>
          </div>
        </div>
        <div className='mc-stat-card'>
          <div className='mc-stat-content'>
            <span className='mc-stat-label' style={{display: 'flex', alignItems: 'center', gap: 8}}><MapPin size={16}/> Places</span>
            <span className='mc-stat-value'>128</span>
            <div className='mc-stat-trend up'>+5.4%</div>
          </div>
        </div>
      </div>

      <div className='mc-dashboard-grid'>
        <section className='mc-card'>
          <div className='mc-card__head'>
            <h2>Bookings Over Time</h2>
          </div>
          <div style={{height: 250}}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="Bookings" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, fill: '#fff', stroke: '#3B82F6', strokeWidth: 2}} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className='mc-card'>
          <div className='mc-card__head'>
            <h2>Revenue Overview</h2>
          </div>
          <div style={{display: 'flex', alignItems: 'center', height: 250}}>
            <div style={{flex: 1, height: 200, position: 'relative'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center'}}>
                <div>
                  <strong style={{display: 'block', fontSize: 14}}>NPR 2,45,380</strong>
                  <span style={{fontSize: 12, color: '#6B7280'}}>Total</span>
                </div>
              </div>
            </div>
            <div style={{flex: 1}}>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '12px'}}>
                {pieData.map((d, i) => (
                  <li key={i} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#4B5563'}}>
                      <span style={{width: 8, height: 8, borderRadius: '50%', background: d.color}}/>
                      {d.name}
                    </div>
                    <strong>{money(d.value)}</strong>
                  </li>
                ))}
                <li style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#4B5563'}}>
                    <span style={{width: 8, height: 8, borderRadius: '50%', background: '#EF4444'}}/>
                    Refunds
                  </div>
                  <strong>NPR 2,750</strong>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div className='mc-dashboard-grid'>
        <section className='mc-card' style={{padding: 0}}>
          <div className='mc-card__head' style={{padding: '24px 24px 0'}}>
            <h2>Top Performing Places</h2>
          </div>
          <div className='mc-table-card' style={{border: 'none', boxShadow: 'none'}}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <div className='mc-cell-place'>
                      <img src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=100&q=80" alt="Patan" />
                      <strong>Patan Durbar Square</strong>
                    </div>
                  </td>
                  <td style={{textAlign: 'right'}}>1,258 bookings</td>
                </tr>
                <tr>
                  <td>
                    <div className='mc-cell-place'>
                      <img src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=100&q=80" alt="Patan" />
                      <strong>Boudhanath Stupa</strong>
                    </div>
                  </td>
                  <td style={{textAlign: 'right'}}>982 bookings</td>
                </tr>
                <tr>
                  <td>
                    <div className='mc-cell-place'>
                      <img src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=100&q=80" alt="Patan" />
                      <strong>Pashupatinath Temple</strong>
                    </div>
                  </td>
                  <td style={{textAlign: 'right'}}>876 bookings</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        <section className='mc-card'>
          <div className='mc-card__head'>
            <h2>Crowd Alert</h2>
          </div>
          <div className='mc-insight-card' style={{background: '#FEF2F2', borderColor: '#FCA5A5'}}>
            <div className='mc-insight-icon' style={{background: '#EF4444', color: '#fff'}}><Activity size={20}/></div>
            <div className='mc-insight-content'>
              <small style={{color: '#DC2626'}}>High crowd detected at</small>
              <strong style={{color: '#991B1B', fontSize: 16, marginTop: 4}}>Patan Durbar Square</strong>
              <div style={{marginTop: 8, fontSize: 12, color: '#B91C1C'}}>Current Status: <strong style={{color: '#991B1B'}}>High</strong></div>
            </div>
          </div>
          <button className='mc-primary' style={{width: '100%', marginTop: 24}} onClick={() => nav('crowd')}>View Details</button>
        </section>
      </div>
    </>
  );
}

// ---------------------------------------------
// 2. PLACES MANAGEMENT
// ---------------------------------------------
function PlacesPage({ state, act }: { state: State; act: (a: string, p?: Record<string, unknown>) => Promise<boolean> }) {
  const [q, setQ] = useState('');
  const [drawer, setDrawer] = useState(false);
  
  return (
    <>
      <div className='mc-toolbar'>
        <div className='mc-toolbar-left'>
          <div className='mc-search'>
            <Search size={18} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder='Search places...' />
          </div>
          <div className='mc-filter-select'>
            <select><option>All Zones</option><option>Patan Core</option></select>
          </div>
          <div className='mc-filter-select'>
            <select><option>All Status</option><option>Active</option></select>
          </div>
        </div>
        <div className='mc-toolbar-right'>
          <button className='mc-secondary'><Download size={18}/> Export</button>
          <button className='mc-primary' onClick={() => setDrawer(true)}><Plus size={18}/> Add Place</button>
        </div>
      </div>
      
      <div className='mc-table-card'>
        <table>
          <thead>
            <tr>
              <th>Place Name</th>
              <th>Zone</th>
              <th>Category</th>
              <th>Crowd</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.places.map(p => (
              <tr key={p.id}>
                <td><strong>{p.name}</strong></td>
                <td>{p.zone}</td>
                <td>{p.category}</td>
                <td><Badge tone={crowdClass(p.crowd)}>{p.crowd}</Badge></td>
                <td><Badge tone={p.status === 'Active' ? 'active' : 'inactive'}>{p.status}</Badge></td>
                <td>
                  <div className='mc-row-actions'>
                    <button><Edit3 size={16}/></button>
                    <button style={{color: '#DC2626'}}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='mc-pagination'>
          <span className='mc-pagination-info'>Showing 1 to 128 of 128 places</span>
          <div className='mc-pagination-controls'>
            <button><ChevronRight style={{transform: 'rotate(180deg)'}} size={16}/></button>
            <button className='active'>1</button>
            <button>2</button>
            <button>3</button>
            <span style={{color: '#9CA3AF'}}>...</span>
            <button>10</button>
            <button><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>

      {drawer && <AddPlaceDrawer onClose={() => setDrawer(false)} />}
    </>
  );
}

// ---------------------------------------------
// 3. ADD/EDIT PLACE DRAWER
// ---------------------------------------------
function AddPlaceDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className='mc-drawer-backdrop' onClick={onClose}>
      <div className='mc-drawer' onClick={e => e.stopPropagation()}>
        <header>
          <h2>Add New Place</h2>
          <button onClick={onClose}><X size={24}/></button>
        </header>
        
        <div className='mc-form-grid'>
          <div className='mc-form-section'>
            <h3>Basic Information</h3>
            <div className='mc-form-group'>
              <label>Name</label>
              <input defaultValue="Patan Durbar Square" />
            </div>
            <div className='mc-form-grid'>
              <div className='mc-form-group'>
                <label>Zone</label>
                <select><option>Patan Core</option></select>
              </div>
              <div className='mc-form-group'>
                <label>Category</label>
                <select><option>Heritage</option></select>
              </div>
            </div>
            <div className='mc-form-group'>
              <label>Short Description *</label>
              <textarea defaultValue="Historic royal palace complex in Patan, known for its Newari architecture and rich culture." rows={3} />
            </div>
            <div className='mc-form-group'>
              <label>Full Description</label>
              {/* Fake rich text editor */}
              <div style={{border: '1px solid var(--mc-line)', borderRadius: 8, overflow: 'hidden'}}>
                <div style={{padding: 8, borderBottom: '1px solid var(--mc-line)', display: 'flex', gap: 8, background: '#F9FAFB'}}>
                  <button style={{border: 0, background: 'transparent', cursor: 'pointer', fontWeight: 'bold'}}>B</button>
                  <button style={{border: 0, background: 'transparent', cursor: 'pointer', fontStyle: 'italic'}}>I</button>
                  <button style={{border: 0, background: 'transparent', cursor: 'pointer', textDecoration: 'underline'}}>U</button>
                </div>
                <textarea style={{border: 0, borderRadius: 0}} defaultValue="Historic royal palace complex in Patan, known for its Newari architecture and rich culture." />
              </div>
            </div>
            <div className='mc-form-group'>
              <label>Cover Image</label>
              <div className='mc-image-upload'>
                <img src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=100&q=80" alt="Preview" />
                <button className='mc-secondary'><Upload size={16}/> Change Image</button>
              </div>
            </div>
          </div>
          
          <div className='mc-form-section'>
            <h3>Additional Information</h3>
            <div className='mc-form-group'>
              <label>Capacity (Daily Visitors)</label>
              <input type="number" defaultValue={5000} />
            </div>
            <div className='mc-form-grid'>
              <div className='mc-form-group'>
                <label>Open Time</label>
                <input type="time" defaultValue="09:00" />
              </div>
              <div className='mc-form-group'>
                <label>Close Time</label>
                <input type="time" defaultValue="18:00" />
              </div>
            </div>
            <div className='mc-form-group'>
              <label>Entry Fee (NPR)</label>
              <input type="number" defaultValue={100} />
            </div>
            <div className='mc-form-group' style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', display: 'flex'}}>
              <label>Status</label>
              <div style={{width: 40, height: 24, background: 'var(--mc-teal)', borderRadius: 99, position: 'relative'}}>
                <div style={{width: 20, height: 20, background: '#fff', borderRadius: '50%', position: 'absolute', right: 2, top: 2}}/>
              </div>
            </div>
            
            <div className='mc-form-group'>
              <label>Amenities</label>
              <div style={{display: 'flex', gap: 16, marginTop: 8}}>
                <label style={{display: 'flex', alignItems: 'center', gap: 8, fontWeight: 400}}><input type="checkbox" defaultChecked /> Parking</label>
                <label style={{display: 'flex', alignItems: 'center', gap: 8, fontWeight: 400}}><input type="checkbox" defaultChecked /> Guide Available</label>
                <label style={{display: 'flex', alignItems: 'center', gap: 8, fontWeight: 400}}><input type="checkbox" /> Wheelchair Access</label>
              </div>
            </div>
            
            <div className='mc-form-group'>
              <label>Tags</label>
              <div className='mc-tags'>
                <span className='mc-tag'>Heritage <button><X size={12}/></button></span>
                <span className='mc-tag'>Culture <button><X size={12}/></button></span>
                <span className='mc-tag'>UNESCO <button><X size={12}/></button></span>
                <span className='mc-tag'>Popular <button><X size={12}/></button></span>
                <button className='mc-tag-add'><Plus size={12}/> Add Tag</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className='mc-drawer-footer'>
          <button className='mc-secondary' onClick={onClose}>Cancel</button>
          <button className='mc-primary' onClick={onClose}>Save Place</button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------
// 4. EXPERIENCES MANAGEMENT
// ---------------------------------------------
function ExperiencesPage({ state, act }: { state: State; act: (a: string, p?: Record<string, unknown>) => Promise<boolean> }) {
  const [q, setQ] = useState('');
  return (
    <>
      <div className='mc-toolbar'>
        <div className='mc-toolbar-left'>
          <div className='mc-search'>
            <Search size={18} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder='Search experiences...' />
          </div>
          <div className='mc-filter-select'>
            <select><option>All Places</option></select>
          </div>
          <div className='mc-filter-select'>
            <select><option>All Status</option></select>
          </div>
        </div>
        <div className='mc-toolbar-right'>
          <button className='mc-primary'><Plus size={18}/> Add Experience</button>
        </div>
      </div>
      
      <div className='mc-table-card'>
        <table>
          <thead>
            <tr>
              <th>Experience</th>
              <th>Place</th>
              <th>Operator</th>
              <th>Price (NPR)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.experiences.map(x => (
              <tr key={x.id}>
                <td><strong>{x.title}</strong></td>
                <td>Patan Durbar Square</td>
                <td>{state.operators.find(o => o.id === x.operatorId)?.business || 'Patan Heritage'}</td>
                <td>{money(x.price)}</td>
                <td><Badge tone={x.status === 'Published' ? 'active' : x.status === 'Paused' ? 'inactive' : 'pending'}>{x.status}</Badge></td>
                <td>
                  <div className='mc-row-actions'>
                    <button><Edit3 size={16}/></button>
                    <button style={{color: '#DC2626'}}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ---------------------------------------------
// 5. BOOKINGS MANAGEMENT
// ---------------------------------------------
function BookingsPage({ state, act, admin = false }: { state: State; act: (a: string, p?: Record<string, unknown>) => Promise<boolean>; admin?: boolean }) {
  const [q, setQ] = useState('');
  return (
    <>
      <div className='mc-toolbar'>
        <div className='mc-toolbar-left'>
          <div className='mc-search'>
            <Search size={18} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder='Search bookings...' />
          </div>
          <div className='mc-filter-select'>
            <select><option>All Status</option></select>
          </div>
          <div className='mc-filter-select'>
            <CalendarDays size={16} style={{position: 'absolute', left: 12, top: 12, color: '#6B7280'}}/>
            <select style={{paddingLeft: 36}}><option>21 May - 27 May 2025</option></select>
          </div>
        </div>
        <div className='mc-toolbar-right'>
          <button className='mc-secondary'><Download size={18}/> Export</button>
        </div>
      </div>

      <div className='mc-table-card'>
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Experience</th>
              <th>Traveler</th>
              <th>Date</th>
              <th>Guests</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.bookings.map(b => (
              <tr key={b.id}>
                <td style={{color: '#6B7280', fontWeight: 500}}>{b.id}</td>
                <td>{b.experienceTitle || 'Heritage Walk'}</td>
                <td>{b.guest}</td>
                <td>{b.date}</td>
                <td>{b.guests}</td>
                <td>{money(b.amount)}</td>
                <td><Badge tone={b.status.toLowerCase().replace(' ', '-')}>{b.status}</Badge></td>
                <td>
                  <div className='mc-row-actions'>
                    <button><Eye size={16}/></button>
                    <button><MessageSquare size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ---------------------------------------------
// 6. OPERATORS MANAGEMENT
// ---------------------------------------------
function OperatorsPage({ state, act, nav }: { state: State; act: (a: string, p?: Record<string, unknown>) => Promise<boolean>; nav: (v: AdminView) => void }) {
  const [q, setQ] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newOp, setNewOp] = useState({ business: '', email: '' });

  const handleAdd = async () => {
    if (!newOp.business || !newOp.email) return;
    await act('add_operator', newOp);
    setShowAdd(false);
    setNewOp({ business: '', email: '' });
  };

  return (
    <>
      <div className='mc-toolbar'>
        <div className='mc-toolbar-left'>
          <div className='mc-search'>
            <Search size={18} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder='Search operators...' />
          </div>
          <div className='mc-filter-select'>
            <select><option>All Status</option></select>
          </div>
        </div>
        <div className='mc-toolbar-right'>
          <button className='mc-secondary' onClick={() => nav('operator-applications')}>Applications (3)</button>
          <button className='mc-primary' onClick={() => setShowAdd(true)}><Plus size={18}/> Add Operator</button>
        </div>
      </div>

      {showAdd && (
        <div className="mc-modal-overlay">
          <div className="mc-modal">
            <div className="mc-modal-header">
              <h3>Add New Operator</h3>
              <button className="mc-btn-icon" onClick={() => setShowAdd(false)}><X size={18} /></button>
            </div>
            <div className="mc-modal-body">
              <div className="mc-form-group">
                <label>Business Name</label>
                <input value={newOp.business} onChange={e => setNewOp({...newOp, business: e.target.value})} placeholder="e.g. Himalayan Treks" />
              </div>
              <div className="mc-form-group">
                <label>Email Address</label>
                <input type="email" value={newOp.email} onChange={e => setNewOp({...newOp, email: e.target.value})} placeholder="e.g. contact@himalayantreks.com" />
              </div>
            </div>
            <div className="mc-modal-footer">
              <button className="mc-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="mc-primary" onClick={handleAdd}>Save Operator</button>
            </div>
          </div>
        </div>
      )}

      <div className='mc-table-card'>
        <table>
          <thead>
            <tr>
              <th>Operator</th>
              <th>Email</th>
              <th>Experiences</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.operators.map(o => (
              <tr key={o.id}>
                <td><strong>{o.business}</strong></td>
                <td>{o.email}</td>
                <td>{o.experiences}</td>
                <td><Badge tone={o.status === 'Verified' ? 'active' : o.status === 'Pending' ? 'pending' : 'inactive'}>{o.status === 'Verified' ? 'Approved' : o.status}</Badge></td>
                <td>
                  <div className='mc-row-actions'>
                    <button><Eye size={16}/></button>
                    <button><Edit3 size={16}/></button>
                    <button style={{color: '#DC2626'}}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ---------------------------------------------
// 7. CROWD MANAGEMENT
// ---------------------------------------------
function CrowdPage({ state, act }: { state: State; act: (a: string, p?: Record<string, unknown>) => Promise<boolean> }) {
  const gaugeData = [{name: 'Used', value: 85, color: '#F59E0B'}, {name: 'Free', value: 15, color: '#F3F4F6'}];
  
  const lineData = [
    { time: '9am', Visitors: 1200 },
    { time: '11am', Visitors: 3000 },
    { time: '1pm', Visitors: 2500 },
    { time: '3pm', Visitors: 4000 },
    { time: '5pm', Visitors: 3200 },
  ];

  return (
    <div className='mc-dashboard-grid' style={{gridTemplateColumns: '1fr 2fr'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
        <section className='mc-card' style={{padding: 0}}>
          <div className='mc-card__head' style={{padding: '24px 24px 0'}}>
            <h2 style={{fontSize: 16}}>Places</h2>
          </div>
          <div className='mc-table-card' style={{border: 'none', boxShadow: 'none'}}>
            <table>
              <tbody>
                <tr>
                  <td><strong>Patan Durbar Square</strong></td>
                  <td style={{textAlign: 'right'}}><Badge tone="high">High Crowd</Badge></td>
                </tr>
                <tr>
                  <td><strong>Boudhanath Stupa</strong></td>
                  <td style={{textAlign: 'right'}}><Badge tone="moderate">Moderate</Badge></td>
                </tr>
                <tr>
                  <td><strong>Pashupatinath Temple</strong></td>
                  <td style={{textAlign: 'right'}}><Badge tone="moderate">Moderate</Badge></td>
                </tr>
                <tr>
                  <td><strong>Bhaktapur Durbar Square</strong></td>
                  <td style={{textAlign: 'right'}}><Badge tone="low">Low</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      
      <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
        <section className='mc-card'>
          <div className='mc-card__head'>
            <h2>Patan Durbar Square <Badge tone="high">High Crowd</Badge></h2>
          </div>
          <div className='mc-dashboard-grid' style={{gridTemplateColumns: '1fr 1.5fr', marginBottom: 0}}>
            <div>
              <p style={{fontSize: 14, color: '#6B7280', margin: '0 0 16px'}}>Real-time Status</p>
              <div style={{height: 160, position: 'relative'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={gaugeData} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={80} outerRadius={110} paddingAngle={0} dataKey="value" stroke="none">
                      {gaugeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center'}}>
                  <strong style={{fontSize: 32, display: 'block'}}>85%</strong>
                  <span style={{fontSize: 12, color: '#6B7280'}}>Capacity Used</span>
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px solid #E5E7EB'}}>
                <span style={{fontSize: 14, color: '#6B7280'}}>Visitors</span>
                <strong style={{fontSize: 14}}>4,250 / 5,000</strong>
              </div>
            </div>
            
            <div style={{height: 250}}>
               <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="Visitors" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, fill: '#fff', stroke: '#3B82F6', strokeWidth: 2}} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: 24}}>
             <button className='mc-primary' style={{width: 200}}>View Details</button>
          </div>
        </section>
      </div>
    </div>
  );
}

// ---------------------------------------------
// 8. ANALYTICS & REPORTS
// ---------------------------------------------
function AnalyticsPage({ state }: { state: State }) {
  const lineData = [
    { name: 'Jan', Visitors: 4000 },
    { name: 'Feb', Visitors: 3000 },
    { name: 'Mar', Visitors: 5000 },
    { name: 'Apr', Visitors: 2780 },
    { name: 'May', Visitors: 6000 },
  ];

  const barData = [
    { name: 'Patan Durbar', count: 5000 },
    { name: 'Boudhanath', count: 4200 },
    { name: 'Pashupatinath', count: 3800 },
    { name: 'Bhaktapur', count: 2500 },
    { name: 'Swayambhunath', count: 2100 },
  ];

  return (
    <>
      <div className='mc-toolbar'>
        <div className='mc-toolbar-left'></div>
        <div className='mc-toolbar-right'>
           <div className='mc-filter-select'>
            <select><option>This Month</option></select>
          </div>
          <button className='mc-secondary'><Download size={18}/> Export Report</button>
        </div>
      </div>

      <div className='mc-stats'>
        <div className='mc-stat-card'>
          <div className='mc-stat-content'>
            <span className='mc-stat-label'>Total Visitors</span>
            <span className='mc-stat-value'>24,580</span>
            <div className='mc-stat-trend up'>+15.4%</div>
          </div>
        </div>
        <div className='mc-stat-card'>
          <div className='mc-stat-content'>
            <span className='mc-stat-label'>Total Revenue</span>
            <span className='mc-stat-value'>NPR 45,80,230</span>
            <div className='mc-stat-trend up'>+20.1%</div>
          </div>
        </div>
        <div className='mc-stat-card'>
          <div className='mc-stat-content'>
            <span className='mc-stat-label'>Total Bookings</span>
            <span className='mc-stat-value'>2,458</span>
            <div className='mc-stat-trend up'>+18.7%</div>
          </div>
        </div>
        <div className='mc-stat-card'>
          <div className='mc-stat-content'>
            <span className='mc-stat-label'>Conversion Rate</span>
            <span className='mc-stat-value'>6.42%</span>
            <div className='mc-stat-trend up'>+2.3%</div>
          </div>
        </div>
      </div>

      <div className='mc-dashboard-grid'>
        <section className='mc-card'>
          <div className='mc-card__head'>
            <h2>Visitors Overview</h2>
          </div>
          <div style={{height: 300}}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="Visitors" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, fill: '#fff', stroke: '#3B82F6', strokeWidth: 2}} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </section>


        <section className='mc-card'>
          <div className='mc-card__head'>
            <h2>Top Places by Visitors</h2>
          </div>
          <div style={{height: 300}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB"/>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#111827', fontSize: 12, fontWeight: 500}} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#0EA5E9" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </>
  );
}

// ---------------------------------------------
// 9. REVIEWS MANAGEMENT
// ---------------------------------------------
function ReviewsPage({ state, act }: { state: State; act: (a: string, p?: Record<string, unknown>) => Promise<boolean> }) {
  const [q, setQ] = useState('');
  return (
    <>
      <div className='mc-toolbar'>
        <div className='mc-toolbar-left'>
          <div className='mc-search'>
            <Search size={18} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder='Search reviews...' />
          </div>
          <div className='mc-filter-select'>
            <select><option>All Ratings</option><option>5 Stars</option></select>
          </div>
        </div>
      </div>
      
      <div className='mc-review-list'>
        {state.reviews.map(r => (
          <div className='mc-review-card' key={r.id}>
            <div className='mc-review-user'>
              <strong>{r.guest}</strong>
              <small>{r.experience}</small>
            </div>
            <div className='mc-review-content'>
              <div className='mc-review-rating'>
                {Array.from({length: 5}).map((_, i) => <Star key={i} size={16} fill={i < r.rating ? '#F59E0B' : 'transparent'} stroke={i < r.rating ? '#F59E0B' : '#D1D5DB'} />)}
              </div>
              <p>{r.text}</p>
              <div className='mc-review-meta'>
                <span>{r.date}</span>
                <div style={{display: 'flex', gap: 12}}>
                  <button style={{background: 'transparent', border: 0, color: 'var(--mc-teal)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4}}><Send size={14}/> Reply</button>
                  <button style={{background: 'transparent', border: 0, color: 'var(--mc-muted)', cursor: 'pointer'}}><Trash2 size={16}/></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------
// 10. USERS MANAGEMENT
// ---------------------------------------------
function UsersPage({ state, act }: { state: State; act: (a: string, p?: Record<string, unknown>) => Promise<boolean> }) {
  const [q, setQ] = useState('');
  return (
    <>
      <div className='mc-toolbar'>
        <div className='mc-toolbar-left'>
          <div className='mc-search'>
            <Search size={18} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder='Search users...' />
          </div>
          <div className='mc-filter-select'>
            <select><option>All Roles</option></select>
          </div>
        </div>
        <div className='mc-toolbar-right'>
           <button className='mc-primary'><Plus size={18}/> Add User</button>
        </div>
      </div>
      
      <div className='mc-table-card'>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.users.map((u, i) => (
              <tr key={i}>
                <td>
                  <div className='mc-cell-operator'>
                    <div className='mc-avatar small' style={{background: '#F3F4F6', color: '#4B5563'}}>{u.name[0]}</div>
                    <strong>{u.name}</strong>
                  </div>
                </td>
                <td>{u.email}</td>
                <td style={{textTransform: 'capitalize'}}>{u.role}</td>
                <td><Badge tone={u.status === 'Active' ? 'active' : 'inactive'}>{u.status}</Badge></td>
                <td>{u.joined}</td>
                <td>
                  <div className='mc-row-actions'>
                    <button><Edit3 size={16}/></button>
                    <button style={{color: '#DC2626'}}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ---------------------------------------------
// 11. NOTIFICATIONS
// ---------------------------------------------
function NotificationsPage() {
  const notifs = [
    { id: 1, title: 'High crowd alert at Patan Durbar Square', time: '2 mins ago', icon: <Activity size={16}/>, color: '#EF4444', unread: true },
    { id: 2, title: 'New booking received for Patan Heritage Walk', time: '10 mins ago', icon: <TicketCheck size={16}/>, color: '#10B981', unread: true },
    { id: 3, title: 'Operator "Spiritual Nepal" registration pending', time: '1 hour ago', icon: <UserRoundCheck size={16}/>, color: '#F59E0B', unread: false },
    { id: 4, title: 'Monthly report is ready to download', time: '3 hours ago', icon: <FileText size={16}/>, color: '#3B82F6', unread: false },
  ];
  return (
    <>
      <div className='mc-toolbar'>
        <div className='mc-tabs'>
          <button className='active'>All</button>
          <button>Unread</button>
          <button>Important</button>
        </div>
        <button className='mc-secondary' style={{height: 32, fontSize: 12}}>Mark all as read</button>
      </div>
      
      <div className='mc-notification-list'>
        {notifs.map(n => (
          <div key={n.id} className={`mc-notification-item ${n.unread ? 'unread' : ''}`}>
             <div className='mc-notification-icon' style={{background: `${n.color}20`, color: n.color}}>
               {n.icon}
             </div>
             <div className='mc-notification-content'>
               <p>{n.title}</p>
             </div>
             <small style={{color: '#9CA3AF'}}>{n.time}</small>
          </div>
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------
// 12. SETTINGS
// ---------------------------------------------
function SettingsPage() {
  return (
    <div className='mc-dashboard-grid' style={{gridTemplateColumns: '240px 1fr'}}>
      <div className='mc-sidebar' style={{height: 'auto', position: 'static', padding: 0, background: 'transparent'}}>
        <nav style={{gap: 8}}>
          <button className='active' style={{background: '#F3F4F6', color: '#111827'}}><Settings size={18}/> General</button>
          <button style={{color: '#4B5563'}}><CircleDollarSign size={18}/> Payment</button>
          <button style={{color: '#4B5563'}}><MessageSquare size={18}/> Email Templates</button>
          <button style={{color: '#4B5563'}}><TicketCheck size={18}/> Booking Rules</button>
          <button style={{color: '#4B5563'}}><Activity size={18}/> Crowd Settings</button>
          <button style={{color: '#4B5563'}}><ShieldCheck size={18}/> System Settings</button>
        </nav>
      </div>
      
      <section className='mc-card'>
        <div className='mc-card__head'>
          <h2>General Settings</h2>
        </div>
        <div className='mc-form-section'>
          <div className='mc-form-grid'>
            <div className='mc-form-group'>
              <label>Platform Name</label>
              <input defaultValue="YatraLink" />
            </div>
            <div className='mc-form-group'>
              <label>Platform Email</label>
              <input defaultValue="info@yatralink.com" />
            </div>
          </div>
          <div className='mc-form-group'>
            <label>Contact Number</label>
            <input defaultValue="+977 9800000000" />
          </div>
          <div className='mc-form-grid'>
            <div className='mc-form-group'>
              <label>Currency</label>
              <select><option>NPR (Nepali Rupee)</option></select>
            </div>
            <div className='mc-form-group'>
              <label>Timezone</label>
              <select><option>Asia/Kathmandu</option></select>
            </div>
          </div>
          <div className='mc-form-grid'>
            <div className='mc-form-group'>
              <label>Date Format</label>
              <select><option>DD MMM YYYY</option></select>
            </div>
            <div className='mc-form-group'>
              <label>Time Format</label>
              <select><option>12 Hour (AM/PM)</option></select>
            </div>
          </div>
          <div className='mc-form-group'>
            <label>Language</label>
            <select><option>English</option></select>
          </div>
          <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 24}}>
             <button className='mc-primary'>Save Changes</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------
// 13. REPORTS
// ---------------------------------------------
function ReportsPage() {
  const reports = [
    { title: 'Booking Report', desc: 'Detailed booking and revenue report.', icon: <TicketCheck size={24}/>, color: '#3B82F6', bg: '#EFF6FF' },
    { title: 'Visitors Report', desc: 'Visitor analytics and insights.', icon: <Users size={24}/>, color: '#10B981', bg: '#F0FDF4' },
    { title: 'Operator Report', desc: 'Operator performance report.', icon: <Store size={24}/>, color: '#F59E0B', bg: '#FFFBEB' },
    { title: 'Revenue Report', desc: 'Financial and revenue report.', icon: <CircleDollarSign size={24}/>, color: '#8B5CF6', bg: '#F5F3FF' },
  ];
  return (
    <div className='mc-reports-grid'>
      {reports.map((r, i) => (
        <div key={i} className='mc-report-card'>
          <div className='mc-report-header'>
            <div className='mc-report-icon' style={{background: r.bg, color: r.color}}>{r.icon}</div>
            <h3>{r.title}</h3>
          </div>
          <p>{r.desc}</p>
          <button className='mc-secondary'><Download size={16}/> Download</button>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------
// 14. OPERATOR APPLICATIONS
// ---------------------------------------------
function OperatorApplicationsPage({ state }: { state: State }) {
  const apps = [
    { name: 'Mountain Explorers', email: 'mountain@example.com', date: '21 May 2025' },
    { name: 'Nepal City Tours', email: 'citytours@example.com', date: '20 May 2025' },
    { name: 'Local Experiences Nepal', email: 'localexp@example.com', date: '19 May 2025' },
    { name: 'Cultural Heritage Walks', email: 'cultural@example.com', date: '18 May 2025' },
  ];
  return (
    <div className='mc-table-card'>
      <table>
        <thead>
          <tr>
            <th>Operator</th>
            <th>Email</th>
            <th>Applied On</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((a, i) => (
            <tr key={i}>
              <td><strong>{a.name}</strong></td>
              <td>{a.email}</td>
              <td>{a.date}</td>
              <td><Badge tone="pending">Pending</Badge></td>
              <td>
                <button className='mc-primary' style={{height: 32, fontSize: 12}}>Review</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// Operator routing and pages
function OperatorRouter({ view, state, operator, act, nav }: { view: OperatorView; state: State; operator: Operator; act: (a: string, p?: Record<string, unknown>) => Promise<boolean>; nav: (v: OperatorView) => void }) {
  if (view === 'experiences') return <OperatorExperiencesPage state={state} act={act} />;
  if (view === 'calendar') return <OperatorCalendarPage state={state} act={act} />;
  if (view === 'bookings') return <BookingsPage state={state} act={act} />;
  
  if (view === 'customers') return <div className="mc-card"><h2>Customers</h2><p>Customer management placeholder.</p></div>;
  if (view === 'reviews') return <div className="mc-card"><h2>Reviews</h2><p>Operator reviews placeholder.</p></div>;
  if (view === 'payouts') return <div className="mc-card"><h2>Payouts</h2><p>Operator payouts placeholder.</p></div>;
  if (view === 'analytics') return <div className="mc-card"><h2>Analytics</h2><p>Operator analytics placeholder.</p></div>;
  if (view === 'settings') return <div className="mc-card"><h2>Settings</h2><p>Operator settings placeholder.</p></div>;

  return <div className="mc-card"><h2>Overview</h2><p>Operator overview placeholder.</p></div>;
}

function OperatorExperiencesPage({ state, act }: { state: State; act: (a: string, p?: Record<string, unknown>) => Promise<boolean> }) {
  const exps = state.experiences;
  
  return (
    <div className='mc-table-card'>
      <div className='mc-toolbar'>
        <div className='mc-search'>
          <Search size={18}/>
          <input type='text' placeholder='Search experiences...'/>
        </div>
        <select><option>All Categories</option></select>
        <select><option>All Statuses</option></select>
        <button className='mc-button mc-secondary'><Filter size={16}/> Filter</button>
        <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8}}>
          <span style={{fontSize: 13, color: 'var(--mc-gray)'}}>Sort by:</span>
          <select><option>Newest First</option></select>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Experience</th>
            <th>Location</th>
            <th>Category</th>
            <th>Duration</th>
            <th>Price (NPR)</th>
            <th>Status</th>
            <th>Bookings</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exps.map(e => (
            <tr key={e.id}>
              <td>
                <div style={{display: 'flex', gap: 12, alignItems: 'center', width: 300}}>
                  <div style={{width: 64, height: 44, background: '#eee', borderRadius: 4, overflow: 'hidden', flexShrink: 0}}>
                    <img src={`https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=100&q=80`} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt=""/>
                  </div>
                  <div style={{minWidth: 0}}>
                    <div style={{fontWeight: 600, color: 'var(--mc-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{e.title}</div>
                    <div style={{fontSize: 12, color: 'var(--mc-gray)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>Experience local culture and traditions.</div>
                  </div>
                </div>
              </td>
              <td><div style={{display:'flex', alignItems:'center', gap:4, color: 'var(--mc-gray)', whiteSpace: 'nowrap'}}><MapPin size={14}/> Kathmandu</div></td>
              <td><div style={{display:'flex', alignItems:'center', gap:4, color: 'var(--mc-gray)', whiteSpace: 'nowrap'}}><BookOpen size={14}/> {e.category}</div></td>
              <td><div style={{display:'flex', alignItems:'center', gap:4, color: 'var(--mc-gray)', whiteSpace: 'nowrap'}}><Clock size={14}/> 3 Hours</div></td>
              <td style={{whiteSpace: 'nowrap'}}>NPR {e.price.toLocaleString()}</td>
              <td><Badge tone={e.status==='active'?'success':'neutral'}>{e.status}</Badge></td>
              <td>{e.bookings}</td>
              <td>
                <div style={{display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600}}>
                  <Star size={14} fill="#F59E0B" color="#F59E0B"/> {e.rating}
                </div>
                <div style={{fontSize: 12, color: 'var(--mc-gray)'}}>(124)</div>
              </td>
              <td>
                <div style={{display: 'flex', gap: 4}}>
                  <button className='mc-icon-btn' title="Edit"><Edit3 size={16}/></button>
                  <button className='mc-icon-btn' title="Pause"><Pause size={16}/></button>
                  <button className='mc-icon-btn' title="Duplicate"><Copy size={16}/></button>
                  <button className='mc-icon-btn' title="View"><Eye size={16}/></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className='mc-pagination' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderTop: '1px solid var(--mc-border)'}}>
        <div style={{fontSize: 13, color: 'var(--mc-gray)'}}>Showing 1 to {exps.length} of {exps.length} experiences</div>
        <div style={{display: 'flex', gap: 4}}>
          <button className='mc-button mc-secondary' style={{width: 32, height: 32, padding: 0, minWidth: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>&lt;</button>
          <button className='mc-button mc-primary' style={{width: 32, height: 32, padding: 0, minWidth: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>1</button>
          <button className='mc-button mc-secondary' style={{width: 32, height: 32, padding: 0, minWidth: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>&gt;</button>
        </div>
      </div>
    </div>
  );
}

function OperatorCalendarPage({ state, act }: { state: State; act: (a: string, p?: Record<string, unknown>) => Promise<boolean> }) {
  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24}}>
      <div className='mc-card' style={{padding: 0, overflow: 'hidden'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--mc-border)'}}>
           <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
             <button className='mc-button mc-secondary'>Today</button>
             <div style={{display: 'flex', gap: 4}}>
               <button className='mc-icon-btn'>&lt;</button>
               <button className='mc-icon-btn'>&gt;</button>
             </div>
             <h2 style={{margin: 0, fontSize: 18}}>May 2025</h2>
           </div>
           <div style={{display: 'flex', gap: 12}}>
             <select><option>All Experiences</option></select>
             <select><option>All Guides</option></select>
             <select><option>All Status</option></select>
           </div>
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--mc-border)'}}>
           {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
             <div key={d} style={{padding: '12px 16px', fontWeight: 600, fontSize: 14, textAlign: 'center', borderRight: '1px solid var(--mc-border)'}}>{d}</div>
           ))}
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 120}}>
           {Array.from({length: 31}).map((_, i) => {
             const day = i + 1;
             return (
               <div key={i} style={{borderRight: '1px solid var(--mc-border)', borderBottom: '1px solid var(--mc-border)', padding: 8, background: day === 14 ? 'rgba(59, 130, 246, 0.05)' : 'transparent'}}>
                  <div style={{
                    fontSize: 14, 
                    fontWeight: day === 14 ? 600 : 400,
                    color: day === 14 ? '#fff' : 'var(--mc-gray)', 
                    background: day === 14 ? 'var(--mc-dark)' : 'transparent',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                  }}>{day}</div>
                  
                  {day % 4 === 0 && (
                    <div style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                      Patan Durbar Square
                    </div>
                  )}
                  {day % 5 === 0 && (
                    <div style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                      Golden Temple Visit
                    </div>
                  )}
                  {day % 7 === 0 && (
                    <div style={{background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                      Woodcarving Walk
                    </div>
                  )}
               </div>
             )
           })}
        </div>
      </div>
      
      <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
        <div style={{display: 'flex', gap: 12}}>
          <button className='mc-button mc-primary' style={{flex: 1, padding: 0, minWidth: 0}}><CalendarDays size={18} style={{margin:'0 auto'}}/></button>
          <button className='mc-button mc-secondary' style={{flex: 1, padding: 0, minWidth: 0}}><LayoutDashboard size={18} style={{margin:'0 auto'}}/></button>
          <button className='mc-button mc-primary' style={{flex: 3}}><Plus size={16}/> Add Booking</button>
        </div>
        
        <div className='mc-card'>
           <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
             <h3 style={{margin: 0, fontSize: 16}}>Upcoming Events</h3>
             <a href="#" style={{fontSize: 13, color: 'var(--mc-teal)', textDecoration: 'none'}}>View all</a>
           </div>
           <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
             {[
               {c: '#10B981', t: 'Golden Temple Visit', d: 'May 15, 2025 • 9:00 AM', b: 7},
               {c: '#3B82F6', t: 'Mangal Bazaar Tour', d: 'May 15, 2025 • 1:00 PM', b: 5},
               {c: '#F59E0B', t: 'Woodcarving Walk', d: 'May 16, 2025 • 10:00 AM', b: 4},
               {c: '#EF4444', t: 'Patan Durbar Square', d: 'May 18, 2025 • 9:30 AM', b: 9}
             ].map((e, i) => (
               <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                 <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                   <div style={{width: 8, height: 8, borderRadius: '50%', background: e.c}}/>
                   <div>
                     <div style={{fontSize: 13, fontWeight: 500, color: 'var(--mc-dark)', marginBottom: 2}}>{e.t}</div>
                     <div style={{fontSize: 12, color: 'var(--mc-gray)'}}>{e.d}</div>
                   </div>
                 </div>
                 <div style={{fontSize: 12, fontWeight: 500, color: 'var(--mc-gray)'}}>{e.b} bookings</div>
               </div>
             ))}
           </div>
        </div>
        
        <div className='mc-card'>
           <h3 style={{margin: '0 0 4px', fontSize: 16}}>Today's Schedule</h3>
           <div style={{fontSize: 13, color: 'var(--mc-gray)', marginBottom: 20}}>Wednesday, May 14, 2025</div>
           
           <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
             {[
               {t: '9:00 AM', c: '#10B981', name: 'Golden Temple Visit', g: 'Rajan Shrestha', b: '6 / 10'},
               {t: '11:30 AM', c: '#F59E0B', name: 'Woodcarving Walk', g: 'Sita Maharjan', b: '4 / 8'},
               {t: '1:00 PM', c: '#3B82F6', name: 'Mangal Bazaar Tour', g: 'Anil Lama', b: '8 / 12'},
               {t: '3:30 PM', c: '#8B5CF6', name: 'Kumbheshwar Tour', g: 'Nabin Joshi', b: '5 / 8'}
             ].map((e, i) => (
               <div key={i} style={{display: 'flex', gap: 16, border: '1px solid var(--mc-border)', borderRadius: 6, padding: '16px 12px', borderLeft: `4px solid ${e.c}`}}>
                 <div style={{fontSize: 12, fontWeight: 600, width: 55, color: e.c}}>{e.t}</div>
                 <div style={{flex: 1}}>
                   <div style={{fontSize: 14, fontWeight: 500, marginBottom: 4, color: 'var(--mc-dark)'}}>{e.name}</div>
                   <div style={{fontSize: 12, color: 'var(--mc-gray)'}}>Guide: {e.g}</div>
                 </div>
                 <div style={{textAlign: 'right'}}>
                   <div style={{fontSize: 14, fontWeight: 600, color: 'var(--mc-dark)', marginBottom: 2}}>{e.b}</div>
                   <div style={{fontSize: 11, color: 'var(--mc-gray)'}}>bookings</div>
                 </div>
               </div>
             ))}
           </div>
        </div>
        
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 12}}>
            <h3 style={{margin: 0, fontSize: 16}}>Quick Stats</h3>
            <span style={{fontSize: 12, color: 'var(--mc-gray)'}}>Today</span>
          </div>
          <div style={{display: 'flex', gap: 12}}>
            <div className='mc-card' style={{flex: 1, padding: '16px 12px', textAlign: 'center'}}>
              <div style={{fontSize: 24, fontWeight: 600, color: 'var(--mc-dark)', marginBottom: 4}}>23</div>
              <div style={{fontSize: 11, color: 'var(--mc-gray)'}}>Total Bookings</div>
            </div>
            <div className='mc-card' style={{flex: 1, padding: '16px 12px', textAlign: 'center'}}>
              <div style={{fontSize: 24, fontWeight: 600, color: 'var(--mc-dark)', marginBottom: 4}}>4</div>
              <div style={{fontSize: 11, color: 'var(--mc-gray)'}}>Experiences</div>
            </div>
            <div className='mc-card' style={{flex: 1, padding: '16px 12px', textAlign: 'center'}}>
              <div style={{fontSize: 24, fontWeight: 600, color: 'var(--mc-dark)', marginBottom: 4}}>3</div>
              <div style={{fontSize: 11, color: 'var(--mc-gray)'}}>Guides Working</div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
