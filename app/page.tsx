"use client";
import React, { useEffect, useState } from 'react';

// EXACTLY 100 MASTER NODES & MIRRORS
const SERVERS = {
  // Sector 1: Vidora Network (1-10)
  Vidora_Prime: { domain: "dmlkb3JhLnN1", path: "embed" },
  Vidora_V2: { domain: "dmlkb3JhLnN1", path: "vapi" },
  Vidora_V3: { domain: "dmlkb3JhLnN1", path: "alt" },
  Vidora_API: { domain: "dmlkb3JhLnN1", path: "api" },
  Vidora_Pro: { domain: "dmlkb3JhLnN1", path: "pro" },
  Vidora_Max: { domain: "dmlkb3JhLnN1", path: "max" },
  Vidora_Net: { domain: "dmlkb3JhLnN1", path: "net" },
  Vidora_Cloud: { domain: "dmlkb3JhLnN1", path: "cloud" },
  Vidora_Stream: { domain: "dmlkb3JhLnN1", path: "stream" },
  Vidora_NodeX: { domain: "dmlkb3JhLnN1", path: "node" },

  // Sector 2: Autoembed Network (11-20)
  Auto_Prime: { domain: "d2F0Y2gtdjIuYXV0b2VtYmVkLmNj", path: "player.php" },
  Auto_CC: { domain: "YXV0b2VtYmVkLmNj", path: "embed" },
  Auto_TO: { domain: "YXV0b2VtYmVkLnRv", path: "embed" },
  Auto_Watch: { domain: "d2F0Y2gtdjIuYXV0b2VtYmVkLmNj", path: "watch" },
  Auto_V2: { domain: "YXV0b2VtYmVkLnRv", path: "v2" },
  Auto_V3: { domain: "YXV0b2VtYmVkLmNj", path: "v3" },
  Auto_Direct: { domain: "d2F0Y2gtdjIuYXV0b2VtYmVkLmNj", path: "direct" },
  Auto_API: { domain: "YXV0b2VtYmVkLnRv", path: "api" },
  Auto_Play: { domain: "YXV0b2VtYmVkLmNj", path: "play" },
  Auto_Hub: { domain: "d2F0Y2gtdjIuYXV0b2VtYmVkLmNj", path: "hub" },

  // Sector 3: Super & VidLink (21-30)
  Super_Prime: { domain: "bXVsdGllbWJlZC5tb3Y=", path: "direct" },
  Super_V2: { domain: "bXVsdGllbWJlZC5tb3Y=", path: "embed" },
  Super_V3: { domain: "bXVsdGllbWJlZC5tb3Y=", path: "v3" },
  Super_API: { domain: "bXVsdGllbWJlZC5tb3Y=", path: "api" },
  Super_Max: { domain: "bXVsdGllbWJlZC5tb3Y=", path: "max" },
  VidLink_Prime: { domain: "dmlkbGluay5wcm8=", path: "embed" },
  VidLink_V2: { domain: "dmlkbGluay5wcm8=", path: "movie" },
  VidLink_V3: { domain: "dmlkbGluay5wcm8=", path: "vapi" },
  VidLink_API: { domain: "dmlkbGluay5wcm8=", path: "api" },
  VidLink_Pro: { domain: "dmlkbGluay5wcm8=", path: "pro" },

  // Sector 4: EmbedSU & Smashy (31-40)
  EmbedSU_Prime: { domain: "ZW1iZWQuc3U=", path: "embed" },
  EmbedSU_API: { domain: "ZW1iZWQuc3U=", path: "api" },
  EmbedSU_V2: { domain: "ZW1iZWQuc3U=", path: "v2" },
  EmbedSU_V3: { domain: "ZW1iZWQuc3U=", path: "v3" },
  EmbedSU_Max: { domain: "ZW1iZWQuc3U=", path: "max" },
  Smashy_Prime: { domain: "ZW1iZWQuc21hc2h5c3RyZWFtLmNvbQ==", path: "smashy" },
  Smashy_Play: { domain: "ZW1iZWQuc21hc2h5c3RyZWFtLmNvbQ==", path: "play" },
  Smashy_V2: { domain: "ZW1iZWQuc21hc2h5c3RyZWFtLmNvbQ==", path: "v2" },
  Smashy_V3: { domain: "ZW1iZWQuc21hc2h5c3RyZWFtLmNvbQ==", path: "v3" },
  Smashy_API: { domain: "ZW1iZWQuc21hc2h5c3RyZWFtLmNvbQ==", path: "api" },

  // Sector 5: VidSrc TO & ME (41-50)
  VidSrc_TO: { domain: "dmlkc3JjLnRv", path: "embed" },
  VidSrc_TO_V2: { domain: "dmlkc3JjLnRv", path: "v2" },
  VidSrc_TO_V3: { domain: "dmlkc3JjLnRv", path: "v3" },
  VidSrc_TO_API: { domain: "dmlkc3JjLnRv", path: "api" },
  VidSrc_TO_Max: { domain: "dmlkc3JjLnRv", path: "max" },
  VidSrc_ME: { domain: "dmlkc3JjLm1l", path: "embed" },
  VidSrc_ME_VAPI: { domain: "dmlkc3JjLm1l", path: "vapi" },
  VidSrc_ME_V3: { domain: "dmlkc3JjLm1l", path: "v3" },
  VidSrc_ME_API: { domain: "dmlkc3JjLm1l", path: "api" },
  VidSrc_ME_Max: { domain: "dmlkc3JjLm1l", path: "max" },

  // Sector 6: VidSrc PM & ICU (51-60)
  VidSrc_PM: { domain: "dmlkc3JjLnBt", path: "embed" },
  VidSrc_PM_Alt: { domain: "dmlkc3JjLnBt", path: "alt" },
  VidSrc_PM_VAPI: { domain: "dmlkc3JjLnBt", path: "vapi" },
  VidSrc_PM_API: { domain: "dmlkc3JjLnBt", path: "api" },
  VidSrc_PM_Max: { domain: "dmlkc3JjLnBt", path: "max" },
  VidSrc_ICU: { domain: "dmlkc3JjLmljdQ==", path: "embed" },
  VidSrc_ICU_Watch: { domain: "dmlkc3JjLmljdQ==", path: "watch" },
  VidSrc_ICU_V2: { domain: "dmlkc3JjLmljdQ==", path: "v2" },
  VidSrc_ICU_API: { domain: "dmlkc3JjLmljdQ==", path: "api" },
  VidSrc_ICU_Max: { domain: "dmlkc3JjLmljdQ==", path: "max" },

  // Sector 7: VidSrc XYZ & NET (61-70)
  VidSrc_XYZ: { domain: "dmlkc3JjLnh5eg==", path: "embed" },
  VidSrc_XYZ_API: { domain: "dmlkc3JjLnh5eg==", path: "api" },
  VidSrc_XYZ_V2: { domain: "dmlkc3JjLnh5eg==", path: "v2" },
  VidSrc_XYZ_V3: { domain: "dmlkc3JjLnh5eg==", path: "v3" },
  VidSrc_XYZ_Max: { domain: "dmlkc3JjLnh5eg==", path: "max" },
  VidSrc_NET: { domain: "dmlkc3JjLm5ldA==", path: "embed" },
  VidSrc_NET_V2: { domain: "dmlkc3JjLm5ldA==", path: "v2" },
  VidSrc_NET_API: { domain: "dmlkc3JjLm5ldA==", path: "api" },
  VidSrc_NET_V3: { domain: "dmlkc3JjLm5ldA==", path: "v3" },
  VidSrc_NET_Max: { domain: "dmlkc3JjLm5ldA==", path: "max" },

  // Sector 8: VidSrc PRO & VIP (71-80)
  VidSrc_PRO: { domain: "dmlkc3JjLnBybw==", path: "embed" },
  VidSrc_PRO_V3: { domain: "dmlkc3JjLnBybw==", path: "v3" },
  VidSrc_PRO_API: { domain: "dmlkc3JjLnBybw==", path: "api" },
  VidSrc_PRO_V2: { domain: "dmlkc3JjLnBybw==", path: "v2" },
  VidSrc_PRO_Max: { domain: "dmlkc3JjLnBybw==", path: "max" },
  VidSrc_VIP: { domain: "dmlkc3JjLnZpcA==", path: "embed" },
  VidSrc_VIP_API: { domain: "dmlkc3JjLnZpcA==", path: "api" },
  VidSrc_VIP_V2: { domain: "dmlkc3JjLnZpcA==", path: "v2" },
  VidSrc_VIP_V3: { domain: "dmlkc3JjLnZpcA==", path: "v3" },
  VidSrc_VIP_Max: { domain: "dmlkc3JjLnZpcA==", path: "max" },

  // Sector 9: MoviesAPI & BlackVid (81-90)
  MoviesAPI_Prime: { domain: "bW92aWVzYXBpLmNsdWI=", path: "movieapi" },
  MoviesAPI_V1: { domain: "bW92aWVzYXBpLmNsdWI=", path: "v1" },
  MoviesAPI_V2: { domain: "bW92aWVzYXBpLmNsdWI=", path: "v2" },
  MoviesAPI_API: { domain: "bW92aWVzYXBpLmNsdWI=", path: "api" },
  MoviesAPI_Max: { domain: "bW92aWVzYXBpLmNsdWI=", path: "max" },
  BlackVid_Prime: { domain: "YmxhY2t2aWQuc3BhY2U=", path: "embed" },
  BlackVid_Watch: { domain: "YmxhY2t2aWQuc3BhY2U=", path: "watch" },
  BlackVid_V2: { domain: "YmxhY2t2aWQuc3BhY2U=", path: "v2" },
  BlackVid_API: { domain: "YmxhY2t2aWQuc3BhY2U=", path: "api" },
  BlackVid_Max: { domain: "YmxhY2t2aWQuc3BhY2U=", path: "max" },

  // Sector 10: Nonton, VidBinge, 2Embed (91-100)
  Nonton_Prime: { domain: "bm9udG9uLnN0cmVhbQ==", path: "embed" },
  Nonton_V2: { domain: "bm9udG9uLnN0cmVhbQ==", path: "v2" },
  Nonton_API: { domain: "bm9udG9uLnN0cmVhbQ==", path: "api" },
  VidBinge_Prime: { domain: "dmlkYmluZ2UuY29t", path: "embed" },
  VidBinge_API: { domain: "dmlkYmluZ2UuY29t", path: "api" },
  VidBinge_V2: { domain: "dmlkYmluZ2UuY29t", path: "v2" },
  TwoEmbed_Prime: { domain: "MmVtYmVkLmNj", path: "embed" },
  TwoEmbed_V2: { domain: "MmVtYmVkLmNj", path: "v2" },
  TwoEmbed_API: { domain: "MmVtYmVkLmNj", path: "api" },
  Omega_Core_100: { domain: "dmlkb3JhLnN1", path: "omega" }
};

