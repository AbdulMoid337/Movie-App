import React from 'react'
import Sidenav from './Templates/Sidenav'
import Header from './Templates/header'
import HorizontalCards from './Templates/HorizontalCards'
import Separator from './Templates/Separator'

const Home = () => {
    document.title = "Movie App | MA. Moid"
    return (
        <div className='bg-gray-900 min-h-screen'>
            <Sidenav />
            <div className="pt-2">
                <Header />
                <div className="container mx-auto px-4">
                    <Separator title="Trending Now" />
                </div>
                <HorizontalCards />
                <main className="p-4 md:p-8">
                    {/* Add more content here if needed */}
                </main>
            </div>
        </div>
    )
}

export default Home
