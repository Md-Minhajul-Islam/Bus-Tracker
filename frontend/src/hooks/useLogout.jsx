import axios from "axios";
import { useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../utils/constants.js";
import { toast } from "sonner";
import { socket } from "../socket/socket.js";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";

const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (res?.data?.success) {
        socket.disconnect();
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return logoutHandler;
};

export default useLogout;
