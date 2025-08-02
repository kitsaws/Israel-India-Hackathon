import React from 'react'

const NavbarTiles = ({ name, logo, className }) => {
console.log(className)
  return (
    <div className={`size-24 flex flex-col justify-center items-center rounded-xl border-[1px] border-primary-active shadow-md ${className}`}>
        {logo}
        <span>{name}</span>
    </div>
  )
}

export default NavbarTiles
