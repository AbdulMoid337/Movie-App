import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../Utils/Axios';
import GlobalLoader from './GlobalLoader';
import * as HeroIcons from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import Separator from './Separator';

const PersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        const response = await axios.get(`/person/${id}`, {
          params: { append_to_response: 'combined_credits,external_ids,images' }
        });
        setPerson(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching person details:', error);
        setError('Failed to load person details');
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [id]);

  const handleBackToHome = () => {
    navigate('/people');
  };

  const getAge = (birthday, deathday) => {
    if (!birthday) return 'Age unknown';
    const endDate = deathday ? new Date(deathday) : new Date();
    const ageDifMs = endDate - new Date(birthday);
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (loading) return <GlobalLoader />;
  if (error) return <div className="text-white text-center">{error}</div>;
  if (!person) return null;

  const sortedCredits = person.combined_credits.cast
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <button
              onClick={handleBackToHome}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded flex items-center"
            >
              <HeroIcons.ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to People
            </button>
            <h1 className="text-2xl font-bold">{person.name}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Person Overview */}
        <div className="flex flex-col md:flex-row mb-12">
          <div className="md:w-1/3 mb-6 md:mb-0 md:mr-6">
            {person.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                alt={person.name}
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-700 rounded-lg flex items-center justify-center">
                <HeroIcons.UserIcon className="h-32 w-32 text-gray-500" />
              </div>
            )}
          </div>
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold mb-4">{person.name}</h2>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Age:</span> {getAge(person.birthday, person.deathday)}
              {person.deathday && ` (Deceased)`}
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Born:</span> {person.birthday || 'Unknown'}
            </p>
            {person.deathday && (
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Died:</span> {person.deathday}
              </p>
            )}
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">From:</span> {person.place_of_birth || 'Unknown'}
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Known for:</span> {person.known_for_department}
            </p>
            <p className="text-gray-300 mb-4">{person.biography || 'No biography available.'}</p>

            {/* External Links */}
            <div className="flex space-x-4 mb-4">
              {person.external_ids.imdb_id && (
                <a href={`https://www.imdb.com/name/${person.external_ids.imdb_id}`} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300">
                  <HeroIcons.FilmIcon className="h-6 w-6" />
                </a>
              )}
              {person.external_ids.instagram_id && (
                <a href={`https://www.instagram.com/${person.external_ids.instagram_id}`} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300">
                  <HeroIcons.CameraIcon className="h-6 w-6" />
                </a>
              )}
              {person.external_ids.twitter_id && (
                <a href={`https://twitter.com/${person.external_ids.twitter_id}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  <HeroIcons.ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>
        </div>
        <Separator title="Known For" />
        {/* Known For */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
          {sortedCredits.map((credit) => (
            <motion.div
              key={credit.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={`/${credit.media_type === 'movie' ? 'movies' : 'tv-shows'}/details/${credit.id}`}>
                {credit.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${credit.poster_path}`}
                    alt={credit.title || credit.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                    <HeroIcons.FilmIcon className="h-12 w-12 text-gray-500" />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-white font-semibold truncate">{credit.title || credit.name || 'Untitled'}</p>
                  <p className="text-gray-400 text-sm">
                    {credit.media_type === 'movie' ? 'Movie' : 'TV'}: {credit.character || 'Unknown role'}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <Separator title="Images" />

        {person.images && person.images.profiles && person.images.profiles.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
              {person.images.profiles.slice(0, 12).map((image, index) => (
                <motion.img
                  key={index}
                  src={`https://image.tmdb.org/t/p/w200${image.file_path}`}
                  alt={`${person.name} image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PersonDetails;