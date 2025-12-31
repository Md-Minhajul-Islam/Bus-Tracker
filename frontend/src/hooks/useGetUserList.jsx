import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { ADMIN_API_END_POINT } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setUserList } from "@/redux/userListSlice";

const useGetUserList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserList = async () => {
      try {
        const res = await axios.get(`${ADMIN_API_END_POINT}/user`, {
          withCredentials: true,
        });
        if (res.data.users) {
          dispatch(setUserList(res.data.users));
        }
      } catch (error) {
        // console.log(error);
      }
    };
    getUserList();
  }, [dispatch]);
};

export default useGetUserList;
