import React, { useState, useEffect } from 'react'
import axios from '../../Utils/Axios'
import { PlayIcon, FilmIcon, TvIcon, CalendarIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'

const Header = () => {
  const [backgroundImage, setBackgroundImage] = useState('')
  const [title, setTitle] = useState('')
  const [overview, setOverview] = useState('')
  const [releaseDate, setReleaseDate] = useState('')
  const [mediaType, setMediaType] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const fetchTrendingItem = async () => {
      try {
        const response = await axios.get('/trending/all/day')
        const items = response.data.results
        const randomItem = items[Math.floor(Math.random() * items.length)]
        const imageUrl = `https://image.tmdb.org/t/p/original${randomItem.backdrop_path}`
        setBackgroundImage(imageUrl)
        setTitle(randomItem.title || randomItem.name)
        setOverview(randomItem.overview)
        setReleaseDate(randomItem.release_date || randomItem.first_air_date)
        setMediaType(randomItem.media_type)
      } catch (error) {
        console.error('Error fetching trending item:', error)
      }
    }

    fetchTrendingItem()
  }, [])

  const truncateOverview = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
  };

  return (
    <div 
      className="bg-cover bg-center h-[50vh] md:h-[70vh] relative overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-16 text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 text-shadow">
          {title || 'Welcome to Movie App'}
        </h1>
        <div className="flex items-center space-x-4 mb-2 md:mb-4">
          <div className="flex items-center">
            {mediaType === 'movie' ? (
              <FilmIcon className="w-5 h-5 mr-2 text-yellow-500" />
            ) : (
              <TvIcon className="w-5 h-5 mr-2 text-yellow-500" />
            )}
            <span className="text-sm md:text-base text-shadow">
              {mediaType === 'movie' ? 'Movie' : 'TV Show'}
            </span>
          </div>
          {releaseDate && (
            <div className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-yellow-500" />
              <span className="text-sm md:text-base text-shadow">
                {new Date(releaseDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        {overview && (
          <div className="mb-4 md:mb-6">
            <p className={`text-sm md:text-base max-w-2xl text-shadow ${isExpanded ? '' : 'line-clamp-3'}`}>
              {isExpanded ? overview : truncateOverview(overview, 200)}
            </p>
            {overview.length > 200 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-yellow-500 hover:text-yellow-400 text-sm md:text-base mt-2 flex items-center"
              >
                {isExpanded ? (
                  <>
                    <ChevronUpIcon className="w-4 h-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="w-4 h-4 mr-1" />
                    Show More
                  </>
                )}
              </button>
            )}
          </div>
        )}
        <button className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
          <PlayIcon className="w-5 h-5 mr-2" />
          Watch Trailer
        </button>
      </div>
    </div>
  )
}

export default Header
