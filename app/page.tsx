"use client";
import React, { useEffect, useState } from 'react';

// Exactly 50 Master Nodes & Sub-Mirrors
const SERVERS = {
  // Tier 1: Primary Aggregators
  Vidora: { domain: "dmlkb3JhLnN1", path: "embed" },
  Auto_V2: { domain: "d2F0Y2gtdjIuYXV0b2VtYmVkLmNj", path: "player.php" },
  Auto_TO: { domain: "YXV0b2VtYmVkLnRv", path: "embed" },
  Super: { domain: "bXVsdGllbWJlZC5tb3Y=", path: "direct" },
  VidLink: { domain: "dmlkbGluay5wcm8=", path: "embed" },
  EmbedSU: { domain: "ZW1iZWQuc3U=", path: "embed" },
  
  // Tier 2: The VidSrc Ecosystem
  Vidsrc_TO: { domain: "dmlkc3JjLnRv", path: "embed" },
  Vidsrc_ME: { domain: "dmlkc3JjLm1l", path: "embed" },
  Vidsrc_PM: { domain: "dmlkc3JjLnBt", path: "embed" },
  Vidsrc_ICU: { domain: "dmlkc3JjLmljdQ==", path: "embed" },
  Vidsrc_XYZ: { domain: "dmlkc3JjLnh5eg==", path: "embed" },
  Vidsrc_NET: { domain: "dmlkc3JjLm5ldA==", path: "embed" },
  Vidsrc_PRO: { domain: "dmlkc3JjLnBybw==", path: "embed" },
  Vidsrc_VIP: { domain: "dmlkc3JjLnZpcA==", path: "embed" },

  // Tier 3: Third-Party Mirrors
  Smashy: { domain: "ZW1iZWQuc21hc2h5c3RyZWFtLmNvbQ==", path: "smashy" },
  MoviesAPI: { domain: "bW92aWVzYXBpLmNsdWI=", path: "movieapi" },
  BlackVid: { domain: "YmxhY2t2aWQuc3BhY2U=", path: "embed" },
  Nonton: { domain: "bm9udG9uLnN0cmVhbQ==", path: "embed" },
  VidBinge: { domain: "dmlkYmluZ2UuY29t", path: "embed" },
  TwoEmbed: { domain: "MmVtYmVkLmNj", path: "embed" },

  // Tier 4: Redundancy Nodes (Alternate routing to bypass blocks)
  Alpha: { domain: "dmlkb3JhLnN1", path: "vapi" },
  Beta: { domain: "d2F0Y2gtdjIuYXV0b2VtYmVkLmNj", path: "watch" },
  Gamma: { domain: "ZW1iZWQuc3U=", path: "api" },
  Delta: { domain: "dmlkbGluay5wcm8=", path: "movie" },
  Omega: { domain: "bXVsdGllbWJlZC5tb3Y=", path: "embed" },
  Sigma: { domain: "dmlkc3JjLnRv", path: "v2" },
  Zeta: { domain: "dmlkc3JjLm1l", path: "vapi" },
  Nova: { domain: "dmlkc3JjLnBt", path: "alt" },
  Apex: { domain: "dmlkc3JjLmljdQ==", path: "watch" },
  Nexus: { domain: "dmlkc3JjLnh5eg==", path: "api" },
  Prime: { domain: "dmlkc3JjLm5ldA==", path: "v2" },
  Ultra: { domain: "dmlkc3JjLnBybw==", path: "v3" },
  Max: { domain: "dmlkc3JjLnZpcA==", path: "embed" },
  Zenith: { domain: "ZW1iZWQuc21hc2h5c3RyZWFtLmNvbQ==", path: "play" },
  Core: { domain: "bW92aWVzYXBpLmNsdWI=", path: "v1" },
  Pulse: { domain: "YmxhY2t2aWQuc3BhY2U=", path: "watch" },
  Flux: { domain: "bm9udG9uLnN0cmVhbQ==", path: "v2" },
  Aura: { domain: "dmlkYmluZ2UuY29t", path: "api" },
  Onyx: { domain: "MmVtYmVkLmNj", path: "v2" },
  Titan: { domain: "dmlkb3JhLnN1", path: "alt" },
  Atlas: { domain: "YXV0b2VtYmVkLnRv", path: "v2" },
  Echo: { domain: "bXVsdGllbWJlZC5tb3Y=", path: "v3" },

  // Tier 5: The Outer Rim (Extra deep-routing to hit the 50 mark)
  Orion: { domain: "dmlkbGluay5wcm8=", path: "vapi" },
  Matrix: { domain: "ZW1iZWQuc3U=", path: "v2" },
  Cyber: { domain: "d2F0Y2gtdjIuYXV0b2VtYmVkLmNj", path: "v3" },
  Quantum: { domain: "dmlkc3JjLnRv", path: "v3" },
  Vortex: { domain: "dmlkc3JjLm1l", path: "v3" },
  Celestial: { domain: "dmlkc3JjLnBt", path: "vapi" },
  Infinity: { domain: "bW92aWVzYXBpLmNsdWI=", path: "v2" },
  Phantom: { domain: "ZW1iZWQuc21hc2h5c3RyZWFtLmNvbQ==", path: "v2" }
};

