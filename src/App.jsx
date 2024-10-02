import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Components/Home'
import Trending from './Components/Templates/Trending'

function App() {

  return (
    <>
      <div >
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/trending' element={<Trending />} />
        </Routes>
      </div>
    </>
  )
}

export default App
