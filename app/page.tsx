"use client";
import React, { useEffect, useState } from 'react';

interface Movie {
  id: number; title: string; poster_path: string; backdrop_path: string;
  overview: string; release_date: string; vote_average: number;
  vote_count: number; popularity: number; original_language: string;
}

export default function BlehflixFinalBuild() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'browse' | 'details'>('browse');
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  
  const API_KEY = "3c08a2b895c3295cc09d583b3fc279cf";

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`)
      .then(res => res.json())
      .then(data => setMovies(data.results || []));
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setQuery(term);
    if (term.length > 2) {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${term}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } else {
      setSearchResults([]);
    }
  };

  const openDetails = (movie: Movie) => {
    setActiveMovie(movie);
    setView('details');
    setIsStreaming(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextHero = () => setHeroIndex((prev) => (prev + 1) % 5);
  const prevHero = () => setHeroIndex((prev) => (prev === 0 ? 4 : prev - 1));

  const currentHero = movies[heroIndex];
  const displayMovies = query.length > 2 ? searchResults : movies;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600">
      {/* NAVIGATION */}
      <nav className="p-6 flex flex-col md:flex-row justify-between items-center fixed w-full z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-md border-b border-white/5">
        <h1 onClick={() => {setView('browse'); setQuery('');}} className="text-3xl font-black text-[#E50914] cursor-pointer tracking-tighter mb-4 md:mb-0">BLEHFLIX™</h1>
        <div className="flex flex-1 justify-center max-w-xl w-full px-4">
          <input 
            type="text" 
            placeholder="Search all-time classics..." 
            className="w-full bg-zinc-900/80 border border-zinc-800 px-6 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all shadow-inner"
            value={query}
            onChange={handleSearch}
          />
        </div>
        <div className="hidden lg:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          <span onClick={() => {setView('browse'); setQuery('');}} className="hover:text-red-600 cursor-pointer transition">Top 25</span>
          <a href="https://discord.com/invite/NzPpXVurAq" target="_blank" className="hover:text-red-600 transition">Community</a>
        </div>
      </nav>

      {view === 'browse' ? (
        <main className="animate-in fade-in duration-1000">
          {/* HERO SLIDER */}
          {currentHero && query.length <= 2 && (
            <div className="relative h-[85vh] w-full flex items-center px-12">
              <img src={`https://image.tmdb.org/t/p/original${currentHero.backdrop_path}`} className="absolute inset-0 w-full h-full object-cover opacity-40 transition-opacity duration-1000" alt="Hero" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
              <div className="relative z-10 max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-[10px] font-black italic">TOP RATED</span>
                    <span className="text-zinc-400 text-xs font-bold tracking-widest uppercase">Rank #{heroIndex + 1}</span>
                </div>
                <h2 className="text-7xl font-black mb-6 tracking-tighter italic uppercase leading-none drop-shadow-2xl">{currentHero.title}</h2>
                <p className="text-lg text-zinc-400 mb-8 line-clamp-3 font-light max-w-xl italic">"{currentHero.overview}"</p>
                <div className="flex gap-4">
                  <button onClick={() => openDetails(currentHero)} className="bg-red-600 text-white px-10 py-4 rounded-sm font-black hover:bg-white hover:text-black transition-all uppercase tracking-tighter shadow-xl shadow-red-600/20">Stream Now</button>
                  <div className="flex gap-2">
                    <button onClick={prevHero} className="bg-zinc-900/80 border border-zinc-700 p-4 rounded-sm hover:bg-white hover:text-black transition">←</button>
                    <button onClick={nextHero} className="bg-zinc-900/80 border border-zinc-700 p-4 rounded-sm hover:bg-white hover:text-black transition">→</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GRID */}
          <div className={`px-12 pb-20 relative z-20 ${query.length <= 2 ? "-mt-24" : "pt-32"}`}>
            <h3 className="text-xs font-black mb-8 text-zinc-500 uppercase tracking-[0.4em]">
              {query.length > 2 ? `Search results` : "Greatest Movies Ever Made"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {displayMovies.map((movie, index) => (
                <div key={movie.id} onClick={() => openDetails(movie)} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-sm shadow-2xl transition-all duration-500 group-hover:scale-110 z-0 group-hover:z-10 bg-zinc-900">
                    <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} className="w-full h-full object-cover" />
                    {query.length <= 2 && (
                        <div className="absolute top-2 left-2 bg-black/90 text-white font-black text-[10px] w-5 h-5 flex items-center justify-center border border-red-600/50 rounded-sm">
                            {index + 1}
                        </div>
                    )}
                    <div className="absolute inset-0 border border-white/5 group-hover:border-red-600 transition-colors" />
                  </div>
                  <h4 className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-red-600 truncate">{movie.title}</h4>
                  <p className="text-[9px] text-zinc-600 font-bold mt-1 tracking-tighter uppercase">{movie.release_date.split('-')[0]} • {movie.vote_average.toFixed(1)} Rating</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        /* DETAILS VIEW */
        <main className="animate-in slide-in-from-bottom-10 duration-700 pb-20">
          <div className="relative h-[70vh]">
            <img src={`https://image.tmdb.org/t/p/original${activeMovie?.backdrop_path}`} className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
            <div className="absolute bottom-12 left-12 right-12">
               <div className="flex flex-wrap gap-4 mb-6">
                  <div className="bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded-sm text-yellow-500 font-black tracking-widest text-xs uppercase">🏆 Absolute Classic</div>
                  <div className="bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded-sm"><span className="text-green-500 font-black">{(activeMovie?.vote_average! * 10).toFixed(0)}%</span> <span className="text-[10px] uppercase ml-2 text-zinc-500">Score</span></div>
               </div>
               <h2 className="text-8xl font-black mb-6 uppercase italic tracking-tighter leading-none text-white drop-shadow-2xl">{activeMovie?.title}</h2>
               <p className="text-xl text-zinc-400 max-w-4xl mb-10 font-light leading-relaxed">{activeMovie?.overview}</p>
               <div className="flex gap-4">
                 <button onClick={() => setIsStreaming(true)} className="bg-white text-black px-12 py-5 rounded-sm font-black uppercase hover:bg-red-600 hover:text-white transition-all shadow-2xl active:scale-95">Stream Now</button>
                 <button onClick={() => {setView('browse'); setQuery('');}} className="border border-zinc-700 px-12 py-5 rounded-sm font-black uppercase hover:bg-zinc-800 transition-all">Back</button>
               </div>
            </div>
          </div>
          {isStreaming && (
            <div className="p-12 bg-black animate-in zoom-in duration-500">
               <div className="relative w-full aspect-video border-y-2 border-red-600 shadow-[0_0_100px_rgba(229,9,20,0.15)] bg-zinc-900">
                 <iframe src={`https://vidsrc.xyz/embed/movie/${activeMovie?.id}`} className="absolute inset-0 w-full h-full" allowFullScreen />
               </div>
            </div>
          )}
        </main>
      )}

      {/* FOOTER WITH YOUR LINKS */}
      <footer className="p-16 border-t border-white/5 bg-black/50 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
             <a href="https://docs.google.com/presentation/d/1aPZRt3i-KAH3ywYYWt6Cajgz4-J2yGw75qpmpllcBmc/edit?usp=sharing" target="_blank" className="hover:text-white transition">Project Docs</a>
             <a href="https://discord.com/invite/NzPpXVurAq" target="_blank" className="hover:text-[#5865F2] transition">Discord</a>
             <a href="https://www.patreon.com/posts/buy-me-coffee-136046422?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=postshare_creator&utm_content=join_link" target="_blank" className="hover:text-[#FF424D] transition">Patreon</a>
          </div>
          <p className="text-[10px] text-zinc-700 uppercase tracking-widest">© {new Date().getFullYear()} Blehflix™ • Educational Stream Concept</p>
        </div>
      </footer>
    </div>
  );
}