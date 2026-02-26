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

  const openDetails = (item: any) => {
    setActiveItem(item);
    setView('details');
    setIsStreaming(false);
    window.scrollTo(0,0);
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
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
        <h1 className="text-5xl font-black text-[#E50914] italic animate-pulse">BLEHFLIX</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600">
      <nav className="p-4 md:p-6 flex flex-col lg:flex-row justify-between items-center fixed w-full z-50 bg-black/95 border-b border-white/5 gap-4">
        <div className="flex items-center justify-between w-full lg:w-auto gap-8">
          <h1 onClick={() => {setView('browse'); setIsStreaming(false);}} className="text-3xl font-black text-[#E50914] cursor-pointer tracking-tighter">BLEHFLIX™</h1>
          <div className="flex bg-zinc-900 rounded-full p-1">
            <button onClick={() => setType('movie')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${type === 'movie' ? 'bg-red-600' : 'text-zinc-500'}`}>Movies</button>
            <button onClick={() => setType('tv')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${type === 'tv' ? 'bg-red-600' : 'text-zinc-500'}`}>Shows</button>
          </div>
        </div>
        <input type="text" placeholder="Search titles..." className="w-full lg:max-w-md bg-zinc-900 border border-zinc-800 px-6 py-2 rounded-full text-sm outline-none focus:ring-2 focus:ring-red-600" onChange={handleSearch} />
      </nav>

      {view === 'browse' ? (
        <main className="pt-32">
          {items[0] && (
            <div className="relative h-[60vh] flex items-center px-6 md:px-16 overflow-hidden mb-12">
              <img src={`https://image.tmdb.org/t/p/original${items[0].backdrop_path}`} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="hero" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              <div className="relative z-10 max-w-2xl space-y-4">
                <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{items[0].title || items[0].name}</h2>
                <button onClick={() => openDetails(items[0])} className="bg-red-600 text-white px-8 py-3 rounded-sm font-black uppercase hover:bg-white hover:text-black transition-all">Watch Now</button>
              </div>
            </div>
          )}

          <div className="px-6 md:px-16 pb-20">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {(query.length > 2 ? searchResults : items).map((item) => (
                <div key={item.id} onClick={() => openDetails(item)} className="cursor-pointer group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-white/5 group-hover:border-red-600 transition-all">
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <h4 className="mt-2 text-[10px] font-bold uppercase truncate text-zinc-500 group-hover:text-white">{item.title || item.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        <main className="pt-32 px-6 md:px-16">
          <button onClick={() => setView('browse')} className="mb-8 text-[10px] font-black uppercase text-zinc-500 hover:text-white tracking-widest">← Back</button>
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-1/3">
              <img src={`https://image.tmdb.org/t/p/w500${activeItem?.poster_path}`} className="w-full rounded-xl shadow-2xl" />
            </div>
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter">{activeItem?.title || activeItem?.name}</h2>
              {!isStreaming ? (
                <button onClick={() => setIsStreaming(true)} className="bg-red-600 px-12 py-5 font-black uppercase rounded-sm">Initialize Ares Node</button>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                    {Object.keys(ENCODED_DOMAINS).map(key => (
                      <button key={key} onClick={() => setServer(key as any)} className={`px-3 py-1 text-[10px] font-black uppercase rounded ${server === key ? 'bg-red-600' : 'bg-black'}`}>{key}</button>
                    ))}
                    <button onClick={() => setIsProxyEnabled(!isProxyEnabled)} className={`ml-auto px-3 py-1 text-[10px] font-black uppercase rounded-full border ${isProxyEnabled ? 'bg-green-600 border-green-500' : 'border-zinc-700 text-zinc-500'}`}>Proxy: {isProxyEnabled ? 'ON' : 'OFF'}</button>
                  </div>
                  {type === 'tv' && (
                    <div className="flex gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                      <input type="number" value={season} onChange={e => setSeason(Number(e.target.value))} className="w-20 bg-black border border-zinc-800 text-center py-1 rounded text-xs" />
                      <input type="number" value={episode} onChange={e => setEpisode(Number(e.target.value))} className="w-20 bg-black border border-zinc-800 text-center py-1 rounded text-xs" />
                    </div>
                  )}
                  <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border border-zinc-800">
                    <iframe key={`${server}-${season}-${episode}-${isProxyEnabled}`} src={getStreamUrl()} className="w-full h-full" allowFullScreen scrolling="no" frameBorder="0" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
