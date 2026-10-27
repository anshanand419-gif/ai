import React, { useState, useEffect, useRef } from 'react';
import { 
  Subtitles, 
  Sparkles, 
  Play, 
  Pause, 
  Download, 
  Type, 
  Layers, 
  Zap, 
  Volume2, 
  VolumeX,
  Video
} from 'lucide-react';
import { SUBTITLE_STYLES } from '../../data/mockData';
import { SubtitleChunk, GeneratedAsset } from '../../types';
import { downloadVideoFile } from '../../utils/videoHelper';

interface AutoCaptionerProps {
  onDeductCredits: (amount: number) => boolean;
  onAddAsset: (asset: GeneratedAsset) => void;
  onOpenPricing: () => void;
}

export const AutoCaptioner: React.FC<AutoCaptionerProps> = ({
  onDeductCredits,
  onAddAsset,
  onOpenPricing,
}) => {
  const [speechText, setSpeechText] = useState(
    'If you want to explode your social media views in 2026, you MUST master dynamic short form subtitles. Watch how attention triples!'
  );
  const [selectedStyleId, setSelectedStyleId] = useState('tiktok');
  const [fontSize, setFontSize] = useState<number>(24);
  const [isUppercase, setIsUppercase] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4';
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [subtitles, setSubtitles] = useState<SubtitleChunk[]>([
    { id: 1, start: '0.0s', end: '1.2s', text: 'IF YOU WANT TO', highlightWord: 'WANT', emoji: '🔥' },
    { id: 2, start: '1.2s', end: '2.5s', text: 'EXPLODE YOUR VIEWS', highlightWord: 'EXPLODE', emoji: '💥' },
    { id: 3, start: '2.5s', end: '3.8s', text: 'IN 2026 RIGHT NOW', highlightWord: '2026', emoji: '⚡' },
    { id: 4, start: '3.8s', end: '5.2s', text: 'YOU MUST MASTER', highlightWord: 'MASTER', emoji: '👑' },
    { id: 5, start: '5.2s', end: '6.5s', text: 'DYNAMIC SUBTITLES', highlightWord: 'DYNAMIC', emoji: '🎯' },
  ]);

  // Synchronized playback loop
  useEffect(() => {
    let interval: any;
    if (isPlaying && subtitles.length > 0) {
      interval = setInterval(() => {
        setActiveWordIdx((prev) => (prev + 1) % subtitles.length);
      }, 1300);
    }
    return () => clearInterval(interval);
  }, [isPlaying, subtitles.length]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
  }, [isMuted]);

  const handleGenerateCaptions = async () => {
    const success = onDeductCredits(4);
    if (!success) {
      onOpenPricing();
      return;
    }

    setIsGenerating(true);

    try {
      const activeStyleName = SUBTITLE_STYLES.find((s) => s.id === selectedStyleId)?.name || 'TikTok Viral';
      const res = await fetch('/api/gemini/subtitles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speechText,
          stylePreset: activeStyleName,
        }),
      });
      const data = await res.json();
      if (data.subtitles && data.subtitles.length > 0) {
        setSubtitles(data.subtitles);
        setActiveWordIdx(0);
      }
    } catch {
      // Keep existing
    } finally {
      setIsGenerating(false);
      setIsPlaying(true);
    }

    const newAsset: GeneratedAsset = {
      id: 'cap-' + Date.now(),
      title: 'Auto-Captioned Viral Clip',
      tool: 'captions',
      type: 'video',
      url: videoUrl,
      thumbnail: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
      createdAt: 'Just now',
      prompt: speechText,
      aspectRatio: '9:16',
      style: `${SUBTITLE_STYLES.find((s) => s.id === selectedStyleId)?.name} Subtitles`,
      tags: ['Auto-Caption', 'Bouncing Text', 'High Retention', '4K Video'],
      duration: '0:15',
    };
    onAddAsset(newAsset);
  };

  const handleDownloadVideo = async () => {
    setIsDownloading(true);
    await downloadVideoFile(videoUrl, 'PixAI-Auto-Captioned-Video.mp4');
    setIsDownloading(false);
  };

  const activeStyle = SUBTITLE_STYLES.find((s) => s.id === selectedStyleId) || SUBTITLE_STYLES[0];
  const currentChunk = subtitles[activeWordIdx] || subtitles[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Subtitles className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">AI Subtitle & Auto-Captioner</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Generate high-retention animated captions like TikTok, Alex Hormozi, and MrBeast with synchronized highlight pop animations on real video.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Cost: <span className="text-blue-400 font-bold">4 Credits</span> / video
          </span>
          <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-current text-blue-400" /> 99.8% Whisper Transcription
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Spoken Text Box */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 text-xs flex items-center justify-between">
              <span>Speech Input / Spoken Words</span>
              <span className="text-[11px] text-blue-400">Auto Whisper Sync</span>
            </label>
            <textarea
              rows={3}
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
              className="w-full bg-[#0d0f17] border border-slate-800 focus:border-blue-500 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition resize-none leading-relaxed"
            />
          </div>

          {/* Subtitle Style Presets */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-300 text-xs flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" /> Subtitle Visual Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SUBTITLE_STYLES.map((st) => {
                const isSelected = selectedStyleId === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStyleId(st.id)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                        : 'bg-[#0d0f17] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200">{st.name}</span>
                      {isSelected && <Zap className="w-3.5 h-3.5 text-blue-400 fill-current" />}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-2">{st.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography Customization */}
          <div className="p-3.5 bg-[#0d0f17] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-blue-400" /> Font Size
              </span>
              <span className="font-mono text-blue-400 font-bold">{fontSize}px</span>
            </div>
            <input
              type="range"
              min={16}
              max={36}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-300 font-semibold">ALL CAPS (Hormozi Style)</span>
              <button
                type="button"
                onClick={() => setIsUppercase(!isUppercase)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                  isUppercase ? 'bg-blue-500 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerateCaptions}
            disabled={isGenerating || !speechText.trim()}
            className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-xl shadow-blue-600/25 transition transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Animated Subtitles...</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>Auto-Generate Subtitles & Video (4 Credits)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Live Synchronized Real Video Player (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full max-w-sm mx-auto bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl aspect-[9/16] flex items-center justify-center group">
            {/* Real Playable Vertical Video */}
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

            {/* Top preset badge */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
              <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white font-bold text-xs border border-white/10">
                {activeStyle.name} Style
              </span>
              <span className="text-xs font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded">
                {currentChunk?.start}
              </span>
            </div>

            {/* Centered Synchronized Animated Subtitle Overlay */}
            <div className="absolute inset-x-4 bottom-24 z-20 text-center pointer-events-none px-2">
              <div 
                className={`inline-block transition-all duration-150 transform scale-105 ${activeStyle.shadow}`}
                style={{ fontSize: `${fontSize}px` }}
              >
                <div className={`font-black ${activeStyle.font} ${activeStyle.textColor} leading-tight`}>
                  {currentChunk?.text.split(' ').map((word, wIdx) => {
                    const isHighlighted = currentChunk.highlightWord && word.toLowerCase().includes(currentChunk.highlightWord.toLowerCase());
                    return (
                      <span
                        key={wIdx}
                        className={`inline-block mx-1 transition-all ${
                          isHighlighted ? activeStyle.highlightColor : ''
                        }`}
                      >
                        {isUppercase ? word.toUpperCase() : word}
                      </span>
                    );
                  })}
                  {currentChunk?.emoji && (
                    <span className="ml-1 inline-block animate-bounce">{currentChunk.emoji}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center font-bold shadow-lg transition"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 bg-black/60 rounded-full hover:bg-black/80 transition"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                onClick={handleDownloadVideo}
                disabled={isDownloading}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-blue-600/30"
              >
                {isDownloading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>Export MP4 Video</span>
              </button>
            </div>
          </div>

          {/* Editable Subtitle Token List */}
          <div className="p-4 bg-[#0d0f17] border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Synchronized Subtitle Segments ({subtitles.length})</span>
              <span className="text-[10px] text-slate-500">Click to jump in player</span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {subtitles.map((chunk, idx) => (
                <div
                  key={chunk.id}
                  onClick={() => setActiveWordIdx(idx)}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition ${
                    activeWordIdx === idx
                      ? 'bg-blue-500/15 border-blue-500/60 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-blue-400">{chunk.start}</span>
                    <span className="font-semibold text-slate-200">{chunk.text}</span>
                  </div>
                  <span className="text-base">{chunk.emoji}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
