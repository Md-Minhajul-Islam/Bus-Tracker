import React from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constants";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const useDeleteProfile = ({ password }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteHandler = async () => {

    if (!password) {
        toast.error("Enter Password");
        return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/delete`,
          { password },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile Delete Failed!");
    } finally {
      dispatch(setLoading(false));
    }
  };
  return deleteHandler;
};

export default useDeleteProfile;
