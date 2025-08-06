import {Routes, Route} from 'react-router-dom'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { useAuth } from './context/AuthContext'
import { useRole } from './context/RoleContext'
import { useEffect } from 'react'

function App() {
  const { role } = useRole()

  const { auth } = useAuth();
  useEffect(() => {
    if(!role){
        console.log('Wait for role to be set before checking auth');
        return;
    }
    console.log(`Checking authentication for role: ${role}`);
    console.log(`Auth: ${auth}`);
    
    
    if (auth.loading) {
      console.log('Loading authentication status...')
    } else if (auth.user) {
      console.log('User is authenticated:', auth.user)
    } else {
      console.log('User is not authenticated')
    }
  }, [role, auth])

  return (
    <div className='min-h-screen bg-background text-text'>
      <AppRoutes />
    </div>
  )
}

export default App
