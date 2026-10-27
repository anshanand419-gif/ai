import React, { useState, useRef } from 'react';
import { 
  Scissors, 
  Upload, 
  Download, 
  Sparkles, 
  Sliders, 
  Layers, 
  Check, 
  Zap, 
  RefreshCw,
  MoveHorizontal
} from 'lucide-react';
import { BG_PRESETS } from '../../data/mockData';
import { GeneratedAsset } from '../../types';

interface BackgroundRemoverProps {
  onDeductCredits: (amount: number) => boolean;
  onAddAsset: (asset: GeneratedAsset) => void;
  onOpenPricing: () => void;
}

export const BackgroundRemover: React.FC<BackgroundRemoverProps> = ({
  onDeductCredits,
  onAddAsset,
  onOpenPricing,
}) => {
  const sampleItems = [
    {
      title: 'Luxury Watch',
      original: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80',
    },
    {
      title: 'Fashion Model',
      original: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
    },
    {
      title: 'Sneaker Product',
      original: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80',
    },
    {
      title: 'Electric Car',
      original: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80',
    },
  ];

  const [activeImage, setActiveImage] = useState<string>(sampleItems[0].original);
  const [selectedPreset, setSelectedPreset] = useState<string>('ai-penthouse');
  const [customBgImage, setCustomBgImage] = useState<string | null>(null);
  const [splitPos, setSplitPos] = useState<number>(50); // 0-100 percentage
  const [edgeFeather, setEdgeFeather] = useState<number>(3);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isRemoved, setIsRemoved] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offset / rect.width) * 100));
    setSplitPos(percentage);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setActiveImage(url);
    }
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomBgImage(url);
      setSelectedPreset('custom');
    }
  };

  const handleRunRemover = async () => {
    const success = onDeductCredits(3);
    if (!success) {
      onOpenPricing();
      return;
    }

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsProcessing(false);
    setIsRemoved(true);

    const newAsset: GeneratedAsset = {
      id: 'bg-' + Date.now(),
      title: 'AI Background Cutout',
      tool: 'bgremover',
      type: 'image',
      url: activeImage,
      thumbnail: activeImage,
      createdAt: 'Just now',
      prompt: `Isolated subject and applied ${selectedPreset} backdrop`,
      aspectRatio: '1:1',
      style: 'Studio Cutout',
      tags: ['Background Removed', 'Clean Edges', 'Alpha Channel'],
    };
    onAddAsset(newAsset);
  };

  const getBackgroundStyle = () => {
    if (selectedPreset === 'custom' && customBgImage) {
      return { backgroundImage: `url(${customBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    const preset = BG_PRESETS.find((p) => p.id === selectedPreset);
    if (!preset) return {};
    if (preset.type === 'transparent') {
      return {
        backgroundImage: 'linear-gradient(45deg, #1f2937 25%, transparent 25%), linear-gradient(-45deg, #1f2937 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f2937 75%), linear-gradient(-45deg, transparent 75%, #1f2937 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
      };
    }
    if (preset.type === 'color') {
      return { backgroundColor: preset.preview };
    }
    if (preset.type === 'image') {
      return { backgroundImage: `url(${preset.preview})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return {};
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Scissors className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">1-Click AI Background Remover</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Remove backgrounds from photos and videos instantly. Replace with solid color, AI studio scenes, or transparent PNG.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Cost: <span className="text-pink-400 font-bold">3 Credits</span> / cutout
          </span>
          <span className="px-3 py-1 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-300 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-current text-pink-400" /> Sub-Pixel Hair Matting
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Options (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Preset test images */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Choose Image or Upload</span>
              <label className="text-pink-400 hover:text-pink-300 cursor-pointer flex items-center gap-1">
                <Upload className="w-3 h-3" /> Upload Custom
                <input type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
              </label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {sampleItems.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(s.original)}
                  className={`rounded-lg overflow-hidden border aspect-square transition ${
                    activeImage === s.original ? 'ring-2 ring-pink-500 border-pink-400' : 'border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={s.original} alt={s.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Replacement Background Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-pink-400" /> Replacement Background
              </span>
              <label className="text-slate-400 hover:text-white cursor-pointer text-[11px] flex items-center gap-1">
                <Upload className="w-3 h-3" /> Upload Backdrop
                <input type="file" accept="image/*" onChange={handleCustomBgUpload} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BG_PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPreset(preset.id)}
                    className={`p-2 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-pink-600/20 border-pink-500 text-white shadow-md'
                        : 'bg-[#0d0f17] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-lg border border-white/20 shrink-0 overflow-hidden"
                      style={
                        preset.type === 'color'
                          ? { backgroundColor: preset.preview }
                          : preset.type === 'image'
                          ? { backgroundImage: `url(${preset.preview})`, backgroundSize: 'cover' }
                          : { backgroundColor: '#374151' }
                      }
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-200 truncate">{preset.label}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{preset.type}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Edge Feathering Slider */}
          <div className="space-y-2 bg-[#0d0f17] p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-pink-400" /> Edge Feathering & Hair Matting
              </label>
              <span className="font-mono text-pink-400 font-bold">{edgeFeather}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={edgeFeather}
              onChange={(e) => setEdgeFeather(Number(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>Sharp Crisp Vector Cut</span>
              <span>Soft Natural Hair Strands</span>
            </div>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={handleRunRemover}
            disabled={isProcessing}
            className="w-full py-4 px-4 bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-pink-600/25 transition transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Removing Background & Matting Edges...</span>
              </>
            ) : (
              <>
                <Scissors className="w-4 h-4" />
                <span>Re-Process Background Removal (3 Credits)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Split View Interactive Slider (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div
            ref={containerRef}
            onMouseMove={(e) => e.buttons === 1 && handleSliderMove(e)}
            onTouchMove={handleSliderMove}
            onClick={handleSliderMove}
            className="relative w-full bg-black rounded-2xl border border-slate-800 overflow-hidden shadow-2xl aspect-square sm:aspect-video cursor-ew-resize select-none group"
          >
            {/* The After (New Background Replacement) on left */}
            <div className="absolute inset-0" style={getBackgroundStyle()}>
              <img
                src={activeImage}
                alt="Subject Isolated"
                className="w-full h-full object-contain"
                style={{
                  filter: `drop-shadow(0 15px 25px rgba(0,0,0,0.5))`,
                }}
              />
            </div>

            {/* The Before (Original with old background) clipped by splitPos */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${splitPos}%` }}
            >
              <img
                src={activeImage}
                alt="Original Scene"
                className="w-full h-full object-cover"
                style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%', maxWidth: 'none' }}
              />
            </div>

            {/* Vertical Split Divider Line */}
            <div
              className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
              style={{ left: `${splitPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-2xl font-bold cursor-ew-resize">
                <MoveHorizontal className="w-5 h-5 text-slate-800" />
              </div>
            </div>

            {/* Badges on each side */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                Original Photo
              </span>
            </div>
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md bg-pink-500/80 backdrop-blur-md text-white text-xs font-bold border border-pink-400/30">
                AI Clean Cutout ({BG_PRESETS.find((p) => p.id === selectedPreset)?.label})
              </span>
            </div>

            {/* Drag instruction overlay hint */}
            <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-slate-300 text-[11px] font-medium border border-white/10">
                Drag slider to compare Before vs After
              </span>
            </div>
          </div>

          {/* Download Options */}
          <div className="p-4 bg-[#0d0f17] border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="text-slate-400">
              <span className="text-white font-semibold">Alpha Channel Matting:</span> 100% Transparent PNG or Composite JPG available
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = activeImage;
                  link.download = `PixAI-Cutout-Transparent.png`;
                  link.click();
                }}
                className="px-3.5 py-2 rounded-lg bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-pink-500/20"
              >
                <Download className="w-3.5 h-3.5" /> Download Transparent PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
