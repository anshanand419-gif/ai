import React from 'react';
import { 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  Languages, 
  Scissors, 
  Megaphone, 
  Subtitles, 
  FolderHeart, 
  CreditCard, 
  Zap, 
  Compass, 
  LayoutDashboard,
  Menu,
  X,
  Crown,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ToolType, UserProfile } from '../types';

interface NavigationProps {
  currentTab: ToolType;
  onSelectTab: (tab: ToolType) => void;
  user: UserProfile;
  isLandingView: boolean;
  onToggleLandingView: (isLanding: boolean) => void;
  onOpenPricing: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  user,
  isLandingView,
  onToggleLandingView,
  onOpenPricing,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const navItems: { id: ToolType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Overview Hub', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'nano-banana', label: 'Nano Banana 4K', icon: <Zap className="w-4 h-4 text-amber-400" />, badge: '4K UHD' },
    { id: 'adobe-studio', label: 'Adobe AI Suite', icon: <Scissors className="w-4 h-4 text-rose-400" />, badge: 'Fill & SVG' },
    { id: 'pinterest', label: 'PinAI Discovery', icon: <Compass className="w-4 h-4 text-red-400" />, badge: 'Boards' },
    { id: 'vision-studio', label: 'Gemini Vision', icon: <Sparkles className="w-4 h-4 text-cyan-400" />, badge: 'Analysis' },
    { id: 'cartoon', label: 'AI Cartoon & Anime', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
    { id: 'image2video', label: 'Image to Video', icon: <Video className="w-4 h-4 text-cyan-400" /> },
    { id: 'translator', label: 'Video Translator', icon: <Languages className="w-4 h-4 text-emerald-400" />, badge: 'Lip-Sync' },
    { id: 'bgremover', label: 'Background Remover', icon: <Scissors className="w-4 h-4 text-pink-400" /> },
    { id: 'adcreator', label: 'AI Ad Creator', icon: <Megaphone className="w-4 h-4 text-amber-400" /> },
    { id: 'captions', label: 'Auto-Captions', icon: <Subtitles className="w-4 h-4 text-blue-400" /> },
    { id: 'gallery', label: 'My Creations', icon: <FolderHeart className="w-4 h-4 text-rose-400" /> },
    { id: 'pricing', label: 'Subscription & Plans', icon: <CreditCard className="w-4 h-4 text-indigo-400" /> },
    { id: 'owner', label: 'Owner Portal', icon: <ShieldCheck className="w-4 h-4 text-red-400" />, badge: 'Admin' },
  ];

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full h-16 bg-[#090a0f]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 flex items-center justify-between">
        {/* Brand Logo & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 text-slate-400 hover:text-white lg:hidden rounded-lg hover:bg-slate-800/60 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => { onToggleLandingView(false); onSelectTab('dashboard'); }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-600/30 group-hover:shadow-indigo-500/50 transition">
              <div className="w-full h-full bg-[#0d0f17] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent flex items-center gap-1.5">
                PixAI<span className="text-cyan-400 font-black">Studio</span>
              </div>
              <div className="text-[10px] text-slate-400 -mt-1 font-medium tracking-wide">Next-Gen Video Engine</div>
            </div>
          </div>
        </div>

        {/* Center Mode Switcher */}
        <div className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800/90 text-xs font-semibold">
          <button
            onClick={() => onToggleLandingView(false)}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              !isLandingView 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Studio Workspace
          </button>
          <button
            onClick={() => onToggleLandingView(true)}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              isLandingView 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Landing Showcase
          </button>
        </div>

        {/* Right User & Credits Bar */}
        <div className="flex items-center gap-2.5">
          {/* Owner Portal Trigger Button */}
          <button
            onClick={() => {
              onToggleLandingView(false);
              onSelectTab('owner');
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm ${
              currentTab === 'owner' && !isLandingView
                ? 'bg-red-600/30 border-red-500 text-white shadow-red-950/40 ring-2 ring-red-500/20'
                : 'bg-red-950/40 border-red-500/30 text-red-300 hover:bg-red-900/50 hover:text-white hover:border-red-400'
            }`}
            title="Owner Command Center"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="hidden md:inline">Owner Portal</span>
          </button>

          {/* Credits Counter */}
          <div 
            onClick={onOpenPricing}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 hover:border-indigo-400/60 rounded-xl cursor-pointer transition group shadow-sm"
            title="Click to view plans and add credits"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-400 hidden sm:inline">Credits: </span>
              <span className="font-bold text-white group-hover:text-cyan-300 transition">
                {user.credits === 999999 ? 'Unlimited' : user.credits}
              </span>
            </div>
            <button className="hidden sm:flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500 hover:bg-indigo-400 text-white ml-1 transition">
              <Zap className="w-2.5 h-2.5 mr-0.5 fill-current" /> Top Up
            </button>
          </div>

          {/* User Profile Pill */}
          <div 
            onClick={onOpenPricing}
            className="flex items-center gap-2 pl-2 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-indigo-500/40 object-cover ring-2 ring-transparent group-hover:ring-indigo-500/50 transition"
              />
              {user.isSubscribed && (
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full flex items-center justify-center text-[8px] text-black font-black">
                  <Crown className="w-2 h-2 text-black fill-current" />
                </div>
              )}
            </div>
            <div className="hidden xl:block text-left text-xs">
              <div className="font-medium text-slate-200 group-hover:text-white flex items-center gap-1">
                {user.name}
              </div>
              <div className="text-[10px] text-indigo-400 font-semibold">{user.plan}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="w-72 h-full bg-[#0d0f17] border-r border-slate-800 p-4 space-y-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-white">PixAI Studio</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Workspace
              </div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onToggleLandingView(false);
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    !isLandingView && currentTab === item.id
                      ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  onToggleLandingView(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 text-sm font-semibold text-white flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-cyan-400" /> View Landing Showcase
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
