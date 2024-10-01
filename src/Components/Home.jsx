import React from 'react'
import SideNav from './Templates/sidenav'
import Topnav from './Templates/Topnav'
const Home = () => {
    document.title = "Movie App | MA. Moid"
    return (
        <div className='bg-gray-900'>
            <SideNav />
            <Topnav />
        </div>
    )
}

export default Home
  