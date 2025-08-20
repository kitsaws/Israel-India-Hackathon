import { NavLink } from 'react-router-dom';
import { House, Heart, Settings, MessageSquare, Target } from 'lucide-react';
import NavbarTiles from '../ui/NavbarTiles';
import Logo from '../../assets/ventibridge.png';

function Navbar() {
  return (
    <nav className="w-full h-[20vh] p-3 flex justify-around items-center bg-primary shadow-md z-10 sticky top-0">
      <NavLink to="/patient/home" end>
        {({ isActive }) => (
          <NavbarTiles
            name="Home"
            logo={<House />}
            className={isActive ? "bg-primary-active" : ""}
          />
        )}
      </NavLink>

      {/* <NavLink to="/patient/comfort-control">
        {({ isActive }) => (
          <NavbarTiles
            name="Comfort"
            logo={<Settings />}
            className={isActive ? "bg-primary-active" : ""}
          />
        )}
      </NavLink> */}

      <NavLink to="/patient/family">
        {({ isActive }) => (
          <NavbarTiles
            name="Family"
            logo={<MessageSquare />}
            className={isActive ? "bg-primary-active" : ""}
          />
        )}
      </NavLink>

      <NavLink to="/patient/goals">
        {({ isActive }) => (
          <NavbarTiles
            name="Goals"
            logo={<Target />}
            className={isActive ? "bg-primary-active" : ""}
          />
        )}
      </NavLink>

      <NavLink to="/patient/media">
        {({ isActive }) => (
          <NavbarTiles
            name="Media"
            logo={<Heart />}
            className={isActive ? "bg-primary-active" : ""}
          />
        )}
      </NavLink>

      <NavLink to="/patient/home" end>
        <img id='logo' src={Logo} />
      </NavLink>
    </nav>
  );
}

export default Navbar;
