import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Loader2,
  IdCard,
  GraduationCap,
  Calendar,
  MapPin,
  Image,
  Phone,
  Mail,
  Pen,
  Lock,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constants";
import { setUser, setLoading } from "@/redux/authSlice";
import { toast } from "sonner";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { loading, user } = useSelector((store) => store.auth);
  const [showPassword, setShowPassword] = useState(false);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    id: user?.id || "",
    address: user?.address || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    file: null,
  });

  const dispatch = useDispatch();

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (input.newPassword !== input.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setInput({
        ...input,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      dispatch(setLoading(false));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setShowPassword(false);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-xl bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Update Profile
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-center">
            Update your personal and academic information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-4 mt-4">
          {/* Name */}
          <InputField
            icon={Pen}
            label="Full Name"
            name="fullname"
            value={input.fullname}
            onChange={changeHandler}
          />

          {/* Email */}
          <InputField
            icon={Mail}
            label="Email"
            name="email"
            type="email"
            value={input.email}
            onChange={changeHandler}
          />

          {/* Phone */}
          <InputField
            icon={Phone}
            label="Phone Number"
            name="phoneNumber"
            value={input.phoneNumber}
            onChange={changeHandler}
          />

          {/* ID */}
          <InputField
            label="ID"
            name="id"
            icon={IdCard}
            value={input.id}
            onChange={changeHandler}
          />

          {/* Address */}
          <InputField
            label="Address"
            name="address"
            icon={MapPin}
            value={input.address}
            onChange={changeHandler}
          />

          {/* Profile Image */}
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="flex items-center gap-2 text-slate-300 col-span-1">
              <Image size={15} className=" text-indigo-400" /> Profile Photo
            </Label>
            <Input
              className="col-span-2 bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
              type="file"
              accept="image/*"
              onChange={fileChangeHandler}
            />
          </div>

          <div>
            <Label
              onClick={() => setShowPassword(!showPassword)}
              className={
                showPassword ? "text-slate-500 mb-4" : "text-slate-300"
              }
            >
              <span className="text-indigo-400">
                <Lock size={15} />
              </span>{" "}
              Change Password
            </Label>

            {showPassword && (
              <div className="space-y-4 border border-slate-800 rounded-xl p-4 bg-slate-900/60">
                <InputField
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  icon={Pen}
                  value={input.currentPassword}
                  onChange={changeHandler}
                />

                <InputField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  icon={Pen}
                  value={input.newPassword}
                  onChange={changeHandler}
                />

                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  icon={Pen}
                  value={input.confirmPassword}
                  onChange={changeHandler}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

/* Reusable Input Field */
const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="grid grid-cols-3 items-center gap-4">
    <Label className="flex items-center gap-2 text-slate-300 col-span-1">
      {Icon && <Icon size={15} className="text-indigo-400" />}
      {label}
    </Label>
    <Input
      {...props}
      className="col-span-2 bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
    />
  </div>
);

export default UpdateProfileDialog;
