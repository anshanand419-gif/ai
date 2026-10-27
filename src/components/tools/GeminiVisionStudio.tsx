import React, { useState } from 'react';
import { 
  Eye, 
  Sparkles, 
  Upload, 
  Palette, 
  Film, 
  Copy, 
  Check, 
  Sliders, 
  ShieldCheck, 
  Zap, 
  Camera, 
  Wand2 
} from 'lucide-react';
import { VisionAnalysisResult, GeneratedAsset } from '../../types';

interface GeminiVisionStudioProps {
  onDeductCredits: (amount: number) => boolean;
  onOpenPricing: () => void;
  onRemixToGenerator: (prompt: string) => void;
}

export const GeminiVisionStudio: React.FC<GeminiVisionStudioProps> = ({
  onDeductCredits,
  onOpenPricing,
  onRemixToGenerator,
}) => {
  const sampleImages = [
    {
      title: 'Neon Cyber Samurai',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    },
    {
      title: 'Alpine Supercar',
      url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80',
    },
    {
      title: 'Fashion Portrait',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
    },
  ];

  const [selectedImage, setSelectedImage] = useState<string>(sampleImages[0].url);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const [analysis, setAnalysis] = useState<VisionAnalysisResult>({
    compositionScore: '9.6 / 10',
    lightingStyle: 'Volumetric Rim Lighting with Cool Ambient Key',
    colorPalette: [
      { hex: '#1e1b4b', name: 'Midnight Indigo' },
      { hex: '#06b6d4', name: 'Electric Cyan' },
      { hex: '#a855f7', name: 'Neon Violet' },
      { hex: '#f59e0b', name: 'Amber Glow' },
      { hex: '#0f172a', name: 'Obsidian Shadow' },
    ],
    detectedSubjects: ['Hero Character Silhouette', 'Atmospheric Ray Dust', 'Rain-Slicked Reflection'],
    cinematographyAdvice: 'Exceptional use of complementary cyan-indigo tones. For heightened cinematic tension, lower key fill by 0.5 EV to deepen the foreground shadows.',
    reversePrompt: 'Masterpiece 8K photograph shot on Arri Alexa 65, 35mm anamorphic lens f/1.4, volumetric rim lighting through atmospheric steam, neon cyan reflections, rich obsidian shadows.',
  });

  const handleAnalyze = async () => {
    const success = onDeductCredits(3);
    if (!success) {
      onOpenPricing();
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/vision-critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: selectedImage,
          promptContext: 'Cinematic Visual Render',
        }),
      });
      const data = await res.json();
      if (data.compositionScore) {
        setAnalysis(data);
      }
    } catch {}

    await new Promise((r) => setTimeout(r, 600));
    setIsAnalyzing(false);
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(analysis.reversePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Eye className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Gemini AI Vision & Cinematography Studio</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Multimodal visual breakdown: reverse-engineer prompts, extract hex color palettes, analyze lighting, and get Hollywood cinematography scores.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Cost: <span className="text-cyan-400 font-bold">3 Credits</span> / vision scan
          </span>
          <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Gemini 3.8 Flash Vision
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Image Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-2">
            <label className="font-semibold text-slate-300 text-xs">Select or Upload Image for Vision Analysis</label>
            <div className="grid grid-cols-3 gap-2">
              {sampleImages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(s.url)}
                  className={`rounded-xl overflow-hidden border aspect-video transition ${
                    selectedImage === s.url ? 'ring-2 ring-cyan-500 border-cyan-400' : 'border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={s.url} alt={s.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Upload Button */}
          <label className="border-2 border-dashed border-slate-800 hover:border-cyan-500/60 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#0d0f17] hover:bg-[#121626] transition text-center group">
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setSelectedImage(URL.createObjectURL(f));
              }} 
              className="hidden" 
            />
            <Upload className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition" />
            <div className="text-xs font-semibold text-slate-200">Upload Image to Analyze</div>
          </label>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-4 px-4 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-xl shadow-cyan-600/25 transition transform active:scale-95 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Scanning Frame with Gemini Vision...</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Run Gemini Vision Analysis (3 Credits)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Analysis Insights (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Composition Score */}
            <div className="p-4 bg-[#0d0f17] border border-slate-800 rounded-2xl space-y-1">
              <div className="text-xs text-slate-400 font-medium">Composition & Depth Score</div>
              <div className="text-2xl font-black text-cyan-400">{analysis.compositionScore}</div>
              <div className="text-[11px] text-slate-500">Gold standard rule of thirds</div>
            </div>

            {/* Lighting Style */}
            <div className="p-4 bg-[#0d0f17] border border-slate-800 rounded-2xl space-y-1">
              <div className="text-xs text-slate-400 font-medium">Lighting Key & Specular</div>
              <div className="text-sm font-bold text-white truncate">{analysis.lightingStyle}</div>
              <div className="text-[11px] text-emerald-400">Atmospheric volumetric pass</div>
            </div>
          </div>

          {/* Color Palette Swatches */}
          <div className="p-4 bg-[#0d0f17] border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-cyan-400" /> Extracted Hex Color Palette
              </span>
              <span className="text-[11px] text-slate-500">Click swatch to copy HEX</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {analysis.colorPalette.map((col, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCopyHex(col.hex)}
                  className="group rounded-xl overflow-hidden border border-slate-800 p-2 bg-slate-900 text-left hover:border-slate-700 transition"
                >
                  <div className="w-full h-8 rounded-lg mb-1.5 shadow-inner" style={{ backgroundColor: col.hex }} />
                  <div className="text-[11px] font-mono font-bold text-white group-hover:text-cyan-300">
                    {copiedHex === col.hex ? 'Copied!' : col.hex}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">{col.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Reverse Engineered Prompt */}
          <div className="p-4 bg-[#0d0f17] border border-slate-800 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-indigo-400" /> Reverse-Engineered AI Prompt
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPrompt}
                  className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => onRemixToGenerator(analysis.reversePrompt)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1"
                >
                  <Wand2 className="w-3 h-3" /> Re-Generate
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono">
              "{analysis.reversePrompt}"
            </p>
          </div>

          {/* Cinematography Advice */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1 text-xs">
            <span className="font-bold text-slate-300">Director of Photography Note:</span>
            <p className="text-slate-400 leading-relaxed">{analysis.cinematographyAdvice}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
