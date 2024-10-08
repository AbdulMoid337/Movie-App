import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../Utils/Axios";
import { motion } from "framer-motion";
import {
  StarIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import GlobalLoader from "./GlobalLoader";
import Slider from "react-slick";
import DropDown from "./DropDown";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HorizontalCards = () => {
  const [trendingItems, setTrendingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [mediaType, setMediaType] = useState("all");

  useEffect(() => {
    const fetchTrendingItems = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/trending/${mediaType}/week`);
        setTrendingItems(response.data.results.slice(0, 10));
        console.log(response.data.results);
      } catch (error) {
        console.error("Error fetching trending items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrendingItems();
  }, [mediaType]);

  const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 p-2 rounded-full"
      >
        <ChevronLeftIcon className="h-6 w-6 text-white" />
      </button>
    );
  };

  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 p-2 rounded-full"
      >
        <ChevronRightIcon className="h-6 w-6 text-white" />
      </button>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const truncateDescription = (text, maxWords) => {
    const words = text.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ");
    }
    return text;
  };

  const toggleDescription = (e, id) => {
    e.preventDefault(); // Prevent navigation when clicking "More/Less"
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleMediaTypeChange = (event) => {
    setMediaType(event.target.value);
  };

  const mediaTypeOptions = [
    { value: "all", label: "All" },
    { value: "movie", label: "Movies" },
    { value: "tv", label: "TV Shows" },
  ];

  return (
    <>
      {isLoading && <GlobalLoader />}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Trending This Week</h2>
          <DropDown
            value={mediaType}
            onChange={handleMediaTypeChange}
            options={mediaTypeOptions}
          />
        </div>
        <Slider {...settings}>
          {trendingItems.map((item) => (
            <Link
              key={item.id}
              to={`/${item.media_type === 'movie' ? 'movies' : 'tv-shows'}/details/${item.id}`}
              className="block px-2"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-white truncate">
                      {item.title || item.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {item.media_type.charAt(0).toUpperCase() +
                        item.media_type.slice(1)}
                    </p>
                    <div className="mt-2">
                      <p className="text-gray-300 text-sm">
                        {expandedDescriptions[item.id]
                          ? item.overview
                          : truncateDescription(item.overview, 20)}
                        {item.overview.split(" ").length > 20 && (
                          <button
                            onClick={(e) => toggleDescription(e, item.id)}
                            className="text-yellow-400 ml-1 hover:underline focus:outline-none"
                          >
                            {expandedDescriptions[item.id] ? "Less" : "More..."}
                          </button>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center mt-2">
                      <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                      <span className="text-white">
                        {item.vote_average.toFixed(1)}
                      </span>
                      <ClockIcon className="h-5 w-5 text-gray-400 ml-4 mr-1" />
                      <span className="text-white">
                        {item.release_date || item.first_air_date}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default HorizontalCards;