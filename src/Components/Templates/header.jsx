import React, { useState, useEffect } from 'react'
import axios from '../../Utils/Axios'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import * as HeroIcons from '@heroicons/react/24/solid'
import Loader from './Loader'

const Header = () => {
  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    const fetchRandomTrendingMovie = async () => {
      try {
        const response = await axios.get('/trending/all/day');
        const trendingMovies = response.data.results;
        const randomIndex = Math.floor(Math.random() * trendingMovies.length);
        const randomMovie = trendingMovies[randomIndex];
        setMovie(randomMovie);
        
        // Fetch video details
        const videoResponse = await axios.get(`/${randomMovie.media_type}/${randomMovie.id}/videos`);
        const trailer = videoResponse.data.results.find(video => video.type === "Trailer");
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (error) {
        console.error('Error fetching random trending movie:', error);
      }
    };
    fetchRandomTrendingMovie();
  }, []);

  if (!movie) return null;

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <header className="relative h-screen text-white pt-16"> {/* Add pt-16 for padding top */}
      <div className="absolute inset-0 pt-16"> {/* Add pt-16 here as well */}
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>
      <div className="absolute bottom-0 left-0 p-8 w-full md:w-1/2">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title || movie.name}</h1>
        <p className="text-lg mb-4">{truncate(movie.overview, 150)}</p>
        <div className="flex space-x-4">
          <Link
            to={`/${movie.media_type === 'movie' ? 'movies' : 'tv'}/details/${movie.id}`}
            className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-300 transition duration-300"
          >
            More Info
          </Link>
          {trailerKey && (
            <button
              onClick={() => setShowTrailer(true)}
              className="bg-gray-500 bg-opacity-50 text-white px-6 py-2 rounded-full font-bold hover:bg-opacity-75 transition duration-300 flex items-center"
            >
              <HeroIcons.PlayIcon className="h-5 w-5 mr-2" />
              Watch Trailer
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={() => setShowTrailer(false)}
          >
            <div className="relative w-full h-[56.25vw] max-w-[90vw] max-h-[90vh]">
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <HeroIcons.XMarkIcon className="h-8 w-8" />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="movie-trailer"
                className="w-full h-full"
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
