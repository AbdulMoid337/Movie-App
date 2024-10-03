import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChartBarIcon, FireIcon, FilmIcon, TvIcon, UserGroupIcon, InformationCircleIcon, EnvelopeIcon, Bars3Icon, XMarkIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import axios from '../../Utils/Axios'
import debounce from 'lodash/debounce'

function Sidenav() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const infoRef = useRef(null);

    // Search state
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const suggestionRef = useRef(null);

    const navItems = [
        { name: 'Trending', icon: ChartBarIcon, path: '/trending' },
        { name: 'Popular', icon: FireIcon, path: '/popular' },
        { name: 'Movies', icon: FilmIcon, path: '/movies' },
        { name: 'TV Shows', icon: TvIcon, path: '/tv-shows' },
        { name: 'People', icon: UserGroupIcon, path: '/people' },
    ];

    const infoItems = [
        { name: 'About', icon: InformationCircleIcon, path: '/about' },
        { name: 'Contact', icon: EnvelopeIcon, path: '/contact' },
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (infoRef.current && !infoRef.current.contains(event.target)) {
                setIsInfoOpen(false);
            }
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [infoRef, suggestionRef]);

    const getSearches = useCallback(
        debounce(async (input) => {
            if (input.trim()) {
                setIsLoading(true);
                setError(null);
                try {
                    const response = await axios.get(
                        `/search/multi?query=${input}&include_adult=false&language=en-US&page=1`
                    );
                    setSuggestions(response.data.results);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Search error:", error);
                    setError("An error occurred while fetching suggestions");
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        getSearches(query);
    }, [query, getSearches]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search/${encodeURIComponent(query)}`);
            setQuery("");
            setShowSuggestions(false);
        }
    };

    const handleClearSearch = () => {
        setQuery("");
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSuggestionClick = (suggestion) => {
        setShowSuggestions(false);
        setQuery("");
        if (suggestion.media_type === "movie") {
            navigate(`/movies/details/${suggestion.id}`);
        } else if (suggestion.media_type === "tv") {
            navigate(`/tv-shows/details/${suggestion.id}`);
        } else if (suggestion.media_type === "person") {
            navigate(`/people/details/${suggestion.id}`);
        }
    };

    return (
        <nav className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white w-full p-4 shadow-lg fixed top-0 left-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center"
                    >
                        <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.4142 4.99998H21.0082C21.556 4.99998 22 5.44461 22 6.00085V19.9991C22 20.5519 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5553 2 19.9991V6.00085C2 5.44808 2.45531 4.99998 2.9918 4.99998H8.58579L6.05025 2.46445L7.46447 1.05023L11.4142 4.99998H12.5858L16.5355 1.05023L17.9497 2.46445L15.4142 4.99998Z" />
                        </svg>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                            Movie App
                        </span>
                    </motion.div>
                </Link>

                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? (
                            <XMarkIcon className="h-6 w-6" />
                        ) : (
                            <Bars3Icon className="h-6 w-6" />
                        )}
                    </button>
                </div>

                <div className={`md:flex md:items-center md:space-x-4 ${isMenuOpen ? 'block' : 'hidden'} absolute md:relative top-full left-0 md:top-auto md:left-auto w-full md:w-auto bg-indigo-900 md:bg-transparent p-4 md:p-0 mt-2 md:mt-0`}>
                    <ul className="md:flex md:space-x-4 mb-4 md:mb-0">
                        {navItems.map((item) => (
                            <motion.li key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-3 py-2 rounded-md transition-colors duration-300 ${
                                        location.pathname === item.path
                                            ? 'bg-indigo-700 text-white'
                                            : 'hover:bg-indigo-700 hover:text-yellow-400'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <item.icon className="w-5 h-5 mr-1" />
                                    <span className="text-sm">{item.name}</span>
                                </Link>
                            </motion.li>
                        ))}
                        <motion.li 
                            className="relative"
                            ref={infoRef}
                        >
                            <button
                                className={`flex items-center px-3 py-2 rounded-md transition-colors duration-300 ${
                                    isInfoOpen ? 'bg-indigo-700 text-white' : 'hover:bg-indigo-700 hover:text-yellow-400'
                                }`}
                                onClick={() => setIsInfoOpen(!isInfoOpen)}
                            >
                                <InformationCircleIcon className="w-5 h-5 mr-1" />
                                <span className="text-sm">Info</span>
                                <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform duration-300 ${isInfoOpen ? 'transform rotate-180' : ''}`} />
                            </button>
                            {isInfoOpen && (
                                <ul className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-indigo-800 ring-1 ring-black ring-opacity-5 divide-y divide-indigo-700 focus:outline-none">
                                    {infoItems.map((subItem) => (
                                        <motion.li key={subItem.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Link
                                                to={subItem.path}
                                                className="flex items-center px-4 py-2 text-sm text-white hover:bg-indigo-700 hover:text-yellow-400"
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    setIsInfoOpen(false);
                                                }}
                                            >
                                                <subItem.icon className="w-5 h-5 mr-2" />
                                                {subItem.name}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </motion.li>
                    </ul>
                    
                    {/* Search Bar */}
                    <div className="relative w-full md:w-64 lg:w-96" ref={suggestionRef}>
                        <form onSubmit={handleSubmit} className="flex">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-gray-700 rounded-full py-2 px-4 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-300"
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
                        </form>

                        {showSuggestions && (
                            <ul className="absolute z-20 w-full bg-gray-800 mt-1 rounded-md shadow-lg max-h-96 overflow-y-auto custom-scrollbar">
                                {isLoading ? (
                                    <li className="px-4 py-2 text-gray-300">Loading...</li>
                                ) : error ? (
                                    <li className="px-4 py-2 text-red-500">{error}</li>
                                ) : suggestions.length > 0 ? (
                                    suggestions.map((suggestion) => (
                                        <li key={suggestion.id}>
                                            <button
                                                className="flex items-center px-4 py-2 hover:bg-gray-700 text-white w-full text-left"
                                                onClick={() => handleSuggestionClick(suggestion)}
                                            >
                                                <img
                                                    src={
                                                        suggestion.media_type === "person"
                                                            ? suggestion.profile_path
                                                                ? `https://image.tmdb.org/t/p/w92${suggestion.profile_path}`
                                                                : "https://via.placeholder.com/92x138?text=No+Image"
                                                            : suggestion.poster_path
                                                            ? `https://image.tmdb.org/t/p/w92${suggestion.poster_path}`
                                                            : "https://via.placeholder.com/92x138?text=No+Image"
                                                    }
                                                    alt={suggestion.title || suggestion.name}
                                                    className="w-12 h-18 object-cover mr-4 rounded"
                                                />
                                                <div>
                                                    <p className="font-semibold">
                                                        {suggestion.title || suggestion.name}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        {suggestion.media_type === "movie" && "Movie"}
                                                        {suggestion.media_type === "tv" && "TV Show"}
                                                        {suggestion.media_type === "person" && "Person"}
                                                        {suggestion.release_date &&
                                                            ` • ${suggestion.release_date.split("-")[0]}`}
                                                        {suggestion.first_air_date &&
                                                            ` • ${suggestion.first_air_date.split("-")[0]}`}
                                                        {suggestion.known_for_department &&
                                                            ` • ${suggestion.known_for_department}`}
                                                    </p>
                                                </div>
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-2 text-gray-300">No results found</li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Sidenav;