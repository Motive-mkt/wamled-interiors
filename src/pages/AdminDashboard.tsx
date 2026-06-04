import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import kenyanHouseLandscapeImg from '../assets/images/kenyan_house_landscape_1780570586379.png';
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
  setDoc
} from 'firebase/firestore';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Package, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Clock, 
  TrendingUp,
  User as UserIcon,
  ExternalLink,
  Save,
  Star,
  Image as ImageIcon,
  Phone,
  Ticket,
  Lock,
  AlertCircle,
  BookOpen,
  FileDown,
  Search,
  Mail,
  X,
  Check,
  Edit,
  Eye
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

const COLORS = ['#C5A059', '#E5E7EB', '#FBBF24', '#10B981'];

export default function AdminDashboard() {
  const { user, role, authLoading, roleLoading, isFirstUser, login, googleLogin, register, logout } = useAuth();
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'cms' | 'invites' | 'portfolio' | 'casestudies'>('overview');
  const [leads, setLeads] = useState<any[]>([]);
  const { content, updateContent } = useCMS();

  useEffect(() => {
    if (authLoading || roleLoading || !user || !role) return;

    const qLeads = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubLeads = onSnapshot(qLeads, (s) => setLeads(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => {
      unsubLeads();
    };
  }, [user, role, authLoading, roleLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await login(email, password);
    } catch (e: any) {
      setAuthError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await googleLogin();
    } catch (e: any) {
      setAuthError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await register(email, password, inviteCode);
    } catch (e: any) {
      setAuthError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Clock className="animate-spin text-brand" size={32} />
          <p className="text-sm font-bold uppercase tracking-widest text-ink/40">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user || !role) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UserIcon className="text-brand" size={32} />
            </div>
            <h1 className="text-2xl font-bold serif mb-2">
              {authMode === 'login' ? 'Studio Access' : isFirstUser ? 'Owner Setup' : 'Create Account'}
            </h1>
            <p className="text-ink/60 text-sm">
              {user && !role 
                ? "Account registered. Waiting for admin approval."
                : authMode === 'login' 
                  ? 'Sign in to manage your studio' 
                  : isFirstUser
                    ? 'Register as the first user to become Studio Owner.'
                    : 'Register for worker access'}
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-bold uppercase flex items-center gap-3">
              <AlertCircle size={16} />
              <p>{authError}</p>
            </div>
          )}

          {user && !role && (
            <div className="mb-6 p-6 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800 text-center space-y-4">
              <div className="flex justify-center text-amber-500">
                <Lock size={32} />
              </div>
              <div>
                <p className="text-sm font-bold mb-1">Awaiting Role Assignment</p>
                <p className="text-xs opacity-75">Your account ({user.email}) is active, but permissions haven't been assigned yet.</p>
              </div>
              <button 
                onClick={() => logout()}
                className="text-[10px] font-bold uppercase tracking-widest text-amber-600 hover:underline"
              >
                Sign out and try another account
              </button>
            </div>
          )}

          {(!user || (user && !role)) && (
            <>
              {(!user) && (
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

                  {authMode === 'register' && email !== "jessescaledyou@gmail.com" && !isFirstUser && (
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

                  {authMode === 'register' && isFirstUser && (
                    <div className="p-4 bg-brand/5 border border-brand/10 rounded-2xl space-y-1">
                      <p className="text-[10px] font-bold text-brand uppercase tracking-widest">👑 Studio Owner Setup</p>
                      <p className="text-xs text-ink/60">Success! You are the first registrant, so you will automatically be initialized as the Studio Owner (No invite code needed).</p>
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
                      authMode === 'login' ? 'Sign In' : 'Complete Setup & Register'
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
              )}

              <div className="mt-8 pt-6 border-t text-center">
                <button 
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'register' : 'login');
                    setAuthError(null);
                  }}
                  className="text-xs font-bold text-brand hover:underline"
                >
                  {authMode === 'login' ? "First time? Register your account" : "Back to Login"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const isOwner = role === 'owner';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-ink text-white flex flex-col">
        <div className="p-8">
          <Link to="/" className="inline-block relative pb-1.5 select-none hover:opacity-90 transition-opacity">
            <span className="text-2xl font-serif tracking-tight text-white">Wamled</span>
            <span className="text-2xl font-serif text-[#A83F1B]">.</span>
            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#A83F1B]" />
          </Link>
          <p className="text-[10px] text-white/40 tracking-widest mt-1">STUDIO DASHBOARD</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <SidebarLink active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={20} />} label="Overview" />
          <SidebarLink active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} icon={<MessageSquare size={20} />} label="Leads & Inquiries" />
          {isOwner && (
            <>
              <SidebarLink active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} icon={<ImageIcon size={20} />} label="Portfolio Curator" />
              <SidebarLink active={activeTab === 'casestudies'} onClick={() => setActiveTab('casestudies')} icon={<BookOpen size={20} />} label="Case Studies Curator" />
              <SidebarLink active={activeTab === 'cms'} onClick={() => setActiveTab('cms')} icon={<Settings size={20} />} label="Site Content" />
              <SidebarLink active={activeTab === 'invites'} onClick={() => setActiveTab('invites')} icon={<Ticket size={20} />} label="Worker Invites" />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-4 py-2 bg-white/5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center font-bold text-xs uppercase">
              {user.email?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user.email?.split('@')[0]}</p>
              <p className="text-[10px] text-white/40 truncate capitalize">{role}</p>
            </div>
          </div>
          <button onClick={() => logout()} className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors px-4 py-2 w-full">
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
              <span className="font-medium text-ink/40 tracking-widest text-[10px] font-bold uppercase">Kenya Standard Time</span>
              <span className="font-medium">{new Date().toLocaleDateString('en-KE', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </header>

        {activeTab === 'overview' && <OverviewTab leads={leads} />}
        {activeTab === 'leads' && <LeadsTab leads={leads} isOwner={isOwner} />}
        {activeTab === 'portfolio' && isOwner && <PortfolioTab />}
        {activeTab === 'casestudies' && isOwner && <CaseStudiesTab />}
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

function OverviewTab({ leads }: any) {
  const stats = [
    { label: 'Total Inquiries', value: leads.length, color: 'brand' },
    { label: 'Active Leads', value: leads.filter((l: any) => l.status === 'New' || l.status === 'In Progress').length, color: 'amber' },
    { label: 'Closed Deals', value: leads.filter((l: any) => l.status === 'Closed').length, color: 'emerald' }
  ];

  const leadStatusData = [
    { name: 'New', value: leads.filter((l: any) => l.status === 'New').length },
    { name: 'In Progress', value: leads.filter((l: any) => l.status === 'In Progress').length },
    { name: 'Closed', value: leads.filter((l: any) => l.status === 'Closed').length },
  ];

  const leadSourceData = [
    { name: 'WhatsApp', value: leads.filter((l: any) => l.source === 'whatsapp').length },
    { name: 'Contact Form', value: leads.filter((l: any) => l.source === 'form').length },
    { name: 'Meta Ads', value: 0 }, 
    { name: 'Google SEO', value: 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border">
            <p className="text-ink/40 text-[10px] font-bold uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-4xl font-bold serif ${s.color === 'brand' ? 'text-brand' : 'text-ink'}`}>{s.value}</p>
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
                <Bar dataKey="value" fill="#C5A059" radius={[4, 4, 0, 0]} />
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
  const [activeTab, setActiveTab] = useState<'All' | 'New' | 'In Progress' | 'Closed' | 'Archived'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // 1. Calculate Analytics Metrics
  const totalCount = leads.length;
  const newCount = leads.filter((l: any) => l.status === 'New' || !l.status).length;
  const inProgressCount = leads.filter((l: any) => l.status === 'In Progress').length;
  const closedCount = leads.filter((l: any) => l.status === 'Closed').length;
  const archivedCount = leads.filter((l: any) => l.status === 'Archived').length;
  const conversionRate = totalCount > 0 ? Math.round((closedCount / totalCount) * 100) : 0;

  // 2. Filter Leads based on Status Tab & Search Term
  const filteredLeads = leads.filter((lead: any) => {
    const status = lead.status || 'New';
    
    // Tab filter
    if (activeTab !== 'All' && status !== activeTab) {
      return false;
    }

    // Search query filter
    const query = searchTerm.toLowerCase();
    return (
      (lead.name || '').toLowerCase().includes(query) ||
      (lead.email || '').toLowerCase().includes(query) ||
      (lead.phone || '').toLowerCase().includes(query) ||
      (lead.projectType || '').toLowerCase().includes(query) ||
      (lead.details || '').toLowerCase().includes(query)
    );
  });

  // 3. Update Status
  const updateLeadStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'leads', id), { status });
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead((prev: any) => ({ ...prev, status }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 4. Add action note/followup logs
  const handleAddNote = async (leadId: string, currentNotes: any[]) => {
    if (!newNoteText.trim()) return;
    const noteObj = {
      text: newNoteText,
      createdAt: new Date().toISOString()
    };
    const updatedNotes = [...(currentNotes || []), noteObj];
    try {
      await updateDoc(doc(db, 'leads', leadId), {
        notes: updatedNotes
      });
      setNewNoteText('');
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead((prev: any) => ({ ...prev, notes: updatedNotes }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 5. Export to Excel/CSV
  const exportToCSV = () => {
    if (leads.length === 0) return alert('No inquiries available to export.');
    
    const headers = ['Name', 'Email', 'Phone', 'Project Subject', 'Inquiry Source', 'Received Date', 'Status', 'Inquiry Message', 'Follow-up Notes Count'];
    const rows = leads.map((l: any) => [
      l.name || '',
      l.email || '',
      l.phone || '',
      l.projectType || '',
      l.source || 'Form',
      l.createdAt ? new Date(l.createdAt).toLocaleString() : 'N/A',
      l.status || 'New',
      (l.details || '').replace(/"/g, '""'),
      (l.notes || []).length
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map((e: any) => e.map((val: any) => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wamled_inquiries_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Ribbon & Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border text-left shadow-sm">
          <span className="text-[9px] font-mono tracking-widest text-ink/40 uppercase font-bold block">Total Inquiries</span>
          <p className="text-2xl font-serif font-light text-ink mt-1">{totalCount}</p>
        </div>
        <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 text-left shadow-sm">
          <span className="text-[9px] font-mono tracking-widest text-amber-700/60 uppercase font-bold block">🚨 New Requests</span>
          <p className="text-2xl font-serif font-light text-amber-800 mt-1">{newCount}</p>
        </div>
        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 text-left shadow-sm">
          <span className="text-[9px] font-mono tracking-widest text-blue-700/60 uppercase font-bold block">⚡ In Progress</span>
          <p className="text-2xl font-serif font-light text-blue-800 mt-1">{inProgressCount}</p>
        </div>
        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 text-left shadow-sm">
          <span className="text-[9px] font-mono tracking-widest text-emerald-700/60 uppercase font-bold block">✓ Closed / Wins</span>
          <p className="text-2xl font-serif font-light text-emerald-800 mt-1">{closedCount}</p>
        </div>
        <div className="bg-ink/5 p-5 rounded-2xl border text-left shadow-sm col-span-2 md:col-span-1">
          <span className="text-[9px] font-mono tracking-widest text-ink/50 uppercase font-bold block">Conversion %</span>
          <p className="text-2xl font-serif font-light text-brand mt-1">{conversionRate}%</p>
        </div>
      </div>

      {/* Advanced Filter and Control Bar */}
      <div className="bg-white p-4 border rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1 w-full md:w-auto">
          {(['All', 'New', 'In Progress', 'Closed', 'Archived'] as const).map((tab) => {
            const countMap = {
              All: totalCount,
              New: newCount,
              'In Progress': inProgressCount,
              Closed: closedCount,
              Archived: archivedCount
            };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] sm:text-xs font-mono tracking-wider px-3 sm:px-4 py-2 rounded-xl font-bold transition-all relative ${
                  isActive 
                    ? 'bg-brand text-white shadow-sm' 
                    : 'text-ink/60 hover:bg-gray-100'
                }`}
              >
                {tab.toUpperCase()}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[8px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-ink/55'
                }`}>
                  {countMap[tab]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Export inputs */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-3 text-ink/30" size={14} />
            <input
              type="text"
              placeholder="Search clients, messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border bg-gray-50 rounded-xl focus:outline-none focus:border-brand"
            />
          </div>
          <button
            onClick={exportToCSV}
            title="Export leads database to CSV"
            className="p-2 border hover:bg-gray-50 rounded-xl text-ink/75 font-mono text-[10px] font-bold tracking-widest flex items-center gap-1.5 h-10 px-4 whitespace-nowrap cursor-pointer"
          >
            <FileDown size={14} />
            EXPORT
          </button>
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40">Client Info</th>
                <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40">Project Classification</th>
                <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40">Submitted Message excerpt</th>
                <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40">Date</th>
                <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40">Status Staging</th>
                <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40">Action Room</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-ink/40 font-mono">
                    No matching client inquiries found.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead: any) => {
                  const status = lead.status || 'New';
                  return (
                    <tr key={lead.id} className="border-b hover:bg-gray-50/30 transition-colors">
                      {/* Name & Source */}
                      <td className="px-6 py-5">
                        <div className="space-y-1 text-left">
                          <p className="font-bold text-ink hover:text-brand transition-colors text-sm">{lead.name}</p>
                          <p className="text-[11px] font-mono text-ink/40">{lead.phone}</p>
                          {lead.email && <p className="text-[10px] text-ink/40 truncate max-w-[150px]">{lead.email}</p>}
                        </div>
                      </td>

                      {/* Project Subject */}
                      <td className="px-6 py-5 text-left">
                        <span className="text-[10px] font-mono uppercase bg-brand/5 border border-brand/10 text-brand px-2 py-1 rounded-md max-w-[170px] inline-block truncate">
                          {lead.projectType || 'General Consultation'}
                        </span>
                        <div className="text-[8px] font-mono tracking-widest text-ink/30 uppercase mt-1">
                          Source: {lead.source || 'Standard Form'}
                        </div>
                      </td>

                      {/* Message details */}
                      <td className="px-6 py-5 max-w-xs text-left">
                        <p className="text-xs text-ink/70 line-clamp-2 mt-0.5 leading-relaxed font-sans">{lead.details}</p>
                        {(lead.notes || []).length > 0 && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 mt-1 rounded">
                            ● {(lead.notes || []).length} follow-up logs
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5 text-xs text-ink/40 font-mono">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Status select dropdown */}
                      <td className="px-6 py-5">
                        <select 
                          value={status} 
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className={`text-[9px] font-mono font-bold uppercase px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none ${
                            status === 'Closed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                            status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                            status === 'Archived' ? 'bg-gray-50 text-gray-400 border-gray-200' :
                            'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Closed">Closed</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>

                      {/* View Dossier and quick actions */}
                      <td className="px-6 py-5">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-2 bg-[#F9F9F7] hover:bg-brand hover:text-white rounded-lg transition-all text-ink/60 border hover:border-brand flex items-center gap-1 text-[10px] font-mono font-bold tracking-widest cursor-pointer"
                            title="Open client dossier and activity log room"
                          >
                            <Eye size={13} />
                            DOSSIER
                          </button>
                          
                          {isOwner && (
                            <button 
                              onClick={() => {
                                if (confirm('Are you absolutely sure you want to purge this lead? This action is irreversible.')) {
                                  deleteDoc(doc(db, 'leads', lead.id));
                                }
                              }} 
                              className="p-2 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-all text-red-500 border border-red-100"
                              title="Purge dossier record"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* World-Class Client Inquiry Dossier & Notes Log (Translucent Aside Drawer Modal) */}
      {selectedLead && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-300">
          {/* Backdrop Closer */}
          <div className="absolute inset-0" onClick={() => setSelectedLead(null)} />
          
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-ink/5 animate-slide-in">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-ink/5 bg-[#F9F9F7]">
              <div className="text-left space-y-1">
                <span className="text-[8px] font-mono tracking-widest text-brand uppercase block font-bold">Wamled Client Ingest Track</span>
                <h3 className="text-lg font-serif text-ink tracking-tight uppercase leading-none">Inquiry Dossier Log</h3>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="p-2 bg-white hover:bg-brand hover:text-white border rounded-xl transition-all cursor-pointer text-ink/50 shadow-xs"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 text-left">
              {/* Client Info Grid Card */}
              <div className="bg-[#F9F9F7] border border-ink/5 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-mono text-ink/40 tracking-wider font-bold">CLIENT NAME</p>
                    <p className="font-serif font-semibold text-lg text-ink uppercase">{selectedLead.name}</p>
                  </div>
                  <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${
                    (selectedLead.status || 'New') === 'Closed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                    (selectedLead.status || 'New') === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                    (selectedLead.status || 'New') === 'Archived' ? 'bg-gray-50 text-gray-500 border-gray-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {selectedLead.status || 'New'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-ink/5 text-xs">
                  <div>
                    <span className="text-[8px] font-mono text-ink/40 font-bold block">PHONE NUMBER</span>
                    <a href={`tel:${selectedLead.phone}`} className="text-ink hover:text-brand font-medium block mt-0.5 transition-colors underline">
                      {selectedLead.phone}
                    </a>
                  </div>
                  {selectedLead.email && (
                    <div>
                      <span className="text-[8px] font-mono text-ink/40 font-bold block">EMAIL ADDRESS</span>
                      <a href={`mailto:${selectedLead.email}`} className="text-ink hover:text-brand font-medium block mt-0.5 transition-colors truncate underline">
                        {selectedLead.email}
                      </a>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[8px] font-mono text-ink/40 font-bold block">RECEIVED TIMEFRAME</span>
                    <span className="text-ink/60 font-mono block mt-0.5">
                      {selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-ink/40 font-bold block">PROJECT CLASSIFICATION</span>
                    <span className="text-brand font-mono font-bold uppercase block mt-0.5 text-[10px] truncate">
                      {selectedLead.projectType || 'General Consultation'}
                    </span>
                  </div>
                </div>

                {/* Instant Connect Suite Buttons */}
                <div className="pt-3 border-t border-ink/5 flex flex-wrap gap-2 justify-center">
                  <a 
                    href={`tel:${selectedLead.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white hover:bg-gray-100 border text-ink font-mono text-[9px] font-bold tracking-widest rounded-xl transition-all"
                  >
                    <Phone size={11} />
                    DIAL
                  </a>
                  {selectedLead.email && (
                    <a 
                      href={`mailto:${selectedLead.email}?subject=Wamled%20Atelier%20Response&body=Dear%20${encodeURIComponent(selectedLead.name)},%0D%0A%0D%0AThank%20you%20for%20contacting%20Wamled%20Design%20Atelier...`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white hover:bg-gray-100 border text-ink font-mono text-[9px] font-bold tracking-widest rounded-xl transition-all"
                    >
                      <Mail size={11} />
                      EMAIL
                    </a>
                  )}
                  <a 
                    href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedLead.name)},%20this%20is%20Wamled%20Interiors.%20Thank%20you%20for%20reaching%20out...`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[9px] font-bold tracking-widest rounded-xl transition-all"
                  >
                    <MessageSquare size={11} />
                    WHATSAPP
                  </a>
                </div>
              </div>

              {/* Raw customer inquiries content panel */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-ink/45 uppercase tracking-widest block font-bold">CLIENT BRIEF</span>
                <div className="bg-amber-50/20 border border-brand/5 rounded-2xl p-5 shadow-inner">
                  <p className="text-xs text-ink/85 leading-relaxed font-sans font-light whitespace-pre-wrap">
                    "{selectedLead.details}"
                  </p>
                </div>
              </div>

              {/* CRM interaction timeline and notes */}
              <div className="space-y-4 pt-4 border-t border-ink/5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-ink/45 uppercase tracking-widest block font-bold">ACTION TIMELINE LOG</span>
                  <span className="text-[8px] font-mono text-ink/30 uppercase">
                    {(selectedLead.notes || []).length} followups
                  </span>
                </div>

                {/* Log entries */}
                <div className="space-y-3.5 max-h-52 overflow-y-auto pr-1">
                  {(selectedLead.notes || []).length === 0 ? (
                    <div className="text-center py-6 border border-dashed rounded-2xl bg-gray-50/50">
                      <p className="text-[10px] text-ink/40 font-mono">No action notes committed. Add follow-up updates below.</p>
                    </div>
                  ) : (
                    (selectedLead.notes || []).map((note: any, nIdx: number) => (
                      <div key={nIdx} className="bg-emerald-50/30 border border-emerald-100/40 rounded-xl p-3.5 space-y-2 text-xs relative">
                        <div className="flex justify-between items-center text-[9px] font-mono text-ink/40 border-b border-ink/5 pb-1">
                          <span className="text-emerald-700 font-semibold uppercase">Follow-up Log #{nIdx + 1}</span>
                          <span>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-ink/80 text-xs text-left leading-relaxed">{note.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Submitting followup log */}
                <div className="space-y-2 border-t pt-4">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-ink/45 block font-bold text-left">
                    Log new dynamic update
                  </label>
                  <div className="flex gap-2">
                    <textarea
                      placeholder="e.g. Discussed seaside villa master bathroom with client. Scheduling drone photography of site on Diani Beach."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      rows={2}
                      className="flex-1 p-3 bg-gray-50 border rounded-2xl text-xs focus:outline-none focus:border-brand resize-none leading-relaxed font-sans placeholder-ink/30"
                    />
                  </div>
                  <button
                    onClick={() => handleAddNote(selectedLead.id, selectedLead.notes)}
                    disabled={!newNoteText.trim()}
                    className="w-full bg-[#A83F1B] hover:bg-[#8D3212] text-white py-2.5 rounded-xl font-mono text-[9px] uppercase tracking-widest font-bold transition-all disabled:opacity-40 select-none shadow-xs text-center cursor-pointer"
                  >
                    COMMIT WORK LOG NOTE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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

function CMSTab({ content, updateContent }: any) {
  const [formData, setFormData] = useState({
    ...content,
    reviews: content.reviews || [],
    announcementActive: content.announcementActive ?? false,
    announcementText: content.announcementText ?? '',
    announcementLink: content.announcementLink ?? ''
  });

  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('');

  const handleSave = async () => {
    try {
      await updateContent(formData);
      alert('Congratulations! Wamled Atelier website content and configuration have been successfully published live.');
    } catch (e) {
      console.error(e);
      alert('Failed to save website changes. Please verify database rules.');
    }
  };

  const handleAddReview = () => {
    if (!newReviewText.trim() || !newReviewAuthor.trim()) {
      alert('Review text and author are required.');
      return;
    }
    const added = {
      text: newReviewText,
      author: newReviewAuthor,
      location: newReviewLocation || 'Verified Client',
      rating: 5
    };
    setFormData(prev => ({
      ...prev,
      reviews: [...(prev.reviews || []), added]
    }));
    setNewReviewText('');
    setNewReviewAuthor('');
    setNewReviewLocation('');
  };

  const handleRemoveReview = (index: number) => {
    setFormData(prev => ({
      ...prev,
      reviews: (prev.reviews || []).filter((_: any, idx: number) => idx !== index)
    }));
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-3xl border shadow-sm space-y-12">
      {/* Hero Section */}
      <div className="space-y-6 text-left">
        <h3 className="text-xl font-bold serif border-b pb-4 flex items-center gap-3 text-ink">
          <LayoutDashboard size={20} className="text-brand" />
          Hero Branding Section
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Headline Introduction</label>
              <textarea 
                value={formData.heroHeadline}
                onChange={e => setFormData({ ...formData, heroHeadline: e.target.value })}
                rows={3}
                className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand transition-all font-serif text-lg leading-relaxed text-ink"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Hero Image URL</label>
              <input 
                value={formData.heroImage}
                onChange={e => setFormData({ ...formData, heroImage: e.target.value })}
                className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand font-mono text-xs text-ink/75"
              />
              <div className="mt-4 aspect-video rounded-2xl overflow-hidden border">
                <img src={formData.heroImage} className="w-full h-full object-cover" alt="Current visual layout backdrop placeholder" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Studio Announcement Banner */}
      <div className="space-y-6 text-left border-t pt-8">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-xl font-bold serif flex items-center gap-3 text-ink">
            <AlertCircle size={20} className="text-brand" />
            Global Studio Announcement Banner
          </h3>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={formData.announcementActive}
              onChange={e => setFormData({ ...formData, announcementActive: e.target.checked })}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            <span className="ml-3 text-xs font-mono font-bold tracking-widest text-ink/65 uppercase">
              {formData.announcementActive ? 'ACTIVE LIVE' : 'DISABLED'}
            </span>
          </label>
        </div>

        <div className="bg-[#F9F9F7] p-5 rounded-3xl border border-ink/5 space-y-4">
          <span className="text-[8px] font-mono tracking-widest text-ink/40 uppercase font-black block">Live Header Preview</span>
          {formData.announcementActive ? (
            <div className="bg-[#A83F1B] text-white py-2 px-4 text-center text-[10px] font-mono tracking-widest uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-sm truncate">
              <span className="font-semibold">{formData.announcementText || 'Your announcement message shows here'}</span>
              {formData.announcementLink && <span className="underline font-bold text-[#E5C384]">EXPLORE</span>}
            </div>
          ) : (
            <div className="bg-gray-100 text-ink/30 py-4 text-center text-[10px] font-mono tracking-widest uppercase rounded-xl border border-dashed border-ink/10">
              Banner announcement alert is deactivated. Toggle on to alert prospective clients.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Announcement Text</label>
            <input 
              type="text"
              placeholder="e.g. Booking private resort interior slots for the Coastal Dry Season. Limited entries remaining."
              value={formData.announcementText}
              onChange={e => setFormData({ ...formData, announcementText: e.target.value })}
              className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand text-xs text-ink placeholder-ink/20"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Action Redirect Link</label>
            <input 
              type="text"
              placeholder="e.g. /contact, /services, /#reviews"
              value={formData.announcementLink}
              onChange={e => setFormData({ ...formData, announcementLink: e.target.value })}
              className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand text-xs text-ink placeholder-ink/20 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Testimonials slider curation */}
      <div className="space-y-6 text-left border-t pt-8">
        <h3 className="text-xl font-bold serif border-b pb-4 flex items-center gap-3 text-ink">
          <Star size={20} className="text-brand" />
          Live Testimonial Slider curator
        </h3>

        {/* Reviews List */}
        <div className="space-y-4">
          <span className="text-[9px] font-mono tracking-widest uppercase text-ink/40 font-bold block">Currently published slides</span>
          <div className="grid md:grid-cols-2 gap-4">
            {(formData.reviews || []).map((rev: any, rIdx: number) => (
              <div key={rIdx} className="p-5 border bg-gray-50/50 rounded-2xl flex flex-col justify-between items-start space-y-4 text-xs group relative">
                <div>
                  <div className="flex gap-1 text-brand mb-2">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} size={11} className="fill-brand text-brand" />
                    ))}
                  </div>
                  <p className="font-sans italic leading-relaxed text-ink/75">"{rev.text}"</p>
                </div>
                <div className="flex justify-between items-center w-full pt-2 border-t border-ink/5">
                  <div className="text-left font-mono">
                    <span className="font-extrabold text-[#121212] block uppercase text-[9px]">{rev.author}</span>
                    <span className="text-ink/40 text-[8px] tracking-wider block">{rev.location || 'Verified Client'}</span>
                  </div>
                  <button 
                    onClick={() => handleRemoveReview(rIdx)}
                    title="Purge slider item"
                    className="p-1.5 text-red-500 hover:text-white bg-red-50 hover:bg-red-500 border border-red-100 hover:border-red-500 rounded-lg transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Append review sub-panel */}
        <div className="p-6 bg-[#F9F9F7] border rounded-3xl space-y-4">
          <span className="text-[9px] font-mono tracking-widest text-[#A83F1B] uppercase font-bold block">Append Live Bespoke Testimonial Slide</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-ink/40">Reviewer Author Name</label>
              <input 
                type="text" 
                placeholder="CEO, Coastal Estates development"
                value={newReviewAuthor}
                onChange={e => setNewReviewAuthor(e.target.value)}
                className="w-full p-3 bg-white border rounded-xl focus:outline-none focus:border-brand text-xs text-ink"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-ink/40">Role or Subtitle Location</label>
              <input 
                type="text" 
                placeholder="Nairobi Executive Penthouse"
                value={newReviewLocation}
                onChange={e => setNewReviewLocation(e.target.value)}
                className="w-full p-3 bg-white border rounded-xl focus:outline-none focus:border-brand text-xs text-ink"
              />
            </div>
          </div>
          <div className="space-y-1 text-left">
            <label className="text-[9px] font-bold uppercase tracking-widest text-ink/40">Endorsement Review Text Quote</label>
            <textarea 
              rows={3}
              placeholder="Wamled Atelier managed our oceanfront layout with impeccable precision. The coastal daylight blends flawlessly into the stone interiors."
              value={newReviewText}
              onChange={e => setNewReviewText(e.target.value)}
              className="w-full p-3 bg-white border rounded-xl focus:outline-none focus:border-brand text-xs text-ink leading-relaxed"
            />
          </div>
          <button
            onClick={handleAddReview}
            className="w-full sm:w-auto px-6 py-2.5 bg-ink text-white hover:bg-brand font-mono text-[9px] tracking-widest uppercase font-bold rounded-xl transition-all cursor-pointer"
          >
            APPEND SLIDE TESTIMONIAL
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-6 text-left border-t pt-8">
        <h3 className="text-xl font-bold serif border-b pb-4 flex items-center gap-3 text-ink">
          <Phone size={20} className="text-brand" />
          Atelier Location & Contact Global Specs
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Studio Phone</label>
            <input 
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand text-sm text-ink font-semibold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Nairobi & Nakuru Location spec</label>
            <input 
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand text-sm text-ink"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Opening Hours</label>
            <input 
              value={formData.hours}
              onChange={e => setFormData({ ...formData, hours: e.target.value })}
              className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand text-sm text-ink"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8 border-t">
        <button 
          onClick={handleSave}
          className="bg-brand text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand/90 transition-all shadow-xl shadow-brand/20 cursor-pointer text-xs uppercase tracking-widest"
        >
          <Save size={18} />
          Deploy All CMS Updates Live
        </button>
      </div>
    </div>
  );
}

function PortfolioTab() {
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Residential');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (s) => setPortfolioItems(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;
    setIsAdding(true);
    try {
      await addDoc(collection(db, 'portfolio'), {
        title,
        category,
        imageUrl,
        location,
        description,
        createdAt: new Date().toISOString()
      });
      setTitle('');
      setImageUrl('');
      setLocation('');
      setDescription('');
    } catch (e) {
      console.error("Error creating portfolio item:", e);
    }
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this portfolio item?")) {
      try {
        await deleteDoc(doc(db, 'portfolio', id));
      } catch (e) {
        console.error("Error deleting portfolio item:", e);
      }
    }
  };

  return (
    <div className="space-y-12 text-left">
      {/* Create form */}
      <div className="bg-white p-8 lg:p-10 rounded-3xl border shadow-sm">
        <h3 className="text-xl font-bold serif border-b pb-4 flex items-center gap-2 mb-6 text-left">
          <Plus size={20} className="text-brand" />
          Add Live Portfolio Item
        </h3>
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Project Name</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Symmetrical Nyali Pavilion" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Category</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand cursor-pointer"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Yacht & Exterior">Yacht & Exterior</option>
                <option value="Landscaping">Landscaping</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Image URL</label>
              <input 
                required
                type="text" 
                placeholder="https://images.unsplash.com/photo-..." 
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Location (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. Kilimani, Nairobi" 
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Story & Description</label>
            <textarea 
              required
              rows={3}
              placeholder="Detail the materials, architectural spatial flow, and structural choices..." 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand resize-none"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              disabled={isAdding}
              className="bg-brand text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand/90 transition-all shadow-xl shadow-brand/10 disabled:opacity-50 cursor-pointer"
            >
              <Plus size={18} />
              {isAdding ? 'Adding Project...' : 'Add Live Project'}
            </button>
          </div>
        </form>
      </div>

      {/* Portfolio Items list */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden text-left">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold serif">Live Portfolio Library ({portfolioItems.length})</h3>
        </div>
        {portfolioItems.length === 0 ? (
          <div className="py-20 text-center text-ink/40">
            <ImageIcon className="mx-auto mb-4 opacity-50 text-brand" size={36} />
            <p className="text-sm">No items uploaded yet. Start adding items above!</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">Project Layout</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">Details & Story</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolioItems.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-6 flex items-center gap-4">
                    <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover border bg-gray-150" />
                    <div>
                      <h4 className="font-bold text-sm text-ink">{item.title}</h4>
                      {item.location && <p className="text-[10px] font-mono text-ink/40">📍 {item.location}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-xs font-mono uppercase font-bold text-brand">
                    {item.category}
                  </td>
                  <td className="px-6 py-6 text-xs text-ink/65 max-w-xs truncate">
                    {item.description}
                  </td>
                  <td className="px-6 py-6">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all rounded-lg cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function CaseStudiesTab() {
  const [studies, setStudies] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [projectType, setProjectType] = useState('Residential');
  const [sqFt, setSqFt] = useState('');
  const [vision, setVision] = useState('');
  const [textures, setTextures] = useState('');
  const [swatches, setSwatches] = useState('');
  const [rawMaterials, setRawMaterials] = useState('');
  const [challenge, setChallenge] = useState('');
  const [blueprintUrl, setBlueprintUrl] = useState('');
  const [renderUrl, setRenderUrl] = useState('');
  const [finalPhotoUrl, setFinalPhotoUrl] = useState('');
  const [materialSpotlightDesc, setMaterialSpotlightDesc] = useState('');
  const [materialSpotlightUrl, setMaterialSpotlightUrl] = useState('');
  const [galleryUrls, setGalleryUrls] = useState('');
  const [galleryAnnotations, setGalleryAnnotations] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [testimonialAuthor, setTestimonialAuthor] = useState('');
  const [outcome, setOutcome] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'casestudies'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setStudies(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !vision || !finalPhotoUrl) {
      alert("Project Title, Vision, and Final Photo URL are required.");
      return;
    }
    setIsAdding(true);
    try {
      await addDoc(collection(db, 'casestudies'), {
        title,
        location,
        projectType,
        sqFt,
        vision,
        textures,
        swatches: swatches || '#111111, #A83F1B',
        rawMaterials,
        challenge,
        blueprintUrl: blueprintUrl || 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&q=80&w=800',
        renderUrl: renderUrl || kenyanHouseLandscapeImg,
        finalPhotoUrl,
        materialSpotlightDesc,
        materialSpotlightUrl,
        galleryUrls,
        galleryAnnotations,
        testimonial,
        testimonialAuthor,
        outcome,
        createdAt: new Date().toISOString()
      });
      
      // Clear all
      setTitle('');
      setLocation('');
      setSqFt('');
      setVision('');
      setTextures('');
      setSwatches('');
      setRawMaterials('');
      setChallenge('');
      setBlueprintUrl('');
      setRenderUrl('');
      setFinalPhotoUrl('');
      setMaterialSpotlightDesc('');
      setMaterialSpotlightUrl('');
      setGalleryUrls('');
      setGalleryAnnotations('');
      setTestimonial('');
      setTestimonialAuthor('');
      setOutcome('');
      alert("Premium Case Study recorded live successfully!");
    } catch (err) {
      console.error("Error creating case study:", err);
      alert("Error saving case study. Check console.");
    }
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this case study?")) {
      try {
        await deleteDoc(doc(db, 'casestudies', id));
      } catch (err) {
        console.error("Error deleting case study:", err);
      }
    }
  };

  return (
    <div className="space-y-12 text-left">
      <div className="bg-white p-8 lg:p-10 rounded-3xl border shadow-sm">
        <h3 className="text-xl font-bold serif border-b pb-4 flex items-center gap-2 mb-6 text-left">
          <BookOpen size={20} className="text-brand" />
          Compile Premium Case Study Narrative
        </h3>
        <p className="text-xs text-ink/50 mb-8 -mt-4 leading-relaxed max-w-2xl">
          Craft elite visual narratives that justify uncompromised pricing. Provide editorial hooks, 3D journey files, macro shot specifications, and client testimonials.
        </p>

        <form onSubmit={handleCreate} className="space-y-8">
          
          {/* 1. EDITORIAL HOOK */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-brand font-bold border-b pb-1">1. The Editorial Hook (Headline & Vision)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Aspirational Headline Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. The Minimalist Sanctuary: A Study in Light and Texture" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Project Type</label>
                <select 
                  value={projectType}
                  onChange={e => setProjectType(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand cursor-pointer"
                >
                  <option value="Residential">Residential Atelier</option>
                  <option value="Commercial">Commercial & Hospitality</option>
                  <option value="Yacht & Exterior">Curated Yacht & Exterior</option>
                  <option value="Landscaping">Bespoke Landscaping</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Nairobi or Nakuru Studio Area</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Kilimani, Nairobi" 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Square Footage / Dimensions</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. 4,200 SQFT" 
                  value={sqFt}
                  onChange={e => setSqFt(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">The Vision (2-3 Sentences atmosphere brief)</label>
              <textarea 
                required
                rows={2}
                placeholder="Describe the atmosphere objectives and the spatial brief intended to create..." 
                value={vision}
                onChange={e => setVision(e.target.value)}
                className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand resize-none"
              />
            </div>
          </div>

          {/* 2. THE CONCEPT */}
          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-brand font-bold border-b pb-1">2. Narrative Concept & Obstacles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Tactile Textures (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Laccate Wood, Honed Travertine, Hand-applied microcement" 
                  value={textures}
                  onChange={e => setTextures(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Raw Materials (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Brushed Brass, Solid Iroko Timber, Calacatta Viola Marble" 
                  value={rawMaterials}
                  onChange={e => setRawMaterials(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Palette Color Swatches (hexes, comma-separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. #1A1A1A, #A83F1B, #C2121D, #FBFBF9" 
                  value={swatches}
                  onChange={e => setSwatches(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">The Critical Challenge / Problem Met</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Maximizing natural light in a north-facing coastal room without gaining equatorial heat." 
                  value={challenge}
                  onChange={e => setChallenge(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
                />
              </div>
            </div>
          </div>

          {/* 3. TECHNICAL JOURNEY */}
          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-brand font-bold border-b pb-1">3. The 3D Journey & Material Spotlights</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">2D Blueprint Image URL</label>
                <input 
                  type="text" 
                  placeholder="https://images.unsplash.com/..." 
                  value={blueprintUrl}
                  onChange={e => setBlueprintUrl(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">3D Render Image URL</label>
                <input 
                  type="text" 
                  placeholder="https://images.unsplash.com/..." 
                  value={renderUrl}
                  onChange={e => setRenderUrl(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Final Realized Photo URL</label>
                <input 
                  required
                  type="text" 
                  placeholder="https://images.unsplash.com/..." 
                  value={finalPhotoUrl}
                  onChange={e => setFinalPhotoUrl(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Material Spotlight Detail (Macro description)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sourcing Calacatta Viola slabs with matched veins for continuous zero-seam bathroom backdrops." 
                  value={materialSpotlightDesc}
                  onChange={e => setMaterialSpotlightDesc(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Material Spotlight Macro Image URL</label>
                <input 
                  type="text" 
                  placeholder="https://images.unsplash.com/..." 
                  value={materialSpotlightUrl}
                  onChange={e => setMaterialSpotlightUrl(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* 4. HERO GALLERY */}
          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-brand font-bold border-b pb-1">4. Hero Portrait Gallery with Micro-Annotations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">9:16 Vertical Photo URLs (comma-separated)</label>
                <textarea 
                  rows={2}
                  placeholder="https://images.unsplash.com/1, https://images.unsplash.com/2" 
                  value={galleryUrls}
                  onChange={e => setGalleryUrls(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand resize-none text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Micro-Annotations for each photo (separated by commas)</label>
                <textarea 
                  rows={2}
                  placeholder="Custom integrated solid oak ceiling grids, Precision-aligned invisible lighting paths" 
                  value={galleryAnnotations}
                  onChange={e => setGalleryAnnotations(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand resize-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* 5. TS LIMIT OUTCOME */}
          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-brand font-bold border-b pb-1">5. Social Proof & Outcome Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Client Testimonial Quote (One powerful sentence)</label>
                <input 
                  type="text" 
                  placeholder="e.g. The finished residence is a quiet sanctuary. Moving from space to space feels like a physical decompression." 
                  value={testimonial}
                  onChange={e => setTestimonial(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Client Author / Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Elena Safaricom Elite, Diani Coast" 
                  value={testimonialAuthor}
                  onChange={e => setTestimonialAuthor(e.target.value)}
                  className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#121212]/40">Ameasurable Outcome</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Successfully achieved seamless indoor flow, dropping average indoor thermal temperature by 4.5°C without HVAC usage." 
                value={outcome}
                onChange={e => setOutcome(e.target.value)}
                className="w-full p-4 bg-gray-50 border rounded-2xl focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button 
              type="submit"
              disabled={isAdding}
              className="bg-brand text-white px-10 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand/90 transition-all shadow-xl shadow-brand/10 disabled:opacity-50 cursor-pointer text-xs"
            >
              <Plus size={18} />
              {isAdding ? 'Recording Case Study Narrative...' : 'Publish Premium Case Study Line'}
            </button>
          </div>

        </form>
      </div>

      {/* Case studies database list */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden text-left">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold serif">Live Case Studies Library ({studies.length})</h3>
        </div>
        {studies.length === 0 ? (
          <div className="py-20 text-center text-ink/40">
            <BookOpen className="mx-auto mb-4 opacity-50 text-brand" size={36} />
            <p className="text-sm">No premium case narratives recorded yet. Begin using the editor above!</p>
          </div>
        ) : (
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">Case Study Profile</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">Classification & Scale</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">Outcome Statement</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studies.map(study => (
                <tr key={study.id} className="border-b hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-6 flex items-center gap-4">
                    <img src={study.finalPhotoUrl} alt="" className="w-16 h-12 rounded-lg object-cover border bg-gray-150" />
                    <div>
                      <h4 className="font-bold text-sm text-ink">{study.title}</h4>
                      <p className="text-[10px] font-mono text-ink/40">📍 {study.location}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-mono uppercase font-bold text-brand block">{study.projectType}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{study.sqFt}</span>
                  </td>
                  <td className="px-6 py-6 text-xs text-ink/65 max-w-xs truncate">
                    {study.outcome}
                  </td>
                  <td className="px-6 py-6">
                    <button 
                      onClick={() => handleDelete(study.id)}
                      className="p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all rounded-lg cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


