import { useEffect, useRef } from "react";
import axios from "axios";
import { LOCATION_API_END_POINT } from "../utils/constants";
import getDistance from "../utils/getDistance";
import { useDispatch } from "react-redux";
import { setUserLocation } from "@/redux/authSlice";

const DURATION = 60 * 1000; // 1 minute
const MIN_DISTANCE = 10; // meters

const useTracker = () => {
  const lastPositionRef = useRef(null);
  const lastSentTimeRef = useRef(0);
  const currentPositionRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        currentPositionRef.current = { lat: latitude, lng: longitude };

        if (!lastPositionRef.current) {
          lastPositionRef.current = currentPositionRef.current;
          lastSentTimeRef.current = Date.now();
          sendLocation(latitude, longitude, dispatch);
        }
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    const intervalId = setInterval(() => {
      const now = Date.now();
      const current = currentPositionRef.current;

      if (!current) return;

      const distance = lastPositionRef.current
        ? getDistance(
            lastPositionRef.current.lat,
            lastPositionRef.current.lng,
            current.lat,
            current.lng
          )
        : 0;

      if (
        now - lastSentTimeRef.current >= DURATION &&
        distance >= MIN_DISTANCE
      ) {
        sendLocation(current.lat, current.lng, dispatch);
        lastPositionRef.current = current;
        lastSentTimeRef.current = now;
      }
    }, 1000); // check every second (can adjust)

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(intervalId);
    };
  }, []);
};

const sendLocation = async (lat, lng, dispatch) => {
  try {
    dispatch(setUserLocation([lat, lng]));
    await axios.post(
      LOCATION_API_END_POINT,
      { lat, lng },
      { withCredentials: true }
    );
  } catch (error) {
    // console.error("Failed to send location");
  }
};

export default useTracker;
