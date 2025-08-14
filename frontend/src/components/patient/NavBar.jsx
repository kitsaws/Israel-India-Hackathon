import { NavLink } from 'react-router-dom';
import { House, Heart, Settings, MessageSquare, Target } from 'lucide-react';
import NavbarTiles from '../ui/NavbarTiles';
import hospitalLogo from '../../assets/hospital-logo.png';

function Navbar() {
  return (
    <nav className="w-full h-[20vh] p-3 flex justify-around items-center bg-primary shadow-md z-10 sticky top-0">
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
      <NavLink to="/" end>
        <img id='logo' src={hospitalLogo} />
      </NavLink>
    </nav>
  );
}

export default Navbar;
