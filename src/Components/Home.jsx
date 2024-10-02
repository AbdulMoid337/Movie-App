import React from 'react'
import Sidenav from './Templates/Sidenav'
import Topnav from './Templates/Topnav'
import Header from './Templates/Header'

const Home = () => {
    document.title = "Movie App | MA. Moid"
    return (
        <div className='bg-gray-900 min-h-screen'>
            <Sidenav />
            <div className="pt-20 md:pt-16"> {/* Adjust padding-top for mobile and desktop */}
                <Topnav />
                <Header />
                <main className="p-4 md:p-8">
                    {/* Your movie listings or other content */}
                </main>
            </div>
        </div>
    )
}

export default Home
