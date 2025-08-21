import { NavLink } from "react-router-dom"
import { User, Activity, Target, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import Logo from '../../assets/ventibridge.png'

const NavbarButton = ({ logo, text, activeClass }) => {
    return (
        <div className={`px-4 py-2 rounded-full transition-all duration-300 ${activeClass===''?'hover:bg-orange-400' : 'hover:opacity-90'} hover:text-white flex justify-center items-center gap-2 ${activeClass}`}>
            <span>{logo}</span>
            <span>{text}</span>
        </div>
    );
}

const Navbar = () => { 
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const handleLogout = async () => {
        try {
            await axios.post(
                `http://localhost:3000/api/auth/logout`,
                {},
                { withCredentials: true }
            );

            setAuth({ loading: true, user: null, role: null });
            navigate('/role-select/login');
        } catch (err) {
            console.error('Failed to logout', err);
        }
    };

    return (
        <nav className='w-full shadow-md flex justify-between items-center px-10 py-4'>
            <div>
                <ul className="flex justify-center items-center gap-7">
                        <NavLink to="/nurse/patient-dashboard">
                            <img src={Logo} width={90} alt="" />
                        </NavLink>
                    <NavLink to="/nurse/profile">
                        {({ isActive }) => (
                            <NavbarButton logo={<User size={20} />} text={'Profile'} activeClass={(isActive) ? 'bg-accent text-white' : ''} />
                        )}
                    </NavLink>
                        <NavLink to="/nurse/patient-dashboard">
                             {({ isActive }) => (
                            <NavbarButton logo={<Activity />} text={'Patient Dashboard'} activeClass={(isActive) ? 'bg-accent text-white' : ''} />
                        )}
                        </NavLink>
                        <NavLink to="/nurse/patient-goals">
                            {({ isActive }) => (
                            <NavbarButton logo={<Target />} text={'Patient Goals'} activeClass={(isActive) ? 'bg-accent text-white' : ''} />
                        )}
                        </NavLink>
                </ul>
            </div>
            <div className="logout">
                <button
                    onClick={handleLogout}
                    className="cursor-pointer px-4 py-2 flex justify-center items-center gap-2 border-1 text-secondary-text transition-all duration-300 hover:text-white hover:bg-secondary-text rounded-full"
                >
                    <LogOut />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    )
}

export default Navbar
