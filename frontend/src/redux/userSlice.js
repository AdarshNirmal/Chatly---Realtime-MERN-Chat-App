import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    otherUsers: null,
    selectedUser: null,
    socket: null,
    onlineUsers: null,
    searchData: null
    // ✅ conversations REMOVED
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload
    },
    setselectedUser: (state, action) => {
      state.selectedUser = action.payload
    },
    setSocket: (state, action) => {
      state.socket = action.payload
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload
    }
    // ✅ setConversations REMOVED
  }
})

export const {
  setUserData,
  setOtherUsers,
  setselectedUser,
  setSocket,
  setOnlineUsers,
  setSearchData
  // ✅ setConversations REMOVED
} = userSlice.actions

export default userSlice.reducer