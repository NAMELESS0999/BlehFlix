"use client";
import React, { useEffect, useState } from 'react';

// --- TYPES & SERVER MAP ---
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

// 9 Different Proxy Mirrors hidden behind God/Goddess names
const SERVERS = {
  'ares': { name: 'Ares', getUrl: (type: string, id: number, s: number, e: number) => type === 'movie' ? `https://vidsrc.cc/v2/embed/movie/${id}` : `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` },
  'zeus': { name: 'Zeus', getUrl: (type: string, id: number, s: number, e: number) => type === 'movie' ? `https://vidlink.pro/movie/${id}` : `https://vidlink.pro/tv/${id}/${s}/${e}` },
  'balder': { name: 'Balder', getUrl: (type: string, id: number, s: number, e: number) => type === 'movie' ? `https://vidsrc.net/embed/movie/${id}` : `https://vidsrc.net/embed/tv/${id}/${s}/${e}` },
  'circe': { name: 'Circe', getUrl: (type: string, id: number, s: number, e: number) => type === 'movie' ? `https://vidsrc.pro/embed/movie/${id}` : `https://vidsrc.pro/embed/tv/${id}/${s}/${e}` },
  'dionysus': { name: 'Dionysus', getUrl: (type: string, id: number, s: number, e: number) => type === 'movie' ? `https://vidsrc.xyz/embed/movie/${id}` : `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}` },
  'eros': { name: 'Eros', getUrl: (type: string, id: number, s: number, e: number) => type === 'movie' ? `https://superembed.cc/embed/movie/${id}` : `https://superembed.cc/embed/tv/${id}/${s}/${e}` },
  'freya': { name: 'Freya', getUrl: (type: string, id: number, s: number, e: number) => type === 'movie' ? `https://multiembed.mov/?video_id=${id}&tmdb=1` : `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}` },
  'gaia': { name: 'Gaia', getUrl: (type: string, id: number, s: number, e: number) => type === 'movie' ? `https://autoembed.cc/embed/player.php?id=${id}` : `https://autoembed.cc/embed/player.php?id=${id}&s=${s}&e=${e}` },
  'hades': { name: 'Hades', getUrl: (type: string, id: number, s: number, e: number) => type === 'movie' ? `https://player.smashy.stream/movie/${id}` : `https://player.smashy.stream/tv/${id}?s=${s}&e=${e}` }
};

