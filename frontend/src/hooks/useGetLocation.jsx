import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { LOCATION_API_END_POINT } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setLocation } from "@/redux/locationSlice";

const useGetLocation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getLocation = async () => {
      try {
        const res = await axios.get(`${LOCATION_API_END_POINT}`, {
          withCredentials: true,
        });
        if (res.data.locations) {
          dispatch(setLocation(res.data.locations));
        }
      } catch (error) {
        // console.log(error);
      }
    };
    getLocation();
  }, [dispatch]);
};

export default useGetLocation;
