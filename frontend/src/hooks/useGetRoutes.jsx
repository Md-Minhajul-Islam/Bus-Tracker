import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { ADMIN_API_END_POINT } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setRoutes } from "@/redux/routeSlice";
import { setLoading } from "../redux/authSlice";

const useGetRoutes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getRoutes = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(`${ADMIN_API_END_POINT}/getRoutes`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setRoutes(res.data.data));
        }
      } catch (error) {
        // console.log(error);
      } finally {
          dispatch(setLoading(false));
      }
    };
    getRoutes();
  }, [dispatch]);
};

export default useGetRoutes;
