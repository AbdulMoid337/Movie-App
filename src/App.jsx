import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Components/Home'
import Trending from './Components/Templates/Trending'
import Popular from './Components/Templates/Popular'
import Movies from './Components/Templates/Movies'
import Tvshows from './Components/Templates/Tvshows'
import Peoples from './Components/Templates/Peoples'
import Moviedetails from './Components/Templates/Moviedetails'
import TvDetails from './Components/Templates/TvDetails'
import PersonDetails from './Components/Templates/PersonDetails'
import About from './Components/Templates/About'
import Contact from './Components/Templates/Contact'
function App() {

  return (
    <>
      <div >
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/trending' element={<Trending />} />
          <Route path='/popular' element={<Popular />} />
          <Route path='/movies' element={<Movies />} />
          <Route path='/movies/details/:id' element={<Moviedetails />} />
          <Route path='/tv-shows' element={<Tvshows />} />
          <Route path='/tv-shows/details/:id' element={<TvDetails />} />
          <Route path='/people' element={<Peoples />} />
          <Route path='/people/details/:id' element={<PersonDetails />} />
          <Route path='/about' element={<About />} />
          <Route path='/Contact' element={<Contact />} />
        </Routes>
      </div>
    </>
  )
}

export default App
