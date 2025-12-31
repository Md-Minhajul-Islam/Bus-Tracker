import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bus, MapPin, X } from "lucide-react";
import getDistance from "@/utils/getDistance";
import { useEffect, useState } from "react";

const DistanceSidebar = () => {
  const { allLocations } = useSelector((store) => store.location);
  const { user, userLocation } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const [busesWithDistance, setBusesWithDistance] = useState([]);

  useEffect(() => {
    const busesWithDistance = allLocations
      ?.map((obj) => {
        if (obj?.sender?.role !== "driver" || obj?.sender?._id === user?._id) {
          return null;
        }

        const distance =
          getDistance(
            userLocation[0],
            userLocation[1],
            obj?.locations[obj?.locations?.length - 1][0],
            obj?.locations[obj?.locations?.length - 1][1]
          ) / 1000;

        return {
          ...obj,
          distance: Number(distance.toFixed(2)),
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance);

    setBusesWithDistance(busesWithDistance);
  }, [location, allLocations, user?._id]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-[340px]
          bg-white/90 backdrop-blur-xl
          border-r shadow-2xl z-40
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Nearby Buses</h2>
            <p className="text-xs text-muted-foreground">
              Live distance from your location
            </p>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="rounded-full hover:bg-slate-200 hover:text-red-500"
          >
            <X size={18} />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-80px)] px-5 py-4">
          <div className="space-y-1">
            {busesWithDistance?.length === 0 && (
              <p className="text-center text-sm text-muted-foreground mt-10">
                No buses available
              </p>
            )}

            {busesWithDistance?.map((bus, index) => (
              <Card
                key={index}
                className={`rounded-2xl transition hover:shadow-lg cursor-pointer
                  ${index === 0 ? "border-indigo-500" : ""}
                `}
              >
                <CardContent className="p-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center
                        ${bus.distance < 0.5 ? "bg-green-500" : "bg-slate-100"}
                      `}
                    >
                      <Bus
                        size={18}
                        className={
                          bus.distance < 0.5
                            ? "text-white"
                            : "text-slate-600"
                        }
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={12} />
                        {bus.distance} km away
                      </div>
                    </div>
                  </div>

                  <Badge
                    className={`rounded-full px-3 py-1
                      ${
                        bus?.distance < 0.5
                          ? "bg-green-500 text-white"
                          : "bg-slate-200 text-slate-700"
                      }
                    `}
                  >
                    {bus?.distance < 0.5 ? "Nearby" : "On Route"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </aside>

      <Button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-50 h-10 w-10 rounded-full shadow-xl bg-indigo-600 hover:bg-indigo-700 transition-all"
      >
        <Bus size={22} />
      </Button>
    </>
  );
};

export default DistanceSidebar;
