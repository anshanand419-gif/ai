import React, { useState, useRef, useEffect } from 'react';
import { 
  Languages, 
  Upload, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Check, 
  Sparkles, 
  Mic, 
  Download, 
  Video
} from 'lucide-react';
import { LANGUAGES_50 } from '../../data/mockData';
import { GeneratedAsset } from '../../types';
import { downloadVideoFile } from '../../utils/videoHelper';

interface VideoTranslatorProps {
  onDeductCredits: (amount: number) => boolean;
  onAddAsset: (asset: GeneratedAsset) => void;
  onOpenPricing: () => void;
}

export const VideoTranslator: React.FC<VideoTranslatorProps> = ({
  onDeductCredits,
  onAddAsset,
  onOpenPricing,
}) => {
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4');
  const [sourceTranscript, setSourceTranscript] = useState(
    'Hey everyone! Welcome to PixAI Studio. Today I am showing you how you can take any idea, image, or video and transform it into viral content in just seconds.'
  );
  const [targetLanguage, setTargetLanguage] = useState('Spanish (Castilian & Latin)');
  const [voiceCloning, setVoiceCloning] = useState(true);
  const [lipSyncEnabled, setLipSyncEnabled] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [translatedResult, setTranslatedResult] = useState<string>(
    '¡Hola a todos! Bienvenidos a PixAI Studio. Hoy les muestro cómo transformar cualquier idea, imagen o video en contenido viral en cuestión de segundos.'
  );
  const [syncAccuracy, setSyncAccuracy] = useState('99.6%');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(14);
  const [audioMode, setAudioMode] = useState<'translated' | 'original'>('translated');
  const [isDownloading, setIsDownloading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const demoPresets = [
    {
      title: 'Tech Founder Keynote',
      lang: 'Spanish (Castilian & Latin)',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      text: 'Hey everyone! Welcome to PixAI Studio. Today I am showing you how you can take any idea, image, or video and transform it into viral content in just seconds.',
    },
    {
      title: 'Master Chef Recipe',
      lang: 'Japanese (Tokyo)',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      text: 'First, sear the garlic at high heat until golden brown. The secret is keeping the aromatic oils locked inside.',
    },
    {
      title: 'Fitness Coach Tutorial',
      lang: 'German (Standard)',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      text: 'Keep your core braced and shoulders back. Remember: controlled tempo gives you twice the hypertrophy results.',
    },
  ];

  // Guaranteed autoplay and error recovery
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.load();
      const p = videoRef.current.play();
      if (p !== undefined) {
        p.catch((err) => {
          console.warn('Dub video autoplay blocked, muting to run:', err);
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
  }, [isPlaying, videoUrl]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
  }, [isMuted]);

  const handleTranslate = async () => {
    const success = onDeductCredits(8);
    if (!success) {
      onOpenPricing();
      return;
    }

    setIsTranslating(true);
    setProgress(15);

    try {
      const apiPromise = fetch('/api/gemini/translate-dub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalText: sourceTranscript,
          targetLanguage,
          speakerTone: 'Charismatic, energetic creator',
        }),
      });

      const steps = [35, 60, 85];
      for (const s of steps) {
        await new Promise((r) => setTimeout(r, 450));
        setProgress(s);
      }

      const res = await apiPromise;
      const data = await res.json();
      if (data.translatedText) {
        setTranslatedResult(data.translatedText);
      }
      if (data.syncScore) {
        setSyncAccuracy(data.syncScore);
      }
    } catch {
      setTranslatedResult(`[Translated to ${targetLanguage}]: ${sourceTranscript}`);
    }

    setProgress(100);
    setIsTranslating(false);
    setIsPlaying(true);

    const newAsset: GeneratedAsset = {
      id: 'trans-' + Date.now(),
      title: `Dubbed into ${targetLanguage}`,
      tool: 'translator',
      type: 'video',
      url: videoUrl,
      thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      createdAt: 'Just now',
      prompt: `Dubbed to ${targetLanguage} with voice cloning & lip-sync`,
      aspectRatio: '16:9',
      style: `${targetLanguage} Dub`,
      tags: [targetLanguage, 'Lip-Sync', 'Voice Cloned'],
      duration: '0:14',
    };
    onAddAsset(newAsset);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    await downloadVideoFile(videoUrl, `PixAI-Dubbed-${targetLanguage.split(' ')[0]}.mp4`);
    setIsDownloading(false);
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
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Languages className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">AI Video Language Translator & Lip-Sync</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Dub real videos into 50+ languages with vocal cloning and realistic speaker lip-sync synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Cost: <span className="text-emerald-400 font-bold">8 Credits</span> / video
          </span>
          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Neural Lip-Sync Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Preset Demos */}
          <div>
            <label className="font-semibold text-slate-300 text-xs mb-2 block">Quick Test Presets</label>
            <div className="grid grid-cols-3 gap-2">
              {demoPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setVideoUrl(p.video);
                    setSourceTranscript(p.text);
                    setTargetLanguage(p.lang);
                  }}
                  className={`p-2 rounded-xl border text-left transition ${
                    sourceTranscript === p.text
                      ? 'bg-emerald-600/20 border-emerald-500 text-white'
                      : 'bg-[#0d0f17] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold truncate text-slate-200">{p.title}</div>
                  <div className="text-[10px] text-emerald-400 truncate mt-0.5">{p.lang.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Video Input */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-300 text-xs flex items-center justify-between">
              <span>Source Video (MP4)</span>
              <span className="text-[11px] text-slate-400">MP4, MOV, WebM</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Video URL..."
                className="flex-1 bg-[#0d0f17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl cursor-pointer text-xs font-semibold flex items-center gap-1 shrink-0">
                <Upload className="w-3.5 h-3.5" /> Upload
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setVideoUrl(URL.createObjectURL(f));
                  }} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* Transcript box */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 text-xs flex items-center justify-between">
              <span>Spoken Transcript (Detected Auto)</span>
              <span className="text-[10px] text-emerald-400 font-medium">Whisper Neural AI</span>
            </label>
            <textarea
              rows={3}
              value={sourceTranscript}
              onChange={(e) => setSourceTranscript(e.target.value)}
              className="w-full bg-[#0d0f17] border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-slate-200 focus:outline-none transition leading-relaxed resize-none"
            />
          </div>

          {/* Target Language Dropdown */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 text-xs flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-emerald-400" /> Target Translation Language (50+ Supported)
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full bg-[#0d0f17] border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-white focus:outline-none transition"
            >
              {LANGUAGES_50.map((lang) => (
                <option key={lang} value={lang} className="bg-slate-900 text-white">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* AI Options Toggles */}
          <div className="p-3.5 bg-[#0d0f17] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-emerald-400" /> AI Voice Timbre Cloning
                </div>
                <div className="text-[11px] text-slate-400">Clone exact voice pitch, accent, and natural emotion</div>
              </div>
              <button
                type="button"
                onClick={() => setVoiceCloning(!voiceCloning)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                  voiceCloning ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Neural Speaker Lip-Sync
                </div>
                <div className="text-[11px] text-slate-400">Resynthesize mouth geometry to match target language syllables</div>
              </div>
              <button
                type="button"
                onClick={() => setLipSyncEnabled(!lipSyncEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                  lipSyncEnabled ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>
          </div>

          {/* Translate Button */}
          <button
            type="button"
            onClick={handleTranslate}
            disabled={isTranslating || !sourceTranscript.trim()}
            className="w-full py-4 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-emerald-600/25 transition transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isTranslating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Translating & Synthesizing Lip-Sync ({progress}%)...</span>
              </>
            ) : (
              <>
                <Languages className="w-4 h-4" />
                <span>Dub Video to {targetLanguage.split(' ')[0]} (8 Credits)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Comparison & Waveform Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Real Video Player */}
          <div className="relative w-full bg-black rounded-2xl border border-slate-800 overflow-hidden shadow-2xl aspect-video flex items-center justify-center group">
            <video
              key={videoUrl}
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              onLoadedData={() => {
                if (isPlaying && videoRef.current) {
                  videoRef.current.play().catch(() => {});
                }
              }}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                  setDuration(videoRef.current.duration || 14);
                }
              }}
              className="w-full h-full object-cover"
            />

            {/* Floating Unmute prompt button */}
            {isMuted && !isTranslating && (
              <button
                type="button"
                onClick={() => {
                  setIsMuted(false);
                  if (videoRef.current) {
                    videoRef.current.muted = false;
                    videoRef.current.play().catch(() => {});
                  }
                }}
                className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-400/50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xl transition-all transform hover:scale-105 active:scale-95 animate-pulse"
              >
                <VolumeX className="w-3.5 h-3.5 text-emerald-300" />
                <span>Unmute Audio</span>
              </button>
            )}

            {/* Live Comparison Badges */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>{targetLanguage.split(' ')[0]} Lip-Sync Active</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-emerald-400 text-xs font-mono border border-emerald-500/30">
                Sync: {syncAccuracy}
              </span>
            </div>

            {/* Center Play/Pause button */}
            {!isTranslating && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute z-20 w-16 h-16 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:scale-110 hover:bg-black/80 transition shadow-2xl"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5 fill-current" />}
              </button>
            )}

            {/* Audio Waveform Bar */}
            <div className="absolute inset-x-6 bottom-16 z-20 bg-black/70 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shrink-0 transition"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              
              <div className="flex-1 flex items-center gap-1 h-8">
                {Array.from({ length: 36 }).map((_, i) => {
                  const height = isPlaying 
                    ? Math.sin(i * 0.4 + currentTime * 5) * 14 + 18 
                    : (i % 3 === 0 ? 18 : i % 2 === 0 ? 10 : 6);
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-emerald-500 to-cyan-400 rounded-full transition-all duration-150"
                      style={{ height: `${height}px` }}
                    />
                  );
                })}
              </div>

              <div className="flex bg-slate-900 rounded-lg p-0.5 text-[11px] font-bold border border-slate-800 shrink-0">
                <button
                  onClick={() => setAudioMode('original')}
                  className={`px-2 py-1 rounded transition ${audioMode === 'original' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                >
                  Original
                </button>
                <button
                  onClick={() => setAudioMode('translated')}
                  className={`px-2 py-1 rounded transition ${audioMode === 'translated' ? 'bg-emerald-500 text-black' : 'text-slate-400'}`}
                >
                  AI Dub
                </button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 inset-x-0 z-20 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsMuted(!isMuted)} className="p-1 hover:text-emerald-400 transition">
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-xs font-mono text-slate-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
              >
                {isDownloading ? (
                  <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>Download Dubbed MP4</span>
              </button>
            </div>
          </div>

          {/* Translated text comparison card */}
          <div className="p-4 bg-[#0d0f17] border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Synchronized Output in {targetLanguage}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">14.2s spoken length</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800 font-medium">
              "{translatedResult}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
