import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from '../assets/dp.png'
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import { MdDarkMode, MdLightMode } from "react-icons/md"; 
import axios from 'axios'
import { serverUrl } from '../main'
import { setOtherUsers, setselectedUser, setUserData, setSearchData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function SideBar() {
   
    let { userData, otherUsers, selectedUser, onlineUsers, searchData, conversations } = useSelector(state => state.user)
    let [search, setSearch] = useState(false)
    let [input, setInput] = useState("")
    let dispatch = useDispatch()
    let navigate = useNavigate()

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            dispatch(setOtherUsers(null))
            dispatch(setselectedUser(null))
            navigate("/login")
        } catch (error) {
            console.log(error)
        }
    }

    const handlesearch = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/user/search?query=${input}`, { withCredentials: true })
            dispatch(setSearchData(result.data))
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (input) {
            handlesearch()
        }
    }, [input])

    return (
        <div className={`lg:w-[30%] w-full h-full overflow-hidden lg:block bg-slate-200 dark:bg-slate-900 relative ${!selectedUser ? "block" : "hidden"} transition-colors duration-300`}>
            
            
            <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white dark:bg-slate-800 shadow-gray-500 dark:shadow-black text-gray-700 dark:text-white cursor-pointer shadow-lg fixed bottom-[90px] left-[10px] z-50' onClick={toggleTheme}>
                {theme === "light" ? <MdDarkMode className='w-[25px] h-[25px]' /> : <MdLightMode className='w-[25px] h-[25px]' />}
            </div>

           
            <div className='w-[60px] h-[60px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-[#20c7ff] shadow-gray-500 dark:shadow-black text-white cursor-pointer shadow-lg fixed bottom-[20px] left-[10px] z-50' onClick={handleLogOut}>
                <BiLogOutCircle className='w-[25px] h-[25px]' />
            </div>

          
            {input.length > 0 && (
                <div className='flex absolute top-[250px] bg-white dark:bg-gray-800 w-full h-[500px] overflow-y-auto items-center pt-[20px] flex-col gap-[10px] z-[150] shadow-lg'>
                    {searchData?.map((user) => (
                        <div
                            key={user._id}
                            className='w-[95%] h-[70px] flex items-center gap-[20px] px-[10px] hover:bg-[#78cae5] dark:hover:bg-gray-700 border-b-2 border-gray-400 dark:border-gray-600 cursor-pointer'
                            onClick={() => {
                                dispatch(setselectedUser(user))
                                setInput("")
                                setSearch(false)
                            }}
                        >
                            <div className='relative rounded-full bg-white dark:bg-gray-700 flex justify-center items-center '>
                                <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center '>
                                    <img src={user.image || dp} alt="" className='h-[100%]' />
                                </div>
                                {onlineUsers?.includes(user._id?.toString()) &&
                                    <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md border-2 border-white dark:border-gray-800'></span>}
                            </div>
                            <h1 className='text-gray-800 dark:text-white font-semibold text-[20px]'>{user.name || user.userName}</h1>
                        </div>
                    ))}
                </div>
            )}

            
            <div className='w-full h-[300px] bg-[#20c7ff] dark:bg-slate-800 rounded-b-[30%] shadow-gray-400 dark:shadow-black shadow-lg flex flex-col justify-center px-[20px] transition-colors duration-300'>
                <h1 className='text-white font-bold text-[25px]'>chatly</h1>
                <div className='w-full flex justify-between items-center'>
                    <h1 className='text-gray-800 dark:text-gray-100 font-bold text-[25px]'>Hii , {userData.name || "user"}</h1>
                    <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white dark:bg-gray-700 cursor-pointer shadow-gray-500 dark:shadow-black shadow-lg' onClick={() => navigate("/profile")}>
                        <img src={userData.image || dp} alt="" className='h-[100%]' />
                    </div>
                </div>

                
                <div className='w-full flex items-center gap-[20px] overflow-y-auto py-[18px]'>
                    {!search && (
                        <div className='w-[60px] h/[60px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-white dark:bg-gray-700 shadow-gray-500 dark:shadow-black cursor-pointer shadow-lg min-w-[60px]' onClick={() => setSearch(true)}>
                            <IoIosSearch className='w-[25px] h-[25px] dark:text-white' />
                        </div>
                    )}

                    {!search && otherUsers?.map((user) => (
                        onlineUsers?.includes(user._id?.toString()) &&
                        <div key={user._id} className='relative rounded-full shadow-gray-500 dark:shadow-black bg-white dark:bg-gray-700 shadow-lg flex justify-center items-center mt-[10px] cursor-pointer min-w-[60px]' onClick={() => dispatch(setselectedUser(user))}>
                            <div className='w/[60px] h/[60px] rounded-full overflow-hidden flex justify-center items-center '>
                                <img src={user.image || dp} alt="" className='h/[100%]' />
                            </div>
                            <span className='w/[12px] h/[12px] rounded-full absolute bottom/[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md border-2 border-white dark:border-gray-700'></span>
                        </div>
                    ))}

                    {search && (
                        <form className='w-full h/[60px] bg-white dark:bg-gray-700 shadow-gray-500 dark:shadow-black shadow-lg flex items-center gap/[10px] mt/[10px] rounded-full overflow-hidden px/[20px] relative'>
                            <IoIosSearch className='w/[25px] h/[25px] dark:text-white' />
                            <input type="text" placeholder='search users...' className='w-full h-full p/[10px] text/[17px] outline-none border-0 bg-transparent dark:text-white' onChange={(e) => setInput(e.target.value)} value={input} />
                            <RxCross2 className='w/[25px] h/[25px] cursor-pointer dark:text-white' onClick={() => setSearch(false)} />
                        </form>
                    )}
                </div>
            </div>

            
            <div className='w-full h-[50%] overflow-auto flex flex-col gap-[20px] items-center mt/[20px] pb/[100px]'>

                {otherUsers?.map((user) => {

                   
                    const conv = conversations?.find(c =>
                        c.partcipants.some(p => p._id === user._id)
                    )

                    const currentUserId = userData?._id?.toString()

                   
                    let unread = 0
                    if (conv && conv.unreadCount) {
                        // Map ka JSON object banne ki wajah se dono tarah se try
                        unread =
                            conv.unreadCount[currentUserId] ??
                            conv.unreadCount.get?.(currentUserId) ??
                            0
                    }

                    const lastMsg = conv?.lastMessage
                    const isOnline = onlineUsers?.includes(user._id?.toString())

                    return (
                        <div
                            key={user._id}
                            className='w-[93%] h/[56px] flex items-center gap/[20px] shadow-gray-500 dark:shadow-black bg-white dark:bg-gray-800 shadow-lg rounded-full hover:bg-[#78cae5] dark:hover:bg-gray-700 cursor-pointer transition-colors px/[10px]'
                            onClick={() => dispatch(setselectedUser(user))}
                        >
                            {/* Avatar + online dot */}
                            <div className='relative rounded-full shadow-gray-500 dark:shadow-none bg-white dark:bg-gray-700 shadow-lg flex justify-center items.center mt/[10px]'>
                                <div className='w/[60px] h/[62px] rounded-full overflow-hidden flex justify-center items.center '>
                                    <img src={user.image || dp} alt="" className='h/[100%]' />
                                </div>
                                
                                {isOnline &&
                                    <span className='w/[12px] h/[12px] rounded-full absolute bottom/[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md border-2 border-white dark:border-gray-800'></span>}
                            </div>

                            {/* Naam + last message preview */}
                            <div className='flex flex-col flex-1 overflow-hidden'>
                                <h1 className='text-gray-800 dark:text-white font-semibold text-[20px]'>
                                    {user.name || user.userName}
                                </h1>

                                {lastMsg && (
                                    <span className='text-xs text-gray-500 dark:text-gray-300 truncate max-w-[180px]'>
                                        {lastMsg.sender === currentUserId ? "You: " : ""}
                                        {lastMsg.message || (lastMsg.image ? "Photo" : "")}
                                    </span>
                                )}
                            </div>

                            {/* Unread badge right side */}
                            {unread > 0 && (
                                <div className='ml-auto mr-[8px] w-[20px] h/[20px] rounded-full bg-[#20c7ff] text-white flex items-center justify-center text-xs'>
                                    {unread}
                                </div>
                            )}
                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default SideBar