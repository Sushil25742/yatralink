import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { api, ws } from './lib/platform';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import {
  Activity, ArrowDownToLine, BarChart3, Bell, BookOpen, CalendarDays, Check,
  ChevronRight, CircleDollarSign, Clock, Edit3, Eye, Home, LayoutDashboard,
  MapPin, MessageSquare, MoreHorizontal, Plus, RefreshCw, Search, Settings,
  ShieldCheck, Star, Store, TicketCheck, Trash2, TrendingUp, UserRoundCheck,
  Users, X, Download, AlertCircle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import 'leaflet/dist/leaflet.css';
import './management.css';

type Role = 'operator' | 'superadmin';
type User = { name: string; email: string; role: Role };

type Place = { id: string; name: string; category: string; zone: string; status: string; crowd: string; capacity: number; visits: number; lat: number; lng: number };
type Experience = { id: string; title: string; operatorId: string; category: string; price: number; capacity: number; status: string; bookings: number; rating: number };
type Booking = { id: string; guest: string; experienceId: string; experienceTitle?: string; operatorId: string; date: string; time: string; guests: number; amount: number; status: string };
type Operator = { id: string; name: string; business: string; email: string; status: string; experiences: number; rating: number; revenue: number };
type CrowdSite = { id: string; name: string; level: string; score: number; wait: string; lat: number; lng: number; source?: string };
type Slot = { id: string; experienceId: string; operatorId: string; day: string; time: string; available: boolean; capacity: number; booked: number };
type Review = { id: string; guest: string; rating: number; text: string; reply: string };

type State = {
  places: Place[];
  experiences: Experience[];
  bookings: Booking[];
  operators: Operator[];
  crowdSites: CrowdSite[];
  slots: Slot[];
  reviews: Review[];
  updated_at: number;
};

type AdminView = 'overview' | 'places' | 'experiences' | 'bookings' | 'operators' | 'crowd' | 'analytics';
type OperatorView = 'overview' | 'experiences' | 'bookings' | 'calendar' | 'earnings' | 'reviews';

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

function download(name: string, rows: string[][]) {
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const u = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = u;
  a.download = name;
  a.click();
  URL.revokeObjectURL(u);
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

  const load = () => api.get('/api/management/state', { session_id: sessionId })
    .then(({ data }) => setState(data.state))
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
        if (['overview', 'places', 'experiences', 'bookings', 'operators', 'crowd', 'analytics'].includes(v)) setAdminView(v);
      } else if (!isAdmin && h.startsWith('#/operator/')) {
        const v = h.split('/')[2] as OperatorView;
        if (['overview', 'experiences', 'bookings', 'calendar', 'earnings', 'reviews'].includes(v)) setOperatorView(v);
      }
    };
    sync();
    addEventListener('hashchange', sync);
    return () => removeEventListener('hashchange', sync);
  }, [isAdmin]);

  const act = async (action: string, payload: Record<string, unknown> = {}) => {
    setError('');
    try {
      const { data } = await api.post('/api/management/action', { session_id: sessionId, action, payload });
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
            <button className='mc-icon' onClick={() => setNotice(!notice)}><Bell size={20}/></button>
            <button className='mc-icon' onClick={onSettings}><Settings size={20}/></button>
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

        {notice && (
          <div className='mc-demo-banner' style={{marginTop: '16px', marginInline: '40px'}}>
            <ShieldCheck className='text-blue-600'/>
            <div style={{flex: 1}}>
              <strong>Showcase alerts</strong>
              <p style={{margin: '4px 0 0', fontSize: '12px'}}>Crowd state and booking exceptions update from shared prototype data.</p>
            </div>
            <button onClick={() => setNotice(false)}><X size={16}/></button>
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
  overview: ['Overview', 'Monitor destination operations, crowd health and local tourism performance.'],
  places: ['Places', 'Manage heritage sites, zones and visitor-facing status.'],
  experiences: ['Experiences', 'Manage cultural experiences, approvals, pricing and availability.'],
  bookings: ['Bookings', 'Track reservations, payments, attendance and customer activity.'],
  operators: ['Operators', 'Manage local partners, operator verification and business performance.'],
  crowd: ['Crowd', 'Monitor crowd levels, visitor pressure and route balancing across heritage zones.'],
  analytics: ['Analytics', 'Prototype analytics are clearly labeled where simulated.']
};

const operatorTitles: Record<OperatorView, [string, string]> = {
  overview: ['Operator overview', 'Today’s bookings, capacity and earnings at a glance.'],
  experiences: ['My experiences', 'Manage what travelers can discover and book.'],
  bookings: ['Bookings', 'Prepare for guests and update attendance.'],
  calendar: ['Calendar & availability', 'Control bookable time slots and capacity.'],
  earnings: ['Earnings', 'Review booking value and statements.'],
  reviews: ['Reviews', 'Read guest feedback and respond.']
};

function SidebarAdmin({ active, nav, logout }: { active: AdminView; nav: (v: AdminView) => void; logout: () => void }) {
  const items: [AdminView, string, ReactNode][] = [
    ['overview', 'Overview', <LayoutDashboard size={20}/>],
    ['places', 'Places', <MapPin size={20}/>],
    ['experiences', 'Experiences', <BookOpen size={20}/>],
    ['bookings', 'Bookings', <TicketCheck size={20}/>],
    ['operators', 'Operators', <Users size={20}/>],
    ['crowd', 'Crowd', <Activity size={20}/>],
    ['analytics', 'Analytics', <BarChart3 size={20}/>]
  ];
  return (
    <aside className='mc-sidebar'>
      <div className='mc-sidebar__head'>
        <Brand />
        <small>Destination Manager</small>
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

function SidebarOperator({ active, nav, logout }: { active: OperatorView; nav: (v: OperatorView) => void; logout: () => void }) {
  const items: [OperatorView, string, ReactNode][] = [
    ['overview', 'Overview', <Home size={20}/>],
    ['experiences', 'My Experiences', <Store size={20}/>],
    ['bookings', 'Bookings', <TicketCheck size={20}/>],
    ['calendar', 'Calendar', <CalendarDays size={20}/>],
    ['earnings', 'Earnings', <CircleDollarSign size={20}/>],
    ['reviews', 'Reviews', <Star size={20}/>]
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
  if (view === 'operators') return <OperatorsPage state={state} act={act} />;
  if (view === 'crowd') return <CrowdPage state={state} act={act} />;
  if (view === 'analytics') return <AnalyticsPage state={state} />;
  return <AdminOverview state={state} nav={nav} />;
}

// ---------------------------------------------
// OVERVIEW PAGE
// ---------------------------------------------
function AdminOverview({ state, nav }: { state: State; nav: (v: AdminView) => void }) {
  const revenue = state.bookings.filter(b => !['Cancelled', 'Refunded'].includes(b.status)).reduce((s, b) => s + b.amount, 0);
  
  // Recharts Data
  const chartData = [
    { name: 'May 16', Visitors: 4000, Bookings: 100 },
    { name: 'May 17', Visitors: 3000, Bookings: 150 },
    { name: 'May 18', Visitors: 2000, Bookings: 140 },
    { name: 'May 19', Visitors: 2780, Bookings: 120 },
    { name: 'May 20', Visitors: 1890, Bookings: 180 },
    { name: 'May 21', Visitors: 2390, Bookings: 250 },
    { name: 'May 22', Visitors: 3490, Bookings: 190 },
  ];

  const pieData = [
    { name: 'Low (0 - 500)', value: 2722, color: '#10B981', pct: '42%' },
    { name: 'Moderate (500 - 1500)', value: 2138, color: '#F59E0B', pct: '33%' },
    { name: 'High (1500 - 2500)', value: 972, color: '#F97316', pct: '15%' },
    { name: 'Very High (2500+)', value: 648, color: '#EF4444', pct: '10%' },
  ];

  return (
    <>
      <div className='mc-stats'>
        <div className='mc-stat-card'>
          <div className='mc-stat-icon green'><MapPin size={24}/></div>
          <div className='mc-stat-content'>
            <span className='mc-stat-label'>Total Places</span>
            <span className='mc-stat-value'>{state.places.length || 32}</span>
            <div className='mc-stat-trend up'><ArrowUpRight size={14}/> 8% <span>vs last month</span></div>
          </div>
        </div>
        <div className='mc-stat-card'>
          <div className='mc-stat-icon blue'><BookOpen size={24}/></div>
          <div className='mc-stat-content'>
            <span className='mc-stat-label'>Active Experiences</span>
            <span className='mc-stat-value'>{state.experiences.length || 48}</span>
            <div className='mc-stat-trend up'><ArrowUpRight size={14}/> 12% <span>vs last month</span></div>
          </div>
        </div>
        <div className='mc-stat-card'>
          <div className='mc-stat-icon purple'><TicketCheck size={24}/></div>
          <div className='mc-stat-content'>
            <span className='mc-stat-label'>Today's Bookings</span>
            <span className='mc-stat-value'>{state.bookings.length || 186}</span>
            <div className='mc-stat-trend up'><ArrowUpRight size={14}/> 15% <span>vs yesterday</span></div>
          </div>
        </div>
        <div className='mc-stat-card'>
          <div className='mc-stat-icon red'><AlertCircle size={24}/></div>
          <div className='mc-stat-content'>
            <span className='mc-stat-label'>Crowd Alerts</span>
            <span className='mc-stat-value'>3</span>
            <div className='mc-stat-trend' style={{color: '#DC2626', cursor: 'pointer', fontWeight: 600}}>
              View all alerts <ChevronRight size={14}/>
            </div>
          </div>
        </div>
      </div>

      <div className='mc-dashboard-grid'>
        <section className='mc-card'>
          <div className='mc-card__head'>
            <h2>Visitor Trend</h2>
            <div className='mc-filter-select'>
              <select defaultValue="last7"><option value="last7">Last 7 days</option></select>
            </div>
          </div>
          <div style={{height: 300}}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={v => v >= 1000 ? `${v/1000}K` : v} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <RechartsTooltip />
                <Area yAxisId="left" type="monotone" dataKey="Visitors" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
                <Area yAxisId="right" type="monotone" dataKey="Bookings" stroke="#3B82F6" strokeWidth={2} fill="none" dot={{r: 4, fill: '#fff', stroke: '#3B82F6', strokeWidth: 2}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className='mc-card'>
          <div className='mc-card__head'>
            <h2>Crowd Distribution</h2>
            <div className='mc-filter-select'>
              <select defaultValue="today"><option value="today">Today</option></select>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', height: 260}}>
            <div style={{flex: 1, height: 220}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{flex: 1}}>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '12px'}}>
                {pieData.map((d, i) => (
                  <li key={i} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#4B5563'}}>
                      <span style={{width: 8, height: 8, borderRadius: '50%', background: d.color}}/>
                      {d.name}
                    </div>
                    <div style={{display: 'flex', gap: '16px'}}>
                      <strong style={{color: '#111827'}}>{d.pct}</strong>
                      <span style={{color: '#9CA3AF'}}>({d.value})</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div style={{marginTop: '24px', fontSize: '11px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px'}}>
                <RefreshCw size={12}/> Updated just now
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className='mc-dashboard-grid'>
        <section className='mc-card' style={{padding: 0}}>
          <div className='mc-card__head' style={{padding: '24px 24px 0'}}>
            <h2>Recent Bookings</h2>
            <button className='mc-secondary' style={{border: 0, color: 'var(--mc-teal)'}} onClick={() => nav('bookings')}>View all bookings <ChevronRight size={16}/></button>
          </div>
          <div className='mc-table-card' style={{border: 'none', boxShadow: 'none'}}>
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Experience</th>
                  <th>Place</th>
                  <th>Date</th>
                  <th>Visitors</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.bookings.slice(0, 5).map(b => (
                  <tr key={b.id}>
                    <td style={{color: '#6B7280', fontWeight: 500}}>{b.id}</td>
                    <td>{b.experienceTitle || 'Heritage Walk'}</td>
                    <td>Patan Durbar Square</td>
                    <td>{b.date}</td>
                    <td>{b.guests}</td>
                    <td><Badge tone={b.status === 'Pending' ? 'pending' : 'confirmed'}>{b.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className='mc-card'>
          <div className='mc-card__head'>
            <h2>Quick Insights</h2>
          </div>
          <div className='mc-insights-list'>
            <div className='mc-insight-card'>
              <div className='mc-insight-icon' style={{background: '#FEE2E2', color: '#DC2626'}}><Users size={20}/></div>
              <div className='mc-insight-content'>
                <strong>Patan Durbar Square is busy</strong>
                <p>Current crowd is high. Consider visitor flow management.</p>
              </div>
              <div className='mc-insight-action' style={{color: '#DC2626'}}>View details <ChevronRight size={14}/></div>
            </div>
            <div className='mc-insight-card'>
              <div className='mc-insight-icon' style={{background: '#FEF3C7', color: '#D97706'}}><UserRoundCheck size={20}/></div>
              <div className='mc-insight-content'>
                <strong>3 operators awaiting review</strong>
                <p>Pending operator applications need your attention.</p>
              </div>
              <div className='mc-insight-action' style={{color: '#D97706'}}>Review now <ChevronRight size={14}/></div>
            </div>
            <div className='mc-insight-card'>
              <div className='mc-insight-icon' style={{background: '#D1FAE5', color: '#059669'}}><BarChart3 size={20}/></div>
              <div className='mc-insight-content'>
                <strong>Bookings up by 15%</strong>
                <p>Today's bookings are higher compared to yesterday.</p>
              </div>
              <div className='mc-insight-action' style={{color: '#059669'}}>View analytics <ChevronRight size={14}/></div>
            </div>
            <div className='mc-insight-card'>
              <div className='mc-insight-icon' style={{background: '#DBEAFE', color: '#2563EB'}}><ShieldCheck size={20}/></div>
              <div className='mc-insight-content'>
                <strong>All systems operational</strong>
                <p>No system issues detected.</p>
              </div>
              <div className='mc-insight-action' style={{color: '#2563EB'}}>View status <ChevronRight size={14}/></div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// ---------------------------------------------
// EXPERIENCES PAGE
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
            <label>Status</label>
            <select><option>All</option><option>Published</option><option>Pending</option></select>
          </div>
          <div className='mc-filter-select'>
            <label>Category</label>
            <select><option>All</option><option>Heritage</option><option>Craft</option></select>
          </div>
          <div className='mc-filter-select'>
            <label>Operator</label>
            <select><option>All</option></select>
          </div>
        </div>
        <div className='mc-toolbar-right'>
          <button className='mc-primary'><Plus size={18}/> Add experience</button>
        </div>
      </div>
      
      <div className='mc-table-card'>
        <table>
          <thead>
            <tr>
              <th>Experience</th>
              <th>Category</th>
              <th>Operator</th>
              <th>Price</th>
              <th>Capacity</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.experiences.map(x => (
              <tr key={x.id}>
                <td>
                  <div className='mc-cell-experience'>
                    <img src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=150&q=80" alt="" />
                    <div>
                      <strong>{x.title}</strong>
                      <small>Guided walking tour through heritage sites.</small>
                    </div>
                  </div>
                </td>
                <td><Badge tone="blue" dot={false}><BookOpen size={12} style={{marginRight: 4}}/> {x.category}</Badge></td>
                <td>
                  <div className='mc-cell-operator'>
                    <div className='mc-avatar small'>OP</div>
                    <span style={{fontSize: 12}}>{state.operators.find(o => o.id === x.operatorId)?.business || 'Patan Heritage'}</span>
                  </div>
                </td>
                <td>{money(x.price)}</td>
                <td>{x.capacity}</td>
                <td>
                  <div className='mc-cell-rating'>
                    <Star size={14} /> 4.8 <span>(126)</span>
                  </div>
                </td>
                <td><Badge tone={x.status === 'Published' ? 'published' : x.status === 'Paused' ? 'paused' : 'pending'}>{x.status}</Badge></td>
                <td>
                  <div className='mc-row-actions'>
                    <button><Edit3 size={16}/></button>
                    <button><Eye size={16}/></button>
                    <button style={{color: '#059669', borderColor: '#059669'}}><Check size={16}/></button>
                    <button style={{color: '#DC2626'}}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='mc-pagination'>
          <span className='mc-pagination-info'>Showing 1 to {state.experiences.length} of {state.experiences.length} experiences</span>
          <div className='mc-pagination-controls'>
            <button><ChevronRight style={{transform: 'rotate(180deg)'}} size={16}/></button>
            <button className='active'>1</button>
            <button><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------
// BOOKINGS PAGE
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
          <div className='mc-tabs'>
            <button className='active'>All</button>
            <button><div className="dot pending"/> Pending</button>
            <button><div className="dot confirmed"/> Confirmed</button>
            <button><div className="dot checked-in"/> Checked In</button>
            <button><div className="dot cancelled"/> Cancelled</button>
            <button><div className="dot refunded"/> Refunded</button>
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
              <th>Traveler</th>
              <th>Experience</th>
              <th>Date & Time</th>
              <th>Guests</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Booking Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.bookings.map(b => (
              <tr key={b.id}>
                <td style={{color: '#6B7280', fontWeight: 500}}>{b.id}</td>
                <td>
                  <strong>{b.guest}</strong>
                  <small>{b.guest.toLowerCase().replace(' ', '.')}@example.com</small>
                </td>
                <td>
                  <strong>{b.experienceTitle || 'Golden Temple'}</strong>
                  <small>Spiritual</small>
                </td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: 6, color: '#4B5563', fontSize: 13, marginBottom: 4}}><CalendarDays size={14}/> {b.date}</div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13}}><Clock size={14}/> {b.time}</div>
                </td>
                <td>{b.guests} Adults</td>
                <td>{money(b.amount)}</td>
                <td><Badge tone="paid">Paid</Badge></td>
                <td><Badge tone={b.status.toLowerCase().replace(' ', '-')}>{b.status}</Badge></td>
                <td>
                  <div className='mc-row-actions'>
                    <button><Eye size={16}/></button>
                    <button><RefreshCw size={14}/></button>
                    <button><MessageSquare size={14}/></button>
                    <button><Clock size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='mc-pagination'>
          <span className='mc-pagination-info'>Showing 1 to {state.bookings.length} of {state.bookings.length} bookings</span>
          <div className='mc-pagination-controls'>
            <button><ChevronRight style={{transform: 'rotate(180deg)'}} size={16}/></button>
            <button className='active'>1</button>
            <button>2</button>
            <button>3</button>
            <span style={{color: '#9CA3AF'}}>...</span>
            <button>16</button>
            <button><ChevronRight size={16}/></button>
            <select style={{marginLeft: 16, height: 32, borderRadius: 8, borderColor: '#E5E7EB'}}><option>10</option></select>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------
// OPERATORS PAGE
// ---------------------------------------------
function OperatorsPage({ state, act }: { state: State; act: (a: string, p?: Record<string, unknown>) => Promise<boolean> }) {
  const [q, setQ] = useState('');
  
  return (
    <>
      <div className='mc-toolbar'>
        <div className='mc-toolbar-left'>
          <div className='mc-search'>
            <Search size={18} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder='Search operators...' />
          </div>
          <div className='mc-tabs'>
            <button className='active'>All</button>
            <button><span style={{color: '#059669', fontWeight: 600}}>Verified</span></button>
            <button><span style={{color: '#D97706', fontWeight: 600}}>Pending Review</span></button>
            <button><span style={{color: '#DC2626', fontWeight: 600}}>Suspended</span></button>
          </div>
        </div>
        <div className='mc-toolbar-right'>
          <button className='mc-primary'><Plus size={18}/> Invite operator</button>
        </div>
      </div>

      <div className='mc-table-card'>
        <table>
          <thead>
            <tr>
              <th>Operator</th>
              <th>Category</th>
              <th>Contact</th>
              <th>Experiences</th>
              <th>Avg. Rating</th>
              <th>Bookings</th>
              <th>Revenue</th>
              <th>Verification Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.operators.map(o => (
              <tr key={o.id}>
                <td>
                  <div className='mc-cell-experience' style={{gap: 16}}>
                    <div style={{width: 48, height: 48, borderRadius: '50%', background: '#F3F4F6', display: 'grid', placeItems: 'center', fontWeight: 700, color: '#4B5563', border: '1px solid #E5E7EB'}}>{o.business.substring(0, 2).toUpperCase()}</div>
                    <div>
                      <strong style={{fontSize: 14}}>{o.business}</strong>
                      <small>Heritage Walks & Tours</small>
                    </div>
                  </div>
                </td>
                <td>Heritage &<br/>Guided Tours</td>
                <td>
                  <div style={{color: '#4B5563', fontSize: 13, marginBottom: 4}}>+977 9841 234567</div>
                  <div style={{color: '#2563EB', fontSize: 13}}>{o.email}</div>
                </td>
                <td style={{fontWeight: 600}}>{o.experiences}</td>
                <td>
                  <div className='mc-cell-rating'>
                    {o.rating} <Star size={14} /> <span>(124)</span>
                  </div>
                </td>
                <td style={{fontWeight: 600}}>1,248</td>
                <td style={{fontWeight: 600}}>{money(o.revenue)}</td>
                <td><Badge tone={o.status === 'Verified' ? 'verified' : o.status === 'Pending' ? 'pending' : 'suspended'}>{o.status}</Badge></td>
                <td>
                  <div className='mc-row-actions'>
                    <button><Eye size={16}/></button>
                    <button><Edit3 size={16}/></button>
                    <button><MoreHorizontal size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='mc-pagination'>
          <span className='mc-pagination-info'>Showing 1 to 4 of 4 operators</span>
          <div className='mc-pagination-controls'>
            <button><ChevronRight style={{transform: 'rotate(180deg)'}} size={16}/></button>
            <button className='active'>1</button>
            <button><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------
// CROWD PAGE
// ---------------------------------------------
function CrowdPage({ state, act }: { state: State; act: (a: string, p?: Record<string, unknown>) => Promise<boolean> }) {
  const [selected, setSelected] = useState<CrowdSite>(state.crowdSites[0]);

  useEffect(() => {
    const fresh = state.crowdSites.find(s => s.id === selected.id);
    if (fresh) setSelected(fresh);
  }, [state]);

  const color = (l: string) => l === 'Low' ? '#10B981' : l === 'Moderate' ? '#F59E0B' : l === 'High' ? '#EF4444' : '#374151';

  return (
    <>
      <div className='mc-toolbar'>
        <div className='mc-toolbar-left'>
          <div className='mc-filter-select'>
            <CalendarDays size={16} style={{position: 'absolute', left: 12, top: 12, color: '#6B7280'}}/>
            <select style={{paddingLeft: 36, paddingTop: 0}}><option>May 21 - May 27, 2025</option></select>
          </div>
          <div className='mc-filter-select'>
            <div className="dot" style={{width: 8, height: 8, borderRadius: '50%', background: '#10B981', position: 'absolute', left: 12, top: 16}}/>
            <select style={{paddingLeft: 28, paddingTop: 0}}><option>Live</option></select>
          </div>
          <button className='mc-secondary'><RefreshCw size={16}/> Refresh</button>
        </div>
        <div className='mc-toolbar-right'>
          <button className='mc-secondary'><Activity size={18}/> Run Simulation</button>
          <button className='mc-primary'><RefreshCw size={18}/> Manual Update</button>
        </div>
      </div>

      <div className='mc-crowd-layout'>
        <section className='mc-card mc-crowd-map'>
          <MapContainer center={[27.6737, 85.3245]} zoom={15} className='mc-leaflet'>
            <TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' />
            {state.crowdSites.map(s => (
              <CircleMarker 
                key={s.id} 
                center={[s.lat, s.lng]} 
                radius={s.id === selected.id ? 16 : 12} 
                eventHandlers={{ click: () => setSelected(s) }} 
                pathOptions={{ color: '#fff', fillColor: color(s.level), fillOpacity: 1, weight: 3 }}
              >
                <Popup>{s.name} · {s.level}</Popup>
              </CircleMarker>
            ))}
          </MapContainer>
          
          <div style={{position: 'absolute', bottom: 24, left: 24, right: 24, display: 'flex', gap: 16, background: '#fff', padding: 16, borderRadius: 12, boxShadow: 'var(--shadow-md)', zIndex: 400}}>
            <div style={{flex: 1}}>
              <span style={{fontSize: 12, color: '#6B7280', display: 'block'}}>Overall Crowd Level</span>
              <strong style={{fontSize: 20, color: '#F59E0B'}}>Moderate</strong>
            </div>
            <div style={{width: 1, background: '#E5E7EB'}}/>
            <div style={{flex: 1}}>
              <span style={{fontSize: 12, color: '#6B7280', display: 'block'}}>Total Visitors (Live)</span>
              <strong style={{fontSize: 20, color: '#111827'}}>2,720</strong>
            </div>
            <div style={{width: 1, background: '#E5E7EB'}}/>
            <div style={{flex: 1}}>
              <span style={{fontSize: 12, color: '#6B7280', display: 'block'}}>Total Capacity</span>
              <strong style={{fontSize: 20, color: '#111827'}}>4,050</strong>
            </div>
            <div style={{width: 1, background: '#E5E7EB'}}/>
            <div style={{flex: 1}}>
              <span style={{fontSize: 12, color: '#6B7280', display: 'block'}}>Utilization</span>
              <strong style={{fontSize: 20, color: '#111827'}}>67%</strong>
            </div>
          </div>
        </section>
        
        <aside>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
            <h3 style={{fontSize: 16, fontWeight: 700, margin: 0}}>Crowd Status <AlertCircle size={14} style={{color: '#9CA3AF', marginLeft: 4, verticalAlign: 'text-bottom'}}/></h3>
            <span style={{fontSize: 13, color: 'var(--mc-teal)', fontWeight: 600, cursor: 'pointer'}}>View all <ChevronRight size={14} style={{verticalAlign: 'middle'}}/></span>
          </div>
          
          <div className='mc-crowd-list'>
            {state.crowdSites.map(s => (
              <div className='mc-crowd-site-card' key={s.id} onClick={() => setSelected(s)} style={{borderColor: selected.id === s.id ? 'var(--mc-teal)' : ''}}>
                <img src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=100&q=80" alt="" />
                <div>
                  <h3>{s.name}</h3>
                  <p>Heritage Zone</p>
                  <div className='mc-crowd-site-metrics'>
                    <div className='mc-crowd-site-metric'>
                      <small>Estimated Wait</small>
                      <strong style={{color: s.level === 'High' ? '#DC2626' : s.level === 'Moderate' ? '#D97706' : '#059669'}}>{s.wait}</strong>
                    </div>
                    <div className='mc-crowd-site-metric'>
                      <small>Current Crowd</small>
                      <strong style={{display: 'flex', alignItems: 'center', gap: 4}}><Users size={14} style={{color: '#9CA3AF'}}/> 1,520</strong>
                    </div>
                    <div className='mc-crowd-site-metric'>
                      <small>Capacity</small>
                      <strong style={{display: 'flex', alignItems: 'center', gap: 4}}><BarChart3 size={14} style={{color: '#9CA3AF'}}/> 1,800</strong>
                    </div>
                  </div>
                </div>
                <div className='mc-crowd-actions'>
                  <Badge tone={crowdClass(s.level)}>{s.level}</Badge>
                  <ChevronRight size={20} style={{color: '#9CA3AF'}}/>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}

// Minimal stubs for other pages to satisfy imports
function PlacesPage({ state, act }: { state: State; act: (a: string, p?: Record<string, unknown>) => Promise<boolean> }) { return <div className="mc-card">Places placeholder. Redesigned layout applies generally.</div>; }
function AnalyticsPage({ state }: { state: State }) { return <div className="mc-card">Analytics placeholder. See Overview for new charts.</div>; }

// Operator routing stub - Uses similar styling framework
function OperatorRouter({ view, state, operator, act, nav }: { view: OperatorView; state: State; operator: Operator; act: (a: string, p?: Record<string, unknown>) => Promise<boolean>; nav: (v: OperatorView) => void }) {
  if (view === 'experiences') return <div className="mc-card">Operator experiences placeholder.</div>;
  if (view === 'bookings') return <BookingsPage state={state} act={act} />;
  return <div className="mc-card">Operator overview placeholder.</div>;
}
