import React, { useState } from 'react';
import { 
  Sparkles, 
  Video, 
  Languages, 
  Scissors, 
  Megaphone, 
  Subtitles, 
  Play, 
  Pause, 
  Check, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Zap, 
  Flame, 
  MoveHorizontal,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Lock,
  Globe,
  Award
} from 'lucide-react';
import { ToolType, PlanTier, BillingCycle } from '../types';
import { PLANS, MONTHLY_PLANS, CARTOON_STYLES, CAMERA_MOVEMENTS, BG_PRESETS, SUBTITLE_STYLES } from '../data/mockData';

interface LandingPageProps {
  onEnterStudio: (tool?: ToolType) => void;
  onOpenCheckout: (plan: PlanTier, cycle: BillingCycle) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterStudio,
  onOpenCheckout,
}) => {
  const [activeFeatureTab, setActiveFeatureTab] = useState<ToolType>('cartoon');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('bundle');
  const [splitPos, setSplitPos] = useState<number>(50);
  const [isHeroPlaying, setIsHeroPlaying] = useState<boolean>(true);

  const featureTabs = [
    { id: 'cartoon' as ToolType, label: '3D Cartoon & Anime', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
    { id: 'image2video' as ToolType, label: 'Image to Video', icon: <Video className="w-4 h-4 text-cyan-400" /> },
    { id: 'translator' as ToolType, label: 'Video Translator & Lip-Sync', icon: <Languages className="w-4 h-4 text-emerald-400" /> },
    { id: 'bgremover' as ToolType, label: '1-Click BG Remover', icon: <Scissors className="w-4 h-4 text-pink-400" /> },
    { id: 'adcreator' as ToolType, label: 'AI Ad Creator', icon: <Megaphone className="w-4 h-4 text-amber-400" /> },
    { id: 'captions' as ToolType, label: 'Auto-Captions', icon: <Subtitles className="w-4 h-4 text-blue-400" /> },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Viral TikTok Creator (1.4M Followers)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: 'PixAI Studio turned our video production from 8 hours into literally 90 seconds. The Hormozi captions and 3D Pixar styles doubled our view retention immediately!',
      metric: '+380% Watch Time',
      badge: 'Pro Member',
    },
    {
      name: 'Marcus Vance',
      role: 'Founder at HyperScale E-commerce',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'The AI Ad Creator generated 12 video hooks for our sneaker brand in 5 minutes. We scaled ROAS from 1.8x to 4.2x on TikTok ads in the first week.',
      metric: '4.2x Ad ROAS',
      badge: 'Ultimate Bundle',
    },
    {
      name: 'Elena Rostova',
      role: 'Global Tech YouTuber & Educator',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      text: 'The lip-sync video translation is mind-blowing. My keynote was dubbed into Japanese and Spanish with my actual voice timbre and perfect mouth sync.',
      metric: '50+ Global Markets',
      badge: 'Pro Member',
    },
  ];

  const currentPlans = billingCycle === 'bundle' ? PLANS : MONTHLY_PLANS;

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 px-4 max-w-7xl mx-auto text-center space-y-8 bg-radial-hero">
        {/* Top Innovation Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md animate-float shadow-lg">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>Next-Gen Video Synthesis Engine v2.5 is Live</span>
          <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
        </div>

        {/* Catchy Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
            Turn Words & Images into{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Viral AI Videos
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
            Generate 3D Pixar animations, cinematic camera moves, 50+ language neural lip-syncing, 1-click cutouts, and high-converting video ads in seconds.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onEnterStudio('cartoon')}
            className="w-full sm:w-auto py-4 px-8 bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-600/35 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-base"
          >
            <Sparkles className="w-5 h-5" />
            <span>Start Creating Free</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('pricing-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto py-4 px-8 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold rounded-2xl transition flex items-center justify-center gap-2 text-base"
          >
            <Flame className="w-5 h-5 text-amber-400" />
            <span>View Pricing & Bundles</span>
          </button>
        </div>

        {/* Dynamic Background Demo Video Loop Showcase Container */}
        <div className="pt-6 max-w-5xl mx-auto">
          <div className="relative rounded-3xl bg-[#0a0c14] border-2 border-indigo-500/40 p-2 sm:p-3 shadow-2xl neon-glow-indigo overflow-hidden">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center group">
              <video
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
                autoPlay
                loop
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Ambient Glowing Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

              {/* Top status bar in player */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>Live 4K Demo Loop</span>
                  </span>
                  <span className="hidden sm:inline px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-cyan-300 text-xs font-mono border border-cyan-500/30">
                    Prompt: "Cyberpunk Sci-Fi in 4K 60fps"
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                    60 FPS • ProRes 4K MP4
                  </span>
                </div>
              </div>

              {/* Floating Hero Play/Open Button */}
              <button
                onClick={() => onEnterStudio('cartoon')}
                className="absolute z-20 w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition group"
                title="Launch Video Studio"
              >
                <Play className="w-8 h-8 ml-1 fill-current" />
              </button>

              {/* Bottom Quick Feature Navigator */}
              <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">Featured Engine:</span>
                  <span className="text-cyan-400 font-mono">Omni Flash 3D + Raytracing</span>
                </div>
                <button
                  onClick={() => onEnterStudio('cartoon')}
                  className="px-4 py-2 rounded-xl bg-white text-black font-extrabold flex items-center gap-1.5 hover:bg-slate-200 transition shadow-lg"
                >
                  <span>Open Interactive Canvas</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Metric Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-black text-white">1.2M+</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Videos Rendered</div>
          </div>
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">99.4%</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Lip-Sync Accuracy</div>
          </div>
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center justify-center gap-1">
              <span>4.9</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
            </div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Creator Rating (18k+ reviews)</div>
          </div>
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-black text-purple-400">85,000+</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Active Studios & Creators</div>
          </div>
        </div>
      </section>

      {/* 2. FEATURE SHOWCASE (Interactive Tabs & Live Sliders) */}
      <section className="px-4 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Complete Multi-Modal AI Production Suite</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            6 Specialized AI Tools in One Dashboard
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            No complicated video editing software required. Select an AI tool below and experience interactive live previews.
          </p>
        </div>

        {/* Feature Tab Buttons */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {featureTabs.map((tab) => {
            const isActive = activeFeatureTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40'
                    : 'bg-[#0d0f17] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Feature Interactive Card */}
        <div className="bg-[#0d0f17] border border-slate-800 rounded-3xl p-6 lg:p-10 shadow-2xl">
          {activeFeatureTab === 'cartoon' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-block px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-xs uppercase tracking-wider border border-purple-500/30">
                  Feature 01 • Animation Engine
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                  Turn Any Text Prompt into 3D Pixar & Shinkai Anime
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Generate rich character animations with realistic physics, expressive facial rigs, cinematic camera lighting, and octave rendering in 16:9, 9:16, or 1:1.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-white block mb-0.5">3D Pixar Style</span>
                    <span className="text-slate-400">Volumetric lighting & expressive eyes</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-white block mb-0.5">2D Anime Aesthetic</span>
                    <span className="text-slate-400">Vibrant cloudscapes & cel shading</span>
                  </div>
                </div>
                <button
                  onClick={() => onEnterStudio('cartoon')}
                  className="py-3.5 px-6 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition"
                >
                  <span>Launch Cartoon Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-2xl border border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80"
                  alt="3D Pixar Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/75 backdrop-blur-md rounded-xl border border-white/10 text-xs text-white flex items-center justify-between">
                  <span className="font-medium truncate">"A cute cybernetic red panda on a floating cloud"</span>
                  <span className="text-purple-400 font-bold shrink-0">4K 60FPS</span>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'image2video' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-block px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs uppercase tracking-wider border border-cyan-500/30">
                  Feature 02 • Motion Synthesis
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                  Bring Static Photos to Life with Cinematic Drone Paths
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Upload any product photo, landscape, portrait, or architectural render. Select camera paths like Pan Left, Drone Shot, Orbit 360, or Zoom In with motion intensity sliders.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-white block mb-0.5">Motion Intensity</span>
                    <span className="text-slate-400">Subtle, Moderate, or High-energy</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-white block mb-0.5">6 Camera Presets</span>
                    <span className="text-slate-400">Drone, Pan, Orbit, Hitchcock Vertigo</span>
                  </div>
                </div>
                <button
                  onClick={() => onEnterStudio('image2video')}
                  className="py-3.5 px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition"
                >
                  <span>Launch Image to Video</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-2xl border border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80"
                  alt="Image to video motion"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-cyan-500 text-black font-bold text-xs">
                  Drone Sweeping Pass Active
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'translator' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-block px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
                  Feature 03 • Global Dubbing
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                  Translate Spoken Videos into 50+ Languages with Lip-Sync
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Reach international audiences seamlessly. Our neural speech model clones your authentic voice timbre and resynthesizes speaker mouth geometry to match translated syllables.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-white block mb-0.5">Voice Timbre Cloning</span>
                    <span className="text-slate-400">99.8% vocal pitch fidelity</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-white block mb-0.5">Neural Lip-Sync</span>
                    <span className="text-slate-400">Mouth landmarks match phonemes</span>
                  </div>
                </div>
                <button
                  onClick={() => onEnterStudio('translator')}
                  className="py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition"
                >
                  <span>Launch Video Translator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-2xl border border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80"
                  alt="Lip sync translator"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 inset-x-4 p-3 bg-black/80 backdrop-blur-md rounded-xl text-xs flex justify-between items-center text-emerald-400 font-bold">
                  <span>English → Japanese (東京) Dubbed</span>
                  <span className="text-white">99.6% Lip-Sync Match</span>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'bgremover' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-block px-3 py-1 rounded-lg bg-pink-500/20 text-pink-300 font-bold text-xs uppercase tracking-wider border border-pink-500/30">
                  Feature 04 • 1-Click Matte
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                  Instant AI Background Removal with Hair Matting
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Isolate subjects from any photo or video without manual rotoscoping. Swap in transparent PNGs, vibrant studio colors, or AI-generated luxury penthouses and beaches.
                </p>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-pink-400">Interactive Preview Below:</span> Drag the vertical slider on the right to compare Before vs After in real-time!
                </div>
                <button
                  onClick={() => onEnterStudio('bgremover')}
                  className="py-3.5 px-6 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-pink-600/30 transition"
                >
                  <span>Launch Background Remover</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Interactive Split Slider on Landing Page */}
              <div
                onMouseMove={(e) => {
                  if (e.buttons === 1) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setSplitPos(((e.clientX - rect.left) / rect.width) * 100);
                  }
                }}
                className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-2xl border border-slate-700 cursor-ew-resize select-none"
              >
                {/* After background */}
                <div className="absolute inset-0 bg-[#0f172a]">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80"
                    alt="After Cutout"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Before original clipped */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${splitPos}%` }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80"
                    alt="Original"
                    className="w-full h-full object-cover"
                    style={{ width: '800px', maxWidth: 'none' }}
                  />
                </div>

                {/* Split line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white"
                  style={{ left: `${splitPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-xl">
                    <MoveHorizontal className="w-4 h-4" />
                  </div>
                </div>

                <div className="absolute bottom-3 inset-x-3 text-center pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-black/60 text-white text-[11px] font-semibold">
                    Drag handle to inspect edge feathering
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'adcreator' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-block px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-500/30">
                  Feature 05 • E-Commerce & UGC
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                  AI Ad Creator: From Product URL to High-ROAS Video Ads
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Generate 4-scene video storyboards engineered for TikTok & Instagram Reels. Includes psychology-backed hooks, visual instructions, audio cues, and animated dynamic captions.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-white block mb-0.5">Alex Hormozi Hooks</span>
                    <span className="text-slate-400">High-retention problem/solution format</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-white block mb-0.5">Multi-Scene Export</span>
                    <span className="text-slate-400">Ready-to-post 15s - 30s ad packages</span>
                  </div>
                </div>
                <button
                  onClick={() => onEnterStudio('adcreator')}
                  className="py-3.5 px-6 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-amber-600/30 transition"
                >
                  <span>Launch Ad Creator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-2xl border border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80"
                  alt="AI Ad Creator"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 text-center">
                  <div className="p-4 bg-black/85 backdrop-blur-md rounded-2xl border border-amber-500/40 text-amber-300 font-black text-lg uppercase tracking-tight">
                    "94% OF CREATORS GET STUCK HERE! 🛑"
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'captions' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-block px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-bold text-xs uppercase tracking-wider border border-blue-500/30">
                  Feature 06 • Viral Retention
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                  TikTok & Hormozi Animated Captions with Emoji Sync
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Auto-transcribe speech and overlay animated bouncing words with bright neon yellow/green highlights. Triple social media retention on TikTok, Reels, and YouTube Shorts.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-white block mb-0.5">Bouncing Word Animations</span>
                    <span className="text-slate-400">Pops in time with voiceover cadence</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-white block mb-0.5">Auto Emoji Injection</span>
                    <span className="text-slate-400">Contextual emojis added dynamically</span>
                  </div>
                </div>
                <button
                  onClick={() => onEnterStudio('captions')}
                  className="py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
                >
                  <span>Launch Auto-Captioner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-2xl border border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1000&auto=format&fit=crop&q=80"
                  alt="Auto-Captions"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-6 bottom-8 text-center">
                  <span className="inline-block px-4 py-2 bg-black/90 rounded-xl text-yellow-400 font-black text-xl uppercase tracking-wider shadow-2xl border border-yellow-400/40">
                    EXPLODE YOUR VIEWS IN 2026 🔥
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. INTERACTIVE PRICING SECTION (Requested: Starter $49/1mo, Pro $99/2mo, Ultimate $299/5mo) */}
      <section id="pricing-section" className="px-4 max-w-7xl mx-auto space-y-8 scroll-mt-20">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Transparent Pricing • Stripe Protected</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Flexible Plans for Every Creator
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Toggle between Multi-Month Bundles for maximum savings or flexible Monthly Billing.
          </p>

          {/* Toggle */}
          <div className="pt-2 flex items-center justify-center">
            <div className="bg-[#0d0f17] p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 shadow-lg">
              <button
                onClick={() => setBillingCycle('bundle')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                  billingCycle === 'bundle'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Multi-Month Bundles</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase border border-emerald-500/30">
                  Save 40%
                </span>
              </button>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Subscription
              </button>
            </div>
          </div>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-4">
          {currentPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 lg:p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-[#181c33] via-[#0f1220] to-[#0a0c14] border-2 border-indigo-500/80 shadow-2xl neon-glow-indigo transform md:-translate-y-2'
                  : 'bg-[#0d0f17] border border-slate-800 hover:border-slate-700 shadow-xl'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-current text-yellow-300" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{plan.description}</p>
                </div>

                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                      ${plan.totalPrice}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {plan.monthsCount > 1 ? `for ${plan.monthsCount} Months` : '/ month'}
                    </span>
                  </div>
                  {plan.monthsCount > 1 && (
                    <div className="text-[11px] font-medium text-emerald-400">
                      ${plan.priceMonthly.toFixed(2)}/month equivalent
                    </div>
                  )}
                </div>

                <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Credits Included:</span>
                  <span className="font-extrabold text-cyan-300">
                    {plan.creditsPerMonth === 'Unlimited' ? '∞ Unlimited' : `${plan.creditsPerMonth} credits / mo`}
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => onOpenCheckout(plan, billingCycle)}
                  className={`w-full py-4 px-4 rounded-xl font-bold text-sm transition transform active:scale-95 flex items-center justify-center gap-2 shadow-lg ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white shadow-indigo-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{plan.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TESTIMONIALS & CREATOR SHOWCASE WALL */}
      <section className="px-4 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Loved by Top Content Creators & Growth Teams</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Real Creators. Viral Results.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#0d0f17] border border-slate-800 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {t.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-indigo-500/40" />
                  <div>
                    <div className="text-xs font-bold text-white">{t.name}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{t.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-emerald-400">{t.metric}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FINAL CTA BANNER */}
      <section className="px-4 max-w-6xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-cyan-900 border border-indigo-500/40 p-8 sm:p-12 text-center space-y-6 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Create Your First Viral AI Video?
            </h2>
            <p className="text-slate-200 text-sm sm:text-base">
              Join 85,000+ creators scaling their audiences with 3D animations, lip-sync translation, and dynamic video ads.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onEnterStudio('cartoon')}
                className="py-4 px-8 bg-white hover:bg-slate-100 text-black font-extrabold rounded-2xl shadow-2xl transition transform hover:scale-105 active:scale-95 text-sm"
              >
                Launch PixAI Studio Free
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('pricing-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-4 px-8 bg-black/40 hover:bg-black/60 border border-white/20 text-white font-bold rounded-2xl text-sm transition"
              >
                Choose Subscription Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 pt-12 px-4 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2 text-slate-300 font-bold">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>PixAI Studio Inc.</span>
        </div>
        <div>
          © {new Date().getFullYear()} PixAI Studio. Built with cutting-edge multi-modal AI models. All rights reserved.
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Stripe Security</span>
        </div>
      </footer>
    </div>
  );
};
