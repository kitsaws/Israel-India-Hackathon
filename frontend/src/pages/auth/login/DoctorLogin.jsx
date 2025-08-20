import { useState } from 'react';
import { useRole } from '../../../context/RoleContext';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import AuthLayout from '../AuthLayout';
import SwitchRoleCard from '../../../components/auth/SwitchRoleCard';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { role } = useRole();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      alert('Please enter both username and password');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3000/api/auth/login/nurse`, {
        username: formData.username,
        password: formData.password,
      },{ withCredentials: true });

      console.log('Login success:', response.data);
      setAuth({ loading: false, user: response.data.user, role: response.data.role });

      // Navigate to dashboard or appropriate page
      navigate(`/${role}/home`);

    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-xl mx-auto rounded-lg p-8">
        <SwitchRoleCard />

        <h2 className="text-2xl font-semibold text-accent mt-6 mb-4">Login</h2>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              autoComplete='off'
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer mt-4 bg-accent text-white font-medium py-3 rounded-md hover:bg-opacity-90 transition"
          >
            Login
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
