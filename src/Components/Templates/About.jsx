import React from 'react';
import { motion } from 'framer-motion';
import { FilmIcon, TvIcon, UserGroupIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const About = () => {
  document.title = "About | Movie App";

  const features = [
    { name: 'Extensive Movie Database', icon: FilmIcon, description: 'Access information on thousands of movies, from classics to the latest releases.' },
    { name: 'TV Show Coverage', icon: TvIcon, description: 'Explore details about your favorite TV series, including episodes, cast, and ratings.' },
    { name: 'Celebrity Profiles', icon: UserGroupIcon, description: 'Discover comprehensive information about actors, directors, and other film industry professionals.' },
    { name: 'Global Entertainment', icon: GlobeAltIcon, description: 'Stay updated with entertainment news and trends from around the world.' },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white pt-20">
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Movie App
        </motion.h1>
        
        <motion.p 
          className="text-lg text-center mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Movie App is your ultimate destination for all things cinema and television. 
          We provide a comprehensive platform for movie enthusiasts, TV show fans, and 
          anyone interested in the world of entertainment.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.name}
              className="bg-gray-800 p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <feature.icon className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg max-w-3xl mx-auto">
            At Movie App, we strive to create a user-friendly platform that connects 
            movie lovers with the content they're passionate about. Our goal is to 
            provide accurate, up-to-date information and foster a community where 
            users can explore, discover, and share their love for cinema and television.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
