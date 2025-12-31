import React from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
} from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import ProfileNav from "../components/ProfileNav";
import Chatbox from "../components/Chatbox";
import useConnectSocket from "../hooks/useConnectSocket";
import useGetMessages from "../hooks/useGetMessages";
import useGetLocation from "../hooks/useGetLocation";
import useTracker from "../hooks/useTracker";
import { useEffect } from "react";
import { updateLocation } from "@/redux/locationSlice";
import { socket } from "../socket/socket";
import DistanceSidebar from "../components/DistanceSidebar";
import L from "leaflet";

const center = [22.3476, 91.8223]; // Chattogram

const MapView = () => {
  useConnectSocket();
  useTracker();
  useGetLocation();
  useGetMessages();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleReceive = (newLocation) => {
      dispatch(updateLocation(newLocation));
    };

    socket.on("receive_location", handleReceive);

    return () => socket.off("receive_location", handleReceive);
  }, [dispatch]);

  const { allLocations } = useSelector((store) => store.location);
  const { user } = useSelector((store) => store.auth);

  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const blueIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* MAP */}
      <MapContainer
        center={center}
        zoom={13}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {allLocations?.map((obj, index) => {
          const currentPosition = obj?.locations[obj?.locations?.length - 1];
          return (
            <React.Fragment key={index}>
              {obj?.sender?.role === "driver" && (
                <>
                  <Polyline
                    positions={obj?.locations}
                    pathOptions={{
                      color: "#3b82f6",
                      weight: 4,
                      opacity: 0.85,
                      smoothFactor: 1,
                    }}
                  />
                  <Marker
                    icon={obj?.sender?._id === user?._id ? redIcon : blueIcon}
                    position={currentPosition}
                  />
                </>
              )}

              {obj?.sender?.role === "student" && (
                <CircleMarker
                  center={currentPosition}
                  radius={6}
                  pathOptions={{
                    color:
                      obj?.sender?._id === user?._id ? "#ef4444" : "#3b82f6",
                    fillColor:
                      obj?.sender?._id === user?._id ? "#ef4444" : "#3b82f6",
                    fillOpacity: 0.9,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      <ProfileNav />
      <Chatbox />
      <DistanceSidebar />
    </div>
  );
};

export default MapView;
