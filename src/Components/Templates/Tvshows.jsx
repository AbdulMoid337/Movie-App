import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../../Utils/Axios'
import { motion } from 'framer-motion'
import { StarIcon, HomeIcon, CalendarIcon, FilmIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import GlobalLoader from './GlobalLoader'
import InfiniteScroll from 'react-infinite-scroll-component'
import DropDown from './DropDown'

const Tvshows = () => {
  const navigate = useNavigate()
  const [tvShows, setTvShows] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [expandedDescriptions, setExpandedDescriptions] = useState({})
  const [category, setCategory] = useState('popular')
  const [genre, setGenre] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [genres, setGenres] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const fetchTvShows = useCallback(async (resetItems = false) => {
    setIsLoading(true)
    try {
      let endpoint = `/tv/${category}`
      let params = { page: resetItems ? 1 : page }
      if (category === 'discover' && genre) {
        endpoint = '/discover/tv'
        params.with_genres = genre
      }
      if (searchTerm) {
        endpoint = '/search/tv'
        params.query = searchTerm
      }
      const response = await axios.get(endpoint, { params })
      const newShows = response.data.results
      setTvShows(prevShows => resetItems ? newShows : [...prevShows, ...newShows])
      setHasMore(response.data.page < response.data.total_pages)
      setPage(prevPage => resetItems ? 2 : prevPage + 1)
    } catch (error) {
      console.error('Error fetching TV shows:', error)
    } finally {
      setIsLoading(false)
    }
  }, [category, genre, page, searchTerm])

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/genre/tv/list')
      setGenres(response.data.genres)
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

  useEffect(() => {
    fetchTvShows(true)
    fetchGenres()
  }, [category, genre])

  useEffect(() => {
    document.title = `TV Shows | ${category.charAt(0).toUpperCase() + category.slice(1)} | MovieApp`
  }, [category])

  const loadMoreItems = () => {
    if (!isLoading) {
      fetchTvShows()
    }
  }

  const handleCategoryChange = (event) => {
    setCategory(event.target.value)
    setPage(1)
    setGenre('')
  }

  const handleGenreChange = (event) => {
    setGenre(event.target.value)
    setPage(1)
  }

  const handleBackToHome = () => {
    navigate('/')
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
    { value: 'on_the_air', label: 'On The Air' },
    { value: 'airing_today', label: 'Airing Today' },
    { value: 'discover', label: 'Discover by Genre' },
  ]

  const genreOptions = genres.map(genre => ({
    value: genre.id.toString(),
    label: genre.name
  }))

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchTvShows(true)
  }

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
                <HomeIcon className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </button>
              <h2 className="text-2xl font-bold text-white">TV Shows</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <DropDown
                value={category}
                onChange={handleCategoryChange}
                options={categoryOptions}
              />
              {category === 'discover' && (
                <DropDown
                  value={genre}
                  onChange={handleGenreChange}
                  options={genreOptions}
                />
              )}
              <form onSubmit={handleSearch} className="flex-1 max-w-lg">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for TV shows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Add a spacer div to push content below the fixed header */}
      <div className="h-40 md:h-28"></div>
      {/* Adjust padding for mobile and larger screens */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 md:pt-0">
        <InfiniteScroll
          dataLength={tvShows.length}
          next={loadMoreItems}
          hasMore={hasMore}
          loader={<div className="text-center py-4">Loading more...</div>}
          endMessage={
            <p className="text-center text-gray-400 mt-4">
              You've seen all the TV shows!
            </p>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {tvShows.map((show) => (
              <Link
                key={show.id}
                to={`/tv-shows/details/${show.id}`}
                className="block"
              >
                <motion.div
                  className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                      {show.name}
                    </h3>
                    <div className="mt-2">
                      <p className="text-gray-300 text-xs sm:text-sm">
                        {expandedDescriptions[show.id] 
                          ? show.overview 
                          : truncateDescription(show.overview, 15)}
                        {show.overview.split(' ').length > 15 && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              toggleDescription(show.id);
                            }}
                            className="text-yellow-400 ml-1 hover:underline focus:outline-none text-xs"
                          >
                            {expandedDescriptions[show.id] ? 'Less' : 'More...'}
                          </button>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center mt-2 text-xs sm:text-sm">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-white">{show.vote_average.toFixed(1)}</span>
                      <CalendarIcon className="h-4 w-4 text-gray-400 ml-4 mr-1" />
                      <span className="text-white">{show.first_air_date}</span>
                    </div>
                    <div className="flex items-center mt-2 text-xs sm:text-sm">
                      <FilmIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-white">{show.origin_country.join(', ')}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </InfiniteScroll>
      </div>
      {isLoading && <GlobalLoader />}
    </div>
  )
}

export default Tvshows