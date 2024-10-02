import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../Utils/Axios'
import { motion } from 'framer-motion'
import { StarIcon, ClockIcon, HomeIcon } from '@heroicons/react/24/solid'
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
    <div className="p-4 sm:p-6 md:p-8 bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleBackToHome}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded flex items-center"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Trending</h2>
        </div>
        <Topnav />
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
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
        </div>
      </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {trendingItems.map((item) => (
            <motion.div
              key={item.id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                className="w-full h-48 sm:h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg sm:text-xl font-semibold text-white truncate">
                  {item.title || item.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {item.media_type.charAt(0).toUpperCase() + item.media_type.slice(1)}
                </p>
                <div className="mt-2">
                  <p className="text-gray-300 text-sm">
                    {expandedDescriptions[item.id] 
                      ? item.overview 
                      : truncateDescription(item.overview, 20)}
                    {item.overview.split(' ').length > 20 && (
                      <button 
                        onClick={() => toggleDescription(item.id)}
                        className="text-yellow-400 ml-1 hover:underline focus:outline-none"
                      >
                        {expandedDescriptions[item.id] ? 'Less' : 'More...'}
                      </button>
                    )}
                  </p>
                </div>
                <div className="flex items-center mt-2">
                  <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="text-white">{item.vote_average.toFixed(1)}</span>
                  <ClockIcon className="h-5 w-5 text-gray-400 ml-4 mr-1" />
                  <span className="text-white text-sm">
                    {item.release_date || item.first_air_date}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </InfiniteScroll>
      {isLoading && <GlobalLoader />}
    </div>
  )
}

export default Trending