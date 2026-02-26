"use client";
import React, { useEffect, useState } from 'react';

// --- CLOAKED DATABASE (Base64 Encoded) ---
const ENCODED_DOMAINS = {
  ares: "dmlkc3JjLnRv",       // vidsrc.to
  zeus: "dmlkc3JjLm1l",       // vidsrc.me
  balder: "dmlkc3JjLmNj",     // vidsrc.cc
  hades: "ZW1iZWQuc3U=",      // embed.su
  circe: "dmlkc3JjLnh5eg==",   // vidsrc.xyz
  dionysus: "dmlkc3JjLnBybw==", // vidsrc.pro
  eros: "dmlkc3JjLmlu",       // vidsrc.in
};

export default function BlehflixGhost() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [view, setView] = useState<'browse' | 'details'>('browse');
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProxyEnabled, setIsProxyEnabled] = useState(false);
  
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [server, setServer] = useState<keyof typeof ENCODED_DOMAINS>('ares');

  const API_KEY = "3c08a2b895c3295cc09d583b3fc279cf";

  // Startup Animation Logic
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/${type}/top_rated?api_key=${API_KEY}&language=en-US&page=1`)
      .then(res => res.json())
      .then(data => setItems(data.results || []));
  }, [type]);

  const handleSearch = async (e: any) => {
    const term = e.target.value;
    setQuery(term);
    if (term.length > 2) {
      const res = await fetch(`https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${term}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    }
  };

  // THE 1:1 CLOAKED BRIDGE GENERATOR
  const getStreamUrl = () => {
    if (!activeItem) return "";
    const decodedDomain = atob(ENCODED_DOMAINS[server]);
    let path = type === 'movie' 
      ? `embed/movie/${activeItem.id}` 
      : `embed/tv/${activeItem.id}/${season}/${episode}`;
    
    let url = `https://${decodedDomain}/${path}`;
    
    // Experimental Proxy Logic (The "Bridge" bypass)
    if (isProxyEnabled) {
      // Wraps the URL in a secondary relay to confuse school DPI filters
      return `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=604800&url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[100] animate-pulse">
        <h1 className="text-5xl md:text-8xl font-black text-[#E50914] tracking-tighter italic animate-bounce">BLEHFLIX</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-red-600">
      
      {/* --- SMART NAV --- */}
      <nav className="p-4 md:p-6 flex flex-col lg:flex-row justify-between items-center fixed w-full z-50 bg-black/95 backdrop-blur-xl border-b border-white/5 gap-4">
        <div className="flex items-center justify-between w-full lg:w-auto gap-8">
          <h1 onClick={() => {setView('browse'); setQuery(''); setIsStreaming(false);}} className="text-3xl md:text-4xl font-black text-[#E50914] cursor-pointer tracking-tighter hover:drop-shadow-[0_0_10px_rgba(229,9,20,0.8)] transition">BLEHFLIX™</h1>
          <div className="flex bg-zinc-900 rounded-full p-1 border border-white/10">
            <button onClick={() => setType('movie')} className={`px-4 md:px-6 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${type === 'movie' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-zinc-500 hover:text-white'}`}>Movies</button>
            <button onClick={() => setType('tv')} className={`px-4 md:px-6 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${type === 'tv' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-zinc-500 hover:text-white'}`}>Shows</button>
          </div>
        </div>
        
        <div className="w-full lg:max-w-xl px-2 relative group">
          <input 
            type="text" 
            placeholder={`Search ${type === 'movie' ? 'Cinematic Titles' : 'TV Collections'}...`}
            className="w-full bg-zinc-900/50 border border-zinc-800 px-6 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-red-600 focus:bg-zinc-900 transition-all text-zinc-200"
            onChange={handleSearch}
          />
          <div className="absolute right-6 top-3 text-zinc-600">🔍</div>
        </div>
      </nav>

      {view === 'browse' ? (
        <main className="animate-in fade-in duration-1000 pt-32 lg:pt-0">
          {/* HERO HERO SECTION */}
          {items[0] && query.length <= 2 && (
            <div className="relative h-[65vh] md:h-[90vh] w-full flex items-center px-6 md:px-16 overflow-hidden">
              <img src={`https://image.tmdb.org/t/p/original${items[0].backdrop_path}`} className="absolute inset-0 w-full h-full object-cover opacity-50 scale-110" alt="hero" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="flex gap-2">
                   {items[0].vote_average > 8.0 && <span className="bg-yellow-500 text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.5)]">Absolute Classic</span>}
                   <span className="bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-white/20">★ {items[0].vote_average.toFixed(1)}</span>
                </div>
                <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]">{items[0].title || items[0].name}</h2>
                <p className="text-sm md:text-xl text-zinc-300 line-clamp-3 leading-relaxed font-light">{items[0].overview}</p>
                <button onClick={() => openDetails(items[0])} className="bg-red-600 text-white px-10 py-4 md:px-14 md:py-5 rounded-sm font-black uppercase tracking-tighter hover:bg-white hover:text-black hover:scale-105 transition-all shadow-xl shadow-red-600/20 active:scale-95">Watch Now</button>
              </div>
            </div>
          )}

          {/* DYNAMIC CONTENT GRID */}
          <div className="px-4 md:px-16 py-12">
            <h3 className="text-xl md:text-2xl font-black mb-8 uppercase tracking-tighter border-l-4 border-red-600 pl-4">Trending Today</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-8">
              {(query.length > 2 ? searchResults : items).map((item) => (
                <div key={item.id} onClick={() => openDetails(item)} className="group cursor-pointer relative flex flex-col">
                  {item.vote_average > 8.0 && <div className="absolute -top-2 -right-2 z-20 bg-yellow-500 text-black text-[8px] font-black px-2 py-1 rounded shadow-lg">CLASSIC</div>}
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-white/5 transition-all duration-500 group-hover:scale-105 group-hover:border-red-600 group-hover:shadow-[0_10px_40px_rgba(229,9,20,0.3)]">
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-red-600 font-black text-4xl transform scale-50 group-hover:scale-100 transition duration-300">▶</span>
                    </div>
                  </div>
                  <h4 className="mt-3 text-[11px] font-bold uppercase truncate text-zinc-500 group-hover:text-white transition-colors">{item.title || item.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        /* --- RESPONSIVE DETAIL & PLAYER VIEW --- */
        <main className="pt-32 pb-20 px-4 md:px-16 animate-in slide-in-from-bottom-4 duration-700">
          <button onClick={() => setView('browse')} className="mb-8 text-[10px] font-black uppercase text-zinc-500 hover:text-white tracking-[0.3em] flex items-center gap-2">
            <span className="text-lg">←</span> Return to Lobby
          </button>
          
          <div className="flex flex-col xl:flex-row gap-12">
            <div className="w-full xl:w-1/4 flex flex-col gap-6">
               <img src={`https://image.tmdb.org/t/p/w500${activeItem?.poster_path}`} className="w-full rounded-2xl shadow-2xl border border-white/10" />
               <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 space-y-4">
                  <h3 className="text-xs font-black uppercase text-red-600 tracking-widest">Description</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed italic">"{activeItem?.overview}"</p>
               </div>
            </div>
            
            <div className="flex-1 space-y-8">
               <div className="space-y-4">
                  <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">{activeItem?.title || activeItem?.name}</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-yellow-500 font-black text-xl tracking-tighter">★ {activeItem?.vote_average.toFixed(1)}</span>
                    <span className="h-4 w-[1px] bg-zinc-700"></span>
                    <span className="text-zinc-500 font-bold uppercase text-xs">{activeItem?.release_date || activeItem?.first_air_date}</span>
                  </div>
               </div>

               <div className="space-y-6">
                  {!isStreaming ? (
                    <button onClick={() => setIsStreaming(true)} className="w-full md:w-auto bg-red-600 text-white px-16 py-6 rounded-sm font-black uppercase tracking-tighter hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(229,9,20,0.3)]">Initialize Ares Node</button>
                  ) : (
                    <div className="space-y-4">
                       {/* CONTROL HUB */}
                       <div className="flex flex-col md:flex-row gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800 justify-between items-center">
                          <div className="flex flex-wrap gap-2">
                             {Object.keys(ENCODED_DOMAINS).map(key => (
                               <button key={key} onClick={() => setServer(key as any)} className={`px-4 py-2 text-[10px] font-black uppercase rounded transition ${server === key ? 'bg-red-600' : 'bg-black text-zinc-500 border border-zinc-800'}`}>
                                 {key}
                               </button>
                             ))}
                          </div>

                          <div className="flex items-center gap-3">
                             {/* THE EXPERIMENTAL TAB */}
                             <button 
                                onClick={() => setIsProxyEnabled(!isProxyEnabled)} 
                                className={`px-4 py-2 text-[9px] font-black uppercase rounded-full border transition-all ${isProxyEnabled ? 'bg-green-600 border-green-400 text-white' : 'border-zinc-700 text-zinc-500'}`}
                             >
                               Enable Proxy (Experimental) {isProxyEnabled ? 'ON' : 'OFF'}
                             </button>
                          </div>
                       </div>

                       {type === 'tv' && (
                         <div className="flex gap-4 bg-zinc-900 p-3 rounded-lg border border-zinc-800 items-center justify-center">
                            <span className="text-[10px] font-black text-zinc-600 uppercase">Season</span>
                            <input type="number" value={season} onChange={e => setSeason(Number(e.target.value))} className="w-16 bg-black border border-zinc-800 text-center py-1 rounded text-xs font-bold" />
                            <span className="text-[10px] font-black text-zinc-600 uppercase">Episode</span>
                            <input type="number" value={episode} onChange={e => setEpisode(Number(e.target.value))} className="w-16 bg-black border border-zinc-800 text-center py-1 rounded text-xs font-bold" />
                         </div>
                       )}

                       {/* THE PROTECTED PLAYER */}
                       <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-3xl relative">
                          <iframe 
                            key={`${activeItem?.id}-${server}-${season}-${episode}-${isProxyEnabled}`}
                            src={getStreamUrl()} 
                            className="w-full h-full" 
                            allowFullScreen 
                            scrolling="no"
                            frameBorder="0"
                            referrerPolicy="no-referrer"
                          />
                       </div>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </main>
      )}

      <footer className="py-20 text-center border-t border-white/5 mt-20 opacity-30">
        <h1 className="text-3xl font-black text-zinc-800 italic">BLEHFLIX GHOST EDITION</h1>
      </footer>
    </div>
  );
}
