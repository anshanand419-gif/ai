import React, { useState, useEffect, useRef } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  Play, 
  Pause, 
  Copy, 
  Check, 
  Download, 
  Flame, 
  TrendingUp, 
  Volume2, 
  VolumeX,
  Video
} from 'lucide-react';
import { AdScript, GeneratedAsset } from '../../types';
import { downloadVideoFile } from '../../utils/videoHelper';

interface AdCreatorProps {
  onDeductCredits: (amount: number) => boolean;
  onAddAsset: (asset: GeneratedAsset) => void;
  onOpenPricing: () => void;
}

export const AdCreator: React.FC<AdCreatorProps> = ({
  onDeductCredits,
  onAddAsset,
  onOpenPricing,
}) => {
  const [productName, setProductName] = useState('AuraPulse Smart Noise-Cancelling Headphones');
  const [productDescription, setProductDescription] = useState('Active hybrid noise cancellation, 60-hour battery life, spatial audio head tracking, ultra-lightweight memory foam earcups.');
  const [websiteUrl, setWebsiteUrl] = useState('https://aurapulse.audio');
  const [adGoal, setAdGoal] = useState('E-commerce Sales');
  const [targetAudience, setTargetAudience] = useState('Gen-Z creators, gym enthusiasts, and remote workers');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [isPlayingAd, setIsPlayingAd] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [script, setScript] = useState<AdScript>({
    headline: 'Stop Wasting Money on Overpriced Headphones — Meet AuraPulse',
    scenes: [
      {
        timestamp: '00:00 - 00:03',
        hook: 'Ever noticed how $400 headphones die after just 12 hours?',
        visualCue: 'Fast dramatic zoom on dead battery indicator, frustrated creator in noisy cafe.',
        audio: 'Heavy cinematic sub-bass drop with muffled city noise.',
        caption: 'Overpriced headphones keep failing you! 🛑',
      },
      {
        timestamp: '00:03 - 00:08',
        hook: 'This is AuraPulse. 60-hour playtime and studio-grade ANC for half the price.',
        visualCue: '3D metallic spin render with electric cyan soundwave particles wrapping around.',
        audio: 'Satisfying mechanical snap sound + crisp uplifting synth beat.',
        caption: '60-HOUR BATTERY + Studio Audio 🎧⚡',
      },
      {
        timestamp: '00:08 - 00:14',
        hook: 'Put them on, and the world goes completely silent. Watch this test.',
        visualCue: 'Split screen: Left side loud subway train screeching, Right side serene ocean waves.',
        audio: 'Instant background noise cutoff into crystal clear vocal clarity.',
        caption: 'Noise Cancellation that ACTUALLY works 🔇✨',
      },
      {
        timestamp: '00:14 - 00:18',
        hook: 'Claim your 40% launch discount below before the restock sells out!',
        visualCue: 'High-contrast checkout badge flying in with 5-star customer reviews popping up.',
        audio: 'Exciting chime + energetic outro crescendo.',
        caption: 'Shop 40% OFF Today Only! 🚀📦',
      },
    ],
    suggestedVoiceover: 'High-energy TikTok creator voice (Punchy, fast-paced, enthusiastic)',
    recommendedHooks: [
      'The #1 mistake people make when buying headphones in 2026:',
      'If you commute or study daily, you need to see this right now:',
      'Why audiophiles are quietly switching away from big tech brands:',
    ],
    hashtags: ['#TikTokMadeMeBuyIt', '#AuraPulse', '#AudioGear', '#ViralGadgets', '#WorkFromHome'],
  });

  const demoTemplates = [
    {
      name: 'AuraPulse Headphones',
      desc: 'Spatial audio, 60h battery, active noise cancellation, lightweight.',
      goal: 'E-commerce Sales',
      url: 'https://aurapulse.audio',
    },
    {
      name: 'GlowGoddess Vitamin-C Serum',
      desc: 'Dermatologist tested 15% pure Vitamin-C + Hyaluronic acid for glass skin.',
      goal: 'TikTok UGC Viral',
      url: 'https://glowgoddess.co',
    },
    {
      name: 'FlowMetric AI Analytics',
      desc: 'B2B SaaS conversion intelligence that finds revenue leaks in minutes.',
      goal: 'Lead Generation',
      url: 'https://flowmetric.io',
    },
  ];

  // Ad playback loop through scenes
  useEffect(() => {
    let timer: any;
    if (isPlayingAd) {
      timer = setInterval(() => {
        setActiveSceneIdx((prev) => (prev + 1) % script.scenes.length);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlayingAd, script.scenes.length]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlayingAd) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlayingAd]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
  }, [isMuted]);

  const handleGenerateScript = async () => {
    const success = onDeductCredits(7);
    if (!success) {
      onOpenPricing();
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/api/gemini/ad-creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          productDescription,
          adGoal,
          targetAudience,
          platform: 'TikTok & Instagram Reels (9:16)',
        }),
      });
      const data = await res.json();
      if (data.scenes && data.scenes.length > 0) {
        setScript(data);
        setActiveSceneIdx(0);
      }
    } catch {
      // Keep existing
    } finally {
      setIsGenerating(false);
      setIsPlayingAd(true);
    }

    const newAsset: GeneratedAsset = {
      id: 'ad-' + Date.now(),
      title: `${productName} Viral Ad`,
      tool: 'adcreator',
      type: 'video',
      url: videoUrl,
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      createdAt: 'Just now',
      prompt: `Full 4-scene video ad script for ${productName}`,
      aspectRatio: '9:16',
      style: 'TikTok UGC Ad',
      tags: ['Ad Script', adGoal, 'Viral Hook', '4K Video'],
      duration: '0:18',
    };
    onAddAsset(newAsset);
  };

  const handleCopyScript = () => {
    const formatted = `${script.headline}\n\n` +
      script.scenes.map((s, idx) => `[Scene ${idx + 1} (${s.timestamp})]\nSpoken: "${s.hook}"\nVisual: ${s.visualCue}\nCaption: ${s.caption}\nAudio: ${s.audio}`).join('\n\n') +
      `\n\nVoiceover: ${script.suggestedVoiceover}\nHashtags: ${script.hashtags.join(' ')}`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadVideo = async () => {
    setIsDownloading(true);
    await downloadVideoFile(videoUrl, `PixAI-${productName.replace(/\s+/g, '-')}-Ad.mp4`);
    setIsDownloading(false);
  };

  const currentScene = script.scenes[activeSceneIdx] || script.scenes[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Megaphone className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">AI Ad Creator & Copy Generator</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Generate high-converting TikTok, Reels & Shorts video ads with psychology-backed hooks, dynamic captions, and downloadable MP4 files.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Cost: <span className="text-amber-400 font-bold">7 Credits</span> / ad campaign
          </span>
          <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Hormozi Hook Engine
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Demo Templates */}
          <div>
            <label className="font-semibold text-slate-300 text-xs mb-1.5 block">1-Click Product Presets</label>
            <div className="grid grid-cols-3 gap-2">
              {demoTemplates.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setProductName(item.name);
                    setProductDescription(item.desc);
                    setAdGoal(item.goal);
                    setWebsiteUrl(item.url);
                  }}
                  className={`p-2 rounded-xl border text-left transition ${
                    productName === item.name
                      ? 'bg-amber-500/20 border-amber-500 text-white'
                      : 'bg-[#0d0f17] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold truncate text-slate-200">{item.name}</div>
                  <div className="text-[10px] text-amber-400 truncate mt-0.5">{item.goal}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Name */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 text-xs">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. AuraPulse Headphones"
              className="w-full bg-[#0d0f17] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Product Details & URL */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 text-xs">Product Benefits & Features</label>
            <textarea
              rows={3}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="List key benefits, discount offers, problem solved..."
              className="w-full bg-[#0d0f17] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
            />
          </div>

          {/* Ad Goal & Platform */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 text-xs">Campaign Goal</label>
              <select
                value={adGoal}
                onChange={(e) => setAdGoal(e.target.value)}
                className="w-full bg-[#0d0f17] border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="E-commerce Sales">E-commerce Sales</option>
                <option value="TikTok UGC Viral">TikTok UGC Viral</option>
                <option value="Lead Generation">Lead Generation</option>
                <option value="Brand Awareness">Brand Awareness</option>
                <option value="App Downloads">App Downloads</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 text-xs">Target Audience</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-[#0d0f17] border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerateScript}
            disabled={isGenerating || !productName.trim()}
            className="w-full py-4 px-4 bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-amber-600/25 transition transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating High-Converting Ad Video...</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>Generate Video Ad & MP4 (7 Credits)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Storyboard & Real Playable Video Player (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Ad Video Preview Player */}
          <div className="relative w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl aspect-video flex items-center justify-center group">
            {/* Real Playable HTML5 Video */}
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />

            {/* Top Scene Marker & Goal */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
              <span className="px-2.5 py-1 rounded-md bg-amber-500/80 backdrop-blur-md text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Scene {activeSceneIdx + 1} of {script.scenes.length}</span>
              </span>
              <span className="text-xs font-mono text-amber-300 bg-black/60 px-2 py-1 rounded border border-amber-500/30">
                {currentScene.timestamp}
              </span>
            </div>

            {/* Center Dynamic On-Screen Animated Caption */}
            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 z-20 text-center space-y-2 pointer-events-none">
              <div className="inline-block px-4 py-2 bg-black/85 backdrop-blur-md rounded-xl border border-amber-400/50 shadow-2xl animate-bounce">
                <span className="text-base sm:text-xl font-black text-amber-300 uppercase tracking-tight">
                  {currentScene.caption}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white font-medium max-w-md mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] italic">
                "{currentScene.hook}"
              </p>
            </div>

            {/* Bottom Scene Timeline & Controls */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingAd(!isPlayingAd)}
                  className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center font-bold transition shadow-md"
                >
                  {isPlayingAd ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 hover:text-amber-400 transition"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="flex gap-1.5 ml-2">
                  {script.scenes.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSceneIdx(i)}
                      className={`h-2 rounded-full transition-all ${
                        activeSceneIdx === i ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyScript}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Script'}</span>
                </button>

                <button
                  onClick={handleDownloadVideo}
                  disabled={isDownloading}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/25"
                >
                  {isDownloading ? (
                    <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>Download Ad MP4</span>
                </button>
              </div>
            </div>
          </div>

          {/* Scene Breakdown Storyboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {script.scenes.map((scene, idx) => (
              <div
                key={idx}
                onClick={() => setActiveSceneIdx(idx)}
                className={`p-3 rounded-xl border cursor-pointer transition text-xs space-y-1.5 ${
                  activeSceneIdx === idx
                    ? 'bg-amber-500/10 border-amber-500/60 shadow-md'
                    : 'bg-[#0d0f17] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className={activeSceneIdx === idx ? 'text-amber-400' : 'text-slate-200'}>
                    Scene {idx + 1}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">{scene.timestamp}</span>
                </div>
                <div className="text-slate-300 font-medium truncate">"{scene.hook}"</div>
                <div className="text-[11px] text-slate-500 truncate">🎬 {scene.visualCue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
