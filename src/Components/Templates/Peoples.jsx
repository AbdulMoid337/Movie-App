import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../Utils/Axios'
import { motion } from 'framer-motion'
import * as HeroIcons from '@heroicons/react/24/solid'
import GlobalLoader from './GlobalLoader'
import InfiniteScroll from 'react-infinite-scroll-component'
import Topnav from './Topnav'

const Peoples = () => {
  const navigate = useNavigate()
  const [peoples, setPeoples] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPerson, setSelectedPerson] = useState(null)

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

  const handlePersonClick = async (person) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/person/${person.id}`, {
        params: { append_to_response: 'combined_credits' }
      })
      setSelectedPerson(response.data)
    } catch (error) {
      console.error('Error fetching person details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAge = (birthday) => {
    if (!birthday) return 'Age unknown'
    const ageDifMs = Date.now() - new Date(birthday).getTime()
    const ageDate = new Date(ageDifMs)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }

  const truncateBio = (bio, maxLength = 200) => {
    if (!bio) return 'No biography available'
    return bio.length > maxLength ? bio.substring(0, maxLength) + '...' : bio
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
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search people..."
                className="bg-gray-800 text-white rounded-l px-4 py-2 focus:outline-none"
              />
              <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-r px-4 py-2">
                <HeroIcons.MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>
            <Topnav />
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
      {selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedPerson.name}</h2>
              <button onClick={() => setSelectedPerson(null)} className="text-gray-400 hover:text-white">
                <HeroIcons.XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row">
              {selectedPerson.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${selectedPerson.profile_path}`}
                  alt={selectedPerson.name}
                  className="w-full sm:w-1/3 rounded-lg mb-4 sm:mb-0 sm:mr-4"
                />
              ) : (
                <div className="w-full sm:w-1/3 h-64 bg-gray-700 rounded-lg mb-4 sm:mb-0 sm:mr-4 flex items-center justify-center">
                  <HeroIcons.UserIcon className="h-20 w-20 text-gray-500" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">Age:</span> {getAge(selectedPerson.birthday)}
                </p>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">Born:</span> {selectedPerson.birthday || 'Unknown'}
                </p>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">From:</span> {selectedPerson.place_of_birth || 'Unknown'}
                </p>
                <p className="text-gray-300 mb-4">{truncateBio(selectedPerson.biography)}</p>
                <h3 className="text-xl font-semibold text-white mb-2">Known For</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedPerson.combined_credits && selectedPerson.combined_credits.cast ? (
                    selectedPerson.combined_credits.cast.slice(0, 4).map((credit) => (
                      <div key={credit.id} className="bg-gray-700 p-2 rounded">
                        <p className="text-white font-semibold truncate">{credit.title || credit.name || 'Untitled'}</p>
                        <p className="text-gray-400 text-sm">
                          {credit.media_type === 'movie' ? 'Movie' : 'TV'}: {credit.character || 'Unknown role'}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 col-span-2">No known credits</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isLoading && <GlobalLoader />}
    </div>
  )
}

export default Peoples