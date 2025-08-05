import {Routes, Route} from 'react-router-dom'
import './App.css'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <div className='min-h-screen bg-background text-text'>
      <AppRoutes />
    </div>
  )
}

export default App