export default function BlehflixPantheon() {
  // --- STATE ---
  const [showIntro, setShowIntro] = useState(true);
  const [items, setItems] = useState<Media[]>([]);
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [view, setView] = useState<'browse' | 'details'>('browse');
  const [activeItem, setActiveItem] = useState<Media | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [activeServer, setActiveServer] = useState<keyof typeof SERVERS>('ares');
  const [playerKey, setPlayerKey] = useState(0);

  const API_KEY = "3c08a2b895c3295cc09d583b3fc279cf";

  // --- STARTUP ANIMATION TIMER ---
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  // --- FETCH DATA ---
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/${type}/top_rated?api_key=${API_KEY}&language=en-US&page=1`)
      .then(res => res.json())
      .then(data => {
        setItems(data.results || []);
        setHeroIndex(0); // Pick the first item as Hero
      });
  }, [type]);

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
    setActiveServer('ares'); // Reset to default server
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayItems = query.length > 2 ? searchResults : items;
  const currentHero = items[heroIndex];

  // --- 1. STARTUP INTRO SCREEN ---
  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[100] overflow-hidden">
        <style>{`
          @keyframes blehflixZoom {
            0% { transform: scale(0.8); opacity: 0; text-shadow: 0 0 0px #E50914; }
            20% { opacity: 1; text-shadow: 0 0 50px #E50914; }
            80% { transform: scale(1.3); opacity: 1; text-shadow: 0 0 20px #E50914; }
            100% { transform: scale(2); opacity: 0; }
          }
          .animate-intro { animation: blehflixZoom 3.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        `}</style>
        <h1 className="text-6xl md:text-9xl font-black text-[#E50914] tracking-tighter uppercase animate-intro">
          BLEHFLIX
        </h1>
      </div>
    );
  }

  // --- 2. MAIN APP ---
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600 overflow-x-hidden">
      
      {/* --- NAVIGATION --- */}
      <nav className="p-6 flex flex-col md:flex-row justify-between items-center fixed w-full z-50 bg-gradient-to-b from-black/95 to-transparent backdrop-blur-md border-b border-white/5 animate-in slide-in-from-top duration-700">
        <div className="flex items-center gap-6">
          <h1 onClick={() => {setView('browse'); setQuery('');}} className="text-4xl font-black text-[#E50914] cursor-pointer tracking-tighter hover:scale-105 transition drop-shadow-[0_0_15px_rgba(229,9,20,0.5)]">BLEHFLIX™</h1>
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
          </div>
        </div>
      </nav>

      {view === 'browse' ? (
        <main className="animate-in fade-in duration-1000">
          
          {/* --- HERO SECTION --- */}
          {currentHero && query.length <= 2 && (
            <div className="relative h-[90vh] w-full flex items-center px-8 md:px-16 group">
              <div className="absolute inset-0 overflow-hidden">
                 <img src={`https://image.tmdb.org/t/p/original${currentHero.backdrop_path}`} className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition duration-[20s]" alt="Hero" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />
              
              <div className="relative z-10 max-w-4xl pt-20 space-y-6">
                <div className="flex gap-3 animate-in slide-in-from-left duration-1000 items-center">
                    {/* ABSOLUTE CLASSIC BADGE */}
                    {currentHero.vote_average > 8.0 && (
                        <span className="bg-yellow-500 text-black px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_#eab308] animate-pulse">
                            🏆 Absolute Classic
                        </span>
                    )}
                    <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest">
                        ★ {currentHero.vote_average.toFixed(1)}
                    </span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-[0.85] drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
                    {currentHero.title || currentHero.name}
                </h2>
                <p className="text-lg md:text-xl text-zinc-300 line-clamp-3 font-light max-w-2xl leading-relaxed drop-shadow-md">
                    {currentHero.overview}
                </p>
                <div className="flex gap-4 pt-4">
                    <button onClick={() => openDetails(currentHero)} className="bg-red-600 text-white px-12 py-5 rounded-sm font-black hover:bg-white hover:text-black transition-all uppercase tracking-tighter shadow-[0_0_40px_rgba(229,9,20,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95">
                        Play Now
                    </button>
                </div>
              </div>
            </div>
          )}

          {/* --- CONTENT GRID --- */}
          <div className={`px-8 md:px-16 pb-32 relative z-20 ${query.length <= 2 ? "-mt-32" : "pt-40"}`}>
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                <span className="w-1 h-8 bg-red-600 block"></span>
                {query.length > 2 ? `Search Results: "${query}"` : "Trending & Classics"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
              {displayItems.map((item) => (
                <div key={item.id} onClick={() => openDetails(item)} className="group cursor-pointer relative flex flex-col">
                  {/* CLASSIC BADGE FOR GRID */}
                  {item.vote_average > 8.0 && (
                      <div className="absolute -top-2 -right-2 z-50 bg-yellow-500 text-black text-[8px] font-black px-2 py-1 rounded shadow-[0_0_10px_#eab308] uppercase rotate-3">
                          Classic
                      </div>
                  )}
                  <div className="relative aspect-[2/3] overflow-hidden rounded-md shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2 z-0 group-hover:z-40 bg-zinc-900 ring-1 ring-white/10 group-hover:ring-red-600 group-hover:shadow-[0_10px_30px_rgba(229,9,20,0.3)]">
                    <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750'} className="w-full h-full object-cover" alt="Poster" loading="lazy" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-red-600 font-black text-5xl transform scale-50 group-hover:scale-100 transition duration-300 drop-shadow-[0_0_15px_rgba(229,9,20,0.8)]">▶</span>
                        <p className="text-[9px] text-zinc-300 mt-4 line-clamp-3 leading-relaxed hidden md:block">{item.overview}</p>
                    </div>
                  </div>
                  <h4 className="mt-4 text-[11px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-white truncate transition-colors">{item.title || item.name}</h4>
                  <div className="flex justify-between items-center mt-1">
                      <p className="text-[10px] text-zinc-600">{item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}</p>
                      <p className="text-[10px] text-zinc-500 font-bold">★ {item.vote_average.toFixed(1)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        /* --- DETAILS & PLAYER VIEW --- */
        <main className="animate-in slide-in-from-bottom-10 duration-700 min-h-screen pb-20 bg-[#050505]">
          
          {/* HEADER BACKDROP */}
          <div className="relative h-[70vh] w-full">
            <div className="absolute inset-0">
                <img src={`https://image.tmdb.org/t/p/original${activeItem?.backdrop_path}`} className="w-full h-full object-cover opacity-30" alt="Backdrop" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent" />
            </div>
            
            <button onClick={() => {setView('browse'); setQuery('');}} className="absolute top-32 left-8 md:left-16 z-50 text-zinc-400 hover:text-white uppercase font-black text-[10px] tracking-widest flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 hover:border-white/30 transition">
                ← Return to Lobby
            </button>
            
            <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-12 flex flex-col md:flex-row items-end gap-12">
               <div className="relative group hidden md:block">
                   <img src={`https://image.tmdb.org/t/p/w500${activeItem?.poster_path}`} className="w-64 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 group-hover:border-red-600 transition duration-500 group-hover:-translate-y-4" />
                   {activeItem && activeItem.vote_average > 8.0 && (
                       <div className="absolute -top-4 -right-4 bg-yellow-500 text-black text-xs font-black px-4 py-2 rounded shadow-[0_0_20px_#eab308] uppercase rotate-6 z-50 animate-bounce">
                           Absolute Classic
                       </div>
                   )}
               </div>
               <div className="flex-1 space-y-6 max-w-4xl">
                   <div className="flex gap-4 items-center mb-2">
                       <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                           {activeItem?.release_date?.split('-')[0] || activeItem?.first_air_date?.split('-')[0]}
                       </span>
                       <span className="text-yellow-500 font-bold text-sm tracking-widest">
                           ★ {activeItem?.vote_average.toFixed(1)} / 10
                       </span>
                   </div>
                   <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-white drop-shadow-2xl">
                       {activeItem?.title || activeItem?.name}
                   </h2>
                   <p className="text-zinc-300 text-lg md:text-xl leading-relaxed font-light drop-shadow-md border-l-2 border-red-600 pl-4 bg-gradient-to-r from-red-600/10 to-transparent py-2">
                       {activeItem?.overview}
                   </p>
                   
                   {!isStreaming && (
                       <div className="pt-6">
                           <button onClick={() => setIsStreaming(true)} className="bg-red-600 text-white px-16 py-6 rounded-sm font-black uppercase hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(229,9,20,0.5)] hover:shadow-[0_0_80px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 text-xl tracking-tighter flex items-center gap-4 group">
                               <span className="group-hover:animate-ping">▶</span> Initialize Player
                           </button>
                       </div>
                   )}
               </div>
            </div>
          </div>

          {/* THE PANTHEON PLAYER SECTION */}
          {isStreaming && (
            <div className="px-4 md:px-16 mt-8 animate-in zoom-in-95 duration-500 scroll-mt-24" id="player-container">
               
               {/* SERVER SELECTION BAR */}
               <div className="bg-[#111] border border-zinc-800 border-b-0 rounded-t-xl p-4 flex flex-col gap-4">
                  
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-zinc-800 pb-4">
                      <div className="flex items-center gap-3">
                          <span className="text-red-600 animate-pulse">●</span>
                          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Pantheon Proxy Network</span>
                      </div>
                      
                      {/* TV Show Controls */}
                      {type === 'tv' && (
                          <div className="flex items-center gap-2 bg-black rounded-lg p-1.5 border border-zinc-800">
                              <span className="text-[10px] text-zinc-500 font-bold px-2 uppercase">Season</span>
                              <input type="number" min="1" value={season} onChange={(e) => setSeason(Number(e.target.value))} className="w-12 bg-zinc-900 border border-zinc-700 rounded text-center text-xs py-1 focus:ring-1 focus:ring-red-600 outline-none text-white" />
                              <span className="text-[10px] text-zinc-500 font-bold px-2 uppercase border-l border-zinc-800 ml-2">Episode</span>
                              <input type="number" min="1" value={episode} onChange={(e) => setEpisode(Number(e.target.value))} className="w-12 bg-zinc-900 border border-zinc-700 rounded text-center text-xs py-1 focus:ring-1 focus:ring-red-600 outline-none text-white" />
                              <button onClick={() => setPlayerKey(k => k+1)} className="bg-red-600 hover:bg-white hover:text-black text-white px-4 py-1.5 rounded text-[10px] font-black uppercase transition ml-2">
                                  Load Episode
                              </button>
                          </div>
                      )}
                  </div>

                  {/* GOD/GODDESS SERVER BUTTONS */}
                  <div className="flex flex-wrap gap-2">
                      {Object.entries(SERVERS).map(([key, serverData]) => (
                          <button 
                            key={key}
                            onClick={() => {
                                setActiveServer(key as keyof typeof SERVERS);
                                setPlayerKey(k => k+1);
                            }} 
                            className={`px-4 py-2 rounded-md text-[10px] font-black uppercase transition-all flex-1 md:flex-none text-center ${activeServer === key ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105' : 'bg-black text-zinc-500 border border-zinc-800 hover:border-zinc-500 hover:text-white'}`}
                          >
                              {serverData.name}
                          </button>
                      ))}
                  </div>
               </div>

               {/* VIDEO FRAME (WITH PROXY BYPASS) */}
               <div className="relative w-full aspect-video bg-black border border-zinc-800 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
                 <iframe 
                    key={`${activeItem?.id}-${activeServer}-${season}-${episode}-${playerKey}`}
                    src={SERVERS[activeServer].getUrl(type, activeItem!.id, season, episode)} 
                    className="absolute inset-0 w-full h-full" 
                    allowFullScreen 
                    scrolling="no"
                    frameBorder="0"
                    referrerPolicy="no-referrer" /* Keeps school proxy blocks away */
                    allow="autoplay; encrypted-media; picture-in-picture"
                 />
               </div>
               
               <div className="bg-[#111] border border-zinc-800 border-t-0 rounded-b-xl p-4 flex justify-between items-center text-center">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">
                    Connected to: <span className="text-white">{SERVERS[activeServer].name} Node</span>
                  </p>
                  <button onClick={() => setIsStreaming(false)} className="text-[10px] text-red-600 hover:text-white font-black uppercase tracking-widest transition">
                      ✕ Close Player
                  </button>
               </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
