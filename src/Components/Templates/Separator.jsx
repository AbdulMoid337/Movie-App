import React from 'react';

const Separator = ({ title }) => {
  return (
    <div className="flex items-center my-8">
      <div className="flex-grow h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      <div className="mx-4 text-white font-bold text-xl">{title}</div>
      <div className="flex-grow h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"></div>
    </div>
  );
};

export default Separator;