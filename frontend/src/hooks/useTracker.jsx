import { useEffect, useRef } from "react";
import axios from "axios";
import { LOCATION_API_END_POINT } from "../utils/constants";
import getDistance from "../utils/getDistance";
import { useDispatch, useSelector } from "react-redux";
import { setUserLocation } from "@/redux/authSlice";
import { current } from "@reduxjs/toolkit";

const DURATION = 5 * 1000; // 5 seconds
const MIN_DISTANCE = 10; // meters

const useTracker = () => {
  const lastPositionRef = useRef(null);
  const lastSentTimeRef = useRef(0);
  const currentPositionRef = useRef(null);
  const lastStop = useRef(null);
  const dispatch = useDispatch();
  const { route } = useSelector((store) => store.auth);
  const { routes } = useSelector((store) => store.routes);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        currentPositionRef.current = { lat: latitude, lng: longitude };

        if (!lastPositionRef.current) {
          lastPositionRef.current = currentPositionRef.current;
          lastSentTimeRef.current = Date.now();
          sendLocation(latitude, longitude, dispatch, route?.color);
          if (route?._id) sendLocationMail(latitude, longitude, route?._id);
        }
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true, maximumAge: 0 },
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
            current.lng,
          )
        : 0;

      if (
        now - lastSentTimeRef.current >= DURATION &&
        distance >= MIN_DISTANCE
      ) {
        sendLocation(current.lat, current.lng, dispatch, route?.color);
        lastPositionRef.current = current;
        lastSentTimeRef.current = now;
      }
    }, 1000); // check every second

    // const isSameStop = (a, b) => {
    //   if (!a || !b) return false;
    //   return a[0] === b[0] && a[1] === b[1];
    // };

    // const mailInterval = setInterval(() => {
    //   const currPos = currentPositionRef.current;
    //   if (!currPos) return;

    //   routes?.forEach((route) => {
    //     route?.stopLocation?.forEach((stp) => {
    //       if (!Array.isArray(stp) || stp.length !== 2) return;

    //       const distance = getDistance(
    //         stp[0],
    //         stp[1],
    //         currPos.lat,
    //         currPos.lng,
    //       );

    //       if (distance <= 100 && !isSameStop(lastStop.current, stp)) {
    //         if (route?._id) {
    //           sendLocationMail(currPos.lat, currPos.lng, route._id);
    //         }

    //         lastStop.current = stp;
    //       }
    //     });
    //   });
    // }, 5000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(intervalId);
      // clearInterval(mailInterval);
    };
  }, [routes, route, dispatch]);
};

const sendLocation = async (lat, lng, dispatch, color) => {
  try {
    dispatch(setUserLocation([lat, lng]));
    await axios.post(
      LOCATION_API_END_POINT,
      { lat, lng, color },
      { withCredentials: true },
    );
  } catch (error) {
    // console.error("Failed to send location");
  }
};

const sendLocationMail = async (lat, lng, routeId) => {
  try {
    const res = await axios.post(
      `${LOCATION_API_END_POINT}/send-location-mail`,
      {
        lat,
        lng,
        routeId,
      },
      { withCredentials: true },
    );
  } catch (error) {
    //  console.log(error);
  }
};

export default useTracker;
