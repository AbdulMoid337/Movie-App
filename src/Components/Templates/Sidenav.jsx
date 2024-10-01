import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChartBarIcon, FireIcon, FilmIcon, TvIcon, UserGroupIcon, InformationCircleIcon, EnvelopeIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { name: 'Trending', icon: ChartBarIcon, path: '/trending' },
        { name: 'Popular', icon: FireIcon, path: '/popular' },
        { name: 'Movies', icon: FilmIcon, path: '/movies' },
        { name: 'TV Shows', icon: TvIcon, path: '/tv-shows' },
        { name: 'People', icon: UserGroupIcon, path: '/people' },
    ];

    const dropdownItems = [
        { name: 'About', icon: InformationCircleIcon, path: '/about' },
        { name: 'Contact', icon: EnvelopeIcon, path: '/contact' },
    ];

    return (
        <motion.nav
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-4 shadow-lg sticky top-0 z-50"
        >
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center"
                    >
                        <svg className="w-10 h-10 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.4142 4.99998H21.0082C21.556 4.99998 22 5.44461 22 6.00085V19.9991C22 20.5519 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5553 2 19.9991V6.00085C2 5.44808 2.45531 4.99998 2.9918 4.99998H8.58579L6.05025 2.46445L7.46447 1.05023L11.4142 4.99998H12.5858L16.5355 1.05023L17.9497 2.46445L15.4142 4.99998Z" />
                        </svg>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                            Movie App
                        </span>
                    </motion.div>
                </Link>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>

                {/* Desktop menu */}
                <ul className="hidden md:flex space-x-1 items-center">
                    {navItems.map((item) => (
                        <motion.li key={item.name} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to={item.path}
                                className={`flex items-center px-3 py-2 rounded-md transition-colors duration-300 ${
                                    location.pathname === item.path
                                        ? 'bg-indigo-700 text-white'
                                        : 'hover:bg-indigo-700 hover:text-yellow-400'
                                }`}
                            >
                                <item.icon className="w-5 h-5 mr-1" />
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        </motion.li>
                    ))}
                    {/* Dropdown */}
                    <motion.li 
                        className="relative group"
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.95 }}
                    >
                        <button
                            className="flex items-center px-3 py-2 rounded-md transition-colors duration-300 hover:bg-indigo-700 hover:text-yellow-400"
                        >
                            <span className="text-sm mr-1">More</span>
                            <motion.div
                                animate={{ rotate: 0 }}
                                transition={{ duration: 0.3 }}
                                className="group-hover:rotate-180"
                            >
                                <ChevronDownIcon className="w-4 h-4" />
                            </motion.div>
                        </button>
                        <AnimatePresence>
                            <motion.ul
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-48 bg-indigo-800 rounded-md shadow-lg py-1 hidden group-hover:block"
                            >
                                {dropdownItems.map((item) => (
                                    <motion.li key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link
                                            to={item.path}
                                            className="flex items-center px-4 py-2 text-sm text-white hover:bg-indigo-700"
                                        >
                                            <item.icon className="w-5 h-5 mr-2" />
                                            {item.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </AnimatePresence>
                    </motion.li>
                </ul>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden mt-4 space-y-2"
                    >
                        {[...navItems, ...dropdownItems].map((item) => (
                            <motion.li key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center py-2 px-4 rounded-md transition-colors duration-300 ${
                                        location.pathname === item.path
                                            ? 'bg-indigo-700 text-white'
                                            : 'hover:bg-indigo-700 hover:text-yellow-400'
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon className="w-5 h-5 mr-2" />
                                    {item.name}
                                </Link>
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

export default Navigation;