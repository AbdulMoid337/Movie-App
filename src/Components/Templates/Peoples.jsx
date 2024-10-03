import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../Utils/Axios'
import { motion } from 'framer-motion'
import * as HeroIcons from '@heroicons/react/24/solid'
import GlobalLoader from './GlobalLoader'
import InfiniteScroll from 'react-infinite-scroll-component'

const Peoples = () => {
  const navigate = useNavigate()
  const [peoples, setPeoples] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchPeoples = useCallback(async (resetItems = false, search = '') => {
    setIsLoading(true)
    try {
      let endpoint = search ? '/search/person' : '/person/popular'
      const response = await axios.get(endpoint, {
        params: { 
          page: resetItems ? 1 : page,
          query: search
        }
      })
      const newPeoples = response.data.results
      setPeoples(prevPeoples => resetItems ? newPeoples : [...prevPeoples, ...newPeoples])
      setHasMore(response.data.page < response.data.total_pages)
      setPage(prevPage => resetItems ? 2 : prevPage + 1)
    } catch (error) {
      console.error('Error fetching people:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchPeoples(true, searchTerm)
  }, [searchTerm])

  useEffect(() => {
    document.title = searchTerm ? `Search Results for "${searchTerm}" | MovieApp` : 'Popular People | MovieApp'
  }, [searchTerm])

  const loadMoreItems = () => {
    if (!isLoading) {
      fetchPeoples(false, searchTerm)
    }
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchPeoples(true, searchTerm)
  }

  const handlePersonClick = (person) => {
    navigate(`/people/details/${person.id}`)
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
              <h2 className="text-2xl font-bold text-white">Popular People</h2>
            </div>
            <form onSubmit={handleSearch} className="flex-1 max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for people..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <HeroIcons.MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8">
        <InfiniteScroll
          dataLength={peoples.length}
          next={loadMoreItems}
          hasMore={hasMore}
          loader={<div className="text-center py-4">Loading more...</div>}
          endMessage={
            <p className="text-center text-gray-400 mt-4">
              You've seen all the results!
            </p>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {peoples.map((person) => (
              <motion.div
                key={person.id}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePersonClick(person)}
              >
                {person.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                    alt={person.name}
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 sm:h-64 bg-gray-700 flex items-center justify-center">
                    <HeroIcons.UserIcon className="h-20 w-20 text-gray-500" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                    {person.name}
                  </h3>
                  <div className="flex items-center mt-2 text-xs sm:text-sm">
                    <HeroIcons.StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-white">{person.popularity ? person.popularity.toFixed(1) : 'N/A'}</span>
                  </div>
                  <div className="mt-2 text-xs sm:text-sm">
                    <p className="text-gray-300">Known for:</p>
                    <ul className="list-disc list-inside">
                      {person.known_for && person.known_for.length > 0 ? (
                        person.known_for.slice(0, 3).map((work) => (
                          <li key={work.id} className="text-gray-400 truncate">
                            {work.title || work.name || 'Untitled'}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400">No known works</li>
                      )}
                    </ul>
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

export default Peoples