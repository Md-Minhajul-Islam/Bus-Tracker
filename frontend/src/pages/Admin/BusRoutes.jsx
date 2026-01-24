import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Map,
  ArrowRight,
  ArrowBigRight,
  ArrowBigRightDash,
  ArrowBigRightDashIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useGetRoutes from "@/hooks/useGetRoutes";
import Navbar from "../../components/Admin/Navbar";
import AddRouteDialog from "../../components/Admin/AddRouteDialog";
import { setLoading } from "../../redux/authSlice";
import { removeRoute } from "../../redux/routeSlice";
import axios from "axios";
import { ADMIN_API_END_POINT } from "../../utils/constants";
import { toast } from "sonner";

function BusRoutes() {
  useGetRoutes();

  const dispatch = useDispatch();
  const { routes } = useSelector((store) => store.routes);
  const { loading } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const [singleRoute, setSingleRoute] = useState(null);

  const handleRemoveRoute = async (id) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${ADMIN_API_END_POINT}/removeRoute`,
        {
          id,
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        dispatch(removeRoute(id));
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove route");
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex justify-center items-center h-64 text-slate-400">
          Loading routes...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="px-2 py-4 max-w-6xl mx-auto">
        <AddRouteDialog open={open} setOpen={setOpen} route={singleRoute} />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg sm:text-2xl font-bold text-green-700 flex items-center gap-1">
            <Map size={18} /> Bus Routes
          </h1>

          <Button
            onClick={() => {
              setOpen(true);
              setSingleRoute(null);
            }}
            className="bg-green-600 hover:bg-green-700 rounded-xl text-xs sm:text-base gap-1"
          >
            <Plus size={15} />
            Add Route
          </Button>
        </div>

        {routes?.length === 0 ? (
          <p className="text-center text-slate-500">No routes available</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-2">
            {routes?.map((route) => (
              <Card
                key={route?._id}
                className="rounded-xl"
                style={{ backgroundColor: route?.color }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-white">
                      Route {route?.no}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setOpen(true);
                        setSingleRoute(route);
                      }}
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                    >
                      <Pencil size={16} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-100 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove User?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove{" "}
                            <span className="text-red-600 font-semibold">
                              Route {route?.no}
                            </span>{" "}
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveRoute(route?._id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Yes, Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {route?.route?.map((stop, index) => (
                      <React.Fragment key={index}>
                        <span className="text-xs sm:text-sm px-3 py-1 rounded-md bg-white text-black">
                          {stop}
                        </span>

                        {index < route?.route?.length - 1 && (
                          <span className="text-white">➜</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BusRoutes;
