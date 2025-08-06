const HomePageCard = ({ logo, title, description, isBordered }) => {
  return (
    <div className={`h-48 w-56 ${(isBordered)?'rounded-xl bg-primary shadow-md':'text-accent'}  flex flex-col gap-1 justify-center items-center`}>
        <span className='text-2xl font-bold'>{logo}</span>
        <p className='text-text text-lg font-bold'>{title}</p>
        <p className='text-text-muted text-sm'>{description}</p>
    </div>
  )
}

export default HomePageCard
