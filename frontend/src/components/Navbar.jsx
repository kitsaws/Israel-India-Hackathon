import { NavLink } from "react-router-dom"
import { User } from 'lucide-react'
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import axios from "axios"

const Navbar = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const handleLogout = async () => {
        try{
            await axios.post(
                `http://localhost:3000/api/auth/logout`,
                {},
                { withCredentials: true }
            );
            
            setAuth(null);
            navigate('/role-select/login');
        } catch(err){
            console.error('Failed to logout', err);
        }
    };

    return (
        <nav className='w-full shadow-md flex justify-between items-center '>
            <div>
                <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                    <img src="../assets/ventibridge.png" alt="" />
                </NavLink>
                <ul>
                    <li className="flex justify-center items-center px-4 py-2 rounded-full border-[1] border-accent">
                        <NavLink
                            to="/nurse/profile"
                            className={({ isActive }) => (isActive ? "active-link" : "")}
                        >
                            <User />
                            <span>Profile</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/nurse/patient-dashboard"
                            className={({ isActive }) => (isActive ? "active-link" : "")}
                        >
                            <Activity />
                            <span>Patient Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/nurse/patient-goals"
                            className={({ isActive }) => (isActive ? "active-link" : "")}
                        >
                            <Target />
                            <span>Patient Goals</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="logout">
                <button
                    onClick={handleLogout}
                    className=""
                >
                    <LogOut />
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Navbar
