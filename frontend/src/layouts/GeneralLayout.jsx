import Navbar from '../components/Navbar'

const GeneralLayout = ({ children }) => {
  return (
    <div className='min-h-0 max-h-screen app-container flex flex-col overflow-y-auto'>
      <Navbar />
      <main className='flex-1 w-full flex flex-col gap-4 py-6 px-16'>
        {children}
      </main>
    </div>
  )
}

export default GeneralLayout
