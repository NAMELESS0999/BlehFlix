"use client";
import React, { useEffect, useState } from 'react';

const ENCODED_DOMAINS = {
  vidora: "dmlkb3JhLnN1",    // Working (Balder)
  auto: "d2F0Y2gtdjIuYXV0b2VtYmVkLmNj", // Autoembed
  icu: "dmlkc3JjLmljdQ==",    // Fresh backup
  hades: "ZW1iZWQuc3U=",      // High stability
  ares: "dmlkc3JjLnRv",       
  zeus: "dmlkc3JjLm1l",       
  pm: "dmlkc3JjLnBt",         
};

const GENRES: Record<number, string> = { 
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 
  18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 53: "Thriller", 10752: "War", 37: "Western"
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
  const [isAdBlockerEnabled, setIsAdBlockerEnabled] = useState(true);
  
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [server, setServer] = useState<keyof typeof ENCODED_DOMAINS>('vidora');

  const API_KEY = "3c08a2b895c3295cc09d583b3fc279cf";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
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

  const getStreamUrl = () => {
    if (!activeItem) return "";
    const domain = atob(ENCODED_DOMAINS[server]);
    let url = "";

    // Specific path logic for Vidora & Autoembed
    if (server === 'vidora') {
      url = `https://${domain}/embed/${type}/${activeItem.id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
    } else if (server === 'auto') {
      url = `https://${domain}/watch/${type}/${activeItem.id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
    } else {
      url = `https://${domain}/embed/${type}/${activeItem.id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
    }

    if (isProxyEnabled) {
      return `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=604800&url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex items-center justify-center z-[100] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '40px 40px', animation: 'slide 20s linear infinite' }} />
        <h1 className="text-6xl md:text-9xl font-black text-[#E50914] tracking-tighter italic animate-pulse relative z-10 drop-shadow-[0_0_40px_rgba(229,9,20,0.8)]">BLEHFLIX</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600">
      <nav className="p-4 md:p-6 flex flex-col lg:flex-row justify-between items-center fixed w-full z-50 bg-black/80 backdrop-blur-2xl border-b border-white/5 gap-4">
        <div className="flex items-center justify-between w-full lg:w-auto gap-8">
          <h1 onClick={() => {setView('browse'); setIsStreaming(false);}} className="text-3xl font-black text-[#E50914] cursor-pointer tracking-tighter hover:scale-105 transition-all">BLEHFLIX™</h1>
          <div className="flex bg-zinc-900 rounded-full p-1">
            <button onClick={() => setType('movie')} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase ${type === 'movie' ? 'bg-red-600' : 'text-zinc-500 hover:text-white'}`}>Movies</button>
            <button onClick={() => setType('tv')} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase ${type === 'tv' ? 'bg-red-600' : 'text-zinc-500 hover:text-white'}`}>Shows</button>
          </div>
        </div>
        <input type="text" placeholder="Search peak titles..." className="w-full lg:max-w-md bg-zinc-900/50 border border-zinc-800 px-6 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-red-600 transition-all" onChange={handleSearch} />
      </nav>

      {view === 'browse' ? (
        <main className="pt-32 lg:pt-0">
          {items[0] && query.length <= 2 && (
            <div className="relative h-[65vh] md:h-[80vh] flex items-center px-6 md:px-16 overflow-hidden mb-8 group">
              <img src={`https://image.tmdb.org/t/p/original${items[0].backdrop_path}`} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" alt="hero" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              <div className="relative z-10 max-w-3xl space-y-6">
                <span className="bg-yellow-500 text-black px-4 py-1.5 text-[10px] font-black uppercase tracking-widest animate-pulse">Absolute Cinema</span>
                <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]">{items[0].title || items[0].name}</h2>
                <button onClick={() => { setActiveItem(items[0]); setView('details'); }} className="bg-red-600 text-white px-12 py-5 rounded-sm font-black uppercase tracking-widest hover:bg-white hover:text-black hover:scale-105 transition-all shadow-[0_0_30px_rgba(229,9,20,0.4)]">Watch Now</button>
              </div>
            </div>
          )}

          <div className="px-4 md:px-16 pb-24">
            <h3 className="text-xl font-black mb-8 uppercase tracking-tighter border-l-4 border-red-600 pl-4">Trending Peak</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {(query.length > 2 ? searchResults : items).map((item) => (
                <div key={item.id} onClick={() => { setActiveItem(item); setView('details'); setIsStreaming(false); window.scrollTo(0,0); }} className="cursor-pointer group relative">
                   {item.vote_average > 8 && <div className="absolute -top-2 -right-2 z-20 bg-yellow-500 text-black text-[9px] font-black px-2 py-1 rounded">PEAK</div>}
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10 group-hover:border-red-600 group-hover:-translate-y-2 transition-all duration-300">
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <h4 className="mt-3 text-[10px] font-bold uppercase truncate text-zinc-500 group-hover:text-white transition-colors">{item.title || item.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        <main className="pt-32 pb-20 px-4 md:px-16 max-w-[100rem] mx-auto">
          <button onClick={() => setView('browse')} className="mb-8 text-[11px] font-black uppercase text-zinc-500 hover:text-white tracking-[0.2em] flex items-center gap-2 transition-all">← Return to Lobby</button>
          
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-16">
            <div className="w-full lg:w-1/3 xl:w-1/4">
               <img src={`https://image.tmdb.org/t/p/w500${activeItem?.poster_path}`} className="w-full rounded-2xl shadow-2xl border border-white/10" />
               <div className="mt-6 p-6 bg-zinc-900/40 rounded-2xl border border-white/5">
                  <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">Synopsis</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">{activeItem?.overview}</p>
               </div>
            </div>
            
            <div className="flex-1 space-y-8">
               <div className="space-y-4">
                  <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">{activeItem?.title || activeItem?.name}</h2>
                  <div className="flex items-center gap-4 text-xs font-bold uppercase">
                    <span className="text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">★ {activeItem?.vote_average.toFixed(1)}</span>
                    <span className="text-zinc-400">Released: <span className="text-white">{activeItem?.release_date || activeItem?.first_air_date}</span></span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeItem?.genre_ids?.map((id: number) => GENRES[id] && (
                      <span key={id} className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">{GENRES[id]}</span>
                    ))}
                  </div>
               </div>

               {!isStreaming ? (
                 <button onClick={() => setIsStreaming(true)} className="bg-red-600 text-white px-12 py-6 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">▶ Initialize Ares Node</button>
               ) : (
                 <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="flex flex-wrap gap-3 bg-zinc-900/80 p-4 rounded-xl border border-white/5 items-center justify-between">
                       <div className="flex flex-wrap gap-2">
                          {Object.keys(ENCODED_DOMAINS).map(key => (
                            <button key={key} onClick={() => setServer(key as any)} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${server === key ? 'bg-red-600' : 'bg-black text-zinc-500 border border-zinc-800'}`}>{key}</button>
                          ))}
                       </div>
                       <div className="flex gap-3">
                          <button onClick={() => setIsAdBlockerEnabled(!isAdBlockerEnabled)} className={`px-4 py-2 text-[9px] font-black uppercase rounded-full border transition-all ${isAdBlockerEnabled ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'border-zinc-700 text-zinc-500'}`}>Ad-Blocker: {isAdBlockerEnabled ? 'ON' : 'OFF'}</button>
                          <button onClick={() => setIsProxyEnabled(!isProxyEnabled)} className={`px-4 py-2 text-[9px] font-black uppercase rounded-full border transition-all ${isProxyEnabled ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'border-zinc-700 text-zinc-500'}`}>Ghost: {isProxyEnabled ? 'ON' : 'OFF'}</button>
                       </div>
                    </div>

                    <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative">
                       {/* RELAXED SANDBOX: allows scripts to run the video engine but blocks popups */}
                       <iframe 
                         key={`${activeItem?.id}-${server}-${isProxyEnabled}-${isAdBlockerEnabled}`}
                         src={getStreamUrl()} 
                         className="w-full h-full" 
                         allowFullScreen 
                         sandbox={isAdBlockerEnabled ? "allow-forms allow-scripts allow-same-origin" : undefined}
                         scrolling="no"
                         frameBorder="0"
                       />
                    </div>
                    <p className="text-center text-[10px] font-black text-zinc-600 uppercase tracking-widest">⚠️ If video hangs, turn OFF Ad-Blocker & Ghost-Mode for initial load</p>
                 </div>
               )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
