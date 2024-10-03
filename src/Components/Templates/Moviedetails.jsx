import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetails, clearMovieDetails } from '../../stores/actions/movieActions';
import { motion, AnimatePresence } from 'framer-motion';
import * as HeroIcons from '@heroicons/react/24/solid';
import GlobalLoader from './GlobalLoader';
import Sidenav from './Sidenav';
import Separator from './Separator';

const Moviedetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { info: movie, loading, error } = useSelector(state => state.movie);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isTrailerHovered, setIsTrailerHovered] = useState(false);
  const [isImdbHovered, setIsImdbHovered] = useState(false);

  useEffect(() => {
    console.log(`Fetching details for movie ID: ${id}`);
    dispatch(fetchMovieDetails(id));
    return () => {
      dispatch(clearMovieDetails());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (movie) {
      console.log(`Movie details received:`, movie);
      document.title = `${movie.title} | MovieApp`;
    }
  }, [movie]);

  if (loading) return <GlobalLoader />;
  if (error) return <div className="text-white text-center">Error: {error}</div>;
  if (!movie) return null;

  const trailerKey = movie.videos?.results.find(video => video.type === "Trailer")?.key;
  const hasSimilarMovies = movie.similar?.results.length > 0;

  // Updated available platforms with logo URLs
  const availablePlatforms = [
    { name: 'Netflix', logo: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png', url: 'https://www.netflix.com' },
    { name: 'Amazon Prime', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/2560px-Amazon_Prime_Video_logo.svg.png', url: 'https://www.amazon.com/Prime-Video' },
    { name: 'Disney+', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/2560px-Disney%2B_logo.svg.png', url: 'https://www.disneyplus.com' },
    { name: 'Apple TV+', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Apple_TV_Plus_Logo.svg/2560px-Apple_TV_Plus_Logo.svg.png', url: 'https://www.apple.com/apple-tv-plus' },
    { name: 'Hulu', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Hulu_Logo.svg/2560px-Hulu_Logo.svg.png', url: 'https://www.hulu.com' },
  ];

  const trailerButtonVariants = {
    initial: { scale: 1, boxShadow: "0px 0px 0px rgba(255, 0, 0, 0)" },
    hover: { 
      scale: 1.05, 
      boxShadow: "0px 0px 20px rgba(255, 0, 0, 0.5)",
      transition: { 
        duration: 0.3,
        yoyo: Infinity,
        ease: "easeInOut"
      }
    },
    tap: { scale: 0.95 }
  };

  const imdbButtonVariants = {
    initial: { scale: 1, boxShadow: "0px 0px 0px rgba(245, 197, 24, 0)" },
    hover: { 
      scale: 1.05, 
      boxShadow: "0px 0px 20px rgba(245, 197, 24, 0.5)",
      transition: { 
        duration: 0.3,
        yoyo: Infinity,
        ease: "easeInOut"
      }
    },
    tap: { scale: 0.95 }
  };

  const iconVariants = {
    initial: { x: 0 },
    hover: { 
      x: [0, 5, 0],
      transition: { 
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getDirector = (crew) => {
    return crew.find(member => member.job === 'Director')?.name || 'Unknown';
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center"
        >
          <HeroIcons.ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Home
        </button>
      </div> */}
      <Sidenav  />

*      <div 
        className="relative h-[70vh] bg-cover bg-center"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">{movie.title}</h1>
            <p className="text-xl mb-6 italic">{movie.tagline || 'No tagline available'}</p>
            <div className="flex justify-center space-x-4">
              {trailerKey ? (
                <motion.button
                  onClick={() => setShowTrailer(true)}
                  className="bg-red-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center justify-center"
                  variants={trailerButtonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  onHoverStart={() => setIsTrailerHovered(true)}
                  onHoverEnd={() => setIsTrailerHovered(false)}
                >
                  <motion.span variants={iconVariants}>
                    <HeroIcons.PlayIcon className="h-6 w-6 mr-2" />
                  </motion.span>
                  Watch Trailer
                  <AnimatePresence>
                    {isTrailerHovered && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-red-500 -z-10"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 0.3 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              ) : (
                <p className="text-gray-400 italic">No trailer available</p>
              )}
              {movie.imdb_id && (
                <motion.a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-400 text-black font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out flex items-center justify-center"
                  variants={imdbButtonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  onHoverStart={() => setIsImdbHovered(true)}
                  onHoverEnd={() => setIsImdbHovered(false)}
                >
                  <motion.span variants={iconVariants}>
                    <HeroIcons.StarIcon className="h-6 w-6 mr-2" />
                  </motion.span>
                  IMDb
                  <AnimatePresence>
                    {isImdbHovered && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-yellow-300 -z-10"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 0.3 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <Separator title="Movie Details" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Poster */}
          <div className="md:col-span-1">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Right Column - Movie Details */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-4">{movie.title}</h2>
            <p className="text-gray-400 mb-4">{movie.tagline}</p>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                {movie.release_date.split('-')[0]}
              </span>
              <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                {formatRuntime(movie.runtime)}
              </span>
              <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                {movie.vote_average.toFixed(1)} ⭐
              </span>
            </div>

            {/* Genres */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map(genre => (
                  <span key={genre.id} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Overview */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Overview</h3>
              <p className="text-gray-300">{movie.overview}</p>
            </div>

            {/* Director */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Director</h3>
              <p className="text-gray-300">{getDirector(movie.credits.crew)}</p>
            </div>

            {/* Top Cast */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Top Cast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {movie.credits.cast.slice(0, 6).map(actor => (
                  <Link
                    key={actor.id}
                    to={`/people/details/${actor.id}`}
                    className="flex items-center hover:bg-gray-800 rounded-lg p-2 transition duration-300"
                  >
                    <img
                      src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                      alt={actor.name}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="font-semibold">{actor.name}</p>
                      <p className="text-sm text-gray-400">{actor.character}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Available on Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Available on</h3>
              <div className="flex flex-wrap gap-4">
                {availablePlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-gray-200 transition duration-300 ease-in-out flex items-center justify-center rounded-lg overflow-hidden"
                    style={{ width: '48px', height: '48px', padding: '4px' }}
                  >
                    <img 
                      src={platform.logo} 
                      alt={`${platform.name} logo`} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/48?text=' + platform.name.charAt(0);
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator title="Similar Movies" />

        {/* Similar Movies */}
        {hasSimilarMovies ? (
          <div className="mt-16">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movie.similar.results.slice(0, 5).map((similarMovie) => (
                <Link
                  key={similarMovie.id}
                  to={`/movies/details/${similarMovie.id}`}
                  className="block"
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                >
                  <motion.div
                    className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`}
                      alt={similarMovie.title}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg truncate">{similarMovie.title}</h3>
                      <div className="flex items-center mt-2">
                        <HeroIcons.StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                        <span>{similarMovie.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6">Similar Movies</h2>
            <p className="text-gray-400 italic">No similar movies found</p>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full h-[90vh] max-w-[90vw]">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <HeroIcons.XMarkIcon className="h-8 w-8" />
            </button>
            <div className="w-full h-full">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="movie-trailer"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Moviedetails;
