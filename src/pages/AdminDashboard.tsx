import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc,
  orderBy,
  limit,
  getDoc,
  setDoc,
  where
} from 'firebase/firestore';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Package, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  User as UserIcon,
  Search,
  ExternalLink,
  Save,
  Star,
  Image as ImageIcon,
  Phone,
  UserPlus,
  Ticket,
  Lock,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { db } from '../lib/firebase';
import { useCMS } from '../components/CMSContext';
import { useAuth } from '../components/AuthContext';

const COLORS = ['#A83F1B', '#E5E7EB', '#FBBF24', '#10B981'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, userData, loading: isLoading, error: authError, login, googleLogin, register, logout } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'services' | 'products' | 'cms' | 'invites'>('overview');
  const [leads, setLeads] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const { content, updateContent } = useCMS();

  useEffect(() => {
    if (!user || !userData) return;

    const qLeads = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubLeads = onSnapshot(qLeads, (s) => setLeads(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qServices = query(collection(db, 'services'));
    const unsubServices = onSnapshot(qServices, (s) => setServices(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qProducts = query(collection(db, 'products'));
    const unsubProducts = onSnapshot(qProducts, (s) => setProducts(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => {
      unsubLeads();
      unsubServices();
      unsubProducts();
    };
  }, [user, userData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await googleLogin();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(email, password, inviteCode);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => logout();


  if (isLoading) return null;

  if (!user || !userData) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UserIcon className="text-brand" size={32} />
            </div>
            <h1 className="text-2xl font-bold serif mb-2">
              {authMode === 'login' ? 'Studio Access' : 'Create Account'}
            </h1>
            <p className="text-ink/60 text-sm">
              {authMode === 'login' 
                ? 'Sign in to manage your studio' 
                : email === "jessescaledyou@gmail.com" 
                  ? 'Register as the Studio Owner' 
                  : 'Register as a Studio Worker'}
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-bold uppercase flex items-center gap-3">
              <AlertCircle size={16} />
              <p>{authError}</p>
            </div>
          )}

          {user && !userData && !authError && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-[10px] font-bold uppercase flex items-center gap-3">
              <Lock size={16} />
              <p>Sign in successful, but no studio profile found. Please register.</p>
            </div>
          )}

          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Email Address</label>
              <input 
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Choose Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
              />
            </div>

            {authMode === 'register' && email !== "jessescaledyou@gmail.com" && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Invite Code (5 Digits)</label>
                <input 
                  type="text"
                  required
                  maxLength={5}
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value)}
                  placeholder="XXXXX"
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand text-center font-mono text-xl tracking-widest"
                />
              </div>
            )}
            
            {authMode === 'register' && email === "jessescaledyou@gmail.com" && (
              <div className="p-4 bg-brand/5 border border-brand/10 rounded-xl text-[10px] font-bold text-brand uppercase text-center">
                System recognized Owner: No invite code required.
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand text-white py-4 rounded-xl font-bold transition-all hover:bg-brand/90 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Clock className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                authMode === 'login' ? 'Sign In' : 'Complete Registration'
              )}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.2em] px-4">
                <span className="bg-white px-4 text-ink/30">Or use Google</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full bg-white border-2 border-gray-100 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-gray-50 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.705a5.41 5.41 0 0 1-.282-1.705c0-.593.102-1.17.282-1.705V4.963H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.037l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.963L3.964 7.295C4.672 5.168 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              {authMode === 'login' ? 'Sign in with Google' : 'Register with Google'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t text-center">
            <button 
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setEmail('');
                setPassword('');
                setInviteCode('');
              }}
              className="text-xs font-bold text-brand hover:underline"
            >
              {authMode === 'login' ? "First time? Register your account" : "Back to Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = userData.role === 'owner';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-ink text-white flex flex-col">
        <div className="p-8">
          <div className="text-2xl font-bold serif tracking-tight">Wamled<span className="text-brand">.</span></div>
          <p className="text-[10px] text-white/40 tracking-widest mt-1">STUDIO DASHBOARD</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <SidebarLink active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={20} />} label="Overview" />
          <SidebarLink active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} icon={<MessageSquare size={20} />} label="Leads & Inquiries" />
          {isOwner && (
            <>
              <SidebarLink active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={<Package size={20} />} label="Services" />
              <SidebarLink active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<TrendingUp size={20} />} label="Products" />
              <SidebarLink active={activeTab === 'cms'} onClick={() => setActiveTab('cms')} icon={<Settings size={20} />} label="Site Content" />
              <SidebarLink active={activeTab === 'invites'} onClick={() => setActiveTab('invites')} icon={<Ticket size={20} />} label="Worker Invites" />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-4 py-2 bg-white/5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center font-bold text-xs uppercase">
              {userData.email[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{userData.email.split('@')[0]}</p>
              <p className="text-[10px] text-white/40 truncate capitalize">{userData.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors px-4 py-2 w-full">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold serif text-ink capitalize">{activeTab}</h2>
            <p className="text-ink/40 text-sm mt-1">
              {isOwner ? 'Manage your studio operations and site content.' : 'Track and manage client inquiries.'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white border rounded-xl px-4 py-2 flex items-center gap-3 text-sm">
              <CalendarIcon size={16} className="text-ink/40" />
              <span className="font-medium">{new Date().toLocaleDateString('en-KE', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </header>

        {activeTab === 'overview' && <OverviewTab leads={leads} services={services} />}
        {activeTab === 'leads' && <LeadsTab leads={leads} isOwner={isOwner} />}
        {activeTab === 'services' && isOwner && <ListManager collectionName="services" items={services} />}
        {activeTab === 'products' && isOwner && <ListManager collectionName="products" items={products} />}
        {activeTab === 'cms' && isOwner && <CMSTab content={content} updateContent={updateContent} />}
        {activeTab === 'invites' && isOwner && <InvitesTab />}
      </main>
    </div>
  );
}

function SidebarLink({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${active ? 'bg-brand text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function OverviewTab({ leads, services }: any) {
  const stats = [
    { label: 'Total Inquiries', value: leads.length, color: 'brand' },
    { label: 'Active Leads', value: leads.filter((l: any) => l.status === 'New' || l.status === 'In Progress').length, color: 'amber' },
    { label: 'Closed Deals', value: leads.filter((l: any) => l.status === 'Closed').length, color: 'emerald' },
    { label: 'Services', value: services.length, color: 'ink' }
  ];

  const leadStatusData = [
    { name: 'New', value: leads.filter((l: any) => l.status === 'New').length },
    { name: 'In Progress', value: leads.filter((l: any) => l.status === 'In Progress').length },
    { name: 'Closed', value: leads.filter((l: any) => l.status === 'Closed').length },
  ];

  const leadSourceData = [
    { name: 'WhatsApp', value: leads.filter((l: any) => l.source === 'whatsapp').length },
    { name: 'Contact Form', value: leads.filter((l: any) => l.source === 'form').length },
    { name: 'Meta Ads', value: 0 }, // Placeholder for simulation
    { name: 'Google SEO', value: 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border">
            <p className="text-ink/40 text-[10px] font-bold uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-4xl font-bold serif text-${s.color === 'brand' ? 'brand' : 'ink'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border">
          <h3 className="text-xl font-bold serif mb-6">Leads by Status</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadStatusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#A83F1B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border">
          <h3 className="text-xl font-bold serif mb-6">Inquiry Sources</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leadSourceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {leadSourceData.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] font-bold text-ink/40 uppercase">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadsTab({ leads, isOwner }: any) {
  const updateLeadStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'leads', id), { status });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">Client</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">Inquiry Details</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">Date</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">Status</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead: any) => (
            <tr key={lead.id} className="border-b hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-6">
                <p className="font-bold text-sm">{lead.name}</p>
                <p className="text-xs text-ink/40">{lead.phone}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-brand/10 text-brand text-[8px] font-bold rounded uppercase">
                  {lead.source || 'Form'}
                </span>
              </td>
              <td className="px-6 py-6 max-w-xs">
                <p className="text-xs font-medium text-brand mb-1">{lead.projectType}</p>
                <p className="text-xs text-ink/60 line-clamp-2">{lead.details}</p>
              </td>
              <td className="px-6 py-6 text-xs text-ink/40">
                {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-6">
                <select 
                  value={lead.status} 
                  onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                  className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border focus:outline-none ${
                    lead.status === 'Closed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                    lead.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                    'bg-gray-50 text-gray-600 border-gray-200'
                  }`}
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                  <option value="Archived">Archived</option>
                </select>
              </td>
              <td className="px-6 py-6">
                <div className="flex gap-2">
                  <a href={`tel:${lead.phone}`} className="p-2 bg-gray-100 rounded-lg hover:bg-brand hover:text-white transition-all">
                    <Phone size={14} />
                  </a>
                  {isOwner && (
                    <button onClick={() => deleteDoc(doc(db, 'leads', lead.id))} className="p-2 bg-gray-100 rounded-lg hover:bg-red-500 hover:text-white transition-all text-red-500">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InvitesTab() {
  const [invites, setInvites] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'invites'), orderBy('createdAt', 'desc'), limit(10));
    const unsub = onSnapshot(q, (s) => setInvites(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const generateCode = async () => {
    setIsGenerating(true);
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    try {
      await setDoc(doc(db, 'invites', code), {
        code,
        createdAt: new Date().toISOString(),
        used: false
      });
    } catch (e) {
      console.error(e);
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold serif">Worker Invitations</h3>
        <button 
          onClick={generateCode}
          disabled={isGenerating}
          className="bg-brand text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-brand/20 disabled:opacity-50"
        >
          <Ticket size={18} />
          Generate New Code
        </button>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <table className="w-full text-left ">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">Invite Code</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">Created At</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">Status</th>
            </tr>
          </thead>
          <tbody>
            {invites.map((invite) => (
              <tr key={invite.id} className="border-b">
                <td className="px-6 py-6 border-b">
                  <span className="font-mono text-xl font-bold tracking-widest bg-gray-100 px-4 py-2 rounded-lg">{invite.code}</span>
                </td>
                <td className="px-6 py-6 border-b text-sm text-ink/40">
                  {new Date(invite.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-6 border-b">
                  {invite.used ? (
                    <span className="text-[10px] font-bold uppercase text-red-500 bg-red-50 px-3 py-1 rounded-full">Used</span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-8 bg-brand/5 border border-brand/10 rounded-3xl">
        <div className="flex gap-4">
          <div className="p-3 bg-brand text-white rounded-2xl h-fit">
            <Lock size={20} />
          </div>
          <div>
            <h4 className="font-bold mb-1">Security Note</h4>
            <p className="text-sm text-ink/60">Invite codes are for one-time use. Give a code to a new worker so they can create their account. Once used, the code will become inactive.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListManager({ collectionName, items }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({ title: '', name: '', description: '', price: '' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, collectionName), {
        ...formData,
        price: Number(formData.price),
        createdAt: new Date().toISOString()
      });
      setFormData({ title: '', name: '', description: '', price: '' });
      setIsAdding(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await deleteDoc(doc(db, collectionName, id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-brand/20"
        >
          <Plus size={18} />
          Add New {collectionName === 'services' ? 'Service' : 'Product'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-6">
            <div className="col-span-2 sm:col-span-1 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Title / Name</label>
              <input 
                required
                value={collectionName === 'services' ? formData.title : formData.name}
                onChange={e => setFormData({ ...formData, [collectionName === 'services' ? 'title' : 'name']: e.target.value })}
                className="w-full p-3 bg-gray-50 border rounded-xl focus:outline-none focus:border-brand"
              />
            </div>
            <div className="col-span-2 sm:col-span-1 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Price (KSh)</label>
              <input 
                type="number"
                required
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-3 bg-gray-50 border rounded-xl focus:outline-none focus:border-brand"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Description</label>
              <textarea 
                required
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 bg-gray-50 border rounded-xl focus:outline-none focus:border-brand"
              />
            </div>
            <button type="submit" className="col-span-2 bg-ink text-white py-3 rounded-xl font-bold">Save Item</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item: any) => (
          <div key={item.id} className="bg-white p-6 rounded-3xl border shadow-sm group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-xl font-bold serif">{item.title || item.name}</h4>
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-2 text-ink/20 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-xs text-ink/60 mb-6 line-clamp-2">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-brand font-bold text-lg">KSh {Number(item.price).toLocaleString()}</span>
              <span className="text-[10px] font-bold text-ink/40 uppercase">READY TO QUOTE</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CMSTab({ content, updateContent }: any) {
  const [formData, setFormData] = useState(content);

  const handleSave = async () => {
    await updateContent(formData);
    alert('Site content updated!');
  };

  return (
    <div className="bg-white p-10 rounded-3xl border shadow-sm space-y-12">
      {/* Hero Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold serif border-b pb-4 flex items-center gap-3">
          <LayoutDashboard size={20} className="text-brand" />
          Hero Section
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Headline</label>
              <textarea 
                value={formData.heroHeadline}
                onChange={e => setFormData({ ...formData, heroHeadline: e.target.value })}
                rows={3}
                className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand transition-all font-serif text-lg"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Hero Image URL</label>
              <input 
                value={formData.heroImage}
                onChange={e => setFormData({ ...formData, heroImage: e.target.value })}
                className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
              />
              <div className="mt-4 aspect-video rounded-2xl overflow-hidden border">
                <img src={formData.heroImage} className="w-full h-full object-cover" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold serif border-b pb-4 flex items-center gap-3">
          <Phone size={20} className="text-brand" />
          Contact & Studio Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Studio Phone</label>
            <input 
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Location</label>
            <input 
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Opening Hours</label>
            <input 
              value={formData.hours}
              onChange={e => setFormData({ ...formData, hours: e.target.value })}
              className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
            />
          </div>
        </div>
      </div>

      {/* Gallery Management */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-xl font-bold serif flex items-center gap-3">
            <ImageIcon size={20} className="text-brand" />
            Portfolio Gallery
          </h3>
          <button 
            onClick={() => {
              const newGallery = [...(formData.galleryImages || [])];
              newGallery.push({ url: '', label: 'GALLERY IMAGE' });
              setFormData({ ...formData, galleryImages: newGallery });
            }}
            className="text-xs font-bold text-brand flex items-center gap-1 hover:underline"
          >
            <Plus size={14} />
            Add Image
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(formData.galleryImages || []).map((img: any, idx: number) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-2xl border space-y-3 group relative">
              <button 
                onClick={() => {
                  const newGallery = formData.galleryImages.filter((_: any, i: number) => i !== idx);
                  setFormData({ ...formData, galleryImages: newGallery });
                }}
                className="absolute top-2 right-2 p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Image URL</label>
                <input 
                  value={img.url}
                  placeholder="https://images.unsplash.com/..."
                  onChange={e => {
                    const newGallery = [...formData.galleryImages];
                    newGallery[idx].url = e.target.value;
                    setFormData({ ...formData, galleryImages: newGallery });
                  }}
                  className="w-full p-2 bg-white border rounded-lg text-xs focus:border-brand outline-none"
                />
              </div>
              
              <div className="aspect-[3/4] rounded-lg overflow-hidden border bg-white flex items-center justify-center text-ink/20">
                {img.url ? (
                  <img src={img.url} className="w-full h-full object-cover" alt="" />
                ) : (
                  <ImageIcon size={24} />
                )}
              </div>
            </div>
          ))}
          
          {(!formData.galleryImages || formData.galleryImages.length === 0) && (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border border-dashed">
              <p className="text-ink/40 text-sm italic">No gallery images added yet.</p>
              <button 
                onClick={() => {
                  setFormData({ ...formData, galleryImages: [{ url: '', label: 'GALLERY IMAGE' }] });
                }}
                className="mt-4 text-xs font-bold text-brand hover:underline"
              >
                Click to add your first image
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Management */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold serif border-b pb-4 flex items-center gap-3">
          <Star size={20} className="text-brand" />
          Client Reviews
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {formData.reviews?.map((review: any, idx: number) => (
            <div key={idx} className="p-6 bg-gray-50 rounded-3xl border space-y-4">
              <textarea 
                value={review.text}
                placeholder="Review Text"
                rows={4}
                onChange={e => {
                  const newReviews = [...formData.reviews];
                  newReviews[idx].text = e.target.value;
                  setFormData({ ...formData, reviews: newReviews });
                }}
                className="w-full p-3 bg-white border rounded-xl text-sm italic"
              />
              <input 
                value={review.author}
                placeholder="Author Name"
                onChange={e => {
                  const newReviews = [...formData.reviews];
                  newReviews[idx].author = e.target.value;
                  setFormData({ ...formData, reviews: newReviews });
                }}
                className="w-full p-3 bg-white border rounded-xl text-xs font-bold"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold serif border-b pb-4 flex items-center gap-3">
          <ExternalLink size={20} className="text-brand" />
          Social Media Links
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {formData.socialLinks?.map((social: any, idx: number) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-2xl border flex items-center gap-3">
              <div className="p-2 bg-brand text-white rounded-lg capitalize text-[10px] font-bold min-w-[70px] text-center">
                {social.platform}
              </div>
              <input 
                value={social.url}
                placeholder="Profile URL"
                onChange={e => {
                  const newSocials = [...formData.socialLinks];
                  newSocials[idx].url = e.target.value;
                  setFormData({ ...formData, socialLinks: newSocials });
                }}
                className="flex-1 p-2 bg-white border rounded-lg text-xs"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-8 border-t">
        <button 
          onClick={handleSave}
          className="bg-brand text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand/90 transition-all shadow-xl shadow-brand/20"
        >
          <Save size={20} />
          Publish All Changes
        </button>
      </div>
    </div>
  );
}

function CalendarIcon({ size, className }: any) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
