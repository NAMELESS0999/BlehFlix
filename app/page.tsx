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
  const [isAdBlockerEnabled, setIsAdBlockerEnabled] = useState(false); // Default to OFF to fix the "Sandbox detected" error
  
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
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
    let url = `https://${domain}/${server === 'auto' ? 'watch' : 'embed'}/${type}/${activeItem.id}${type === 'tv' ? `/${season}/${episode}` : ''}`;
    
    if (isProxyEnabled) {
      return `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=604800&url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  if (loading) {
    return <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]"><h1 className="text-6xl font-black text-red-600 animate-pulse italic">BLEHFLIX</h1></div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <nav className="p-6 flex flex-col lg:flex-row justify-between items-center fixed w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 gap-4">
        <h1 onClick={() => {setView('browse'); setIsStreaming(false);}} className="text-3xl font-black text-red-600 cursor-pointer tracking-tighter">BLEHFLIX™</h1>
        <div className="flex bg-zinc-900 rounded-full p-1">
          <button onClick={() => setType('movie')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase ${type === 'movie' ? 'bg-red-600' : 'text-zinc-500'}`}>Movies</button>
          <button onClick={() => setType('tv')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase ${type === 'tv' ? 'bg-red-600' : 'text-zinc-500'}`}>Shows</button>
        </div>
        <input type="text" placeholder="Search..." className="w-full lg:max-w-md bg-zinc-900 border border-zinc-800 px-6 py-2 rounded-full text-sm outline-none" onChange={handleSearch} />
      </nav>

      {view === 'browse' ? (
        <main className="pt-32 px-4 md:px-16 pb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {(query.length > 2 ? searchResults : items).map((item) => (
              <div key={item.id} onClick={() => { setActiveItem(item); setView('details'); setIsStreaming(false); window.scrollTo(0,0); }} className="cursor-pointer group">
                <div className="aspect-[2/3] rounded-xl overflow-hidden border border-white/10 group-hover:border-red-600 transition-all">
                  <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} className="w-full h-full object-cover" />
                </div>
                <h4 className="mt-2 text-[10px] font-bold uppercase truncate text-zinc-400 group-hover:text-white">{item.title || item.name}</h4>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <main className="pt-32 pb-20 px-4 md:px-16 max-w-7xl mx-auto">
          <button onClick={() => setView('browse')} className="mb-8 text-xs font-black text-zinc-500 hover:text-white uppercase">← Back</button>
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-1/4">
               <img src={`https://image.tmdb.org/t/p/w500${activeItem?.poster_path}`} className="rounded-2xl border border-white/10" />
            </div>
            <div className="flex-1 space-y-6">
               <h2 className="text-5xl font-black uppercase italic tracking-tighter">{activeItem?.title || activeItem?.name}</h2>
               {!isStreaming ? (
                 <button onClick={() => setIsStreaming(true)} className="bg-red-600 px-10 py-4 rounded-xl font-black uppercase hover:scale-105 transition-all">Initialize Stream</button>
               ) : (
                 <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 bg-zinc-900 p-4 rounded-xl border border-white/5">
                       {Object.keys(ENCODED_DOMAINS).map(key => (
                         <button key={key} onClick={() => setServer(key as any)} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg ${server === key ? 'bg-red-600' : 'bg-black text-zinc-500'}`}>{key}</button>
                       ))}
                       <div className="ml-auto flex gap-2">
                         <button onClick={() => setIsAdBlockerEnabled(!isAdBlockerEnabled)} className={`px-4 py-2 text-[10px] font-black rounded-full border ${isAdBlockerEnabled ? 'bg-blue-600 border-blue-400' : 'border-zinc-700 text-zinc-500'}`}>Ad-Block: {isAdBlockerEnabled ? 'ON' : 'OFF'}</button>
                         <button onClick={() => setIsProxyEnabled(!isProxyEnabled)} className={`px-4 py-2 text-[10px] font-black rounded-full border ${isProxyEnabled ? 'bg-emerald-600 border-emerald-400' : 'border-zinc-700 text-zinc-500'}`}>Ghost: {isProxyEnabled ? 'ON' : 'OFF'}</button>
                       </div>
                    </div>
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
                       <iframe 
                         key={`${activeItem?.id}-${server}-${isAdBlockerEnabled}-${isProxyEnabled}`}
                         src={getStreamUrl()} 
                         className="w-full h-full" 
                         allowFullScreen 
                         // This is the fix for the "Sandbox Detected" error:
                         sandbox={isAdBlockerEnabled ? "allow-forms allow-scripts allow-same-origin allow-pointer-lock" : "allow-forms allow-scripts allow-same-origin"}
                       />
                    </div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black text-center">Tip: Use "Vidora" + Ghost Mode OFF to bypass School WiFi blocks</p>
                 </div>
               )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
