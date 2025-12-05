import React, { useRef, useState, useEffect } from 'react'
import { IoArrowBackCircle } from "react-icons/io5";
import dp from '../assets/dp.png'
import { useDispatch, useSelector } from 'react-redux';
import { setselectedUser } from '../redux/userSlice'
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import axios from 'axios'
import { serverUrl } from '../main'
import { setMessages } from '../redux/messageSlice';

function MessageArea() {
  let { selectedUser, userData, socket } = useSelector(state => state.user)
  let dispatch = useDispatch()
  let [showPicker, setShowPicker] = useState(false)
  let [input, setInput] = useState("")
  let [frontendImage, setFrontendImage] = useState(null)
  let [backendImage, setBackendImage] = useState(null)
  let image = useRef()
  let { messages } = useSelector(state => state.message)

  
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeout = useRef(null)

  const handleImage = (e) => {
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (input.length == 0 && backendImage == null) {
      return
    }
    try {
      let formData = new FormData()
      formData.append("message", input)
      if (backendImage) {
        formData.append("image", backendImage)
      }
      let result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, formData,
        { withCredentials: true })
      dispatch(setMessages([...messages, result.data]))
      setInput("")
      setFrontendImage(null)
      setBackendImage(null)
    } catch (error) {
      console.log(error)
    }
  }

  const onEmojiClick = (emojiData) => {
    setInput(prevInput => prevInput + emojiData.emoji)
    setShowPicker(false)
  }

  
  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)

    if (!socket || !selectedUser) return

    
    socket.emit("typing", { to: selectedUser._id })

    
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current)
    }
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { to: selectedUser._id })
    }, 1000)
  }

  
  useEffect(() => {
    socket?.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]))
    })
    return () => socket?.off("newMessage")
  }, [messages, setMessages])

  
  useEffect(() => {
    if (!socket || !selectedUser) return

    const handleTyping = ({ from }) => {
      if (from === selectedUser._id) {
        setIsTyping(true)
      }
    }

    const handleStopTyping = ({ from }) => {
      if (from === selectedUser._id) {
        setIsTyping(false)
      }
    }

    socket.on("typing", handleTyping)
    socket.on("stopTyping", handleStopTyping)

    return () => {
      socket.off("typing", handleTyping)
      socket.off("stopTyping", handleStopTyping)
    }
  }, [socket, selectedUser])

  return (
    <div className={`lg:w-[70%] relative ${selectedUser ? "flex" : "hidden"} lg:flex w-full h-full bg-slate-300 dark:bg-slate-950 border-l-2 border-gray-300 dark:border-gray-800 transition-colors duration-300`}>

      {selectedUser &&
        <div className='w-full h-[100vh] flex flex-col' >
          
          <div className='w-full h-[100px] bg-[#1797c2] dark:bg-slate-900 rounded-b-[30px] gap-[20px] shadow-gray-400 dark:shadow-black shadow-lg flex items-center px-[20px] transition-colors duration-300'>
            <div className='cursor-pointer' onClick={() => dispatch(setselectedUser(null))} >
              <IoArrowBackCircle className='w-[40px] h-[40px] text-white' />
            </div>
            
            <div className='w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center bg-white dark:bg-gray-700 shadow-gray-600 dark:shadow-black shadow-lg cursor-pointer'>
              <img src={selectedUser?.image || dp} alt='' className='h-[100%]' />
            </div>
            <h1 className='text-white font-semibold text-[20px] '>{selectedUser?.name || "user"}</h1>
          </div>

          <div className='w-full h-[80vh] flex flex-col py-[50px] px-[20px] overflow-auto gap-[20px] '>

            {showPicker && <div className='absolute bottom-[100px] left-[20px]'><EmojiPicker theme='auto' width={250} height={350} className='shadow-lg z-[100]' onEmojiClick={onEmojiClick} /></div>}

            {messages && messages.map((mess) => (
              mess.sender == userData._id ? 
                <SenderMessage key={mess._id} image={mess.image} message={mess.message} status={mess.status} /> :
                <ReceiverMessage key={mess._id} image={mess.image} message={mess.message} />
            ))}

           
            {isTyping && (
              <div className='text-sm text-gray-600 dark:text-gray-300'>
                {selectedUser?.name || selectedUser?.userName || "User"} is typing...
              </div>
            )}

          </div>
        </div>}

      {!selectedUser &&
        <div className='w-full h-full flex flex-col justify-center items-center p-5 text-center'>
          <h1 className='text-gray-700 dark:text-gray-200 font-bold text-[40px] lg:text-[55px] transition-colors'>Welcome to <span className='text-[#1797c2]'>Chatty..</span></h1>
          <span className='text-gray-700 dark:text-gray-400 font-bold text-[20px] lg:text-[30px] transition-colors'>Where Conversations Come Alive.!</span>
        </div>}

      {selectedUser && <div className='w-full absolute bottom-[20px] flex items-center justify-center'>

        {frontendImage && <img src={frontendImage} alt='' className='w-[80px] absolute bottom-[100px] right-[19%] rounded-lg shadow-gray-700 shadow-lg' />}

        <form className='w-[95%] lg:w-[70%] h-[60px] bg-[rgb(23,151,194)] dark:bg-slate-900 shadow-gray-400 dark:shadow-black shadow-lg rounded-full flex items-center gap-[20px] px-[20px] relative transition-colors duration-300' onSubmit={handleSendMessage}>

          <div onClick={() => setShowPicker(prev => !prev)}>
            <RiEmojiStickerLine className='w-[25px] h-[25px] text-white cursor-pointer' />
          </div>

          <input type='file' accept='image/*' ref={image} hidden onChange={handleImage} />

         
          <input
            type='text'
            className='w-full h-full px-[10px] outline-none border-0 text-[19px] text-white bg-transparent placeholder-gray-200 '
            placeholder='Message'
            onChange={handleInputChange}
            value={input}
          />
          
          <div onClick={() => image.current.click()}>
            <FaImages className='w-[25px] h-[25px] text-white cursor-pointer' />
          </div>
          {(input.length > 0 || backendImage !== null) && (
            <button>
              <RiSendPlane2Fill className='w-[25px] h-[25px] text-white cursor-pointer' />
            </button>
          )}

        </form>
      </div>}

    </div>
  )
}

export default MessageArea