"use client";
import React, { useEffect, useState } from 'react';

const SERVERS = {
  vidsrc: "dmlkc3JjLnRv",
  vidapi: "dmlkc3JjLnh5eg==",
  super: "c3VwZXJlbWJlZC5jYw==",
  auto: "d2F0Y2gtdjIuYXV0b2VtYmVkLmNj",
  embedsu: "ZW1iZWQuc3U=",
  remix: "dmlkc3JjLm1l",
  vip: "dmlkc3JjLmljdQ==",
  prime: "dmlkc3JjLnBt"
};

export default function BlehflixUltra() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [view, setView] = useState<'browse' | 'details'>('browse');
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [server, setServer] = useState<keyof typeof SERVERS>('vidsrc');

  const API_KEY = "3c08a2b895c3295cc09d583b3fc279cf";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // Cinematic delay
    fetch(`https://api.themoviedb.org/3/trending/${type}/week?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setItems(data.results || []);
        if (data.results?.[0]) setActiveItem(data.results[0]);
      });
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
    const domain = atob(SERVERS[server]);
    if (server === 'auto') return `https://${domain}/player.php?id=${activeItem.id}`;
    if (server === 'super') return `https://multiembed.mov/directstream.php?video_id=${activeItem.id}&tmdb=1`;
    return `https://${domain}/embed/${type}/${activeItem.id}`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-[100]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="absolute bg-white rounded-full animate-pulse" style={{
              width: Math.random() * 3 + 'px', height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%', left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's'
            }} />
          ))}
        </div>
        <h1 className="text-8xl font-black text-red-600 italic tracking-tighter animate-bounce">BLEHFLIX</h1>
        <p className="text-white/30 tracking-[1em] uppercase text-[10px] mt-4 font-bold">Initializing Absolute Cinema</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-red-600">
      {/* Dynamic Star Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black" />
      </div>

      <nav className="p-8 flex justify-between items-center fixed w-full z-50 bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center gap-8">
          <h1 onClick={() => setView('browse')} className="text-4xl font-black text-red-600 cursor-pointer tracking-tighter drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">BLEHFLIX™</h1>
          <div className="hidden md:flex bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-2xl">
            <button onClick={() => setType('movie')} className={`px-8 py-2 rounded-full text-xs font-black uppercase transition-all ${type === 'movie' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}>Movies</button>
            <button onClick={() => setType('tv')} className={`px-8 py-2 rounded-full text-xs font-black uppercase transition-all ${type === 'tv' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}>TV Shows</button>
          </div>
        </div>
        <div className="relative group">
          <input type="text" placeholder="Search peak titles..." className="w-64 lg:w-96 bg-black/40 border border-white/10 px-6 py-3 rounded-full text-sm outline-none focus:border-red-600 focus:w-[450px] transition-all" onChange={handleSearch} />
        </div>
      </nav>

      {view === 'browse' ? (
        <main>
          {/* HERO SECTION */}
          <section className="relative h-[85vh] flex items-end pb-24 px-4 md:px-20 overflow-hidden">
            <img src={`https://image.tmdb.org/t/p/original${activeItem?.backdrop_path}`} className="absolute inset-0 w-full h-full object-cover opacity-50 transition-all duration-1000 scale-105" alt="hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/40 to-transparent" />
            <div className="relative z-10 max-w-4xl space-y-6">
              <div className="flex items-center gap-3">
                <span className="bg-red-600 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">Absolute Cinema</span>
                <span className="text-yellow-500 font-bold">★ {activeItem?.vote_average?.toFixed(1)}</span>
              </div>
              <h2 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-none">{activeItem?.title || activeItem?.name}</h2>
              <p className="text-zinc-300 text-lg line-clamp-3 max-w-2xl">{activeItem?.overview}</p>
              <button onClick={() => setView('details')} className="bg-white text-black px-12 py-4 rounded-full font-black uppercase hover:bg-red-600 hover:text-white transition-all scale-110">Watch Now</button>
            </div>
          </section>

          {/* GRID */}
          <div className="px-4 md:px-20 -mt-10 relative z-20">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-2xl font-black uppercase italic italic tracking-tighter underline decoration-red-600 underline-offset-8">Trending Peak</h3>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
              {(query.length > 2 ? searchResults : items).map((item) => (
                <div key={item.id} onClick={() => { setActiveItem(item); setView('details'); setIsStreaming(false); window.scrollTo(0,0); }} className="cursor-pointer group relative">
                  <div className="aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 group-hover:border-red-600 transition-all duration-500 shadow-2xl group-hover:-translate-y-4">
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt="poster" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-[8px] font-black text-red-500 border border-red-500/50">PEAK</div>
                  </div>
                  <h4 className="mt-4 text-[11px] font-black uppercase truncate text-zinc-500 group-hover:text-red-600 transition-colors">{item.title || item.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        /* DETAILS VIEW */
        <main className="pt-40 pb-20 px-4 md:px-20 max-w-[100rem] mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="w-full lg:w-1/4">
               <img src={`https://image.tmdb.org/t/p/w500${activeItem?.poster_path}`} alt="poster" className="rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,1)] sticky top-40" />
            </div>
            <div className="flex-1 space-y-10">
               <div>
                 <div className="flex gap-4 mb-4">
                    <span className="text-red-600 font-black tracking-widest text-xs uppercase">Release: {activeItem?.release_date || activeItem?.first_air_date}</span>
                    <span className="text-zinc-600 font-black text-xs uppercase underline decoration-zinc-800 underline-offset-4">Quality: 4K Peak</span>
                 </div>
                 <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8] mb-6">{activeItem?.title || activeItem?.name}</h2>
                 <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-3xl border-l-4 border-red-600 pl-6">{activeItem?.overview}</p>
               </div>

               <div className="space-y-6">
                 {!isStreaming ? (
                   <button onClick={() => setIsStreaming(true)} className="group relative bg-red-600 px-16 py-6 rounded-2xl font-black uppercase text-2xl tracking-tighter hover:bg-white hover:text-black transition-all shadow-2xl overflow-hidden">
                     <span className="relative z-10">Initialize Peak Player</span>
                     <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                   </button>
                 ) : (
                   <div className="animate-in slide-in-from-bottom-10 duration-700 space-y-6">
                      <div className="flex flex-wrap gap-3 bg-zinc-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-xl shadow-inner">
                        {Object.keys(SERVERS).map(key => (
                          <button key={key} onClick={() => setServer(key as any)} className={`px-6 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${server === key ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-105' : 'bg-black/50 text-zinc-500 hover:text-white border border-white/5'}`}>{key} Cluster</button>
                        ))}
                      </div>
                      <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(220,38,38,0.1)] relative group">
                        <iframe key={server} src={getUrl()} className="w-full h-full" allowFullScreen referrerPolicy="no-referrer" />
                      </div>
                      <p className="text-[10px] text-zinc-700 text-center font-black tracking-[0.5em] uppercase">Now Buffering 50+ Mirrored Nodes via {server} Global Cluster</p>
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
