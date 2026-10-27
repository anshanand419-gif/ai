import React, { useState } from 'react';
import { 
  Compass, 
  Bookmark, 
  Heart, 
  Share2, 
  Sparkles, 
  Search, 
  ExternalLink, 
  Layers, 
  Check, 
  Wand2, 
  Filter, 
  X,
  Plus
} from 'lucide-react';
import { PinItem, ToolType } from '../../types';

interface PinterestDiscoveryProps {
  onRemixPrompt: (prompt: string, tool: ToolType) => void;
  onOpenPricing: () => void;
}

export const PinterestDiscovery: React.FC<PinterestDiscoveryProps> = ({
  onRemixPrompt,
  onOpenPricing,
}) => {
  const [activeBoard, setActiveBoard] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPin, setSelectedPin] = useState<PinItem | null>(null);
  const [savedPins, setSavedPins] = useState<Record<string, boolean>>({});
  const [likedPins, setLikedPins] = useState<Record<string, boolean>>({});

  const boards = [
    { id: 'all', name: 'All Inspiration', count: 32 },
    { id: 'cyberpunk', name: 'Cyberpunk & Sci-Fi', count: 9 },
    { id: 'characters', name: '3D Pixar Characters', count: 8 },
    { id: 'architecture', name: 'Luxury Architecture', count: 7 },
    { id: 'anime', name: 'Anime Concept Art', count: 8 },
  ];

  const pinsData: PinItem[] = [
    {
      id: 'pin-1',
      title: 'Neo-Tokyo Cybernetic Fox Wanderer',
      prompt: 'A sleek cybernetic red fox explorer wearing glowing HUD goggles walking through neon rain in Shibuya, volumetric reflections, octane render 8k.',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      author: 'Kaelen Vance',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      board: 'cyberpunk',
      likes: 1420,
      saves: 852,
      aspectRatio: 'aspect-[3/4]',
      tags: ['Cyberpunk', 'Neon', '3D Render', 'Shibuya'],
      resolution: '4K',
    },
    {
      id: 'pin-2',
      title: 'Pixar Greenhouse Robot Tender',
      prompt: 'Cheerful round Pixar-style robot gently watering glowing miniature bonsai trees on a floating cloud island, soft golden hour sunlight.',
      imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
      author: 'Maya Lin',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      board: 'characters',
      likes: 2180,
      saves: 1340,
      aspectRatio: 'aspect-square',
      tags: ['3D Pixar', 'Robot', 'Whimsical', 'Lighting'],
      resolution: '4K',
    },
    {
      id: 'pin-3',
      title: 'Minimalist Alpine Glass Villa',
      prompt: 'Architectural masterpiece villa perched on misty snowy mountain cliff, floor-to-ceiling glass, warm interior ambient lights, architectural digest style.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      author: 'Stefan Holm',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      board: 'architecture',
      likes: 980,
      saves: 720,
      aspectRatio: 'aspect-[4/3]',
      tags: ['Architecture', 'Modern Villa', 'Snow', 'Glass'],
      resolution: '2K',
    },
    {
      id: 'pin-4',
      title: 'Makoto Shinkai Twin Moon Shrine',
      prompt: 'Japanese anime aesthetic shinto shrine gateway overlooking turquoise sea with twin luminous moons in twilight sky, swirling cherry blossom petals.',
      imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
      author: 'Aoi Tanaka',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      board: 'anime',
      likes: 3120,
      saves: 1980,
      aspectRatio: 'aspect-[9/16]',
      tags: ['Anime', 'Shinkai', 'Moons', 'Cel Shaded'],
      resolution: '4K',
    },
    {
      id: 'pin-5',
      title: 'Electric Hypercar Drone Climb',
      prompt: 'Matte titanium electric hypercar drifting through high alpine mountain hairpins, golden sunset lens flare, motion blur, 35mm film.',
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
      author: 'Chase Miller',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      board: 'cyberpunk',
      likes: 1890,
      saves: 940,
      aspectRatio: 'aspect-[16/9]',
      tags: ['Automotive', 'Drone Shot', 'Sunset', 'Hypercar'],
      resolution: '4K',
    },
    {
      id: 'pin-6',
      title: 'Enchanted Claymation Dragon Baker',
      prompt: 'Tactile stop-motion claymation miniature dragon chef baking glowing star croissants inside a hollow oak tree kitchen.',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      author: 'Elise Dupont',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      board: 'characters',
      likes: 2450,
      saves: 1620,
      aspectRatio: 'aspect-[3/4]',
      tags: ['Claymation', 'Stop Motion', 'Dragon', 'Cute'],
      resolution: '4K',
    },
  ];

  const filteredPins = pinsData.filter((pin) => {
    const matchesBoard = activeBoard === 'all' || pin.board === activeBoard;
    const matchesQuery = 
      pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesBoard && matchesQuery;
  });

  const toggleSavePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLikePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRemix = (pin: PinItem) => {
    onRemixPrompt(pin.prompt, 'nano-banana');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">PinAI Visual Discovery & Moodboards</h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Explore curated AI artwork and viral video prompts. Pin inspirations to your boards and 1-click remix in our studios.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pins, styles, prompts..."
            className="w-full bg-[#0d0f17] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Board Collections Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {boards.map((b) => (
          <button
            key={b.id}
            onClick={() => setActiveBoard(b.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeBoard === b.id
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-[#0d0f17] border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{b.name}</span>
            <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded-full opacity-70">
              {b.count}
            </span>
          </button>
        ))}
      </div>

      {/* Pinterest Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {filteredPins.map((pin) => {
          const isSaved = Boolean(savedPins[pin.id]);
          const isLiked = Boolean(likedPins[pin.id]);

          return (
            <div
              key={pin.id}
              onClick={() => setSelectedPin(pin)}
              className="break-inside-avoid bg-[#0d0f17] border border-slate-800 rounded-3xl overflow-hidden group hover:border-slate-700 transition cursor-pointer relative shadow-xl"
            >
              {/* Media Thumbnail */}
              <div className="relative overflow-hidden bg-black">
                <img
                  src={pin.imageUrl}
                  alt={pin.title}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Hover Quick Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-cyan-300 backdrop-blur-md">
                      {pin.resolution || '4K'}
                    </span>
                    <button
                      onClick={(e) => toggleSavePin(pin.id, e)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow-lg ${
                        isSaved ? 'bg-red-600 text-white' : 'bg-white text-black hover:bg-slate-200'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                      <span>{isSaved ? 'Saved' : 'Pin it'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemix(pin);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 backdrop-blur-md transition shadow-md"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Remix in Studio</span>
                    </button>
                    <button
                      onClick={(e) => toggleLikePin(pin.id, e)}
                      className={`p-2 rounded-full backdrop-blur-md transition ${
                        isLiked ? 'bg-red-500/30 text-red-400' : 'bg-black/60 text-white hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Pin info footer */}
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition line-clamp-1">
                  {pin.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  "{pin.prompt}"
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={pin.authorAvatar} alt={pin.author} className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-[11px] text-slate-300 font-medium truncate max-w-[100px]">{pin.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-400" /> {pin.likes + (isLiked ? 1 : 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bookmark className="w-3 h-3 text-amber-400" /> {pin.saves + (isSaved ? 1 : 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pin Detail Drawer Modal */}
      {selectedPin && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setSelectedPin(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-[#0f121e] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPin(null)}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Image View */}
            <div className="bg-black flex items-center justify-center max-h-[550px]">
              <img src={selectedPin.imageUrl} alt={selectedPin.title} className="w-full h-full object-contain" />
            </div>

            {/* Right Details */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 uppercase">
                    {selectedPin.board}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Heart className="w-4 h-4 text-red-400 fill-current" />
                    <span>{selectedPin.likes} likes</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white">{selectedPin.title}</h3>

                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Full AI Prompt:
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-mono">
                    "{selectedPin.prompt}"
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selectedPin.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom CTAs */}
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    handleRemix(selectedPin);
                    setSelectedPin(null);
                  }}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>1-Click Remix with Nano Banana 4K</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
