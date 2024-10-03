import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../Utils/Axios'
import { motion } from 'framer-motion'
import * as HeroIcons from '@heroicons/react/24/solid'
import GlobalLoader from './GlobalLoader'
import InfiniteScroll from 'react-infinite-scroll-component'
import DropDown from './DropDown'
import Topnav from './Topnav'

const Movies = () => {
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [expandedDescriptions, setExpandedDescriptions] = useState({})
  const [category, setCategory] = useState('popular')
  const [genre, setGenre] = useState('')
  const [country, setCountry] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [countries, setCountries] = useState([])

  const fetchMovies = useCallback(async (resetItems = false) => {
    setIsLoading(true)
    try {
      let endpoint = `/movie/${category}`
      if (category === 'genre' || country) {
        endpoint = '/discover/movie'
      }
      const params = {
        page: resetItems ? 1 : page,
        with_genres: category === 'genre' ? genre : undefined,
        with_origin_country: country || undefined
      }
      const response = await axios.get(endpoint, { params })
      const newMovies = response.data.results
      setMovies(prevMovies => resetItems ? newMovies : [...prevMovies, ...newMovies])
      setHasMore(response.data.page < response.data.total_pages)
      setPage(prevPage => resetItems ? 2 : prevPage + 1)
    } catch (error) {
      console.error('Error fetching movies:', error)
    } finally {
      setIsLoading(false)
    }
  }, [category, genre, country, page])

  const fetchCountries = async () => {
    try {
      const response = await axios.get('/configuration/countries')
      setCountries(response.data)
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  }

  useEffect(() => {
    fetchMovies(true)
    fetchCountries()
  }, [category, genre, country])

  useEffect(() => {
    document.title = `Movies | ${category.charAt(0).toUpperCase() + category.slice(1)} | MovieApp`
  }, [category])

  const loadMoreItems = () => {
    if (!isLoading) {
      fetchMovies()
    }
  }

  const handleCategoryChange = (event) => {
    setCategory(event.target.value)
    setPage(1)
  }

  const handleGenreChange = (event) => {
    setGenre(event.target.value)
    setPage(1)
  }

  const handleCountryChange = (event) => {
    setCountry(event.target.value)
    setPage(1)
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  const handleMovieClick = (movieId) => {
    navigate(`/movies/details/${movieId}`)
  }

  const truncateDescription = (text, maxWords) => {
    const words = text.split(' ')
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...'
    }
    return text
  }

  const toggleDescription = (id) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const categoryOptions = [
    { value: 'popular', label: 'Popular' },
    { value: 'top_rated', label: 'Top Rated' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'now_playing', label: 'Now Playing' },
    { value: 'genre', label: 'By Genre' },
  ]

  const genreOptions = [
    { value: '28', label: 'Action' },
    { value: '12', label: 'Adventure' },
    { value: '16', label: 'Animation' },
    { value: '35', label: 'Comedy' },
    { value: '80', label: 'Crime' },
    { value: '99', label: 'Documentary' },
    { value: '18', label: 'Drama' },
    { value: '10751', label: 'Family' },
    { value: '14', label: 'Fantasy' },
    { value: '36', label: 'History' },
    { value: '27', label: 'Horror' },
    { value: '10402', label: 'Music' },
    { value: '9648', label: 'Mystery' },
    { value: '10749', label: 'Romance' },
    { value: '878', label: 'Science Fiction' },
    { value: '10770', label: 'TV Movie' },
    { value: '53', label: 'Thriller' },
    { value: '10752', label: 'War' },
    { value: '37', label: 'Western' },
  ]

  const countryOptions = countries.map(country => ({
    value: country.iso_3166_1,
    label: country.english_name
  }))

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="fixed top-0 left-0 right-0 bg-gray-900 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-3 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToHome}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded flex items-center text-sm"
              >
                <HeroIcons.HomeIcon className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </button>
              <h2 className="text-2xl font-bold text-white">Movies</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <DropDown
                value={category}
                onChange={handleCategoryChange}
                options={categoryOptions}
              />
              {category === 'genre' && (
                <DropDown
                  value={genre}
                  onChange={handleGenreChange}
                  options={genreOptions}
                />
              )}
              <DropDown
                value={country}
                onChange={handleCountryChange}
                options={[{ value: '', label: 'All Countries' }, ...countryOptions]}
              />
              <Topnav />
            </div>
          </div>
        </div>
      </div>
      {/* Increase the height of the spacer div for more top padding */}
      <div className="h-52 md:h-36"></div>
      {/* Adjust padding for mobile and larger screens */}
      <div className="px-4 sm:px-8 lg:px-8 pt-6 md:pt-2">
        <InfiniteScroll
          dataLength={movies.length}
          next={loadMoreItems}
          hasMore={hasMore}
          loader={<div className="text-center py-4">Loading more...</div>}
          endMessage={
            <p className="text-center text-gray-400 mt-4">
              You've seen all the movies!
            </p>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {movies.map((movie) => (
              <motion.div
                key={movie.id}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMovieClick(movie.id)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-48 sm:h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                    {movie.title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-gray-300 text-xs sm:text-sm">
                      {expandedDescriptions[movie.id] 
                        ? movie.overview 
                        : truncateDescription(movie.overview, 15)}
                      {movie.overview.split(' ').length > 15 && (
                        <button 
                          onClick={() => toggleDescription(movie.id)}
                          className="text-yellow-400 ml-1 hover:underline focus:outline-none text-xs"
                        >
                          {expandedDescriptions[movie.id] ? 'Less' : 'More...'}
                        </button>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center mt-2 text-xs sm:text-sm">
                    <HeroIcons.StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-white">{movie.vote_average.toFixed(1)}</span>
                    <HeroIcons.ClockIcon className="h-4 w-4 text-gray-400 ml-4 mr-1" />
                    <span className="text-white">{movie.release_date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
      {isLoading && <GlobalLoader />}
    </div>
  )
}

export default Movies