const SidebarTiles = ({ logo, title }) => {
  return (
    <div className="flex justify-center items-center gap-2 shadow-md bg-secondary-active font-bold text-secondary-text text-2xl px-4 py-8 rounded-xl">
      <span>{ logo }</span>
      <span>{ title }</span>
    </div>
  )
}

export default SidebarTiles
