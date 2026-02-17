"use client";
import React, { useEffect, useState } from 'react';

// 1. Defined a strict interface that handles both Movies (title) and TV (name)
interface Media {
  id: number;
  title?: string;      // Movies use 'title'
  name?: string;       // TV uses 'name'
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date?: string;    // Movies
  first_air_date?: string;  // TV
  vote_average: number;
  vote_count: number;
}

export default function BlehflixFinalBuild() {
  const [items, setItems] = useState<Media[]>([]);
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'movie' | 'tv'>('movie'); // Toggles between Movie/TV
  const [view, setView] = useState<'browse' | 'details'>('browse');
  const [activeItem, setActiveItem] = useState<Media | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  
  const API_KEY = "3c08a2b895c3295cc09d583b3fc279cf";

  // 2. Fetch logic that automatically switches based on 'type'
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/${type}/top_rated?api_key=${API_KEY}&language=en-US&page=1`)
      .then(res => res.json())
      .then(data => {
        setItems(data.results || []);
        setHeroIndex(0); // Reset hero slide when switching types
      })
      .catch(err => console.error("API Error:", err));
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

  // 3. Smart URL Generator for the Embed
  const getStreamUrl = () => {
    if (!activeItem) return "";
    const baseUrl = "https://watch-v2.autoembed.cc";
    // If it's a TV show, we MUST add /1/1 (Season 1, Ep 1) to start the player correctly
    if (type === 'tv') {
      return `${baseUrl}/tv/${activeItem.id}/1/1`;
    }
    // Movies just need the ID
    return `${baseUrl}/movie/${activeItem.id}`;
  };

  const displayItems = query.length > 2 ? searchResults : items;
  const currentHero = items[heroIndex];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600">
      
      {/* --- NAVIGATION --- */}
      <nav className="p-6 flex flex-col md:flex-row justify-between items-center fixed w-full z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-8 mb-4 md:mb-0">
          <h1 onClick={() => {setView('browse'); setQuery('');}} className="text-3xl font-black text-[#E50914] cursor-pointer tracking-tighter hover:scale-105 transition">BLEHFLIX™</h1>
          
          {/* Type Toggle */}
          <div className="flex bg-zinc-900 rounded-full p-1 border border-zinc-800">
            <button 
              onClick={() => { setType('movie'); setQuery(''); }} 
              className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase transition-all tracking-widest ${type === 'movie' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:text-white'}`}
            >
              Movies
            </button>
            <button 
              onClick={() => { setType('tv'); setQuery(''); }} 
              className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase transition-all tracking-widest ${type === 'tv' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:text-white'}`}
            >
              TV Shows
            </button>
          </div>
        </div>
        
        <div className="flex flex-1 justify-center max-w-lg w-full px-4">
          <input 
            type="text" 
            placeholder={`Search ${type === 'movie' ? 'Cinematic Universe' : 'Television Series'}...`}
            className="w-full bg-zinc-900/80 border border-zinc-800 px-6 py-3 rounded-full text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-600 transition-all shadow-inner tracking-wide"
            value={query}
            onChange={handleSearch}
          />
        </div>

        <div className="hidden lg:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          <a href="https://discord.com/invite/NzPpXVurAq" target="_blank" rel="noreferrer" className="hover:text-red-600 transition">Community</a>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      {view === 'browse' ? (
        <main className="animate-in fade-in duration-700">
          
          {/* Hero Section (Only shows when not searching) */}
          {currentHero && query.length <= 2 && (
            <div className="relative h-[85vh] w-full flex items-center px-12 overflow-hidden">
              <img 
                src={`https://image.tmdb.org/t/p/original${currentHero.backdrop_path}`} 
                className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 animate-in fade-in zoom-in duration-[3000ms]" 
                alt="Hero Background" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              
              <div className="relative z-10 max-w-3xl pt-20">
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-[#E50914] text-white px-3 py-1 rounded-sm text-[10px] font-black italic uppercase tracking-wider shadow-lg shadow-red-900/50">
                      #{heroIndex + 1} Global
                    </span>
                    <span className="text-zinc-400 text-xs font-bold tracking-[0.3em] uppercase border border-zinc-700 px-3 py-1 rounded-sm">
                      {type === 'movie' ? 'Top Rated Movie' : 'Top Rated Series'}
                    </span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter italic uppercase leading-[0.85] drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400">
                  {currentHero.title || currentHero.name}
                </h2>
                <p className="text-lg text-zinc-300 mb-10 line-clamp-3 font-medium max-w-xl leading-relaxed opacity-90">
                  {currentHero.overview}
                </p>
                <button 
                  onClick={() => openDetails(currentHero)} 
                  className="bg-white text-black px-12 py-4 rounded-sm font-black hover:bg-[#E50914] hover:text-white transition-all transform hover:scale-105 uppercase tracking-tighter shadow-2xl"
                >
                  Play Now
                </button>
              </div>
            </div>
          )}

          {/* Grid Section */}
          <div className={`px-8 md:px-12 pb-20 relative z-20 ${query.length <= 2 ? "-mt-32" : "pt-32"}`}>
            <h3 className="text-xs font-black mb-8 text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-4">
              <span className="w-8 h-[1px] bg-red-600 inline-block"></span>
              {query.length > 2 ? `Search Results` : `Trending ${type === 'movie' ? 'Movies' : 'TV Shows'}`}
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
              {displayItems.map((item) => (
                <div key={item.id} onClick={() => openDetails(item)} className="group cursor-pointer relative">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-md shadow-2xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(229,9,20,0.3)] bg-zinc-900">
                    <img 
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                      alt={item.title || item.name || "Media Poster"} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h4 className="mt-4 text-[11px] font-black uppercase tracking-wider text-zinc-400 group-hover:text-white truncate transition-colors">
                    {item.title || item.name}
                  </h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] text-zinc-600 font-bold tracking-wider">
                      {(item.release_date || item.first_air_date || 'N/A').split('-')[0]}
                    </span>
                    <span className={`text-[9px] font-black px-1.5 rounded ${item.vote_average >= 8 ? 'bg-green-900/30 text-green-400' : 'text-zinc-600'}`}>
                      {item.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        /* --- DETAILS & STREAMING VIEW --- */
        <main className="animate-in slide-in-from-bottom-10 duration-700 pb-20">
          <div className="relative min-h-[80vh] w-full">
            <img 
              src={`https://image.tmdb.org/t/p/original${activeItem?.backdrop_path}`} 
              className="absolute inset-0 w-full h-full object-cover opacity-20 fixed-bg" 
              alt="Backdrop" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
            
            <div className="relative z-10 px-8 md:px-16 pt-32 md:pt-48 flex flex-col items-start max-w-7xl mx-auto">
               
               {/* 4. Strict "Absolute Classic" Logic */}
               <div className="flex flex-wrap gap-3 mb-8">
                  {activeItem && activeItem.vote_average >= 8.0 ? (
                    <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 px-4 py-1.5 rounded text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-2">
                       <span>🏆</span> Absolute Classic
                    </div>
                  ) : (
                     <div className="bg-zinc-800/50 border border-zinc-700 text-zinc-400 px-4 py-1.5 rounded text-[10px] font-black tracking-[0.2em] uppercase">
                       {type === 'movie' ? 'Feature Film' : 'TV Series'}
                     </div>
                  )}
                  <div className="bg-green-900/20 border border-green-900/50 text-green-500 px-4 py-1.5 rounded text-[10px] font-black tracking-[0.2em] uppercase">
                    {(activeItem?.vote_average! * 10).toFixed(0)}% Match
                  </div>
               </div>

               <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-2xl">
                 {activeItem?.title || activeItem?.name}
               </h2>
               
               <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mb-10 font-light leading-relaxed opacity-90">
                 {activeItem?.overview}
               </p>
               
               <div className="flex flex-wrap gap-4 mb-16">
                 <button 
                   onClick={() => setIsStreaming(true)} 
                   className="bg-[#E50914] text-white px-10 py-4 rounded font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-[0_0_40px_-10px_rgba(229,9,20,0.5)] active:scale-95"
                 >
                   {isStreaming ? 'Scroll Down 👇' : 'Stream Now'}
                 </button>
                 <button 
                   onClick={() => {setView('browse'); setQuery('');}} 
                   className="border border-white/20 bg-black/20 backdrop-blur-sm px-10 py-4 rounded font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                 >
                   Back to Browse
                 </button>
               </div>

               {/* 5. The Player (Conditional Render) */}
               {isStreaming && (
                <div className="w-full animate-in fade-in zoom-in duration-500 mb-20">
                   <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                     <iframe 
                        src={getStreamUrl()} 
                        className="absolute inset-0 w-full h-full" 
                        allowFullScreen 
                        allow="autoplay; encrypted-media; picture-in-picture"
                        scrolling="no"
                        frameBorder="0"
                     />
                   </div>
                   <div className="mt-6 flex justify-between items-center px-4 border-l-2 border-red-600">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">
                        Playing: {activeItem?.title || activeItem?.name} {type === 'tv' && '(S1:E1)'}
                      </p>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                        Source: AutoEmbed v2
                      </p>
                   </div>
                </div>
               )}
            </div>
          </div>
        </main>
      )}

      <footer className="py-12 border-t border-white/5 bg-[#050505] text-center">
        <p className="text-[10px] text-zinc-800 uppercase tracking-[0.3em] font-bold">
          Blehflix™ • Educational Project • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
