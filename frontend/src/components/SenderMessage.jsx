import React, { useEffect, useRef } from 'react'
import dp from '../assets/dp.png'
import { useSelector } from 'react-redux'


function SenderMessage({ image, message, status }) {
  let scroll = useRef()
  let { userData } = useSelector(state => state.user)

  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }, [message, image, status])

  const handleImageScroll = () => {
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className='flex items-center gap-[10px]'>
      <div
        ref={scroll}
        className='w-fit max-w-[500px] px-[20px] py-[5px] bg-[rgb(23,151,194)]
          text-white text-[19px] rounded-tr-none rounded-2xl
          relative right-0 ml-auto shadow-gray-800 shadow-lg gap-[6px] flex flex-col'
      >
        {image && (
          <img
            src={image}
            alt=''
            className='w-[150px] rounded-lg'
            onLoad={handleImageScroll}
          />
        )}

        {message && <span>{message}</span>}

        <div className='flex items-center justify-end gap-[4px] text-[11px] opacity-80'>
          <span>
            {status === "sent" && "✓"}
            {status === "delivered" && "✓✓"}
            {status === "seen" && <span className='text-blue-300'>✓✓</span>}
          </span>
        </div>
      </div>
      <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center
        items-center bg-white shadow-gray-600 shadow-lg cursor-pointer ' >
        <img src={userData.image || dp} alt='' className='h-[100%]' />
      </div>
    </div>
  )
}

export default SenderMessage