"use client";
import React, { useEffect, useState } from 'react';

// TMDB API Key (Keeping yours from the original)
const API_KEY = "3c08a2b895c3295cc09d583b3fc279cf";

export default function BlehflixAres() {
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [view, setView] = useState<'browse' | 'details'>('browse');
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [server, setServer] = useState<'vidsrc' | 'vidlink'>('vidsrc');

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
      setItems(data.results || []);
    }
  };

  // 🔥 THE FIX: Use the stable 2026 Ares clusters
  const getStreamUrl = () => {
    if (!activeItem) return "";
    
    // vidsrc.cc is the current most stable "Ares" provider
    if (server === 'vidsrc') {
      return type === 'movie' 
        ? `https://vidsrc.cc/v2/embed/movie/${activeItem.id}`
        : `https://vidsrc.cc/v2/embed/tv/${activeItem.id}/1/1`;
    } 
    // vidlink.pro is the "Ares" backup (super fast)
    else {
      return type === 'movie'
        ? `https://vidlink.pro/movie/${activeItem.id}`
        : `https://vidlink.pro/tv/${activeItem.id}/1/1`;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600">
      {/* HEADER */}
      <nav className="p-4 flex flex-col md:flex-row justify-between items-center fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <h1 onClick={() => setView('browse')} className="text-2xl font-black text-red-600 cursor-pointer">BLEHFLIX™</h1>
        <div className="flex gap-4 my-2 md:my-0">
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-zinc-900 border border-zinc-800 px-4 py-1 rounded-full text-sm outline-none" 
            onChange={handleSearch} 
          />
          <select 
            className="bg-zinc-900 text-xs px-2 rounded-full border border-zinc-700"
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
        </div>
      </nav>

      {view === 'browse' ? (
        <main className="pt-24 px-8 grid grid-cols-2 md:grid-cols-5 gap-6">
          {items.map(item => (
            <div key={item.id} onClick={() => {setActiveItem(item); setView('details'); setIsStreaming(false);}} className="group cursor-pointer">
              <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} className="rounded-lg hover:scale-105 transition border border-white/5 group-hover:border-red-600" />
              <p className="mt-2 text-[10px] uppercase font-bold text-zinc-500 truncate">{item.title || item.name}</p>
            </div>
          ))}
        </main>
      ) : (
        <main className="pt-24 px-4 flex flex-col items-center">
          <button onClick={() => setView('browse')} className="mb-4 text-xs text-zinc-500 hover:text-white">← BACK TO BROWSE</button>
          <h2 className="text-4xl font-black mb-6 italic uppercase">{activeItem?.title || activeItem?.name}</h2>
          
          <div className="w-full max-w-5xl">
            {isStreaming ? (
              <div className="animate-in fade-in zoom-in duration-500">
                <div className="flex gap-2 mb-2">
                  <button 
                    onClick={() => setServer('vidsrc')} 
                    className={`text-[10px] px-3 py-1 rounded ${server === 'vidsrc' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}
                  >
                    ARES PRIMARY
                  </button>
                  <button 
                    onClick={() => setServer('vidlink')} 
                    className={`text-[10px] px-3 py-1 rounded ${server === 'vidlink' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}
                  >
                    ARES BACKUP
                  </button>
                </div>
                <div className="aspect-video bg-zinc-900 border-2 border-red-600 rounded-lg overflow-hidden shadow-2xl shadow-red-600/10">
                  <iframe 
                    src={getStreamUrl()} 
                    className="w-full h-full" 
                    allowFullScreen 
                    referrerPolicy="origin"
                  />
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsStreaming(true)} 
                className="w-full py-20 bg-zinc-900 rounded-lg border-2 border-dashed border-zinc-700 hover:border-red-600 group transition-all"
              >
                <span className="text-zinc-500 group-hover:text-red-600 font-black uppercase tracking-widest">Connect to Stream Node</span>
              </button>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
