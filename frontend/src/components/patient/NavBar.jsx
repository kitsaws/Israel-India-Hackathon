import React from 'react'
import Home from '../pages/Home'
import Media from '../pages/Media'
import ComfortControl from '../pages/ComfortControl'
import Family from '../pages/Family'
import Goals from '../pages/Goals'


const NavBar = () => {
  return (
    <>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/media' element={<Media />} />
            <Route path='/comfort-control' element={<ComfortControl />} />
            <Route path='/family' element={<Family />} />
            <Route path='/goals' element={<Goals />} />
        </Routes>
    </>
  )
}

export default NavBar
