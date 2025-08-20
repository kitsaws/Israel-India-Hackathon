import React, { useState } from 'react'
import AuthLayout from '../AuthLayout'
import SwitchRoleCard from '../../../components/auth/SwitchRoleCard'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const NurseSignup = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName || !formData.password || !formData.confirmPassword) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup/nurse', {
        fullName: formData.fullName,
        age: formData.age,
        gender: formData.gender,
        password: formData.password
      });
      if (response.status !== 200) {
        throw new Error('Failed to create account');
      }
      console.log('Signup success:', response.data);
      // Optionally reset form
      setFormData({
        fullName: '',
        age: '',
        gender: '',
        password: '',
        confirmPassword: ''
      });

      navigate('/nurse/login');
    } catch (error) {
      console.error('Signup failed:', error);
      alert(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };


  return (
    <AuthLayout>
      <div className="w-full max-w-3xl mx-auto  rounded-lg p-8">
        <SwitchRoleCard />

        <h2 className="text-2xl font-semibold text-accent mt-6 mb-4">Account Information</h2>

        <form className="flex flex-col gap-5">

          <div className="flex flex-col">
            <label htmlFor="full-name" className="mb-1 text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="full-name"
              placeholder="Enter your full name"
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1">
              <label htmlFor="age" className="mb-1 block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                id="age"
                placeholder="Age"
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />
            </div>

            <div className="flex-1">
              <label htmlFor="gender" className="mb-1 block text-sm font-medium text-gray-700">Gender</label>
              <select
                id="gender"
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                required
              >
                <option value="" disabled>Select your gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1">
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                autoComplete='off'
                required
              />
            </div>

            <div className="flex-1">
              <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm your password"
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                autoComplete='off'
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 bg-accent text-white font-medium cursor-pointer py-3 rounded-md hover:bg-opacity-90 transition"
            onClick={handleSubmit}
          >
            Create Account
          </button>
        </form>
      </div>
    </AuthLayout>

  )
}

export default NurseSignup
