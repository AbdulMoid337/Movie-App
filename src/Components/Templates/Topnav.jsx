import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid'
import debounce from 'lodash/debounce'

const Topnav = () => {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const navigate = useNavigate()
    const suggestionRef = useRef(null)

    // Mock API call (replace with actual API in production)
    const fetchSuggestions = async (input) => {
        setIsLoading(true)
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300))
        const mockSuggestions = [
            'The Avengers',
            'Inception',
            'The Dark Knight',
            'Pulp Fiction',
            'The Matrix',
            'Interstellar',
            'Forrest Gump',
            'The Godfather',
        ]
        const filtered = mockSuggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(input.toLowerCase())
        )
        setIsLoading(false)
        return filtered
    }

    const debouncedFetchSuggestions = useCallback(
        debounce(async (input) => {
            if (input.trim()) {
                const newSuggestions = await fetchSuggestions(input)
                setSuggestions(newSuggestions)
                setShowSuggestions(true)
            } else {
                setSuggestions([])
                setShowSuggestions(false)
            }
        }, 300),
        []
    )

    useEffect(() => {
        debouncedFetchSuggestions(query)
    }, [query, debouncedFetchSuggestions])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (query.trim()) {
            navigate(`/search/${encodeURIComponent(query)}`)
            setQuery('')
            setShowSuggestions(false)
        }
    }

    const handleSuggestionClick = (suggestion) => {
        navigate(`/search/${encodeURIComponent(suggestion)}`)
        setQuery('')
        setShowSuggestions(false)
    }

    const handleClearSearch = () => {
        setQuery('')
        setSuggestions([])
        setShowSuggestions(false)
    }

    return (
        <div className=" py-4 ">
            <div className="container mx-auto px-4">
                <form onSubmit={handleSubmit} className="flex justify-end">
                    <div className="relative w-full max-w-md" ref={suggestionRef}>
                        <input
                            type="text"
                            placeholder="Search movies, TV shows..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-gray-800 rounded-full py-2 px-4 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-300"
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300" />

                        {query && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        )}

                        {showSuggestions && (
                            <ul className="absolute z-10 w-full bg-gray-800 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {isLoading ? (
                                    <li className="px-4 py-2 text-gray-300">Loading...</li>
                                ) : suggestions.length > 0 ? (
                                    suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            {suggestion}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-2 text-gray-300">No results found</li>
                                )}
                            </ul>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Topnav
