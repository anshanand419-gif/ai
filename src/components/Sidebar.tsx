import React from 'react';
import { 
  Sparkles, 
  Video, 
  Languages, 
  Scissors, 
  Megaphone, 
  Subtitles, 
  FolderHeart, 
  CreditCard, 
  LayoutDashboard,
  Zap,
  Flame,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { ToolType, UserProfile } from '../types';

interface SidebarProps {
  currentTab: ToolType;
  onSelectTab: (tab: ToolType) => void;
  user: UserProfile;
  onOpenPricing: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenPricing,
}) => {
  const tools: { id: ToolType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Overview Hub', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'nano-banana', label: 'Nano Banana 4K', icon: <Zap className="w-4 h-4 text-amber-400" />, badge: '4K' },
    { id: 'adobe-studio', label: 'Adobe AI Suite', icon: <Scissors className="w-4 h-4 text-rose-400" />, badge: 'Firefly' },
    { id: 'pinterest', label: 'PinAI Discovery', icon: <Flame className="w-4 h-4 text-red-400" />, badge: 'Boards' },
    { id: 'vision-studio', label: 'Gemini Vision', icon: <Sparkles className="w-4 h-4 text-cyan-400" />, badge: 'AI Scan' },
    { id: 'cartoon', label: 'AI Cartoon & Anime', icon: <Sparkles className="w-4 h-4 text-purple-400" />, badge: 'HOT' },
    { id: 'image2video', label: 'Image to Video', icon: <Video className="w-4 h-4 text-cyan-400" /> },
    { id: 'translator', label: 'Video Translator', icon: <Languages className="w-4 h-4 text-emerald-400" /> },
    { id: 'bgremover', label: 'Background Remover', icon: <Scissors className="w-4 h-4 text-pink-400" /> },
    { id: 'adcreator', label: 'AI Ad Creator', icon: <Megaphone className="w-4 h-4 text-amber-400" /> },
    { id: 'captions', label: 'Auto-Captions', icon: <Subtitles className="w-4 h-4 text-blue-400" /> },
    { id: 'gallery', label: 'My Creations', icon: <FolderHeart className="w-4 h-4 text-rose-400" /> },
    { id: 'pricing', label: 'Billing & Plans', icon: <CreditCard className="w-4 h-4 text-indigo-400" /> },
    { id: 'owner', label: 'Owner Portal', icon: <ShieldCheck className="w-4 h-4 text-red-400" />, badge: 'Admin' },
  ];

  const creditPercentage = user.credits === 999999 ? 100 : Math.min(100, Math.round((user.credits / user.maxCredits) * 100));

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0a0c13] border-r border-slate-800/80 p-4 shrink-0 h-[calc(100vh-4rem)] sticky top-16 justify-between">
      <div className="space-y-6">
        {/* Workspace Title */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
            <span>AI Studio Tools</span>
            <span className="text-[10px] text-cyan-400 font-medium">v2.5 Turbo</span>
          </div>

          <div className="space-y-1">
            {tools.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group transform hover:translate-x-1 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 via-indigo-600/20 to-transparent text-white border-l-4 border-indigo-500 shadow-sm shadow-indigo-950/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={`p-1.5 rounded-lg transition-transform duration-200 group-hover:scale-110 ${isActive ? 'bg-indigo-600/40 text-white' : 'bg-slate-900 text-slate-400 group-hover:text-white'}`}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider transition-all duration-200 group-hover:scale-105 ${
                      item.badge === 'HOT'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : item.badge === 'Admin'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Subscription & Quota Card */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        <div className="p-3.5 bg-gradient-to-b from-[#121626] to-[#0c0e18] rounded-xl border border-indigo-500/20 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-white">{user.plan}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
              Active
            </span>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
              <span>Credits Available</span>
              <span className="font-bold text-white">
                {user.credits === 999999 ? '∞ Unlimited' : `${user.credits} / ${user.maxCredits}`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${creditPercentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={onOpenPricing}
            className="w-full py-2 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition transform active:scale-[0.98]"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
            <span>Upgrade to Pro / Bundle</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-indigo-200" />
          </button>
        </div>

        <div className="px-2 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Stripe Protected</span>
          <span className="text-slate-400">PixAI v2.5</span>
        </div>
      </div>
    </aside>
  );
};
