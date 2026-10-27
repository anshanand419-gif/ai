import React, { useState } from 'react';
import { 
  FolderHeart, 
  Play, 
  Download, 
  Copy, 
  Trash2, 
  Search, 
  Filter, 
  Check, 
  Sparkles, 
  ExternalLink,
  X
} from 'lucide-react';
import { GeneratedAsset, ToolType } from '../../types';
import { downloadVideoFile } from '../../utils/videoHelper';

interface GalleryAssetsProps {
  assets: GeneratedAsset[];
  onDeleteAsset: (id: string) => void;
  onSelectTool: (tool: ToolType) => void;
}

export const GalleryAssets: React.FC<GalleryAssetsProps> = ({
  assets,
  onDeleteAsset,
  onSelectTool,
}) => {
  const [filterTool, setFilterTool] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeAsset, setActiveAsset] = useState<GeneratedAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filterTabs = [
    { id: 'all', label: 'All Assets' },
    { id: 'cartoon', label: 'Cartoon & Anime' },
    { id: 'image2video', label: 'Image to Video' },
    { id: 'translator', label: 'Lip-Sync Dubs' },
    { id: 'bgremover', label: 'Cutouts' },
    { id: 'adcreator', label: 'Video Ads' },
    { id: 'captions', label: 'Auto-Captions' },
  ];

  const filteredAssets = assets.filter((asset) => {
    const matchesTool = filterTool === 'all' || asset.tool === filterTool;
    const matchesSearch = 
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.prompt && asset.prompt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (asset.tags && asset.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesTool && matchesSearch;
  });

  const handleCopyPrompt = (asset: GeneratedAsset) => {
    if (asset.prompt) {
      navigator.clipboard.writeText(asset.prompt);
      setCopiedId(asset.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDownload = (asset: GeneratedAsset) => {
    const filename = `PixAI-${asset.title.replace(/[^a-zA-Z0-9]/g, '-')}.${asset.type === 'image' ? 'png' : 'mp4'}`;
    if (asset.type === 'video') {
      downloadVideoFile(asset.url, filename);
    } else {
      const link = document.createElement('a');
      link.href = asset.url;
      link.download = filename;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <FolderHeart className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">My Assets & Generation Gallery</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Access your rendered 4K videos, animated clips, ad storyboards, and cutouts. Download or share anytime.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-semibold bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Total Stored: <span className="text-white font-bold">{assets.length} Assets</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTool(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filterTool === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[#0d0f17] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompt or tag..."
            className="w-full bg-[#0d0f17] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-16 bg-[#0d0f17] border border-slate-800 rounded-2xl space-y-3">
          <FolderHeart className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="text-base font-bold text-white">No creations found</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, or launch any AI tool to start generating your first viral clip.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-[#0d0f17] border border-slate-800 rounded-2xl overflow-hidden shadow-lg group hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                {/* Media Preview Box */}
                <div 
                  onClick={() => setActiveAsset(asset)}
                  className="relative aspect-video bg-black overflow-hidden cursor-pointer"
                >
                  <img
                    src={asset.thumbnail}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-2xl transform group-hover:scale-110 transition">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                      {asset.tool}
                    </span>
                  </div>

                  {asset.duration && (
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/80 rounded text-[10px] font-mono text-white">
                      {asset.duration}
                    </span>
                  )}
                </div>

                {/* Content details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-white line-clamp-1">{asset.title}</h3>
                    <span className="text-[10px] text-slate-500 shrink-0">{asset.createdAt}</span>
                  </div>

                  {asset.prompt && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      "{asset.prompt}"
                    </p>
                  )}

                  {asset.tags && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {asset.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-4 py-3 bg-slate-900/50 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleCopyPrompt(asset)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 transition"
                  title="Copy Prompt"
                >
                  {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === asset.id ? 'Copied' : 'Prompt'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(asset)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                    title="Download Asset"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteAsset(asset.id)}
                    className="p-1.5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Asset Preview Modal */}
      {activeAsset && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setActiveAsset(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-[#0f121e] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveAsset(null)}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video bg-black flex items-center justify-center">
              {activeAsset.type === 'video' ? (
                <video
                  src={activeAsset.url}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={activeAsset.url}
                  alt={activeAsset.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{activeAsset.title}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">{activeAsset.createdAt} • {activeAsset.style || activeAsset.tool}</div>
                </div>
                <button
                  onClick={() => handleDownload(activeAsset)}
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
                >
                  <Download className="w-4 h-4" /> Download 4K File
                </button>
              </div>

              {activeAsset.prompt && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <div className="text-slate-500 font-semibold mb-1">Prompt:</div>
                  "{activeAsset.prompt}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
