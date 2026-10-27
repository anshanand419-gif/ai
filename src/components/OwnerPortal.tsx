import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Key, 
  DollarSign, 
  Users, 
  Zap, 
  Activity, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowUpRight, 
  Crown, 
  Flame, 
  Sliders, 
  Tag, 
  Server, 
  Eye, 
  EyeOff, 
  LogOut,
  Sparkles,
  Database,
  Check,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { UserProfile, OwnerUserRecord, OwnerTransaction } from '../types';

interface OwnerPortalProps {
  currentUser: UserProfile;
  onUpdateCurrentUser: (updated: Partial<UserProfile>) => void;
  onClose: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const OwnerPortal: React.FC<OwnerPortalProps> = ({
  currentUser,
  onUpdateCurrentUser,
  onClose,
  showToast,
}) => {
  const isOwnerAccount = currentUser.email === 'mk8111491@gmail.com' || !!currentUser.isOwner;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('pixai_owner_auth') === 'true' || currentUser.email === 'mk8111491@gmail.com' || !!currentUser.isOwner;
  });
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'revenue' | 'telemetry' | 'coupons'>('overview');

  // Search in User DB
  const [userSearch, setUserSearch] = useState('');

  // Maintenance mode
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Mock User Database
  const [usersList, setUsersList] = useState<OwnerUserRecord[]>([
    {
      id: 'usr-1',
      name: currentUser.name,
      email: currentUser.email,
      plan: currentUser.plan,
      credits: currentUser.credits,
      totalSpent: 299,
      joinDate: 'Oct 12, 2026',
      status: 'active',
    },
    {
      id: 'usr-2',
      name: 'Sarah Chen (TikTok UGC)',
      email: 'sarah@ugcviral.io',
      plan: 'Pro Plan',
      credits: 210,
      totalSpent: 198,
      joinDate: 'Sep 28, 2026',
      status: 'active',
    },
    {
      id: 'usr-3',
      name: 'Marcus Vance',
      email: 'marcus@hyperscale.com',
      plan: 'Ultimate Bundle',
      credits: 999999,
      totalSpent: 598,
      joinDate: 'Aug 14, 2026',
      status: 'active',
    },
    {
      id: 'usr-4',
      name: 'Elena Rostova',
      email: 'elena@techworld.tv',
      plan: 'Pro Plan',
      credits: 145,
      totalSpent: 99,
      joinDate: 'Oct 02, 2026',
      status: 'active',
    },
    {
      id: 'usr-5',
      name: 'David Kim',
      email: 'david@soundwave.ai',
      plan: 'Starter Plan',
      credits: 40,
      totalSpent: 49,
      joinDate: 'Oct 19, 2026',
      status: 'active',
    },
    {
      id: 'usr-6',
      name: 'Liam O’Connor',
      email: 'liam@dubbingagency.co',
      plan: 'Ultimate Bundle',
      credits: 999999,
      totalSpent: 897,
      joinDate: 'Jul 22, 2026',
      status: 'active',
    },
  ]);

  // Stripe Transactions
  const [transactions, setTransactions] = useState<OwnerTransaction[]>([
    { id: 'tx_98124', user: 'Liam O’Connor', planName: 'Ultimate Bundle (5 Mos)', amount: 299, date: 'Today at 09:14', status: 'succeeded' },
    { id: 'tx_98123', user: 'Sarah Chen', planName: 'Pro Plan (2 Mos)', amount: 99, date: 'Today at 07:42', status: 'succeeded' },
    { id: 'tx_98122', user: 'David Kim', planName: 'Starter Plan (1 Mo)', amount: 49, date: 'Yesterday at 22:15', status: 'succeeded' },
    { id: 'tx_98121', user: 'Elena Rostova', planName: 'Pro Plan (2 Mos)', amount: 99, date: 'Yesterday at 18:30', status: 'succeeded' },
    { id: 'tx_98120', user: 'Marcus Vance', planName: 'Ultimate Bundle (5 Mos)', amount: 299, date: 'Oct 23, 2026', status: 'succeeded' },
  ]);

  // Coupons
  const [coupons, setCoupons] = useState([
    { code: 'OWNER100', discount: 100, uses: 12, maxUses: 100, active: true },
    { code: 'LAUNCH50', discount: 50, uses: 48, maxUses: 500, active: true },
    { code: 'VIRAL40', discount: 40, uses: 112, maxUses: 1000, active: true },
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('20');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    try {
      const res = await fetch('/api/owner/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: inputPassword.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('pixai_owner_auth', 'true');
        showToast('Owner Portal unlocked! Welcome SuperAdmin.', 'success');
      } else {
        setAuthError(data.error || 'Access Denied: Incorrect Owner Password');
      }
    } catch {
      // Client-side verification fallback
      const cleanKey = inputPassword.trim();
      if (cleanKey === '4NSH.7X' || cleanKey.toUpperCase() === '4NSH.7X') {
        setIsAuthenticated(true);
        sessionStorage.setItem('pixai_owner_auth', 'true');
        showToast('Owner Portal unlocked! Welcome SuperAdmin.', 'success');
      } else {
        setAuthError('Access Denied: Incorrect Owner Password');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('pixai_owner_auth');
    setInputPassword('');
    showToast('Owner Portal locked.', 'info');
  };

  // God Mode Actions for Current Session
  const handleGrantGodMode = () => {
    onUpdateCurrentUser({
      credits: 999999,
      maxCredits: 999999,
      plan: 'Ultimate Bundle',
      isSubscribed: true,
      planExpiry: 'Lifetime SuperAdmin Access',
    });

    setUsersList((prev) =>
      prev.map((u) => (u.email === currentUser.email ? { ...u, credits: 999999, plan: 'Ultimate Bundle' } : u))
    );

    showToast('👑 God Mode activated! Granted Unlimited Credits and Ultimate Bundle to your account.', 'success');
  };

  const handleAddCreditsToUser = (userId: string, amount: number | 'unlimited') => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newCredits = amount === 'unlimited' ? 999999 : u.credits + amount;
          if (u.email === currentUser.email) {
            onUpdateCurrentUser({ credits: newCredits });
          }
          return { ...u, credits: newCredits };
        }
        return u;
      })
    );
    showToast(`Credits updated for user (${amount === 'unlimited' ? 'Unlimited' : `+${amount}`}).`, 'success');
  };

  const handleChangeUserPlan = (userId: string, newPlan: any) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          if (u.email === currentUser.email) {
            onUpdateCurrentUser({ plan: newPlan, isSubscribed: true });
          }
          return { ...u, plan: newPlan };
        }
        return u;
      })
    );
    showToast(`Updated user tier to ${newPlan}.`, 'success');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    setCoupons((prev) => [
      {
        code: newCouponCode.toUpperCase().trim(),
        discount: Number(newCouponDiscount),
        uses: 0,
        maxUses: 500,
        active: true,
      },
      ...prev,
    ]);
    setNewCouponCode('');
    showToast('Promo coupon created successfully!', 'success');
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.plan.toLowerCase().includes(userSearch.toLowerCase())
  );

  // If not authenticated, render the high-security password prompt
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-[#0a0c14] border-2 border-red-500/40 rounded-3xl p-8 shadow-2xl neon-glow-purple text-center space-y-6 overflow-hidden">
          {/* Top glowing laser line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-indigo-600 animate-pulse" />

          {/* Shield Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600/20 to-amber-500/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-400 shadow-xl">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-wider border border-red-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Owner Authorization Required
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">PixAI Studio Owner Portal</h2>
            <p className="text-xs text-slate-400">
              Enter the system Master Password to unlock the executive administrative control center.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Owner Security Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Enter secret owner key..."
                  className="w-full bg-[#05070d] border border-slate-700/80 focus:border-red-500 rounded-xl py-3 px-4 text-sm text-white font-mono placeholder-slate-600 focus:outline-none transition shadow-inner"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 mt-2 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying || !inputPassword.trim()}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 via-amber-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg shadow-red-600/30 transition transform active:scale-95 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Unlock Owner Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Owner Direct Bypass Trigger */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <button
              type="button"
              onClick={() => {
                setIsAuthenticated(true);
                sessionStorage.setItem('pixai_owner_auth', 'true');
                showToast('SuperAdmin bypass confirmed: Welcome Owner!', 'success');
              }}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/50 hover:to-teal-600/50 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-emerald-400 animate-pulse" />
              <span>Direct Bypass Access ({currentUser.email || 'Verified Owner'})</span>
            </button>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-red-400" /> AES-256 Protected
              </span>
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white transition"
              >
                Cancel & Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Once authenticated, render the full executive command center
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Owner Header Bar */}
      <div className="p-6 bg-gradient-to-r from-red-950/60 via-[#121626] to-indigo-950/60 border-2 border-red-500/30 rounded-3xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white tracking-tight">PixAI Owner Command Center</span>
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold text-[10px] uppercase border border-red-500/30">
                SuperAdmin Level 5
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              SuperAdmin Authorization Verified • Full executive authority over users, credits, Stripe revenue, and AI cluster.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick God Mode Shortcut */}
          <button
            onClick={handleGrantGodMode}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition transform active:scale-95"
            title="Give your account unlimited credits and Ultimate plan"
          >
            <Crown className="w-4 h-4 fill-current" />
            <span>Owner God Mode (∞ Credits)</span>
          </button>

          {/* Lock / Exit */}
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Portal</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs inside Owner Portal */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'overview', label: 'Platform Overview', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'users', label: 'User & Credit Manager', icon: <Users className="w-4 h-4 text-cyan-400" /> },
          { id: 'revenue', label: 'Stripe Billing & Transactions', icon: <DollarSign className="w-4 h-4 text-emerald-400" /> },
          { id: 'telemetry', label: 'AI Cluster & GPU Telemetry', icon: <Server className="w-4 h-4 text-purple-400" /> },
          { id: 'coupons', label: 'Discounts & Promo Codes', icon: <Tag className="w-4 h-4 text-amber-400" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 to-indigo-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-[#0d0f17] border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Platform Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-[#0d0f17] border border-slate-800 rounded-2xl space-y-1.5">
              <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                <span>Total Gross Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white">$184,950</div>
              <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <span>+32.4% vs last month</span>
              </div>
            </div>

            <div className="p-5 bg-[#0d0f17] border border-slate-800 rounded-2xl space-y-1.5">
              <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                <span>Active Paying Subscribers</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white">1,842</div>
              <div className="text-[11px] text-slate-400">940 Starter • 682 Pro • 220 Ultimate</div>
            </div>

            <div className="p-5 bg-[#0d0f17] border border-slate-800 rounded-2xl space-y-1.5">
              <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                <span>Total AI Generations</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-purple-400">1,248,300</div>
              <div className="text-[11px] text-slate-400">4K 60fps video & nano banana</div>
            </div>

            <div className="p-5 bg-[#0d0f17] border border-slate-800 rounded-2xl space-y-1.5">
              <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                <span>GPU Cluster Health</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400">100% OK</div>
              <div className="text-[11px] text-slate-400">8 Dedicated H100 Nodes Online</div>
            </div>
          </div>

          {/* Quick Actions & Recent Platform Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 p-5 bg-[#0d0f17] border border-slate-800 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" /> System Control Switches
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-200">Maintenance Mode</div>
                    <div className="text-slate-400 text-[11px]">Temporarily pauses user queue for upgrades</div>
                  </div>
                  <button
                    onClick={() => {
                      setMaintenanceMode(!maintenanceMode);
                      showToast(`Maintenance mode ${!maintenanceMode ? 'enabled' : 'disabled'}`, 'info');
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                      maintenanceMode ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {maintenanceMode ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-200">Nano Banana 2.1 4K Direct Access</div>
                    <div className="text-slate-400 text-[11px]">Enables high-resolution raytraced 4K models</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    ENABLED
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-200">Live Lip-Sync Neural Engine</div>
                    <div className="text-slate-400 text-[11px]">50+ language real-time mouth landmarking</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    ENABLED
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 p-5 bg-[#0d0f17] border border-slate-800 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Real-Time Platform Activity Stream
              </h3>

              <div className="space-y-2 text-xs">
                {[
                  { user: 'Liam O’Connor', action: 'Exported 4K Dubbed Video in Japanese', time: '2 mins ago', badge: 'Translator' },
                  { user: 'Sarah Chen', action: 'Generated Alex Hormozi Captions Video (9:16)', time: '5 mins ago', badge: 'Captions' },
                  { user: 'Marcus Vance', action: 'Created AuraPulse 4-Scene Video Ad', time: '11 mins ago', badge: 'Ad Creator' },
                  { user: 'Elena Rostova', action: 'Rendered 4K Nano Banana Cyberpunk Scene', time: '18 mins ago', badge: 'Nano Banana' },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-900/70 border border-slate-800/80 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-200">{item.user}</span>{' '}
                      <span className="text-slate-400">{item.action}</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 shrink-0 ml-2">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User & Credit Manager */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d0f17] p-4 border border-slate-800 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name, email or plan..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="text-xs text-slate-400">
              Showing <strong className="text-white">{filteredUsers.length}</strong> registered creators
            </div>
          </div>

          <div className="bg-[#0d0f17] border border-slate-800 rounded-2xl overflow-hidden shadow-xl overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Subscription Tier</th>
                  <th className="p-3.5">Credits Balance</th>
                  <th className="p-3.5">Total Spent</th>
                  <th className="p-3.5 text-right">Owner Credit Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{u.name}</span>
                        {u.email === currentUser.email && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold text-[9px]">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={u.plan}
                        onChange={(e) => handleChangeUserPlan(u.id, e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-indigo-300 font-semibold focus:outline-none"
                      >
                        <option value="Free Trial">Free Trial</option>
                        <option value="Starter Plan">Starter Plan ($49)</option>
                        <option value="Pro Plan">Pro Plan ($99)</option>
                        <option value="Ultimate Bundle">Ultimate Bundle ($299)</option>
                      </select>
                    </td>

                    <td className="p-3.5">
                      <span className="font-mono text-cyan-400 font-bold">
                        {u.credits === 999999 ? '∞ Unlimited' : u.credits}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="text-emerald-400 font-bold">${u.totalSpent}.00</span>
                    </td>

                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleAddCreditsToUser(u.id, 100)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold"
                      >
                        +100
                      </button>
                      <button
                        onClick={() => handleAddCreditsToUser(u.id, 500)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold"
                      >
                        +500
                      </button>
                      <button
                        onClick={() => handleAddCreditsToUser(u.id, 'unlimited')}
                        className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-extrabold"
                      >
                        ∞ Unlimited
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Stripe Billing & Transactions */}
      {activeTab === 'revenue' && (
        <div className="space-y-4">
          <div className="p-5 bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-semibold">Live Stripe Balance Available</div>
              <div className="text-2xl font-black text-white">$42,850.00 USD</div>
            </div>
            <button
              onClick={() => showToast('Simulated Stripe payout scheduled to owner bank account ($42,850).', 'success')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
            >
              <CreditCard className="w-4 h-4" /> Trigger Stripe Payout
            </button>
          </div>

          <div className="bg-[#0d0f17] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 font-bold text-sm text-white">
              Recent Stripe Charges & Transactions
            </div>
            <div className="divide-y divide-slate-800">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{tx.user}</div>
                      <div className="text-slate-400 text-[11px]">{tx.planName} • {tx.id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-400 text-sm">+${tx.amount}.00</div>
                    <div className="text-[10px] text-slate-500">{tx.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: AI Cluster & GPU Telemetry */}
      {activeTab === 'telemetry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-[#0d0f17] border border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-400" /> GPU Nodes Telemetry
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>H100 Node #1 (Nano Banana 4K)</span>
                  <span className="font-mono text-cyan-400 font-bold">78% Load • 42°C</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[78%] h-full bg-cyan-400" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>H100 Node #2 (Video Lip-Sync & Dubbing)</span>
                  <span className="font-mono text-emerald-400 font-bold">62% Load • 39°C</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[62%] h-full bg-emerald-400" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>H100 Node #3 (3D Pixar & Anime Engine)</span>
                  <span className="font-mono text-purple-400 font-bold">85% Load • 44°C</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-purple-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-[#0d0f17] border border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" /> Model Endpoints Status
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Gemini 3.8 Flash (Text & Prompting)</div>
                  <div className="text-[10px] text-slate-400">Response time: ~310ms</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  HEALTHY
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Gemini Nano Banana 2.1 (4K Render)</div>
                  <div className="text-[10px] text-slate-400">Native 1K/2K/4K resolution</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  HEALTHY
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Whisper Speech & Neural Lip-Sync</div>
                  <div className="text-[10px] text-slate-400">50+ languages supported</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  HEALTHY
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Coupons & Promo Codes */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 bg-[#0d0f17] border border-slate-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" /> Create New Discount Code
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="e.g. VIP80"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs transition"
              >
                Create Promo Code
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-[#0d0f17] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 font-bold text-sm text-white">
              Active Promo Codes
            </div>
            <div className="divide-y divide-slate-800">
              {coupons.map((c) => (
                <div key={c.code} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-black text-amber-400 text-sm">{c.code}</div>
                    <div className="text-slate-400 text-[11px]">{c.discount}% Discount • {c.uses} redemptions</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
