import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Components/Home'
import Trending from './Components/Templates/Trending'
import Popular from './Components/Templates/Popular'
import Movies from './Components/Templates/Movies'
import Tvshows from './Components/Templates/Tvshows'
import Peoples from './Components/Templates/Peoples'

function App() {

  return (
    <>
      <div >
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/trending' element={<Trending />} />
          <Route path='/popular' element={<Popular />} />
          <Route path='/movies' element={<Movies />} />
          <Route path='/tv-shows' element={<Tvshows />} />
          <Route path='/people' element={<Peoples />} />
        </Routes>
      </div>
    </>
  )
}

export default App
