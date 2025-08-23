const HomePageCard = ({ logo, title, description, isBordered }) => {
  return (
    <div className={`w-48 ${(isBordered)?'rounded-xl bg-primary shadow-md h-36 ':'text-accent h-24'}  flex flex-col gap-1 justify-center items-center`}>
        <span className='text-2xl font-bold'>{logo}</span>
        <p className='text-text text-lg font-bold'>{title}</p>
        <p className='text-text-muted text-sm text-center'>{description}</p>
    </div>
  )
}

export default HomePageCard
