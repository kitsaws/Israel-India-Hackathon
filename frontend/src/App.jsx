import { Routes, Route } from 'react-router-dom'
import NavBar from '../src/components/NavBar'
import EmergencySidebar from '../src/components/EmergencySidebar'
import Home from './pages/Home'
import Media from './pages/Media'
import ComfortControl from './pages/ComfortControl'
import Family from './pages/Family'
import Goals from './pages/Goals'
import EyeTrackingToast from './components/ui/EyeTrackingToast'
import './App.css'

function App() {
  return (
    <div className='app-container flex flex-col'>
      <NavBar />
      <main className='w-full flex-1 flex overflow-hidden'>
        <div className='w-[80%] overflow-y-auto'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/media' element={<Media />} />
          <Route path='/comfort-control' element={<ComfortControl />} />
          <Route path='/family' element={<Family />} />
          <Route path='/goals' element={<Goals />} />
        </Routes>
        </div>
        <EmergencySidebar />
      </main>
      <EyeTrackingToast />
    </div>
  )
}

export default App
