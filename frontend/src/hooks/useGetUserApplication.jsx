import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { ADMIN_API_END_POINT } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setUserApplication } from "@/redux/userApplicationSlice";

const useGetUserApplication = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserApplication = async () => {
      try {
        const res = await axios.get(`${ADMIN_API_END_POINT}/userapplication`, {
          withCredentials: true,
        });
        if (res.data.applications) {
          dispatch(setUserApplication(res.data.applications));
        }
      } catch (error) {
        // console.log(error);
      }
    };
    getUserApplication();
  }, [dispatch]);
};

export default useGetUserApplication;
