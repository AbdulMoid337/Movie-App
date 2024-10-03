import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../../Utils/Axios'
import { motion } from 'framer-motion'
import * as HeroIcons from '@heroicons/react/24/solid'
import GlobalLoader from './GlobalLoader'
import InfiniteScroll from 'react-infinite-scroll-component'
import DropDown from './DropDown'
import Topnav from './Topnav'

const Trending = () => {
  const navigate = useNavigate()
  const [trendingItems, setTrendingItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [expandedDescriptions, setExpandedDescriptions] = useState({})
  const [mediaType, setMediaType] = useState('all')
  const [timeWindow, setTimeWindow] = useState('week')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchTrendingItems = useCallback(async (resetItems = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/trending/${mediaType}/${timeWindow}?page=${resetItems ? 1 : page}`)
      const newItems = response.data.results
      setTrendingItems(prevItems => resetItems ? newItems : [...prevItems, ...newItems])
      setHasMore(response.data.page < response.data.total_pages)
      setPage(prevPage => resetItems ? 2 : prevPage + 1)
    } catch (error) {
      console.error('Error fetching trending items:', error)
    } finally {
      setIsLoading(false)
    }
  }, [mediaType, timeWindow, page])

  useEffect(() => {
    fetchTrendingItems(true)
  }, [mediaType, timeWindow])

  useEffect(() => {
    document.title = `Trending ${mediaType === 'all' ? 'Movies & TV' : mediaType === 'movie' ? 'Movies' : 'TV Shows'} | MovieApp`
  }, [mediaType])

  const loadMoreItems = () => {
    if (!isLoading) {
      fetchTrendingItems()
    }
  }

  const handleMediaTypeChange = (event) => {
    setMediaType(event.target.value)
    setPage(1)
  }

  const handleTimeWindowChange = (event) => {
    setTimeWindow(event.target.value)
    setPage(1)
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

  const mediaTypeOptions = [
    { value: 'all', label: 'All' },
    { value: 'movie', label: 'Movies' },
    { value: 'tv', label: 'TV Shows' },
  ]

  const timeWindowOptions = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
  ]

  const handleBackToHome = () => {
    navigate('/')
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
                <HeroIcons.HomeIcon className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </button>
              <h2 className="text-2xl font-bold text-white">Trending</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <DropDown
                value={mediaType}
                onChange={handleMediaTypeChange}
                options={mediaTypeOptions}
              />
              <DropDown
                value={timeWindow}
                onChange={handleTimeWindowChange}
                options={timeWindowOptions}
              />
              <Topnav />
            </div>
          </div>
        </div>
      </div>
      {/* Add a spacer div to push content below the fixed header */}
      <div className="h-40 md:h-28"></div>
      {/* Adjust padding for mobile and larger screens */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 md:pt-0">
        <InfiniteScroll
          dataLength={trendingItems.length}
          next={loadMoreItems}
          hasMore={hasMore}
          loader={<div className="text-center py-4">Loading more...</div>}
          endMessage={
            <p className="text-center text-gray-400 mt-4">
              You've seen it all!
            </p>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {trendingItems.map((item) => (
              <Link
                key={item.id}
                to={`/${item.media_type === 'movie' ? 'movies' : 'tv-shows'}/details/${item.id}`}
                className="block"
              >
                <motion.div
                  className="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                      {item.title || item.name}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">
                      {item.media_type.charAt(0).toUpperCase() + item.media_type.slice(1)}
                    </p>
                    <div className="mt-2">
                      <p className="text-gray-300 text-xs sm:text-sm">
                        {expandedDescriptions[item.id] 
                          ? item.overview 
                          : truncateDescription(item.overview, 15)}
                        {item.overview.split(' ').length > 15 && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              toggleDescription(item.id);
                            }}
                            className="text-yellow-400 ml-1 hover:underline focus:outline-none text-xs"
                          >
                            {expandedDescriptions[item.id] ? 'Less' : 'More...'}
                          </button>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center mt-2 text-xs sm:text-sm">
                      <HeroIcons.StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-white">{item.vote_average.toFixed(1)}</span>
                      <HeroIcons.ClockIcon className="h-4 w-4 text-gray-400 ml-4 mr-1" />
                      <span className="text-white">
                        {item.release_date || item.first_air_date}
                      </span>
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

export default Trending