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
import { removeLocation } from "../redux/locationSlice";
import useGetRoutes from "../hooks/useGetRoutes";
import { Bus } from "lucide-react";

const MapView = () => {
  useConnectSocket();
  useTracker();
  useGetLocation();
  useGetRoutes();
  useGetMessages();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleReceive = (newLocation) => {
      dispatch(updateLocation(newLocation));
    };

    const handleRemoveLocation = (sender) => {
      dispatch(removeLocation(sender));
    };

    socket.on("receive_location", handleReceive);
    socket.on("remove_location", handleRemoveLocation);

    return () => socket.off("receive_location", handleReceive);
  }, [dispatch]);

  const { userLocation } = useSelector((store) => store.auth);
  const center = userLocation || [22.3476, 91.8223]; // Chattogram
  const { allLocations } = useSelector((store) => store.location);
  const { user } = useSelector((store) => store.auth);
  const { routes } = useSelector((store) => store.routes);

  const busPinIcon = (color = "#3b82f6") =>
    L.divIcon({
      className: "",
      html: `
      <div style="
        position: relative;
        width: 42px;
        height: 42px;
        transform: translateY(-2px);
      ">
        <!-- Pin -->
        <svg viewBox="0 0 24 24"
             width="42"
             height="42"
             fill="${color}"
             xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C7.6 2 4 5.6 4 10c0 5.3 8 12 8 12s8-6.7 8-12c0-4.4-3.6-8-8-8z"/>
        </svg>

        <!-- Bus icon -->
        <div style="
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 22px;
          height: 22px;
          background: white;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg xmlns="http://www.w3.org/2000/svg"
               width="15"
               height="15"
               viewBox="0 0 24 24"
               fill="none"
               stroke="${color}"
               stroke-width="1.8"
               stroke-linecap="round"
               stroke-linejoin="round">
            <path d="M8 6v6"/>
            <path d="M15 6v6"/>
            <path d="M2 12h19.6"/>
            <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2
                     0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
            <circle cx="7" cy="18" r="2"/>
            <circle cx="16" cy="18" r="2"/>
          </svg>
        </div>
      </div>
    `,
      iconSize: [42, 42],
      iconAnchor: [21, 42],
    });

  

  const stopMarkerIcon = (color = "#FF0000") => {
    return L.divIcon({
      className: "stop-marker",
      html: `<div style="
      background: ${color};
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 2px solid white;
    "></div>`,
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {routes?.map((route, index) => (
          <React.Fragment key={index}>
            {route?.routeLocation?.length > 1 && (
              <Polyline
                positions={route.routeLocation}
                pathOptions={{
                  color: route?.color || "#3b82f6",
                  weight: 4,
                  opacity: 0.4,
                  smoothFactor: 1,
                }}
              />
            )}
          </React.Fragment>
        ))}

        {routes?.map((route, routeIndex) => (
          <React.Fragment key={routeIndex}>
            {route?.stopLocation?.map((stop, stopIndex) => {
              if (
                !stop ||
                !Array.isArray(stop) ||
                stop.length !== 2 ||
                stop.some((coord) => typeof coord !== "number")
              ) {
                return null;
              }

              return (
                <Marker
                  key={`${routeIndex}-${stopIndex}`}
                  position={stop}
                  icon={stopMarkerIcon()}
                />
              );
            })}
          </React.Fragment>
        ))}

        {allLocations?.map((obj, index) => {
          if (!obj?.locations || obj.locations.length === 0) return null;

          const currentPosition = obj?.locations[obj?.locations?.length - 1];
          return (
            <React.Fragment key={index}>
              {obj?.sender?.role === "driver" && (
                <>
                  <Polyline
                    positions={obj?.locations}
                    pathOptions={{
                      color: obj?.color || "#3b82f6",
                      weight: 4,
                      opacity: 0.9,
                      smoothFactor: 1,
                    }}
                  />
                  <Marker
                    position={currentPosition}
                    icon={busPinIcon(
                      obj?.sender?._id === user?._id
                        ? "#ef4444"
                        : obj?.color || "#3b82f6",
                    )}
                  />
                </>
              )}

              {obj?.sender?.role === "student" && (
                <CircleMarker
                  center={currentPosition}
                  radius={5}
                  pathOptions={{
                    color:
                      obj?.sender?._id === user?._id ? "#ef4444" : "#3b82f6",
                    fillColor:
                      obj?.sender?._id === user?._id ? "#ef4444" : "#3b82f6",
                    fillOpacity: 0.8,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      <ProfileNav />
      {user?.role?.toLowerCase() === "student" && <Chatbox />}
      <DistanceSidebar />
    </div>
  );
};

export default MapView;
