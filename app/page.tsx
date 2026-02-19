"use client";
import React, { useEffect, useState } from 'react';

// --- TYPES ---
interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
}

export default function BlehflixInfinity() {
  // --- STATE ---
  const [items, setItems] = useState<Media[]>([]);
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [view, setView] = useState<'browse' | 'details'>('browse');
  const [activeItem, setActiveItem] = useState<Media | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  
  // PLAYER STATE
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [server, setServer] = useState<'ares' | 'backup'>('ares');
  const [playerKey, setPlayerKey] = useState(0);

  const API_KEY = "3c08a2b895c3295cc09d583b3fc279cf";

  // --- EFFECTS ---
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/${type}/top_rated?api_key=${API_KEY}&language=en-US&page=1`)
      .then(res => res.json())
      .then(data => {
        setItems(data.results || []);
        setHeroIndex(0);
      });
  }, [type]);

  // --- HANDLERS ---
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setQuery(term);
    if (term.length > 2) {
      const res = await fetch(`https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${term}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } else {
      setSearchResults([]);
    }
  };

  const openDetails = (item: Media) => {
    setActiveItem(item);
    setView('details');
    setIsStreaming(false);
    setSeason(1);
    setEpisode(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🔥 THE ENGINE: Working 2026 Ares Links
  const getStreamUrl = () => {
    if (!activeItem) return "";
    
    if (server === 'ares') {
      // Primary: vidsrc.cc (Stable Ares)
      return type === 'movie' 
        ? `https://vidsrc.cc/v2/embed/movie/${activeItem.id}`
        : `https://vidsrc.cc/v2/embed/tv/${activeItem.id}/${season}/${episode}`;
    } else {
      // Backup: vidlink.pro (Fast)
      return type === 'movie'
        ? `https://vidlink.pro/movie/${activeItem.id}`
        : `https://vidlink.pro/tv/${activeItem.id}/${season}/${episode}`;
    }
  };

  const displayItems = query.length > 2 ? searchResults : items;
  const currentHero = items[heroIndex];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600 overflow-x-hidden">
      
      {/* --- NAVIGATION --- */}
      <nav className="p-6 flex flex-col md:flex-row justify-between items-center fixed w-full z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-6">
          <h1 onClick={() => {setView('browse'); setQuery('');}} className="text-4xl font-black text-[#E50914] cursor-pointer tracking-tighter hover:scale-105 transition drop-shadow-lg">BLEHFLIX™</h1>
          <div className="flex bg-zinc-900/80 rounded-full p-1 border border-white/10 backdrop-blur-sm">
            <button onClick={() => setType('movie')} className={`px-6 py-1.5 rounded-full text-[10px] font-black uppercase transition ${type === 'movie' ? 'bg-red-600 text-white shadow-lg shadow-red-600/40' : 'text-zinc-500 hover:text-white'}`}>Movies</button>
            <button onClick={() => setType('tv')} className={`px-6 py-1.5 rounded-full text-[10px] font-black uppercase transition ${type === 'tv' ? 'bg-red-600 text-white shadow-lg shadow-red-600/40' : 'text-zinc-500 hover:text-white'}`}>Shows</button>
          </div>
        </div>
        
        <div className="flex flex-1 justify-center max-w-xl w-full px-8 my-4 md:my-0">
          <div className="relative w-full group">
            <input 
              type="text" 
              placeholder={`Search the ${type === 'movie' ? 'Cinematic Universe' : 'Television Database'}...`}
              className="w-full bg-zinc-900/60 border border-zinc-800 px-6 py-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all shadow-inner text-zinc-300 placeholder:text-zinc-600 group-hover:bg-zinc-900"
              value={query}
              onChange={handleSearch}
            />
            <div className="absolute right-4 top-3.5 text-zinc-600">🔍</div>
          </div>
        </div>

        <div className="hidden lg:flex gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 items-center">
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
              <span>ARES: ONLINE</span>
           </div>
        </div>
      </nav>

      {view === 'browse' ? (
        <main className="animate-in fade-in duration-700">
          
          {/* --- HERO SECTION --- */}
          {currentHero && query.length <= 2 && (
            <div className="relative h-[90vh] w-full flex items-center px-16 group">
              <div className="absolute inset-0 overflow-hidden">
                 <img src={`https://image.tmdb.org/t/p/original${currentHero.backdrop_path}`} className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition duration-[20s]" alt="Hero" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />
              
              <div className="relative z-10 max-w-4xl pt-20 space-y-6">
                <div className="flex gap-3 animate-in slide-in-from-left duration-1000">
                    <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest">
                        TMDB {currentHero.vote_average.toFixed(1)}
                    </span>
                    <span className="bg-red-600 text-white px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20">
                        Top Rated
                    </span>
                </div>
                <h2 className="text-8xl font-black tracking-tighter italic uppercase leading-[0.85] drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
                    {currentHero.title || currentHero.name}
                </h2>
                <p className="text-xl text-zinc-300 line-clamp-3 font-light max-w-2xl leading-relaxed drop-shadow-md">
                    {currentHero.overview}
                </p>
                <div className="flex gap-4 pt-4">
                    <button onClick={() => openDetails(currentHero)} className="bg-red-600 text-white px-12 py-5 rounded-sm font-black hover:bg-white hover:text-black transition-all uppercase tracking-tighter shadow-[0_0_40px_rgba(229,9,20,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95">
                        Play Now
                    </button>
                    <button className="px-12 py-5 rounded-sm font-black text-white border border-white/20 hover:bg-white/10 backdrop-blur-sm transition uppercase tracking-tighter">
                        More Info
                    </button>
                </div>
              </div>
            </div>
          )}

          {/* --- CONTENT GRID --- */}
          <div className={`px-16 pb-32 relative z-20 ${query.length <= 2 ? "-mt-32" : "pt-32"}`}>
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                <span className="w-1 h-8 bg-red-600 block"></span>
                {query.length > 2 ? `Search Results: "${query}"` : "Trending Now"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
              {displayItems.map((item, idx) => (
                <div key={item.id} onClick={() => openDetails(item)} className="group cursor-pointer relative">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-md shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2 z-0 group-hover:z-50 bg-zinc-900 ring-1 ring-white/10 group-hover:ring-red-600">
                    <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750'} className="w-full h-full object-cover" alt="Poster" loading="lazy" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-red-600 font-black text-4xl transform scale-50 group-hover:scale-100 transition duration-300">▶</span>
                    </div>
                  </div>
                  <h4 className="mt-4 text-[11px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-white truncate transition-colors">{item.title || item.name}</h4>
                  <p className="text-[10px] text-zinc-600">{item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        /* --- DETAILS & PLAYER VIEW --- */
        <main className="animate-in slide-in-from-bottom-10 duration-700 min-h-screen pb-20">
          
          {/* HEADER BACKDROP */}
          <div className="relative h-[60vh] w-full">
            <div className="absolute inset-0">
                <img src={`https://image.tmdb.org/t/p/original${activeItem?.backdrop_path}`} className="w-full h-full object-cover opacity-30 mask-image-gradient" alt="Backdrop" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 px-16 pb-12 flex flex-col md:flex-row items-end gap-12">
               <img src={`https://image.tmdb.org/t/p/w500${activeItem?.poster_path}`} className="w-48 rounded-lg shadow-2xl border border-white/10 hidden md:block" />
               <div className="flex-1 space-y-6">
                   <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-white drop-shadow-2xl">
                       {activeItem?.title || activeItem?.name}
                   </h2>
                   <div className="flex gap-4">
                        {!isStreaming ? (
                            <button onClick={() => setIsStreaming(true)} className="bg-red-600 text-white px-16 py-6 rounded-sm font-black uppercase hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(229,9,20,0.5)] hover:shadow-[0_0_80px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 text-xl tracking-tighter flex items-center gap-4">
                                <span>▶</span> Start Streaming
                            </button>
                        ) : (
                            <button onClick={() => setIsStreaming(false)} className="bg-zinc-800 text-white px-8 py-4 rounded-sm font-black uppercase hover:bg-zinc-700 transition-all border border-white/10">
                                Close Player
                            </button>
                        )}
                        <button onClick={() => {setView('browse'); setQuery('');}} className="border border-zinc-700 px-10 py-4 rounded-sm font-black uppercase hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white">
                            Back to Home
                        </button>
                   </div>
               </div>
            </div>
          </div>

          {/* PLAYER SECTION */}
          {isStreaming && (
            <div className="px-4 md:px-16 animate-in zoom-in duration-500 scroll-mt-24" id="player-container">
               
               {/* CONTROLS BAR */}
               <div className="bg-[#111] border border-zinc-800 border-b-0 rounded-t-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                  
                  {/* Server Switcher */}
                  <div className="flex bg-black rounded-lg p-1 border border-zinc-800">
                      <button onClick={() => {setServer('ares'); setPlayerKey(k => k+1);}} className={`px-4 py-2 rounded-md text-[10px] font-black uppercase transition ${server === 'ares' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white'}`}>
                          Node: Ares
                      </button>
                      <button onClick={() => {setServer('backup'); setPlayerKey(k => k+1);}} className={`px-4 py-2 rounded-md text-[10px] font-black uppercase transition ${server === 'backup' ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-white'}`}>
                          Node: VidLink
                      </button>
                  </div>

                  {/* TV Show Controls (Only visible for TV) */}
                  {type === 'tv' && (
                      <div className="flex items-center gap-2 bg-black rounded-lg p-1 border border-zinc-800">
                          <span className="text-[10px] text-zinc-500 font-bold px-2 uppercase">Season</span>
                          <input type="number" min="1" value={season} onChange={(e) => setSeason(Number(e.target.value))} className="w-12 bg-zinc-900 border border-zinc-700 rounded text-center text-xs py-1 focus:ring-1 focus:ring-red-600 outline-none" />
                          <span className="text-[10px] text-zinc-500 font-bold px-2 uppercase border-l border-zinc-800 ml-2">Episode</span>
                          <input type="number" min="1" value={episode} onChange={(e) => setEpisode(Number(e.target.value))} className="w-12 bg-zinc-900 border border-zinc-700 rounded text-center text-xs py-1 focus:ring-1 focus:ring-red-600 outline-none" />
                          <button onClick={() => setPlayerKey(k => k+1)} className="bg-zinc-800 hover:bg-white hover:text-black text-white px-3 py-1 rounded text-[10px] font-bold uppercase transition ml-2">
                              Load
                          </button>
                      </div>
                  )}
               </div>

               {/* VIDEO FRAME */}
               <div className="relative w-full aspect-video bg-black border border-zinc-800 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
                 <iframe 
                    key={`${activeItem?.id}-${server}-${season}-${episode}-${playerKey}`}
                    src={getStreamUrl()} 
                    className="absolute inset-0 w-full h-full" 
                    allowFullScreen 
                    scrolling="no"
                    frameBorder="0"
                    referrerPolicy="origin"
                    allow="autoplay; encrypted-media; picture-in-picture"
                 />
               </div>
               
               {/* STATUS FOOTER */}
               <div className="bg-[#111] border border-zinc-800 border-t-0 rounded-b-xl p-3 text-center">
                  <p className="text-[9px] text-zinc-600 uppercase tracking-[0.4em] font-black flex justify-center items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${server === 'ares' ? 'bg-red-600' : 'bg-blue-600'} animate-pulse`}></span>
                    Streaming via {server === 'ares' ? 'VidSrc.cc Network' : 'VidLink.pro Network'}
                  </p>
               </div>
            </div>
          )}
        </main>
      )}

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/5 bg-black text-center mt-20">
        <h1 className="text-3xl font-black text-zinc-800 tracking-tighter mb-4">BLEHFLIX™</h1>
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Infinity Edition • Build 2026.4.2</p>
      </footer>
    </div>
  );
}
