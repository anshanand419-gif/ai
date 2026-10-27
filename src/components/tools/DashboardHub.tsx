import React from 'react';
import { 
  Sparkles, 
  Video, 
  Languages, 
  Scissors, 
  Megaphone, 
  Subtitles, 
  Zap, 
  Flame, 
  ArrowRight, 
  Crown, 
  Clock, 
  Play, 
  FolderHeart,
  ShieldCheck
} from 'lucide-react';
import { ToolType, UserProfile, GeneratedAsset } from '../../types';

interface DashboardHubProps {
  onSelectTab: (tab: ToolType) => void;
  user: UserProfile;
  assets: GeneratedAsset[];
  onOpenPricing: () => void;
}

export const DashboardHub: React.FC<DashboardHubProps> = ({
  onSelectTab,
  user,
  assets,
  onOpenPricing,
}) => {
  const toolCards = [
    {
      id: 'nano-banana' as ToolType,
      title: 'Gemini Nano Banana 2.1',
      desc: 'Native 1K/2K/4K ultra-high resolution image generation with panoramic aspect ratios.',
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      color: 'from-amber-600/20 via-amber-600/5 to-transparent',
      borderColor: 'group-hover:border-amber-500/50',
      badge: '4K Ultra',
      credits: '5 Credits',
    },
    {
      id: 'adobe-studio' as ToolType,
      title: 'Adobe AI Firefly Suite',
      desc: 'Generative Fill inpainting brush, Generative Expand outpainting, 3D text and vectorizer.',
      icon: <Scissors className="w-6 h-6 text-rose-400" />,
      color: 'from-rose-600/20 via-rose-600/5 to-transparent',
      borderColor: 'group-hover:border-rose-500/50',
      badge: 'Firefly AI',
      credits: '4 Credits',
    },
    {
      id: 'pinterest' as ToolType,
      title: 'PinAI Visual Discovery',
      desc: 'Pinterest-style moodboard feed, save pins, visual search, and 1-click prompt remixing.',
      icon: <Flame className="w-6 h-6 text-red-400" />,
      color: 'from-red-600/20 via-red-600/5 to-transparent',
      borderColor: 'group-hover:border-red-500/50',
      badge: 'Moodboards',
      credits: 'Free Browse',
    },
    {
      id: 'vision-studio' as ToolType,
      title: 'Gemini Vision Analyzer',
      desc: 'Multi-modal cinematography analysis, hex color palette extraction, and reverse prompting.',
      icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
      color: 'from-cyan-600/20 via-cyan-600/5 to-transparent',
      borderColor: 'group-hover:border-cyan-500/50',
      badge: 'Multimodal',
      credits: '3 Credits',
    },
    {
      id: 'cartoon' as ToolType,
      title: 'AI Cartoon & Anime',
      desc: '3D Pixar, Shinkai Anime, Disney & Comic book animations from text prompts.',
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      color: 'from-purple-600/20 via-purple-600/5 to-transparent',
      borderColor: 'group-hover:border-purple-500/50',
      badge: 'Popular',
      credits: '5 Credits',
    },
    {
      id: 'image2video' as ToolType,
      title: 'Image to Video Motion',
      desc: 'Animate still photos with drone shots, orbits, zooms, and cinematic physics.',
      icon: <Video className="w-6 h-6 text-cyan-400" />,
      color: 'from-cyan-600/20 via-cyan-600/5 to-transparent',
      borderColor: 'group-hover:border-cyan-500/50',
      badge: '60 FPS',
      credits: '6 Credits',
    },
    {
      id: 'translator' as ToolType,
      title: 'Video Translator & Lip-Sync',
      desc: 'Dub any video into 50+ languages with vocal cloning and mouth landmark alignment.',
      icon: <Languages className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-600/20 via-emerald-600/5 to-transparent',
      borderColor: 'group-hover:border-emerald-500/50',
      badge: 'Lip-Sync',
      credits: '8 Credits',
    },
    {
      id: 'bgremover' as ToolType,
      title: '1-Click Background Remover',
      desc: 'Instant green screen cutout, hair matting, and AI luxury studio replacements.',
      icon: <Scissors className="w-6 h-6 text-pink-400" />,
      color: 'from-pink-600/20 via-pink-600/5 to-transparent',
      borderColor: 'group-hover:border-pink-500/50',
      badge: 'Instant',
      credits: '3 Credits',
    },
    {
      id: 'adcreator' as ToolType,
      title: 'AI Ad Creator & Copy',
      desc: 'Generate high-converting TikTok & Reels ads with hooks, captions, and storyboard.',
      icon: <Megaphone className="w-6 h-6 text-amber-400" />,
      color: 'from-amber-600/20 via-amber-600/5 to-transparent',
      borderColor: 'group-hover:border-amber-500/50',
      badge: 'Viral ROI',
      credits: '7 Credits',
    },
    {
      id: 'captions' as ToolType,
      title: 'Auto-Captions & Subtitles',
      desc: 'TikTok bouncing words, Alex Hormozi bold uppercase pops, and emoji sync.',
      icon: <Subtitles className="w-6 h-6 text-blue-400" />,
      color: 'from-blue-600/20 via-blue-600/5 to-transparent',
      borderColor: 'group-hover:border-blue-500/50',
      badge: 'Auto Sync',
      credits: '4 Credits',
    },
    {
      id: 'owner' as ToolType,
      title: 'SuperAdmin Owner Portal',
      desc: 'Executive command center: monitor $184k+ revenue, Stripe billing, unlimited credit grant, and H100 cluster.',
      icon: <ShieldCheck className="w-6 h-6 text-red-400" />,
      color: 'from-red-600/20 via-red-600/5 to-transparent',
      borderColor: 'group-hover:border-red-500/50',
      badge: 'Executive',
      credits: 'Owner Access',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-indigo-950/80 via-[#13162b] to-purple-950/80 border border-indigo-500/30 p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-xs border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> PixAI Studio Engine v2.5
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/30">
                GPU Queue Ready
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">{user.name}</span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Create Hollywood-grade 3D cartoons, animate photos into video, dub across 50 languages with lip-sync, and auto-caption viral reels in 1 click.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onSelectTab('cartoon')}
              className="py-3 px-5 bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition transform active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4" /> Start New Creation
            </button>
            <button
              onClick={onOpenPricing}
              className="py-3 px-5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl transition flex items-center justify-center gap-2 text-sm"
            >
              <Crown className="w-4 h-4 text-amber-400" /> View Bundle Deals
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0d0f17] border border-slate-800 rounded-xl space-y-1">
          <div className="text-xs text-slate-400">Available Credits</div>
          <div className="text-2xl font-extrabold text-white flex items-center gap-2">
            <span>{user.credits === 999999 ? '∞' : user.credits}</span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {user.plan}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">Auto-renews next cycle</div>
        </div>

        <div className="p-4 bg-[#0d0f17] border border-slate-800 rounded-xl space-y-1">
          <div className="text-xs text-slate-400">Max Export Resolution</div>
          <div className="text-2xl font-extrabold text-cyan-400">4K Ultra HD</div>
          <div className="text-[11px] text-slate-400">60 FPS ProRes / MP4</div>
        </div>

        <div className="p-4 bg-[#0d0f17] border border-slate-800 rounded-xl space-y-1">
          <div className="text-xs text-slate-400">Lip-Sync Accuracy</div>
          <div className="text-2xl font-extrabold text-emerald-400">99.6%</div>
          <div className="text-[11px] text-slate-400">50+ languages active</div>
        </div>

        <div className="p-4 bg-[#0d0f17] border border-slate-800 rounded-xl space-y-1">
          <div className="text-xs text-slate-400">Render Speed</div>
          <div className="text-2xl font-extrabold text-purple-400">Ultra Fast</div>
          <div className="text-[11px] text-slate-400">Dedicated GPU node</div>
        </div>
      </div>

      {/* 6 AI Tools Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400 fill-current" /> AI Creation Tools Suite
          </h2>
          <span className="text-xs text-slate-400">All tools included in every plan</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {toolCards.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTab(tool.id)}
              className={`p-5 rounded-2xl bg-gradient-to-b ${tool.color} bg-[#0d0f17] border border-slate-800/90 ${tool.borderColor} hover:bg-[#121626] transition-all duration-300 hover-card-lift hover:shadow-2xl cursor-pointer group flex flex-col justify-between shadow-lg relative overflow-hidden`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono bg-black/40 px-2 py-0.5 rounded border border-white/5">
                      {tool.credits}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                      {tool.badge}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                <span>Launch Workspace</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-cyan-400 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Generations Feed */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-rose-400" /> Recent Creations
          </h2>
          <button
            onClick={() => onSelectTab('gallery')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>View All ({assets.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.slice(0, 3).map((asset) => (
            <div
              key={asset.id}
              onClick={() => onSelectTab(asset.tool)}
              className="bg-[#0d0f17] border border-slate-800 rounded-xl overflow-hidden group cursor-pointer hover:border-slate-700 transition"
            >
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={asset.thumbnail}
                  alt={asset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-lg">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
                {asset.duration && (
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[10px] font-mono text-white">
                    {asset.duration}
                  </span>
                )}
              </div>
              <div className="p-3 space-y-1">
                <div className="font-bold text-xs text-white truncate">{asset.title}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{asset.style || asset.tool}</span>
                  <span>{asset.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
