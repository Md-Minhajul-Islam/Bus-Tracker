import React from 'react'
import { useEffect } from 'react';
import { socket } from '../socket/socket';

const useConnectSocket = () => {

  useEffect(() => {
    socket.connect();

    // return () => {
    //   socket.disconnect();
    // };
  }, []);
}

export default useConnectSocket