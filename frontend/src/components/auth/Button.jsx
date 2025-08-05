const Button = ({ authType, roleLabel, roleIcon, onClick }) => {
    return (
      <button onClick={onClick} className='cursor-pointer flex justify-center items-center h-16 w-full font-semibold text-lg gap-4 px-6 py-4 rounded-xl border-2 border-accent hover:bg-primary-active transition-all duration-300'>
        <span className="text-2xl">{roleIcon}</span>
        <p>{authType === 'login' ? 'Log In' : 'Sign Up'} as {roleLabel}</p>
      </button>
    );
  };

export default Button
