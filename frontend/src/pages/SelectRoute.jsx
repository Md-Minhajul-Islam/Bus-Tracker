import React, { useState } from "react";
import useGetRoutes from "../hooks/useGetRoutes";
import { useDispatch, useSelector } from "react-redux";
import { setRoute } from "../redux/authSlice";
import { ArrowBigRight, CheckCircle, ChevronRight } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";

const SelectRoute = () => {
  useGetRoutes();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { routes } = useSelector((store) => store.routes);
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  const handleSelect = (route) => {
    setSelectedRouteId(route?._id);
    dispatch(setRoute(route));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-sky-50">
      <div className="absolute -top-24 -left-24 h-72 w-72 bg-indigo-300/30 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-24 h-72 w-72 bg-sky-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 bg-purple-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-3xl mx-auto px-3 sm:px-6 py-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center mt-6 md:mt-12">
          Select Your Route
        </h2>

        <div className="space-y-3">
          {routes?.map((route) => {
            const selected = selectedRouteId === route?._id;

            return (
              <Label
                key={route?._id}
                className={`flex gap-3 p-3 sm:p-4 rounded-xl border cursor-pointer
                  backdrop-blur-md transition-all
                  ${selected ? "border-white border-3 shadow-md" : ""}
                `}
                style={{ backgroundColor: route?.color }}
              >
                <div
                  className="flex-1 space-y-2 "
                  onClick={() => handleSelect(route)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white sm:text-base font-medium">
                        Route {route?.no}
                      </span>
                    </div>

                    {selected && (
                      <CheckCircle size={18} className="text-white shrink-0" />
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 text-[11px] sm:text-xs text-slate-600">
                    {route?.route?.map((stop, index) => (
                      <span key={index} className="flex items-center gap-1 mb-1">
                        <span className="px-2 py-1 bg-white border rounded-md">
                          {stop}
                        </span>
                        {index < route?.route?.length - 1 && (
                          <span className="text-white">➜</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </Label>
            );
          })}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate("/map")}
              disabled={!selectedRouteId}
              className="
      group flex items-center gap-1 md:gap-2
      md:px-5 md:py-3 px-3 py-2
      rounded-lg
      md:rounded-2xl
      bg-gradient-to-r from-indigo-600 to-sky-600
      text-white text-xs sm:text-sm font-semibold
      shadow-lg shadow-indigo-500/30
      transition-all duration-300
      hover:scale-[1.03] hover:shadow-xl
      active:scale-95
      disabled:opacity-40 disabled:cursor-not-allowed
    "
            >
              <span>Go to Map</span>

              <ChevronRight
                size={20}
                className="
        transition-transform duration-300
        group-hover:translate-x-1
      "
              />
            </button>
          </div>

          {!routes?.length && (
            <p className="text-center text-sm text-muted-foreground mt-10">
              No routes available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectRoute;
