import React from 'react'

const EyeTrackingToast = () => {
  return (
    <div className='absolute bottom-0 left-0 m-3 px-4 py-2 rounded-full bg-white opacity-[80%] border-1 border-text-muted text-text-muted text-sm'>
      👁️ Eye tracking active. Blink to select items.
    </div>
  )
}

export default EyeTrackingToast
