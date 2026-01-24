import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRoute } from "@/redux/routeSlice";
import { ADMIN_API_END_POINT } from "@/utils/constants";
import { setLoading } from "../../redux/authSlice";
import { HexColorPicker } from "react-colorful";
import { setRoutes, updateRoute } from "../../redux/routeSlice";

export default function AddRouteDialog({ open, setOpen, route }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ id: "", no: "", route: "", color: "" });
  const { loading } = useSelector((store) => store.auth);

  useEffect(() => {
    if (route) {
      setForm({
        id: route._id ?? "",
        no: route.no ?? "",
        route: Array.isArray(route.route)
          ? route.route.join(", ")
          : (route.route ?? ""),
        routeLocation: "",
        stopeLocation: "",
        color: route.color ?? "#3b82f6",
      });
    } else {
      setForm({
        id: "",
        no: "",
        route: "",
        routeLocation: "",
        stopLocation: "",
        color: "#3b82f6",
      });
    }
  }, [route, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.no || isNaN(Number(form.no))) {
      return toast.error("Route number must be a valid number");
    }
    if (!form.route || form.route.split(",").length < 2) {
      return toast.error("Route must have at least 2 stops, comma-separated");
    }
    if (!form.color) {
      return toast.error("Color is required");
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${ADMIN_API_END_POINT}/${route ? "updateRoute" : "createRoute"}`,
        {
          id: form.id,
          no: form.no,
          route: form.route,
          color: form.color,
          routeLocation: form.routeLocation,
          stopLocation: form.stopLocation,
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        if (route) dispatch(updateRoute(res.data.data));
        else dispatch(addRoute(res.data.data));
        toast.success(res.data.message);
        setOpen(false);
        setForm({
          id: "",
          no: "",
          route: "",
          color: "#3b82f6",
          routeLocation: "",
          stopLocation: "",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add route");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild></DialogTrigger>

      <DialogContent
        className="
    w-full
    sm:max-w-md md:max-w-lg
    bg-white
    rounded-2xl p-4
    sm:mx-auto
    shadow-xl
    text-black
    sm:mt-10
    overflow-auto
    h-[80vh]
  "
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-2xl font-bold text-center">
            Add New Route
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-center mt-1 text-xs sm:text-base">
            Enter route details below
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5 mt-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label className="text-sm sm:text-base">Route Number</Label>
            <Input
              name="no"
              type="number"
              placeholder={form.no || "e.g., 5"}
              value={form.no}
              onChange={handleChange}
              required
              className="border-slate-300 text-black text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm sm:text-base">Route Stops</Label>
            <Input
              name="route"
              type="text"
              placeholder={form.route || "Stop1, Stop2, Stop3"}
              value={form.route}
              onChange={handleChange}
              required
              className="border-slate-300 text-black text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm sm:text-base">Route Locations</Label>
            <Input
              name="routeLocation"
              type="text"
              placeholder={form.routeLocation || "[[lat, lng], [lat, lng]]"}
              value={form.routeLocation}
              onChange={handleChange}
              className="border-slate-300 text-black text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm sm:text-base">Stop Locations</Label>
            <Input
              name="stopLocation"
              type="text"
              placeholder={form.stopLocation || "[[lat, lng], [lat, lng]]"}
              value={form.stopLocation}
              onChange={handleChange}
              className="border-slate-300 text-black text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm sm:text-base">Route Color</Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div
                className="w-full sm:w-24 h-10 rounded-lg shadow-md"
                style={{ backgroundColor: form.color }}
              />
              <HexColorPicker
                color={form.color}
                onChange={(color) => setForm({ ...form, color })}
                className="w-full sm:w-auto sm:flex-1 rounded-xl"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-4 bg-green-600 hover:bg-green-700 rounded-xl text-white font-medium py-2"
            disabled={loading}
          >
            {loading
              ? route
                ? "Updating..."
                : "Adding..."
              : route
                ? "Update Route"
                : "Add Route"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
