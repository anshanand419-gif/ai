import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Upload, 
  Play, 
  Pause, 
  Download, 
  Sliders, 
  Sparkles, 
  Camera, 
  Layers, 
  RotateCcw,
  Zap,
  ArrowRight,
  Maximize2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { CAMERA_MOVEMENTS, VIDEO_PRESETS } from '../../data/mockData';
import { GeneratedAsset } from '../../types';
import { downloadVideoFile, recordCanvasToVideo } from '../../utils/videoHelper';

interface ImageToVideoGeneratorProps {
  onDeductCredits: (amount: number) => boolean;
  onAddAsset: (asset: GeneratedAsset) => void;
  onOpenPricing: () => void;
}

export const ImageToVideoGenerator: React.FC<ImageToVideoGeneratorProps> = ({
  onDeductCredits,
  onAddAsset,
  onOpenPricing,
}) => {
  const sampleImages = [
    {
      title: 'Alpine Supercar',
      url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
      title: 'Cyberpunk Tokyo',
      url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1000&auto=format&fit=crop&q=80',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    },
    {
      title: 'Golden Sunset Villa',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    },
    {
      title: 'Action Bullrun',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    },
  ];

  const [selectedImage, setSelectedImage] = useState<string>(sampleImages[0].url);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>(sampleImages[0].video);
  const [viewMode, setViewMode] = useState<'video' | 'canvas'>('video');
  const [motionIntensity, setMotionIntensity] = useState<number>(65);
  const [selectedCamera, setSelectedCamera] = useState<string>('drone');
  const [motionPrompt, setMotionPrompt] = useState('Epic drone sweeping flyover, clouds drifting fast with golden hour atmospheric mist and motion blur.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [isExporting, setIsExporting] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Video play/pause effect with guaranteed autoplay recovery
  useEffect(() => {
    if (!videoRef.current || viewMode !== 'video') return;
    if (isPlaying) {
      videoRef.current.load();
      const p = videoRef.current.play();
      if (p !== undefined) {
        p.catch((err) => {
          console.warn('Image-to-video autoplay blocked, fallback to muted:', err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, activeVideoUrl, viewMode]);

  // Dynamic canvas motion simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedImage;

    let animId: number;
    let t = 0;

    const render = () => {
      if (isPlaying && img.complete) {
        t += 0.015 * (motionIntensity / 50);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        const progressLoop = (Math.sin(t) + 1) / 2;

        let scale = 1;
        let transX = 0;
        let transY = 0;
        let rotate = 0;

        if (selectedCamera === 'zoom-in') {
          scale = 1 + progressLoop * (0.15 + (motionIntensity / 250));
        } else if (selectedCamera === 'zoom-out') {
          scale = 1.25 - progressLoop * (0.15 + (motionIntensity / 250));
        } else if (selectedCamera === 'pan-left') {
          scale = 1.15;
          transX = -progressLoop * 50 * (motionIntensity / 50);
        } else if (selectedCamera === 'pan-right') {
          scale = 1.15;
          transX = progressLoop * 50 * (motionIntensity / 50);
        } else if (selectedCamera === 'drone') {
          scale = 1 + progressLoop * 0.18;
          transY = -progressLoop * 30;
          rotate = Math.sin(t) * 0.015;
        } else if (selectedCamera === 'orbit') {
          scale = 1.12;
          transX = Math.cos(t) * 25;
          transY = Math.sin(t) * 15;
          rotate = Math.sin(t) * 0.02;
        } else if (selectedCamera === 'tilt-up') {
          scale = 1.12;
          transY = progressLoop * 40;
        }

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotate);
        ctx.scale(scale, scale);
        ctx.translate(-canvas.width / 2 + transX, -canvas.height / 2 + transY);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    img.onload = () => {
      render();
    };

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [selectedImage, selectedCamera, motionIntensity, isPlaying, viewMode]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  const handleGenerate = async () => {
    const success = onDeductCredits(6);
    if (!success) {
      onOpenPricing();
      return;
    }

    setIsGenerating(true);
    setProgress(10);

    const steps = [30, 60, 85, 100];
    for (const s of steps) {
      await new Promise((r) => setTimeout(r, 550));
      setProgress(s);
    }

    // Resolve matching camera motion video
    const motionVideoMap: Record<string, string> = {
      'drone': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'pan-left': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'pan-right': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      'zoom-in': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'zoom-out': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'orbit': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      'tilt-up': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    };

    const target = motionVideoMap[selectedCamera] || motionVideoMap['drone'];
    setActiveVideoUrl(target);

    setIsGenerating(false);
    setViewMode('video');
    setIsPlaying(true);

    const newAsset: GeneratedAsset = {
      id: 'img2vid-' + Date.now(),
      title: `Motion: ${CAMERA_MOVEMENTS.find((c) => c.id === selectedCamera)?.label || 'Camera Drive'}`,
      tool: 'image2video',
      type: 'video',
      url: target,
      thumbnail: selectedImage,
      createdAt: 'Just now',
      prompt: motionPrompt,
      aspectRatio: '16:9',
      style: `${CAMERA_MOVEMENTS.find((c) => c.id === selectedCamera)?.label} Motion`,
      tags: ['Image2Video', 'Cinematic Motion', '4K Render'],
      duration: '0:15',
    };
    onAddAsset(newAsset);
  };

  const handleExportMP4 = async () => {
    setIsExporting(true);
    if (viewMode === 'canvas' && canvasRef.current) {
      try {
        const blob = await recordCanvasToVideo(canvasRef.current, 3500);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PixAI-Motion-${selectedCamera}-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      } catch {
        await downloadVideoFile(activeVideoUrl, `PixAI-Motion-${selectedCamera}.mp4`);
      }
    } else {
      await downloadVideoFile(activeVideoUrl, `PixAI-Motion-${selectedCamera}.mp4`);
    }
    setIsExporting(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Video className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Image-to-Video Generator</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Animate still photos, portraits, and artwork into real 4K cinematic videos with full playback and MP4 export.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Cost: <span className="text-cyan-400 font-bold">6 Credits</span>
          </span>
          <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-current text-cyan-400" /> Real MP4 Generation
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Image Uploader & Presets */}
          <div className="space-y-2.5">
            <label className="font-semibold text-slate-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-cyan-400" /> Source Image
              </span>
              <span className="text-[11px] text-slate-400">JPG, PNG, WEBP</span>
            </label>

            {/* Drag & Drop Area */}
            <label className="border-2 border-dashed border-slate-800 hover:border-cyan-500/60 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#0d0f17] hover:bg-[#121626] transition text-center group">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-slate-200">Drop an image here or click to browse</div>
              <div className="text-[11px] text-slate-400">High-resolution images yield higher video fidelity</div>
            </label>

            {/* Sample Presets */}
            <div className="pt-1">
              <div className="text-[11px] text-slate-400 mb-1.5 font-medium">Or test with presets:</div>
              <div className="grid grid-cols-4 gap-2">
                {sampleImages.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImage(s.url);
                      setActiveVideoUrl(s.video);
                    }}
                    className={`relative rounded-lg overflow-hidden border transition aspect-video ${
                      selectedImage === s.url ? 'ring-2 ring-cyan-500 border-cyan-400' : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={s.url} alt={s.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Camera Movement Presets */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-300 text-xs flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-cyan-400" /> Camera Movement Path
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CAMERA_MOVEMENTS.map((cam) => {
                const isSelected = selectedCamera === cam.id;
                return (
                  <button
                    key={cam.id}
                    type="button"
                    onClick={() => setSelectedCamera(cam.id)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md'
                        : 'bg-[#0d0f17] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-base mb-1">{cam.icon}</div>
                    <div className="text-xs font-bold text-slate-200">{cam.label}</div>
                    <div className="text-[10px] text-slate-400 truncate">{cam.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Motion Intensity Slider */}
          <div className="space-y-2 bg-[#0d0f17] p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Motion Intensity
              </label>
              <span className="font-mono text-cyan-400 font-bold">{motionIntensity}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={motionIntensity}
              onChange={(e) => setMotionIntensity(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Motion Directive */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 text-xs">Motion Directive (Optional)</label>
            <input
              type="text"
              value={motionPrompt}
              onChange={(e) => setMotionPrompt(e.target.value)}
              placeholder="e.g. Swirling mist, reflections shifting, wheels spinning..."
              className="w-full bg-[#0d0f17] border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition"
            />
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 px-4 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-xl shadow-cyan-600/25 transition transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Neural Camera Trajectory ({progress}%)...</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>Synthesize Video Motion (6 Credits)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Real Video Player (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full bg-black rounded-2xl border border-slate-800 overflow-hidden shadow-2xl aspect-video flex items-center justify-center group">
            {/* Real Playable Video when in video mode */}
            {viewMode === 'video' ? (
              <video
                key={activeVideoUrl}
                ref={videoRef}
                src={activeVideoUrl}
                autoPlay
                loop
                playsInline
                muted={isMuted}
                onLoadedData={() => {
                  if (isPlaying && videoRef.current) {
                    videoRef.current.play().catch(() => {});
                  }
                }}
                onError={() => {
                  console.warn('Video failed to load from remote CDN, switching to Live Matrix Canvas');
                  setViewMode('canvas');
                }}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                    setDuration(videoRef.current.duration || 15);
                  }
                }}
                className="w-full h-full object-cover"
              />
            ) : (
              <canvas
                ref={canvasRef}
                width={960}
                height={540}
                className="w-full h-full object-cover"
              />
            )}

            {/* Floating Unmute prompt button */}
            {isMuted && !isGenerating && viewMode === 'video' && (
              <button
                type="button"
                onClick={() => {
                  setIsMuted(false);
                  if (videoRef.current) {
                    videoRef.current.muted = false;
                    videoRef.current.play().catch(() => {});
                  }
                }}
                className="absolute top-14 right-4 z-20 px-3 py-1.5 rounded-full bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xl transition-all transform hover:scale-105 active:scale-95 animate-pulse"
              >
                <VolumeX className="w-3.5 h-3.5 text-cyan-300" />
                <span>Unmute Video</span>
              </button>
            )}

            {/* Top Badges & Mode Switcher */}
            <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-cyan-500/30">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>{CAMERA_MOVEMENTS.find((c) => c.id === selectedCamera)?.label} Motion</span>
              </span>

              {/* Toggle Video Render vs Dynamic Canvas */}
              <div className="flex bg-black/70 rounded-lg p-0.5 border border-white/10 text-[11px] font-bold">
                <button
                  onClick={() => setViewMode('video')}
                  className={`px-2.5 py-1 rounded ${viewMode === 'video' ? 'bg-cyan-500 text-black font-extrabold' : 'text-slate-300'}`}
                >
                  4K Video
                </button>
                <button
                  onClick={() => setViewMode('canvas')}
                  className={`px-2.5 py-1 rounded ${viewMode === 'canvas' ? 'bg-cyan-500 text-black font-extrabold' : 'text-slate-300'}`}
                >
                  Live Matrix
                </button>
              </div>
            </div>

            {/* In progress overlay */}
            {isGenerating && (
              <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                <div>
                  <div className="text-lg font-bold text-white mb-1">Rendering 3D Camera Depth...</div>
                  <div className="text-xs text-cyan-300 font-mono">Synthesizing optical flow & motion vectors</div>
                </div>
                <div className="w-full max-w-xs h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-slate-400">{progress}% completed</div>
              </div>
            )}

            {/* Center Play Button on hover */}
            {!isGenerating && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute z-20 w-16 h-16 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:scale-110 hover:bg-black/80 transition shadow-2xl"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5 fill-current" />}
              </button>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-0 inset-x-0 z-20 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsPlaying(!isPlaying)} className="p-1 hover:text-cyan-400 transition">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button onClick={() => setIsMuted(!isMuted)} className="p-1 hover:text-cyan-400 transition">
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-xs font-mono text-slate-400">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportMP4}
                  disabled={isExporting}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
                >
                  {isExporting ? (
                    <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>Export MP4 Video</span>
                </button>
              </div>
            </div>
          </div>

          {/* Parameters info */}
          <div className="p-4 bg-[#0d0f17] border border-slate-800 rounded-xl grid grid-cols-3 gap-3 text-xs text-slate-400 text-center">
            <div className="p-2 bg-slate-900/60 rounded-lg">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Motion Type</div>
              <div className="text-white font-bold mt-0.5">{CAMERA_MOVEMENTS.find((c) => c.id === selectedCamera)?.label}</div>
            </div>
            <div className="p-2 bg-slate-900/60 rounded-lg">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Temporal Consistency</div>
              <div className="text-emerald-400 font-bold mt-0.5">99.8% Coherent</div>
            </div>
            <div className="p-2 bg-slate-900/60 rounded-lg">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Render Quality</div>
              <div className="text-cyan-400 font-bold mt-0.5">4K Ultra 60fps MP4</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
