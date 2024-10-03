import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTvDetails, clearTvDetails } from '../../stores/actions/tvActions';
import { motion, AnimatePresence } from 'framer-motion';
import * as HeroIcons from '@heroicons/react/24/solid';
import GlobalLoader from './GlobalLoader';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Sidenav from './Sidenav';
import Separator from './Separator';

const TvDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { info: tvShow, loading, error } = useSelector(state => state.tv);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isTrailerHovered, setIsTrailerHovered] = useState(false);
  const [isImdbHovered, setIsImdbHovered] = useState(false);

  useEffect(() => {
    console.log(`Fetching details for TV show ID: ${id}`);
    dispatch(fetchTvDetails(id));
    return () => {
      dispatch(clearTvDetails());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (tvShow) {
      console.log(`TV show details received:`, tvShow);
      document.title = `${tvShow.name} | MovieApp`;
    }
  }, [tvShow]);

  if (loading) return <GlobalLoader />;
  if (error) return <div className="text-white text-center">Error: {error}</div>;
  if (!tvShow) return null;

  const trailerKey = tvShow.videos?.results.find(video => video.type === "Trailer")?.key;
  const hasSimilarShows = tvShow.similar?.results.length > 0;

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

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
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
      <Sidenav />
      {/* Hero Section */}
      <div
        className="relative h-[70vh] bg-cover bg-center"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">{tvShow.name}</h1>
            <p className="text-xl mb-6 italic">{tvShow.tagline || 'No tagline available'}</p>
            <div className="flex justify-center space-x-4">
              {trailerKey && (
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
              )}
              {tvShow.external_ids?.imdb_id && (
                <motion.a
                  href={`https://www.imdb.com/title/${tvShow.external_ids.imdb_id}`}
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
        <Separator title="TV Show Details" />

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Poster */}
          <div className="md:col-span-1">
            <img
              src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
              alt={tvShow.name}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Right Column - TV Show Details */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-4">{tvShow.name}</h2>
            <p className="text-gray-400 mb-4">{tvShow.tagline}</p>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                {tvShow.first_air_date.split('-')[0]}
              </span>
              <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                {tvShow.vote_average.toFixed(1)} ⭐
              </span>
            </div>

            {/* Overview */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Overview</h3>
              <p className="text-gray-300">{tvShow.overview}</p>
            </div>

            {/* Seasons */}
            {tvShow.number_of_seasons && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Seasons</h3>
                <p className="text-gray-300">
                  {tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? 's' : ''}
                  {tvShow.number_of_episodes && ` (${tvShow.number_of_episodes} episodes total)`}
                </p>
              </div>
            )}

            {/* Genres */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {tvShow.genres.map(genre => (
                  <span key={genre.id} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Created By */}
            {tvShow.created_by && tvShow.created_by.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Created By</h3>
                <p className="text-gray-300">{tvShow.created_by.map(creator => creator.name).join(', ')}</p>
              </div>
            )}

            {/* Top Cast */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Top Cast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {tvShow.credits.cast.slice(0, 6).map(actor => (
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

            {/* Networks */}
            {tvShow.networks && tvShow.networks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Networks</h3>
                <div className="flex flex-wrap gap-4">
                  {tvShow.networks.map(network => (
                    <img
                      key={network.id}
                      src={`https://image.tmdb.org/t/p/w200${network.logo_path}`}
                      alt={network.name}
                      className="h-8 object-contain"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator title="Seasons" />

        {/* Seasons Carousel */}
        {tvShow.seasons && tvShow.seasons.length > 0 && (
          <div className="mt-16">
            <Slider {...settings}>
              {tvShow.seasons.map((season) => (
                <div key={season.id} className="px-2">
                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                    <div className="h-96 bg-gray-700"> {/* Fixed height container */}
                      <img
                        src={`https://image.tmdb.org/t/p/w500${season.poster_path || tvShow.poster_path}`}
                        alt={season.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{season.name}</h3>
                      <p className="text-sm text-gray-300 mb-2">
                        {season.episode_count} episode{season.episode_count !== 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-gray-400 line-clamp-3">{season.overview || 'No overview available.'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}

        <Separator title="Similar TV Shows" />

        {/* Similar TV Shows */}
        {hasSimilarShows && (
          <div className="mt-16 container mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {tvShow.similar.results.slice(0, 5).map((similarShow) => (
                <Link
                  key={similarShow.id}
                  to={`/tv-shows/details/${similarShow.id}`}
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
                      src={`https://image.tmdb.org/t/p/w500${similarShow.poster_path}`}
                      alt={similarShow.name}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg truncate">{similarShow.name}</h3>
                      <div className="flex items-center mt-2">
                        <HeroIcons.StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                        <span>{similarShow.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
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
                title="tv-show-trailer"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TvDetails;
