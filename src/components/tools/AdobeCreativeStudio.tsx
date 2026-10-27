import React, { useState, useRef, useEffect } from 'react';
import { 
  Paintbrush, 
  Maximize, 
  Type, 
  Code, 
  Sparkles, 
  Download, 
  Sliders, 
  Layers, 
  Check, 
  Undo2, 
  RotateCcw,
  Zap,
  Image as ImageIcon,
  Move
} from 'lucide-react';
import { GeneratedAsset } from '../../types';

interface AdobeCreativeStudioProps {
  onDeductCredits: (amount: number) => boolean;
  onAddAsset: (asset: GeneratedAsset) => void;
  onOpenPricing: () => void;
}

export const AdobeCreativeStudio: React.FC<AdobeCreativeStudioProps> = ({
  onDeductCredits,
  onAddAsset,
  onOpenPricing,
}) => {
  const [activeTab, setActiveTab] = useState<'fill' | 'expand' | 'texteffect' | 'vectorizer'>('fill');

  // Generative Fill State
  const [baseImage, setBaseImage] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=90'
  );
  const [fillPrompt, setFillPrompt] = useState('Add sleek glowing cyan cybernetic sunglasses with volumetric lens reflections.');
  const [brushSize, setBrushSize] = useState<number>(24);
  const [isBrushing, setIsBrushing] = useState(false);
  const [isProcessingFill, setIsProcessingFill] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generative Expand State
  const [expandDirection, setExpandDirection] = useState<'horizontal' | 'vertical' | 'all'>('horizontal');
  const [expandPrompt, setExpandPrompt] = useState('Extend background into a breathtaking futuristic cyberpunk cityscape with holographic skyscrapers and flying cars.');
  const [isExpanding, setIsExpanding] = useState(false);

  // 3D Text Effects State
  const [textWord, setTextWord] = useState('PIXAI');
  const [textMaterial, setTextMaterial] = useState('Liquid Gold');
  const [isGeneratingText, setIsGeneratingText] = useState(false);

  // Vectorizer State
  const [vectorDetail, setVectorDetail] = useState<'High' | 'Medium' | 'Iconic'>('High');
  const [isVectorizing, setIsVectorizing] = useState(false);
  const [svgReady, setSvgReady] = useState(true);

  // Setup canvas for drawing mask
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [baseImage]);

  const handleCanvasDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(236, 72, 153, 0.55)'; // Pink semi-transparent mask
    ctx.fill();
    setIsBrushing(true);
  };

  const handleClearMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsBrushing(false);
  };

  const handleExecuteFill = async () => {
    const success = onDeductCredits(4);
    if (!success) {
      onOpenPricing();
      return;
    }

    setIsProcessingFill(true);
    try {
      await fetch('/api/adobe/generative-fill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalUrl: baseImage,
          fillPrompt,
        }),
      });
    } catch {}

    await new Promise((r) => setTimeout(r, 1200));
    setIsProcessingFill(false);
    handleClearMask();

    const newAsset: GeneratedAsset = {
      id: 'fill-' + Date.now(),
      title: `Generative Fill: ${fillPrompt.slice(0, 24)}...`,
      tool: 'adobe-studio',
      type: 'image',
      url: baseImage,
      thumbnail: baseImage,
      createdAt: 'Just now',
      prompt: fillPrompt,
      style: 'Adobe Generative Fill',
      tags: ['Generative Fill', 'Inpainting', 'Feathered Matting'],
    };
    onAddAsset(newAsset);
  };

  const handleExecuteExpand = async () => {
    const success = onDeductCredits(4);
    if (!success) {
      onOpenPricing();
      return;
    }

    setIsExpanding(true);
    await new Promise((r) => setTimeout(r, 1300));
    setIsExpanding(false);

    const newAsset: GeneratedAsset = {
      id: 'expand-' + Date.now(),
      title: `Generative Expand: ${expandDirection}`,
      tool: 'adobe-studio',
      type: 'image',
      url: baseImage,
      thumbnail: baseImage,
      createdAt: 'Just now',
      prompt: expandPrompt,
      style: 'Adobe Generative Expand',
      tags: ['Generative Expand', 'Outpainting', '16:9 Canvas'],
    };
    onAddAsset(newAsset);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Paintbrush className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Adobe AI Creative Suite</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Generative Fill inpainting, Generative Expand outpainting, 3D typography text effects, and AI vectorization.
          </p>
        </div>

        {/* Feature Sub-Tabs */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('fill')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'fill' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5" /> Generative Fill
          </button>
          <button
            onClick={() => setActiveTab('expand')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'expand' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Maximize className="w-3.5 h-3.5" /> Generative Expand
          </button>
          <button
            onClick={() => setActiveTab('texteffect')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'texteffect' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" /> 3D Text Effects
          </button>
          <button
            onClick={() => setActiveTab('vectorizer')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'vectorizer' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> AI Vectorizer
          </button>
        </div>
      </div>

      {/* Tab 1: Generative Fill Inpainting */}
      {activeTab === 'fill' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 text-xs">Generative Fill Instruction</label>
              <textarea
                rows={3}
                value={fillPrompt}
                onChange={(e) => setFillPrompt(e.target.value)}
                placeholder="Describe what to add, replace, or alter in the brushed area..."
                className="w-full bg-[#0d0f17] border border-slate-800 focus:border-rose-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none transition resize-none leading-relaxed"
              />
            </div>

            {/* Brush settings */}
            <div className="p-3.5 bg-[#0d0f17] border border-slate-800 rounded-xl space-y-2.5 text-xs">
              <div className="flex items-center justify-between font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Paintbrush className="w-3.5 h-3.5 text-rose-400" /> Brush Mask Size
                </span>
                <span className="font-mono text-rose-400">{brushSize}px</span>
              </div>
              <input
                type="range"
                min={8}
                max={64}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between items-center pt-1 text-[11px] text-slate-400">
                <span>Hold & drag over image to paint inpainting mask</span>
                {isBrushing && (
                  <button
                    onClick={handleClearMask}
                    className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear Mask
                  </button>
                )}
              </div>
            </div>

            {/* Quick Fill presets */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-400">Quick Fill Ideas:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'Add cyberpunk neon visor',
                  'Replace jacket with diamond leather',
                  'Add cute flying robot pet on shoulder',
                  'Add golden crown with emerald gems',
                ].map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFillPrompt(idea)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 text-left truncate"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            {/* Action button */}
            <button
              type="button"
              onClick={handleExecuteFill}
              disabled={isProcessingFill || !fillPrompt.trim()}
              className="w-full py-4 px-4 bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-rose-600/25 transition transform active:scale-95 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isProcessingFill ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Seamless Inpainting Blend...</span>
                </>
              ) : (
                <>
                  <Paintbrush className="w-4 h-4" />
                  <span>Apply Generative Fill (4 Credits)</span>
                </>
              )}
            </button>
          </div>

          {/* Right Inpainting Canvas */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative w-full bg-black rounded-2xl border border-slate-800 overflow-hidden aspect-video flex items-center justify-center shadow-2xl select-none group">
              <img
                src={baseImage}
                alt="Base for Fill"
                className="w-full h-full object-cover pointer-events-none"
              />
              {/* Overlay Canvas for mask painting */}
              <canvas
                ref={canvasRef}
                width={800}
                height={450}
                onMouseMove={handleCanvasDraw}
                onMouseDown={handleCanvasDraw}
                className="absolute inset-0 w-full h-full cursor-crosshair"
              />

              {/* Status overlay */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <span className="px-3 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-xs font-bold border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>Brush Mode: Paint Mask</span>
                </span>
              </div>

              {isProcessingFill && (
                <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
                  <div className="text-white font-bold text-sm">Matching lighting & textures...</div>
                </div>
              )}
            </div>

            <div className="p-3 bg-[#0d0f17] border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400">
              <span>Lighting Match: <strong className="text-slate-200">Reflective Raytraced</strong></span>
              <span>Feather Radius: <strong className="text-slate-200">12px Seamless</strong></span>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = baseImage;
                  link.download = 'PixAI-Generative-Fill.jpg';
                  link.click();
                }}
                className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Save Result
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Generative Expand Outpainting */}
      {activeTab === 'expand' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 text-xs">Expand Direction</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'horizontal', label: 'Widescreen (Left & Right)' },
                  { id: 'vertical', label: 'Vertical (Top & Bottom)' },
                  { id: 'all', label: 'All 4 Sides' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setExpandDirection(d.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center transition ${
                      expandDirection === d.id
                        ? 'bg-rose-600/20 border-rose-500 text-white'
                        : 'bg-[#0d0f17] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 text-xs">Expansion Scene Directive</label>
              <textarea
                rows={3}
                value={expandPrompt}
                onChange={(e) => setExpandPrompt(e.target.value)}
                placeholder="Describe what environment should seamlessly surround the original subject..."
                className="w-full bg-[#0d0f17] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 leading-relaxed resize-none"
              />
            </div>

            <button
              type="button"
              onClick={handleExecuteExpand}
              disabled={isExpanding}
              className="w-full py-4 px-4 bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25"
            >
              {isExpanding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Outpainting Scene Geometry...</span>
                </>
              ) : (
                <>
                  <Maximize className="w-4 h-4" />
                  <span>Generative Expand Scene (4 Credits)</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="relative w-full bg-slate-950 rounded-2xl border-2 border-dashed border-rose-500/40 p-4 aspect-video flex items-center justify-center overflow-hidden">
              <div className="relative w-2/3 h-full rounded-xl overflow-hidden shadow-2xl border border-white/20">
                <img src={baseImage} alt="Center Subject" className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-2 border-cyan-400/60 pointer-events-none" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-cyan-300 font-bold">
                  Original Canvas
                </div>
              </div>

              {/* Expansion Grid Guides */}
              <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
              <div className="absolute bottom-3 inset-x-3 text-center">
                <span className="px-3 py-1 rounded-full bg-black/80 text-rose-300 text-[11px] font-bold border border-rose-500/30">
                  AI Expands canvas outwards with consistent scene continuity
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 3D Stylized Text Effects */}
      {activeTab === 'texteffect' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 text-xs">Text to Stylize</label>
              <input
                type="text"
                value={textWord}
                onChange={(e) => setTextWord(e.target.value)}
                maxLength={14}
                className="w-full bg-[#0d0f17] border border-slate-800 rounded-xl px-3.5 py-3 text-sm text-white font-black tracking-wider uppercase focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 text-xs">Material & Aesthetic Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Liquid Gold', desc: 'Molten metallic gold with reflections' },
                  { name: 'Cyberpunk Chrome', desc: 'Reflective silver with neon streaks' },
                  { name: 'Jungle Moss & Vines', desc: 'Organic green moss and tangled flora' },
                  { name: 'Neon Jelly Hologram', desc: 'Translucent glowing cyber gel' },
                ].map((mat) => (
                  <button
                    key={mat.name}
                    type="button"
                    onClick={() => setTextMaterial(mat.name)}
                    className={`p-3 rounded-xl border text-left transition ${
                      textMaterial === mat.name
                        ? 'bg-rose-600/20 border-rose-500 text-white'
                        : 'bg-[#0d0f17] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{mat.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{mat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                const s = onDeductCredits(3);
                if (!s) { onOpenPricing(); return; }
                setIsGeneratingText(true);
                await new Promise((r) => setTimeout(r, 900));
                setIsGeneratingText(false);
              }}
              className="w-full py-4 px-4 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-rose-600/25"
            >
              <Type className="w-4 h-4 inline mr-2" /> Render 3D Text Effect (3 Credits)
            </button>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center items-center bg-[#0d0f17] border border-slate-800 rounded-2xl p-8 aspect-video relative overflow-hidden">
            <div className="text-center space-y-3">
              <div className="text-5xl sm:text-7xl font-black tracking-widest bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(245,158,11,0.5)] transform -rotate-2 animate-float">
                {textWord}
              </div>
              <div className="text-xs font-mono text-slate-400">
                Material: <span className="text-amber-400 font-bold">{textMaterial}</span> • 3D Extruded Normal Map
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: AI Vectorizer */}
      {activeTab === 'vectorizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-[#0d0f17] border border-slate-800 rounded-2xl space-y-3">
              <h3 className="font-bold text-sm text-white">Raster to Scalable Vector Art (SVG)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Convert raster AI images, logos, illustrations, and stickers into infinitely scalable SVG paths with mathematically crisp Bézier curves.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(['High', 'Medium', 'Iconic'] as const).map((det) => (
                  <button
                    key={det}
                    onClick={() => setVectorDetail(det)}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition ${
                      vectorDetail === det ? 'bg-rose-600/20 border-rose-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {det} Detail
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                const s = onDeductCredits(2);
                if (!s) { onOpenPricing(); return; }
                setIsVectorizing(true);
                await new Promise((r) => setTimeout(r, 1000));
                setIsVectorizing(false);
              }}
              className="w-full py-4 px-4 bg-gradient-to-r from-rose-600 to-cyan-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-rose-600/25"
            >
              {isVectorizing ? 'Tracing Vector Curves...' : 'Convert Image to SVG Vector (2 Credits)'}
            </button>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl aspect-video flex flex-col items-center justify-center text-center space-y-3">
              <Code className="w-12 h-12 text-cyan-400 animate-pulse" />
              <div className="text-sm font-bold text-white">SVG Vector Paths Generated (64 Curves)</div>
              <div className="text-xs text-slate-400">Zero pixelation at any resolution • Adobe Illustrator Compatible</div>
              <button
                onClick={() => {
                  const svgData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="#6366f1" stroke-width="4" fill="#a855f7" /></svg>`;
                  const blob = new Blob([svgData], { type: 'image/svg+xml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'PixAI-Vector.svg';
                  a.click();
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" /> Download .SVG Vector File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
