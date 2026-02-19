"use client";
import React, { useEffect, useState } from 'react';

// This part tells the computer what a "Movie" or "Show" looks like
interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
}

export default function BlehflixFinalMaster() {
  const [items, setItems] = useState<Media[]>([]);
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [view, setView] = useState<'browse' | 'details'>('browse');
  const [activeItem, setActiveItem] = useState<Media | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  
  const API_KEY = "3c08a2b895c3295cc09d583b3fc279cf";

  // This fetches the movies when the page loads
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/${type}/top_rated?api_key=${API_KEY}&language=en-US&page=1`)
      .then(res => res.json())
      .then(data => {
        setItems(data.results || []);
        setHeroIndex(0);
      });
  }, [type]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setQuery(term);
    if (term.length > 2) {
      const res = await fetch(`https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${term}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } else {
      setSearchResults([]);
    }
  };

  const openDetails = (item: Media) => {
    setActiveItem(item);
    setView('details');
    setIsStreaming(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // THE FIX: This link goes ONLY to Vidora servers. No vidsrc allowed.
  const getStreamUrl = () => {
    if (!activeItem) return "";
    if (type === 'tv') {
      // Direct Vidora link for TV (Season 1, Episode 1)
      return `https://vidora.pro/embed/tv/${activeItem.id}/1/1`;
    }
    // Direct Vidora link for Movies
    return `https://vidora.pro/embed/movie/${activeItem.id}`;
  };

  const displayItems = query.length > 2 ? searchResults : items;
  const currentHero = items[heroIndex];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600">
      
      {/* HEADER SECTION */}
      <nav className="p-6 flex flex-col md:flex-row justify-between items-center fixed w-full z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-6">
          <h1 onClick={() => {setView('browse'); setQuery('');}} className="text-3xl font-black text-[#E50914] cursor-pointer tracking-tighter hover:scale-105 transition">BLEHFLIX™</h1>
          <div className="flex bg-zinc-900 rounded-full p-1 border border-white/10">
            <button onClick={() => setType('movie')} className={`px-4 py-1 rounded-full text-[10px] font-black uppercase transition ${type === 'movie' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:text-white'}`}>Movies</button>
            <button onClick={() => setType('tv')} className={`px-4 py-1 rounded-full text-[10px] font-black uppercase transition ${type === 'tv' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:text-white'}`}>Shows</button>
          </div>
        </div>
        
        <div className="flex flex-1 justify-center max-w-md w-full px-4 my-4 md:my-0">
          <input 
            type="text" 
            placeholder={`Search ${type === 'movie' ? 'Cinematic Universe' : 'Television Series'}...`}
            className="w-full bg-zinc-900/80 border border-zinc-800 px-6 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all shadow-inner"
            value={query}
            onChange={handleSearch}
          />
        </div>

        <div className="hidden lg:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
           <span className="text-red-600 animate-pulse">● VIDORA ACTIVE</span>
        </div>
      </nav>

      {view === 'browse' ? (
        <main className="animate-in fade-in duration-1000">
          {/* FEATURED HERO */}
          {currentHero && query.length <= 2 && (
            <div className="relative h-[85vh] w-full flex items-center px-12">
              <img src={`https://image.tmdb.org/t/p/original${currentHero.backdrop_path}`} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Hero" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
              <div className="relative z-10 max-w-3xl pt-20">
                <h2 className="text-7xl font-black mb-6 tracking-tighter italic uppercase leading-none drop-shadow-2xl">{currentHero.title || currentHero.name}</h2>
                <p className="text-lg text-zinc-400 mb-8 line-clamp-3 font-light max-w-xl italic">&ldquo;{currentHero.overview}&rdquo;</p>
                <button onClick={() => openDetails(currentHero)} className="bg-red-600 text-white px-10 py-4 rounded-sm font-black hover:bg-white hover:text-black transition-all uppercase tracking-tighter shadow-xl shadow-red-600/20">Stream Now</button>
              </div>
            </div>
          )}

          {/* MOVIE GRID */}
          <div className={`px-12 pb-20 relative z-20 ${query.length <= 2 ? "-mt-24" : "pt-32"}`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {displayItems.map((item) => (
                <div key={item.id} onClick={() => openDetails(item)} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-sm shadow-2xl transition-all duration-500 group-hover:scale-110 z-0 group-hover:z-10 bg-zinc-900">
                    <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750'} className="w-full h-full object-cover" alt="Poster" />
                    <div className="absolute inset-0 border border-white/5 group-hover:border-red-600 transition-colors" />
                  </div>
                  <h4 className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-red-600 truncate">{item.title || item.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        /* VIDEO PLAYER VIEW */
        <main className="animate-in slide-in-from-bottom-10 duration-700 pb-20">
          <div className="relative h-[60vh]">
            <img src={`https://image.tmdb.org/t/p/original${activeItem?.backdrop_path}`} className="w-full h-full object-cover opacity-20" alt="Backdrop" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 text-center md:text-left">
               <h2 className="text-6xl md:text-8xl font-black mb-6 uppercase italic tracking-tighter leading-none text-white drop-shadow-2xl">{activeItem?.title || activeItem?.name}</h2>
               <div className="flex gap-4 justify-center md:justify-start">
                 <button onClick={() => setIsStreaming(true)} className="bg-red-600 text-white px-12 py-5 rounded-sm font-black uppercase hover:bg-white hover:text-black transition-all shadow-2xl active:scale-95 shadow-red-600/40">Launch Stream</button>
                 <button onClick={() => {setView('browse'); setQuery('');}} className="border border-zinc-700 px-12 py-5 rounded-sm font-black uppercase hover:bg-zinc-800 transition-all">Back</button>
               </div>
            </div>
          </div>
          
          {isStreaming && (
            <div className="px-6 md:px-12 bg-black animate-in zoom-in duration-500">
               <div className="relative w-full aspect-video border-y-2 border-red-600 bg-zinc-900 overflow-hidden shadow-[0_0_100px_rgba(229,9,20,0.1)]">
                 {/* NO SANDBOX = NO ERROR. ReferrerPolicy helps stop pop-ups. */}
                 <iframe 
                    src={getStreamUrl()} 
                    className="absolute inset-0 w-full h-full" 
                    allowFullScreen 
                    scrolling="no"
                    frameBorder="0"
                    referrerPolicy="no-referrer"
                    allow="autoplay; encrypted-media; picture-in-picture"
                 />
               </div>
               <div className="mt-4 text-center">
                  <p className="text-[10px] text-zinc-700 uppercase tracking-[0.5em] font-black">
                    Connected to Vidora Cluster • Ares Node
                  </p>
               </div>
            </div>
          )}
        </main>
      )}

      <footer className="p-16 border-t border-white/5 bg-black text-center">
        <p className="text-[10px] text-zinc-800 uppercase tracking-widest font-black">© {new Date().getFullYear()} Blehflix™ • Vidora-Ready Build</p>
      </footer>
    </div>
  );
}
