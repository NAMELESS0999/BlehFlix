"use client";
import React, { useEffect, useState } from 'react';

const ENCODED_DOMAINS = {
  vidora: "dmlkb3JhLnN1",    
  auto: "d2F0Y2gtdjIuYXV0b2VtYmVkLmNj", 
  icu: "dmlkc3JjLmljdQ==",    
  hades: "ZW1iZWQuc3U=",      
  ares: "dmlkc3JjLnRv",       
  zeus: "dmlkc3JjLm1l",       
  pm: "dmlkc3JjLnBt",         
};

const GENRES: Record<number, string> = { 28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 18: "Drama", 14: "Fantasy", 27: "Horror", 878: "Sci-Fi", 53: "Thriller" };

export default function BlehflixFinal() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [view, setView] = useState<'browse' | 'details'>('browse');
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProxyEnabled, setIsProxyEnabled] = useState(false);
  const [server, setServer] = useState<keyof typeof ENCODED_DOMAINS>('vidora');

  const API_KEY = "3c08a2b895c3295cc09d583b3fc279cf";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
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

    // Fix for the 404 and Black Screen issues
    if (server === 'auto') {
      url = `https://${domain}/player.php?id=${activeItem.id}${type === 'tv' ? `&s=${1}&e=${1}` : ''}`;
    } else if (server === 'vidora') {
      url = `https://${domain}/embed/${type}/${activeItem.id}`;
    } else {
      url = `https://${domain}/embed/${type}/${activeItem.id}`;
    }
    
    // Ghost Mode (Bypassing School Blocks)
    if (isProxyEnabled) {
      return `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=604800&url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  if (loading) {
    return <div className="fixed inset-0 bg-black flex items-center justify-center z-[100] font-black italic text-red-600 text-6xl animate-pulse">BLEHFLIX</div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <nav className="p-6 flex flex-col lg:flex-row justify-between items-center fixed w-full z-50 bg-black/80 backdrop-blur-2xl border-b border-white/5 gap-4">
        <h1 onClick={() => {setView('browse'); setIsStreaming(false);}} className="text-3xl font-black text-red-600 cursor-pointer tracking-tighter hover:scale-105 transition-all">BLEHFLIX™</h1>
        <div className="flex bg-zinc-900 rounded-full p-1 border border-white/5">
          <button onClick={() => setType('movie')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${type === 'movie' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white'}`}>Movies</button>
          <button onClick={() => setType('tv')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${type === 'tv' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white'}`}>Shows</button>
        </div>
        <input type="text" placeholder="Search peak titles..." className="w-full lg:max-w-md bg-zinc-900 border border-zinc-800 px-6 py-2 rounded-full text-sm outline-none focus:border-red-600 transition-all" onChange={handleSearch} />
      </nav>

      {view === 'browse' ? (
        <main className="pt-32 px-4 md:px-16 pb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {(query.length > 2 ? searchResults : items).map((item) => (
              <div key={item.id} onClick={() => { setActiveItem(item); setView('details'); setIsStreaming(false); window.scrollTo(0,0); }} className="cursor-pointer group">
                <div className="aspect-[2/3] rounded-xl overflow-hidden border border-white/10 group-hover:border-red-600 group-hover:-translate-y-2 transition-all duration-300 shadow-lg">
                  <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || item.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="mt-3 text-[10px] font-black uppercase truncate text-zinc-500 group-hover:text-white transition-colors">{item.title || item.name}</h4>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <main className="pt-32 pb-20 px-4 md:px-16 max-w-7xl mx-auto">
          <button onClick={() => setView('browse')} className="mb-8 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-all">← Back to Lobby</button>
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-1/3 xl:w-1/4">
               <img src={`https://image.tmdb.org/t/p/w500${activeItem?.poster_path}`} alt="poster" className="rounded-2xl border border-white/10 shadow-2xl" />
            </div>
            <div className="flex-1 space-y-8">
               <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">{activeItem?.title || activeItem?.name}</h2>
               {!isStreaming ? (
                 <button onClick={() => setIsStreaming(true)} className="bg-red-600 px-12 py-5 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(229,9,20,0.4)]">▶ Initialize Stream</button>
               ) : (
                 <div className="space-y-4 animate-in fade-in duration-1000">
                    <div className="flex flex-wrap gap-2 bg-zinc-900/80 p-4 rounded-2xl border border-white/5">
                       {Object.keys(ENCODED_DOMAINS).map(key => (
                         <button key={key} onClick={() => setServer(key as any)} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${server === key ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-black text-zinc-500 border border-zinc-800'}`}>{key}</button>
                       ))}
                       <button onClick={() => setIsProxyEnabled(!isProxyEnabled)} className={`ml-auto px-4 py-2 text-[10px] font-black rounded-full border transition-all ${isProxyEnabled ? 'bg-emerald-600 border-emerald-400 text-white' : 'border-zinc-700 text-zinc-500 hover:border-white'}`}>Ghost: {isProxyEnabled ? 'ON' : 'OFF'}</button>
                    </div>
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative">
                       <iframe 
                         key={`${activeItem?.id}-${server}-${isProxyEnabled}`}
                         src={getStreamUrl()} 
                         className="w-full h-full" 
                         allowFullScreen 
                         referrerPolicy="no-referrer"
                       />
                    </div>
                    <p className="text-[9px] text-zinc-600 uppercase font-black text-center tracking-widest">Tip: If Black Screen persists, try &quot;Auto&quot; or &quot;Ares&quot; nodes.</p>
                 </div>
               )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
