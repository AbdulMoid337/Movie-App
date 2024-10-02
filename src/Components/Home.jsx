import React from 'react'
import Sidenav from './Templates/Sidenav'
import Topnav from './Templates/Topnav'
import Header from './Templates/header'
import HorizontalCards from './Templates/HorizontalCards'
const Home = () => {
    document.title = "Movie App | MA. Moid"
    return (
        <div className='bg-gray-900 min-h-screen'>
            <Sidenav />
            <div className="pt-20 md:pt-16"> 
                <Topnav />
                <Header />
                <HorizontalCards />
                <main className="p-4 md:p-8">
                </main>
            </div>
        </div>
    )
}

export default Home
