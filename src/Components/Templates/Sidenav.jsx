import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChartBarIcon, FireIcon, FilmIcon, TvIcon, UserGroupIcon, InformationCircleIcon, EnvelopeIcon, Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

function Sidenav() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

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

                <ul className={`md:flex md:space-x-4 ${isMenuOpen ? 'block' : 'hidden'} absolute md:relative top-full left-0 md:top-auto md:left-auto w-full md:w-auto bg-indigo-900 md:bg-transparent p-4 md:p-0 mt-2 md:mt-0`}>
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
                        onMouseEnter={() => setIsInfoOpen(true)}
                        onMouseLeave={() => setIsInfoOpen(false)}
                    >
                        <button
                            className="flex items-center px-3 py-2 rounded-md transition-colors duration-300 hover:bg-indigo-700 hover:text-yellow-400"
                            onClick={() => setIsInfoOpen(!isInfoOpen)}
                        >
                            <InformationCircleIcon className="w-5 h-5 mr-1" />
                            <span className="text-sm">Info</span>
                            <ChevronDownIcon className="w-4 h-4 ml-1" />
                        </button>
                        {isInfoOpen && (
                            <ul className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                                {infoItems.map((subItem) => (
                                    <li key={subItem.name}>
                                        <Link
                                            to={subItem.path}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {subItem.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.li>
                </ul>
            </div>
        </nav>
    );
}

export default Sidenav;