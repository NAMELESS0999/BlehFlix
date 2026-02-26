"use client";
import React, { useEffect, useState } from 'react';

const ENCODED_DOMAINS = {
  ares: "dmlkc3JjLnRv",
  zeus: "dmlkc3JjLm1l",
  balder: "dmlkc3JjLmNj",
  hades: "ZW1iZWQuc3U=",
  circe: "dmlkc3JjLnh5eg==",
  dionysus: "dmlkc3JjLnBybw==",
  eros: "dmlkc3JjLmlu",
};

// Local Genre Database to prevent extra API calls
const GENRES: Record<number, string> = { 
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 
  18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10765: "Sci-Fi & Fantasy", 10768: "War & Politics" 
};

export default function BlehflixPeak() {
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

  // New Lively Startup Animation Timing
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3500);
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

  const openDetails = (item: any) => {
    setActiveItem(item);
    setView('details');
    setIsStreaming(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStreamUrl = () => {
    if (!activeItem) return "";
    const decodedDomain = atob(ENCODED_DOMAINS[server]);
    let path = type === 'movie' 
      ? `embed/movie/${activeItem.id}` 
      : `embed/tv/${activeItem.id}/${season}/${episode}`;
    let url = `https://${decodedDomain}/${path}`;
    if (isProxyEnabled) {
      return `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=604800&url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex items-center justify-center z-[100] overflow-hidden">
        {/* Animated Background Stripes */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px', animation: 'slide 20s linear infinite' }} 
        />
        {/* Animated Pinging "Stars" */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-ping delay-100" />
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-red-600 rounded-full animate-ping delay-300" />
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-red-500 rounded-full animate-ping delay-500" />
        
        <h1 className="text-6xl md:text-9xl font-black text-[#E50914] tracking-tighter italic animate-pulse relative z-10 drop-shadow-[0_0_40px_rgba(229,9,20,0.8)] scale-110 transition-transform duration-1000">
          BLEHFLIX
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600">
      
      {/* LIVELY NAV */}
      <nav className="p-4 md:p-6 flex flex-col lg:flex-row justify-between items-center fixed w-full z-50 bg-black/80 backdrop-blur-2xl border-b border-white/5 gap-4 transition-all duration-300">
        <div className="flex items-center justify-between w-full lg:w-auto gap-8">
          <h1 onClick={() => {setView('browse'); setQuery(''); setIsStreaming(false);}} className="text-3xl md:text-4xl font-black text-[#E50914] cursor-pointer tracking-tighter hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(229,9,20,0.8)] transition-all duration-300">BLEHFLIX™</h1>
          <div className="flex bg-zinc-900/80 rounded-full p-1 shadow-inner shadow-black/50">
            <button onClick={() => setType('movie')} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all duration-300 ${type === 'movie' ? 'bg-red-600 scale-105 shadow-[0_0_15px_rgba(229,9,20,0.5)]' : 'text-zinc-500 hover:text-white'}`}>Movies</button>
            <button onClick={() => setType('tv')} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all duration-300 ${type === 'tv' ? 'bg-red-600 scale-105 shadow-[0_0_15px_rgba(229,9,20,0.5)]' : 'text-zinc-500 hover:text-white'}`}>Shows</button>
          </div>
        </div>
        <div className="w-full lg:max-w-md relative group">
          <input type="text" placeholder="Search peak titles..." className="w-full bg-zinc-900/50 border border-zinc-800 px-6 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-red-600 focus:bg-zinc-900 transition-all duration-300" onChange={handleSearch} />
          <div className="absolute right-5 top-3 text-zinc-500 group-focus-within:text-red-600 transition-colors">🔍</div>
        </div>
      </nav>

      {view === 'browse' ? (
        <main className="pt-32 lg:pt-0">
          {/* HERO SECTION */}
          {items[0] && query.length <= 2 && (
            <div className="relative h-[65vh] md:h-[85vh] w-full flex items-center px-6 md:px-16 overflow-hidden mb-8 group">
              <img src={`https://image.tmdb.org/t/p/original${items[0].backdrop_path}`} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" alt="hero" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              
              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="flex gap-3 items-center">
                   {items[0].vote_average > 8.0 && <span className="bg-yellow-500 text-black px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(234,179,8,0.6)] animate-pulse">Absolute Cinema</span>}
                   <span className="bg-white/10 backdrop-blur-md px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border border-white/20">★ {items[0].vote_average.toFixed(1)}</span>
                </div>
                <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase italic tracking-tighter leading-[0.85] drop-shadow-2xl">{items[0].title || items[0].name}</h2>
                <p className="text-sm md:text-lg text-zinc-300 line-clamp-3 leading-relaxed max-w-2xl font-light drop-shadow-md">{items[0].overview}</p>
                <button onClick={() => openDetails(items[0])} className="bg-red-600 text-white px-12 py-5 rounded-sm font-black uppercase tracking-widest hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(229,9,20,0.4)]">Watch Now</button>
              </div>
            </div>
          )}

          {/* FLUID GRID */}
          <div className="px-4 md:px-8 xl:px-16 pb-24">
            <h3 className="text-xl md:text-2xl font-black mb-8 uppercase tracking-tighter border-l-4 border-red-600 pl-4">Trending Peak</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
              {(query.length > 2 ? searchResults : items).map((item) => (
                <div key={item.id} onClick={() => openDetails(item)} className="cursor-pointer group relative">
                  {item.vote_average > 8.0 && <div className="absolute -top-2 -right-2 z-20 bg-yellow-500 text-black text-[9px] font-black px-2 py-1 rounded shadow-lg scale-90 group-hover:scale-110 transition-transform">PEAK</div>}
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10 group-hover:border-red-600 group-hover:-translate-y-2 group-hover:shadow-[0_15px_40px_rgba(229,9,20,0.4)] transition-all duration-300 bg-zinc-900">
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                       <span className="text-red-600 font-black text-3xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 drop-shadow-[0_0_10px_rgba(229,9,20,1)]">▶</span>
                    </div>
                  </div>
                  <h4 className="mt-3 text-[11px] font-bold uppercase truncate text-zinc-400 group-hover:text-white transition-colors">{item.title || item.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        /* --- RICH DETAILS PAGE --- */
        <main className="pt-32 pb-20 px-4 md:px-8 xl:px-16 max-w-[100rem] mx-auto">
          <button onClick={() => setView('browse')} className="mb-8 text-[11px] font-black uppercase text-zinc-500 hover:text-white tracking-[0.2em] flex items-center gap-2 hover:-translate-x-2 transition-transform duration-300">
            <span className="text-xl leading-none">←</span> Return to Lobby
          </button>
          
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-16">
            {/* Left Info Column */}
            <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-6">
               <div className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10 group">
                 <img src={`https://image.tmdb.org/t/p/w500${activeItem?.poster_path}`} className="w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
               </div>
               
               <div className="p-6 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 space-y-4 shadow-xl">
                  <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest border-b border-white/5 pb-2">Synopsis</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">{activeItem?.overview}</p>
               </div>
            </div>
            
            {/* Right Action Column */}
            <div className="flex-1 space-y-8">
               <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl xl:text-8xl font-black uppercase italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 drop-shadow-lg">
                    {activeItem?.title || activeItem?.name}
                  </h2>
                  
                  {/* Detailed Metadata Row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase">
                    <span className="text-yellow-500 flex items-center gap-1 text-sm bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                      ★ {activeItem?.vote_average.toFixed(1)}
                    </span>
                    <span className="h-4 w-[1px] bg-zinc-700"></span>
                    <span className="text-zinc-400">Release: <span className="text-white">{activeItem?.release_date || activeItem?.first_air_date}</span></span>
                    <span className="h-4 w-[1px] bg-zinc-700"></span>
                    <span className="text-zinc-400">Lang: <span className="text-white">{activeItem?.original_language}</span></span>
                  </div>

                  {/* Dynamic Genre Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {activeItem?.genre_ids?.map((id: number) => GENRES[id] ? (
                      <span key={id} className="bg-zinc-800/80 text-zinc-300 border border-zinc-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider hover:bg-white hover:text-black transition-colors cursor-default">
                        {GENRES[id]}
                      </span>
                    ) : null)}
                  </div>
               </div>

               <div className="space-y-6 pt-4">
                  {!isStreaming ? (
                    <button onClick={() => setIsStreaming(true)} className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-800 text-white px-12 py-6 rounded-xl font-black uppercase tracking-widest hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(229,9,20,0.5)] transition-all duration-300 border border-red-500/50">
                      ▶ Initialize Ares Node
                    </button>
                  ) : (
                    <div className="space-y-4 animate-in fade-in duration-500">
                       {/* Control Panel */}
                       <div className="flex flex-col xl:flex-row gap-4 bg-zinc-900/80 p-4 rounded-xl border border-white/5 justify-between items-center shadow-inner shadow-black/50">
                          <div className="flex flex-wrap gap-2 justify-center">
                             {Object.keys(ENCODED_DOMAINS).map(key => (
                               <button key={key} onClick={() => setServer(key as any)} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all duration-300 ${server === key ? 'bg-red-600 shadow-lg shadow-red-600/30 scale-105' : 'bg-black text-zinc-500 border border-zinc-800 hover:bg-zinc-800 hover:text-white'}`}>
                                 {key}
                               </button>
                             ))}
                          </div>

                          <div className="flex items-center gap-3">
                             {/* GHOST MODE */}
                             <button 
                                onClick={() => setIsProxyEnabled(!isProxyEnabled)} 
                                className={`px-5 py-2.5 text-[9px] font-black uppercase rounded-full border transition-all duration-300 shadow-lg ${isProxyEnabled ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-emerald-500/20' : 'bg-black border-zinc-700 text-zinc-500 hover:border-white hover:text-white'}`}
                             >
                               Enable: Ghost-Mode (Experimental) {isProxyEnabled ? 'ON' : 'OFF'}
                             </button>
                          </div>
                       </div>

                       {type === 'tv' && (
                         <div className="flex flex-wrap gap-4 bg-zinc-900/80 p-4 rounded-xl border border-white/5 items-center justify-center">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Season</span>
                            <input type="number" value={season} onChange={e => setSeason(Number(e.target.value))} className="w-16 bg-black border border-zinc-700 text-center py-1.5 rounded-lg text-sm font-bold focus:ring-2 focus:ring-red-600 focus:outline-none transition-shadow" />
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Episode</span>
                            <input type="number" value={episode} onChange={e => setEpisode(Number(e.target.value))} className="w-16 bg-black border border-zinc-700 text-center py-1.5 rounded-lg text-sm font-bold focus:ring-2 focus:ring-red-600 focus:outline-none transition-shadow" />
                         </div>
                       )}

                       {/* THE SANDBOXED PLAYER (AD-BLOCKER) */}
                       <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
                          <iframe 
                            key={`${activeItem?.id}-${server}-${season}-${episode}-${isProxyEnabled}`}
                            src={getStreamUrl()} 
                            className="w-full h-full" 
                            allowFullScreen 
                            sandbox="allow-same-origin allow-scripts allow-forms"
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
    </div>
  );
}
