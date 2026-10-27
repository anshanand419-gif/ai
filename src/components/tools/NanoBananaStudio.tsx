import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  Sliders, 
  Maximize2, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Layers, 
  Check, 
  Zap, 
  Share2, 
  Eye, 
  Ratio,
  Compass
} from 'lucide-react';
import { GeneratedAsset } from '../../types';

interface NanoBananaStudioProps {
  onDeductCredits: (amount: number) => boolean;
  onAddAsset: (asset: GeneratedAsset) => void;
  onOpenPricing: () => void;
  initialPrompt?: string;
}

export const NanoBananaStudio: React.FC<NanoBananaStudioProps> = ({
  onDeductCredits,
  onAddAsset,
  onOpenPricing,
  initialPrompt,
}) => {
  const [prompt, setPrompt] = useState(
    initialPrompt || 'A hyper-realistic mechanical owl perched on a weathered neon street sign in Neo-Tokyo, intricate brass gears, glowing cyan optics, 35mm photograph, 8k resolution.'
  );
  const [resolution, setResolution] = useState<'1K' | '2K' | '4K'>('4K');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [selectedStyle, setSelectedStyle] = useState<string>('Photographic Realism');
  const [negativePrompt, setNegativePrompt] = useState('blurry, distorted anatomy, low quality, oversaturated artifacts');
  const [seed, setSeed] = useState<number>(428912);
  const [isSeedLocked, setIsSeedLocked] = useState(false);
  const [guidanceScale, setGuidanceScale] = useState<number>(7.5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string>(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=90'
  );

  const nanoStyles = [
    { id: 'photo', name: 'Photographic Realism', desc: '8K Arri Alexa, cinematic depth, 35mm grain' },
    { id: 'cyber', name: 'Cyberpunk Neo-Tokyo', desc: 'Holographic reflections, neon rain puddles' },
    { id: 'clay', name: 'Tactile Clay Sculpture', desc: 'Fingerprint clay textures, stop-motion lighting' },
    { id: 'voxel', name: '3D Isometric Voxel', desc: 'Miniature diorama, tilt-shift lens glow' },
    { id: 'vintage', name: '35mm Vintage Film', desc: 'Analog Kodak Portra 400 aesthetic' },
    { id: 'oil', name: 'Impasto Oil Painting', desc: 'Heavy palette knife impasto strokes' },
  ];

  const aspectRatios = [
    { id: '16:9', label: '16:9', desc: 'Cinematic Widescreen' },
    { id: '9:16', label: '9:16', desc: 'Mobile Fullscreen' },
    { id: '1:1', label: '1:1', desc: 'Square 4K' },
    { id: '4:1', label: '4:1', desc: 'Ultra-Wide Panoramic Banner' },
    { id: '1:4', label: '1:4', desc: 'Vertical Skyscraper Tower' },
    { id: '4:3', label: '4:3', desc: 'Classic Studio' },
  ];

  const handleGenerate = async () => {
    const success = onDeductCredits(5);
    if (!success) {
      onOpenPricing();
      return;
    }

    setIsGenerating(true);
    setProgress(15);
    let targetUrl = generatedImage;

    try {
      const activeSeed = isSeedLocked ? seed : Math.floor(Math.random() * 999999);
      if (!isSeedLocked) setSeed(activeSeed);

      const apiPromise = fetch('/api/gemini/nano-banana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          resolution,
          aspectRatio,
          stylePreset: selectedStyle,
          negativePrompt,
          seed: activeSeed,
        }),
      });

      const steps = [35, 65, 90];
      for (const s of steps) {
        await new Promise((r) => setTimeout(r, 450));
        setProgress(s);
      }

      const res = await apiPromise;
      const data = await res.json();
      if (data.imageUrl) {
        targetUrl = data.imageUrl;
        setGeneratedImage(data.imageUrl);
      }
    } catch {
      // Fallback
    } finally {
      setProgress(100);
      setIsGenerating(false);
    }

    const newAsset: GeneratedAsset = {
      id: 'nano-' + Date.now(),
      title: prompt.slice(0, 32) + '...',
      tool: 'nano-banana',
      type: 'image',
      url: targetUrl,
      thumbnail: targetUrl,
      createdAt: 'Just now',
      prompt,
      aspectRatio,
      style: selectedStyle,
      tags: ['Nano Banana 2.1', resolution, selectedStyle, aspectRatio],
    };
    onAddAsset(newAsset);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-5 h-5 fill-current" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Gemini Nano Banana 2.1 Studio</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Ultra-high-fidelity generation with native 1K, 2K, 4K resolutions and extreme aspect ratios (4:1 Ultra-Wide to 1:4 Skyscraper).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Cost: <span className="text-amber-400 font-bold">5 Credits</span> / 4K render
          </span>
          <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Nano Banana Engine Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Prompt */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 text-xs flex items-center justify-between">
              <span>Nano Banana Prompt</span>
              <span className="text-[10px] text-amber-400 font-mono">Supports 1K/2K/4K</span>
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter detailed visual prompt..."
              className="w-full bg-[#0d0f17] border border-slate-800 focus:border-amber-500 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition leading-relaxed resize-none"
            />
          </div>

          {/* Resolution Selector (1K, 2K, 4K) */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 text-xs">Output Resolution Target</label>
            <div className="grid grid-cols-3 gap-2">
              {(['1K', '2K', '4K'] as const).map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setResolution(res)}
                  className={`py-2 px-3 rounded-xl border text-center transition font-bold text-xs ${
                    resolution === res
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                      : 'bg-[#0d0f17] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-sm">{res}</div>
                  <div className="text-[10px] font-normal text-slate-400 mt-0.5">
                    {res === '4K' ? '3840 x 2160' : res === '2K' ? '2048 x 1152' : '1024 x 1024'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio (including 4:1 panorama and 1:4 skyscraper) */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 text-xs flex items-center justify-between">
              <span>Aspect Ratio</span>
              <span className="text-[10px] text-slate-400">Standard & Non-Standard Supported</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {aspectRatios.map((ar) => (
                <button
                  key={ar.id}
                  type="button"
                  onClick={() => setAspectRatio(ar.id)}
                  className={`p-2 rounded-xl border text-center transition ${
                    aspectRatio === ar.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                      : 'bg-[#0d0f17] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-200">{ar.label}</div>
                  <div className="text-[9px] text-slate-400 truncate mt-0.5">{ar.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Style Presets */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 text-xs">Stylistic Model Tuning</label>
            <div className="grid grid-cols-2 gap-2">
              {nanoStyles.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.name)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    selectedStyle === style.name
                      ? 'bg-amber-500/20 border-amber-500 text-white'
                      : 'bg-[#0d0f17] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-200 truncate">{style.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Negative Prompt & Seed Controls */}
          <div className="p-3 bg-[#0d0f17] border border-slate-800 rounded-xl space-y-2.5 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Negative Prompt Filter</label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Seed:</span>
                <span className="font-mono text-amber-400 font-bold">{seed}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSeedLocked(!isSeedLocked)}
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 text-[11px] font-semibold transition ${
                  isSeedLocked ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {isSeedLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                <span>{isSeedLocked ? 'Locked' : 'Randomize'}</span>
              </button>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-4 px-4 bg-gradient-to-r from-amber-500 via-orange-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-amber-600/25 transition transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Synthesizing Nano Banana {resolution} ({progress}%)...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Render {resolution} Nano Banana Image (5 Credits)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Canvas / Image Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full bg-black rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center aspect-video group">
            <img
              src={generatedImage}
              alt="Nano Banana Render"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-amber-500/80 backdrop-blur-md text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Gemini Nano Banana 2.1</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-amber-300 text-xs font-mono border border-amber-500/30">
                {resolution} • {aspectRatio}
              </span>
            </div>

            {/* In Progress Banner */}
            {isGenerating && (
              <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                <div>
                  <div className="text-lg font-bold text-white mb-1">Rendering Nano Banana {resolution}...</div>
                  <div className="text-xs text-amber-300 font-mono">Aspect: {aspectRatio} • Seed: {seed}</div>
                </div>
                <div className="w-full max-w-xs h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="absolute bottom-0 inset-x-0 z-20 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between text-white">
              <div className="text-xs text-slate-300 font-medium">
                {selectedStyle} • 4K Uncompressed
              </div>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = generatedImage;
                  link.download = `PixAI-NanoBanana-${resolution}-${Date.now()}.png`;
                  link.click();
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
              >
                <Download className="w-3.5 h-3.5" /> Download Full {resolution} PNG
              </button>
            </div>
          </div>

          {/* Details specs */}
          <div className="p-4 bg-[#0d0f17] border border-slate-800 rounded-xl grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-slate-900 rounded-lg">
              <div className="text-slate-400 text-[10px]">Model</div>
              <div className="text-white font-bold mt-0.5">Nano Banana 2.1</div>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg">
              <div className="text-slate-400 text-[10px]">Max Size</div>
              <div className="text-amber-400 font-bold mt-0.5">{resolution} UHD</div>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg">
              <div className="text-slate-400 text-[10px]">Color Space</div>
              <div className="text-cyan-400 font-bold mt-0.5">DCI-P3 Wide</div>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg">
              <div className="text-slate-400 text-[10px]">Negative Weights</div>
              <div className="text-emerald-400 font-bold mt-0.5">Active Filter</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
