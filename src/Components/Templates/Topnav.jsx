import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import axios from "../../Utils/Axios";
import debounce from "lodash/debounce";

const Topnav = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const suggestionRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
    setQuery("");
  };

  return (
    <div className="bg-gradient-to-r from-purple-800 to-indigo-900 py-2 shadow-md">
      <div className="container mx-auto px-4">
        <form onSubmit={handleSubmit} className="flex justify-end">
          <div className="relative w-full max-w-md" ref={suggestionRef}>
            <input
              type="text"
              placeholder="Search movies, TV shows, people..."
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

            {showSuggestions && (
              <ul className="absolute z-20 w-full bg-gray-800 mt-1 rounded-md shadow-lg max-h-96 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  <li className="px-4 py-2 text-gray-300">Loading...</li>
                ) : error ? (
                  <li className="px-4 py-2 text-red-500">{error}</li>
                ) : suggestions.length > 0 ? (
                  suggestions.map((suggestion) => (
                    <li key={suggestion.id}>
                      <Link
                        to={`/search/${encodeURIComponent(
                          suggestion.title || suggestion.name
                        )}`}
                        className="flex items-center px-4 py-2 hover:bg-gray-700 text-white"
                        onClick={handleSuggestionClick}
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
                      </Link>
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
  );
};

export default Topnav;