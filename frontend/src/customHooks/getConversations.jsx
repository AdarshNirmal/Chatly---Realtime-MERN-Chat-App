import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { setConversations } from "../redux/userSlice"

const useGetConversations = () => {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)

  useEffect(() => {
    if (!userData) return

    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/conversation/list`, {
          withCredentials: true
        })
        dispatch(setConversations(res.data))
      } catch (error) {
        console.log("get conversations error:", error)
      }
    }

    fetchConversations()
  }, [userData, dispatch])
}

export default useGetConversations