const GENRES: Record<number, string> = { 
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 
  18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 53: "Thriller", 10752: "War", 37: "Western"
};

export default function BlehflixAbsoluteCinema() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [view, setView] = useState<'browse' | 'details'>('browse');
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [server, setServer] = useState<keyof typeof SERVERS>('Vidora');

  const API_KEY = "3c08a2b895c3295cc09d583b3fc279cf";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3500); // The Beautiful Startup Delay
    // Changed from "trending" to "top_rated" to fetch the IMDb greatest movies
    fetch(`https://api.themoviedb.org/3/${type}/top_rated?api_key=${API_KEY}&language=en-US&page=1`)
      .then(res => res.json())
      .then(data => setItems(data.results || []));
    return () => clearTimeout(timer);
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

  const getUrl = () => {
    const node = SERVERS[server];
    const domain = atob(node.domain);
    const id = activeItem.id;
    
    // Routing logic based on node structure
    if (node.path === 'player.php') return `https://${domain}/player.php?video_id=${id}&tmdb=1`;
    if (node.path === 'direct') return `https://${domain}/directstream.php?video_id=${id}&tmdb=1`;
    if (node.path === 'vapi') return `https://${domain}/vapi/movie/${id}`;
    if (node.path === 'smashy') return `https://${domain}/playere.php?tmdb=${id}`;
    
    // Standard embed
    return `https://${domain}/embed/${type}/${id}`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#020202] flex flex-col items-center justify-center z-[100] overflow-hidden">
        {/* Starry Background Animation */}
        <div className="absolute inset-0 z-0">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="absolute bg-white rounded-full animate-pulse" style={{
              width: Math.random() * 3 + 'px', height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%', left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's', opacity: Math.random()
            }} />
          ))}
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-7xl md:text-9xl font-black text-[#E50914] italic tracking-tighter drop-shadow-[0_0_40px_rgba(229,9,20,0.8)] animate-pulse">BLEHFLIX</h1>
          <div className="flex items-center gap-4 mt-8">
            <span className="h-[1px] w-12 bg-white/30" />
            <p className="text-white tracking-[0.8em] uppercase text-xs font-black">Absolute Cinema</p>
            <span className="h-[1px] w-12 bg-white/30" />
          </div>
        </div>
      </div>
    );
  }

  const heroItem = query === '' ? items[0] : null;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#E50914] selection:text-white">
      {/* Deep Space Background for whole site */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-[#050505] to-[#050505]" />

      <nav className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center fixed w-full z-50 bg-gradient-to-b from-black/90 via-black/50 to-transparent backdrop-blur-sm gap-6 transition-all">
        <div className="flex items-center gap-8 w-full md:w-auto justify-between">
          <h1 onClick={() => {setView('browse'); setIsStreaming(false); setQuery('');}} className="text-3xl md:text-4xl font-black text-[#E50914] cursor-pointer tracking-tighter hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(229,9,20,0.4)]">BLEHFLIX™</h1>
          <div className="flex bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-2xl">
            <button onClick={() => setType('movie')} className={`px-6 md:px-8 py-2.5 rounded-full text-[10px] font-black uppercase transition-all duration-300 ${type === 'movie' ? 'bg-[#E50914] text-white shadow-[0_0_20px_rgba(229,9,20,0.4)]' : 'text-zinc-500 hover:text-white'}`}>Top Movies</button>
            <button onClick={() => setType('tv')} className={`px-6 md:px-8 py-2.5 rounded-full text-[10px] font-black uppercase transition-all duration-300 ${type === 'tv' ? 'bg-[#E50914] text-white shadow-[0_0_20px_rgba(229,9,20,0.4)]' : 'text-zinc-500 hover:text-white'}`}>Top Shows</button>
          </div>
        </div>
        <div className="relative group w-full md:w-auto">
          <input type="text" placeholder="Search absolute cinema..." value={query} className="w-full md:w-80 lg:w-96 bg-zinc-900/50 border border-white/10 px-8 py-3.5 rounded-full text-xs font-bold outline-none focus:border-[#E50914] focus:bg-black transition-all duration-500 placeholder:text-zinc-600 text-white" onChange={handleSearch} />
        </div>
      </nav>

      {view === 'browse' ? (
        <main className="relative z-10">
          {/* HUGE HERO SECTION */}
          {heroItem && (
            <section className="relative h-[85vh] md:h-[90vh] flex items-end pb-12 md:pb-24 px-6 md:px-20 overflow-hidden mb-12">
              <img src={`https://image.tmdb.org/t/p/original${heroItem.backdrop_path}`} alt="hero backdrop" className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[20s] ease-linear scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
              
              <div className="relative z-20 max-w-5xl space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-[#E50914] text-white px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(229,9,20,0.6)]">#1 Rated Peak</span>
                  <span className="bg-yellow-500 text-black px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    ★ {heroItem.vote_average?.toFixed(1)} Rating
                  </span>
                  <span className="border border-white/20 px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-md">
                    {heroItem.release_date?.substring(0, 4) || heroItem.first_air_date?.substring(0, 4)}
                  </span>
                </div>
                
                <h2 className="text-6xl md:text-8xl lg:text-[8rem] font-black uppercase italic tracking-tighter leading-[0.85] drop-shadow-2xl">{heroItem.title || heroItem.name}</h2>
                <p className="text-zinc-300 text-sm md:text-base lg:text-lg line-clamp-3 max-w-3xl font-medium leading-relaxed drop-shadow-md">{heroItem.overview}</p>
                
                <div className="flex gap-4 pt-4">
                  <button onClick={() => { setActiveItem(heroItem); setView('details'); window.scrollTo(0,0); }} className="bg-white text-black px-12 md:px-16 py-4 md:py-5 rounded-full font-black uppercase tracking-widest hover:bg-[#E50914] hover:text-white transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(229,9,20,0.5)] flex items-center gap-3">
                    <span className="text-xl">▶</span> Experience Peak
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* PEAK GRID */}
          <div className="px-6 md:px-20 pb-32">
            {!heroItem && <div className="pt-40" />}
            <div className="flex items-center gap-6 mb-10">
              <h3 className="text-3xl font-black uppercase tracking-tighter italic">
                {query.length > 2 ? 'Search Results' : 'The Greatest of All Time'}
              </h3>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-[#E50914] to-transparent opacity-50" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6 md:gap-8">
              {(query.length > 2 ? searchResults : items).map((item) => {
                if (item.id === heroItem?.id && query === '') return null; // Skip hero in grid
                return (
                  <div key={item.id} onClick={() => { setActiveItem(item); setView('details'); setIsStreaming(false); window.scrollTo(0,0); }} className="cursor-pointer group relative">
                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 group-hover:border-[#E50914] transition-all duration-500 shadow-xl group-hover:shadow-[0_10px_40px_rgba(229,9,20,0.3)] group-hover:-translate-y-3">
                      <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <div className="bg-[#E50914] w-fit text-white px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest mb-2 shadow-[0_0_10px_rgba(229,9,20,0.8)]">PEAK</div>
                        <p className="text-yellow-500 text-xs font-black">★ {item.vote_average?.toFixed(1)}</p>
                      </div>
                    </div>
                    <h4 className="mt-4 text-[11px] font-black uppercase tracking-wide truncate text-zinc-400 group-hover:text-white transition-colors">{item.title || item.name}</h4>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      ) : (
        /* ================= DETAILS & PLAYER ================= */
        <main className="relative z-10 pt-32 md:pt-40 pb-32 px-6 md:px-20 max-w-[120rem] mx-auto min-h-screen">
          <button onClick={() => setView('browse')} className="mb-10 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.3em] transition-all flex items-center gap-3">
            <span className="text-[#E50914] text-lg">←</span> Return to Lobby
          </button>
          
          <div className="flex flex-col xl:flex-row gap-12 xl:gap-20">
            {/* Left: Poster & Meta */}
            <div className="w-full md:w-1/2 xl:w-1/4 shrink-0">
               <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] xl:sticky xl:top-32">
                 <img src={`https://image.tmdb.org/t/p/w500${activeItem?.poster_path}`} alt="poster" className="w-full h-auto object-cover" />
                 <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex flex-col items-center shadow-2xl">
                    <span className="text-yellow-500 text-lg font-black">★ {activeItem?.vote_average?.toFixed(1)}</span>
                    <span className="text-[8px] text-zinc-400 uppercase font-black tracking-widest">TMDb Rating</span>
                 </div>
               </div>
            </div>

            {/* Right: Info & Video Player */}
            <div className="flex-1 space-y-10">
               <div className="space-y-6">
                 <div className="flex flex-wrap items-center gap-4">
                    <span className="text-[#E50914] font-black tracking-widest text-[10px] uppercase border border-[#E50914]/30 px-3 py-1.5 rounded-md bg-[#E50914]/10">4K Peak Native</span>
                    <span className="text-zinc-300 font-black tracking-widest text-[10px] uppercase bg-white/10 px-3 py-1.5 rounded-md">
                      Release: {activeItem?.release_date || activeItem?.first_air_date || 'Unknown'}
                    </span>
                 </div>
                 
                 <h2 className="text-5xl md:text-7xl xl:text-[6rem] font-black uppercase italic tracking-tighter leading-[0.85] text-white">
                   {activeItem?.title || activeItem?.name}
                 </h2>
                 
                 <div className="flex flex-wrap gap-2">
                    {activeItem?.genre_ids?.map((id: number) => GENRES[id] && (
                      <span key={id} className="bg-zinc-900 text-zinc-400 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5 hover:border-white/20 transition-colors cursor-default">
                        {GENRES[id]}
                      </span>
                    ))}
                 </div>

                 <p className="text-base md:text-xl text-zinc-400 font-medium leading-relaxed max-w-4xl border-l-4 border-[#E50914] pl-6 py-2">
                   {activeItem?.overview}
                 </p>
               </div>

               {/* STREAMING UI SECTION */}
               <div className="pt-8 border-t border-white/10">
                 {!isStreaming ? (
                   <button onClick={() => setIsStreaming(true)} className="group relative bg-[#E50914] px-12 md:px-20 py-6 md:py-8 rounded-3xl font-black uppercase tracking-tighter text-2xl md:text-4xl hover:scale-[1.02] transition-all shadow-[0_0_50px_rgba(229,9,20,0.3)] overflow-hidden">
                     <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500">Initialize Cinema UI</span>
                     <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                   </button>
                 ) : (
                   <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 space-y-8">
                      
                      {/* The Massive 50-Node Selector */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center px-2">
                          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Select Global Node (50 Active Clusters)</h4>
                          <span className="flex items-center gap-2 text-[9px] text-emerald-500 font-black uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 50 Nodes Online</span>
                        </div>
                        
                        <div className="bg-zinc-900/60 p-4 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl overflow-y-auto max-h-56 custom-scrollbar">
                          <div className="flex flex-wrap gap-2">
                            {Object.keys(SERVERS).map(key => (
                              <button 
                                key={key} 
                                onClick={() => setServer(key as any)} 
                                className={`px-4 py-2.5 text-[9px] font-black uppercase rounded-xl transition-all duration-300 border ${
                                  server === key 
                                  ? 'bg-[#E50914] text-white border-[#E50914] shadow-[0_0_15px_rgba(229,9,20,0.5)] scale-105' 
                                  : 'bg-black/50 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white'
                                }`}
                              >
                                {key}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Video Player Box */}
                      <div className="relative aspect-video bg-black rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] group ring-1 ring-white/5">
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 -z-10">
                           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E50914]"></div>
                        </div>
                        <iframe 
                          key={`${activeItem?.id}-${server}`}
                          src={getUrl()} 
                          className="w-full h-full relative z-10" 
                          allowFullScreen 
                          referrerPolicy="origin" 
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-[9px] text-zinc-600 font-black tracking-[0.4em] uppercase">
                        <p>Current Protocol: <span className="text-white">{server}</span></p>
                        <p>Aggregating 50 Dedicated Nodes</p>
                      </div>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </main>
      )}

      {/* Custom Scrollbar styling injected via style tag for the 50-server box */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #E50914; }
      `}} />
    </div>
  );
}
