import {Routes, Route, useNavigate} from 'react-router-dom'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { useAuth } from './context/AuthContext'
import { useEffect } from 'react'
import Loading from './components/Loading'

function App() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {    
    if (auth.loading) {
      console.log('Loading authentication status...');
    } else if (auth.user) {
      console.log('User is authenticated:', auth.user);
      navigate(`/${auth.role}/`);
    } else {
      console.log('User is not authenticated');
      navigate(`/role-select/login`);
    }
  }, [auth])

  return (
    <div className='min-h-screen bg-background text-text'>
      <AppRoutes user={auth.user} />
    </div>
  )
}

export default App
