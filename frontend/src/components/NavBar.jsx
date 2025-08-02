import { NavLink } from 'react-router-dom';
import { House, Heart, Settings, MessageSquare, Target } from 'lucide-react';
import NavbarTiles from './ui/NavbarTiles';

function Navbar() {
  return (
    <nav className="w-full h-fit p-3 flex justify-around bg-primary shadow-md z-10">
      <NavLink to="/" end>
        {({ isActive }) => (
          <NavbarTiles
            name="Home"
            logo={<House />}
            className={isActive ? "bg-primary-active" : ""}
          />
        )}
      </NavLink>

      <NavLink to="/media">
        {({ isActive }) => (
          <NavbarTiles
            name="Media"
            logo={<Heart />}
            className={isActive ? "bg-primary-active" : ""}
          />
        )}
      </NavLink>

      <NavLink to="/comfort-control">
        {({ isActive }) => (
          <NavbarTiles
            name="Comfort"
            logo={<Settings />}
            className={isActive ? "bg-primary-active" : ""}
          />
        )}
      </NavLink>

      <NavLink to="/family">
        {({ isActive }) => (
          <NavbarTiles
            name="Family"
            logo={<MessageSquare />}
            className={isActive ? "bg-primary-active" : ""}
          />
        )}
      </NavLink>

      <NavLink to="/goals">
        {({ isActive }) => (
          <NavbarTiles
            name="Goals"
            logo={<Target />}
            className={isActive ? "bg-primary-active" : ""}
          />
        )}
      </NavLink>
    </nav>
  );
}

export default Navbar;
