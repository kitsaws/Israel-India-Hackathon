import { PatientProvider } from '../context/nurse/PatientProvider'
import Navbar from '../components/nurse/Navbar'

const NurseLayout = ({ children }) => {
  return (
    <PatientProvider>
      <div className='min-h-0 max-h-screen app-container flex flex-col overflow-y-auto'>
        <Navbar />
        <main className='flex-1 w-full flex flex-col gap-4 py-10 px-16'>
          {children}
        </main>
      </div>
    </PatientProvider>
  )
}

export default NurseLayout
