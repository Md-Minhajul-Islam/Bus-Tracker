import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { MESSAGE_API_END_POINT } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setMessages } from "@/redux/messageSlice.js";

const useGetMessages = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`${MESSAGE_API_END_POINT}`, {
          withCredentials: true,
        });
        if (res.data.messages) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        // console.log(error);
      }
    };
    getMessages();
  }, [dispatch]);
};

export default useGetMessages;