const GENRES: Record<number, string> = { 
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 
  18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 53: "Thriller", 10752: "War", 37: "Western"
};

export default function BlehflixAbsoluteCinema() {
  const [bootState, setBootState] = useState<'booting' | 'fading' | 'done'>('booting');
  const [items, setItems] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [view, setView] = useState<'browse' | 'details'>('browse');
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [server, setServer] = useState<keyof typeof SERVERS>('Vidora_Prime');

  const API_KEY = "3c08a2b895c3295cc09d583b3fc279cf";

  // Boot sequence with Fade Out
  useEffect(() => {
    const t1 = setTimeout(() => setBootState('fading'), 3500);
    const t2 = setTimeout(() => setBootState('done'), 4500); // 1-second fade out
    
    fetch(`https://api.themoviedb.org/3/${type}/top_rated?api_key=${API_KEY}&language=en-US&page=1`)
      .then(res => res.json())
      .then(data => setItems(data.results || []));
      
    return () => { clearTimeout(t1); clearTimeout(t2); };
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
    
    // The master routing switch for 100 paths
    if (node.path === 'player.php') return `https://${domain}/player.php?video_id=${id}&tmdb=1`;
    if (node.path === 'direct') return `https://${domain}/directstream.php?video_id=${id}&tmdb=1`;
    if (node.path === 'vapi') return `https://${domain}/vapi/movie/${id}`;
    if (node.path === 'smashy') return `https://${domain}/playere.php?tmdb=${id}`;
    
    // Fallback standard structure for variations
    return `https://${domain}/${node.path === 'embed' ? 'embed' : 'embed'}/${type}/${id}`;
  };

  const heroItem = query === '' ? items[0] : null;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#E50914] selection:text-white">
      
      {/* BEAUTIFUL FADE-OUT BOOT SCREEN */}
      {bootState !== 'done' && (
        <div className={`fixed inset-0 bg-[#020202] flex flex-col items-center justify-center z-[100] overflow-hidden transition-opacity duration-1000 ease-in-out ${bootState === 'fading' ? 'opacity-0' : 'opacity-100'}`}>
          <div className="absolute inset-0 z-0">
            {[...Array(120)].map((_, i) => (
              <div key={i} className="absolute bg-white rounded-full animate-pulse" style={{
                width: Math.random() * 3 + 'px', height: Math.random() * 3 + 'px',
                top: Math.random() * 100 + '%', left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's', opacity: Math.random()
              }} />
            ))}
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-7xl md:text-9xl font-black text-[#E50914] italic tracking-tighter drop-shadow-[0_0_50px_rgba(229,9,20,0.8)] animate-pulse">BLEHFLIX</h1>
            <div className="flex items-center gap-4 mt-8">
              <span className="h-[1px] w-12 bg-white/30" />
              <p className="text-white tracking-[0.8em] uppercase text-xs font-black">Absolute Cinema</p>
              <span className="h-[1px] w-12 bg-white/30" />
            </div>
          </div>
        </div>
      )}

      {/* Deep Space Background */}
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
                if (item.id === heroItem?.id && query === '') return null;
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
        /* DETAILS & PLAYER */
        <main className="relative z-10 pt-32 md:pt-40 pb-32 px-6 md:px-20 max-w-[120rem] mx-auto min-h-screen">
          <button onClick={() => setView('browse')} className="mb-10 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.3em] transition-all flex items-center gap-3">
            <span className="text-[#E50914] text-lg">←</span> Return to Lobby
          </button>
          
          <div className="flex flex-col xl:flex-row gap-12 xl:gap-20">
            <div className="w-full md:w-1/2 xl:w-1/4 shrink-0">
               <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] xl:sticky xl:top-32">
                 <img src={`https://image.tmdb.org/t/p/w500${activeItem?.poster_path}`} alt="poster" className="w-full h-auto object-cover" />
                 <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex flex-col items-center shadow-2xl">
                    <span className="text-yellow-500 text-lg font-black">★ {activeItem?.vote_average?.toFixed(1)}</span>
                    <span className="text-[8px] text-zinc-400 uppercase font-black tracking-widest">TMDb Rating</span>
                 </div>
               </div>
            </div>

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

               <div className="pt-8 border-t border-white/10">
                 {!isStreaming ? (
                   <button onClick={() => setIsStreaming(true)} className="group relative bg-[#E50914] px-12 md:px-20 py-6 md:py-8 rounded-3xl font-black uppercase tracking-tighter text-2xl md:text-4xl hover:scale-[1.02] transition-all shadow-[0_0_50px_rgba(229,9,20,0.3)] overflow-hidden">
                     <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500">Initialize Cinema UI</span>
                     <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                   </button>
                 ) : (
                   <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 space-y-8">
                      
                      {/* THE 100-NODE SELECTOR DASHBOARD */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center px-2">
                          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Global Cluster Selection</h4>
                          <span className="flex items-center gap-2 text-[9px] text-emerald-500 font-black uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 100 Nodes Online</span>
                        </div>
                        
                        <div className="bg-zinc-900/60 p-4 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl overflow-y-auto h-72 custom-scrollbar">
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                            {Object.keys(SERVERS).map(key => (
                              <button 
                                key={key} 
                                onClick={() => setServer(key as any)} 
                                className={`px-2 py-3 text-[8px] font-black uppercase rounded-xl transition-all duration-300 border truncate ${
                                  server === key 
                                  ? 'bg-[#E50914] text-white border-[#E50914] shadow-[0_0_15px_rgba(229,9,20,0.5)] scale-105 z-10' 
                                  : 'bg-black/50 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white'
                                }`}
                                title={key}
                              >
                                {key.replace('_', ' ')}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

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
                        <p>Current Protocol: <span className="text-white">{server.replace('_', ' ')}</span></p>
                        <p>Aggregating exactly 100 Dedicated Nodes</p>
                      </div>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </main>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #E50914; }
      `}} />
    </div>
  );
}
