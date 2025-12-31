import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  Bus,
  Mail,
  User,
  Phone,
  Pen,
  Delete,
  Trash,
  Trash2,
  MapPin,
  IdCard,
  Calendar,
  GraduationCap,
  ArrowBigLeft,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import UpdateProfileDialog from "../components/UpdateProfileDialog";
import profilePhoto from "/user-profile-photo.jpg";
import { Link } from "react-router-dom";
import { USER_API_END_POINT } from "../utils/constants";
import { AlertDialogBox } from "../components/AlertDialogBox";
import useLogout from "../hooks/useLogout";

const Profile = () => {
  const { user } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const logoutHandler = useLogout();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto bg-slate-900/70 border border-slate-800 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-10 space-y-6">
        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          {/* Back Button */}
          <Link
            to="/map"
            className="absolute -top-3 -left-3 bg-slate-900/80 backdrop-blur border border-slate-700 p-2 rounded-full hover:bg-indigo-600/30 transition"
          >
            <ArrowLeft size={18} className="text-indigo-400" />
          </Link>

          {/* Logout Button */}
          <button
            onClick={logoutHandler}
            className="absolute -top-3 -right-3 bg-slate-900/80 backdrop-blur border border-slate-700 p-2 rounded-full hover:bg-red-600/30 transition cursor-pointer"
          >
            <LogOut size={18} className="text-red-400" />
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 ring-2 ring-indigo-500">
              <AvatarImage
                src={user?.profilePhoto || profilePhoto}
                alt="profile"
                className="object-cover"
              />
            </Avatar>
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-3xl font-bold text-white">
                {user?.fullname}
              </h1>
              <p className="text-slate-400">{user?.role?.toUpperCase()}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 border border-indigo-500 text-indigo-400 hover:bg-indigo-600/30 hover:text-white transition-all rounded-xl px-4 py-2 shadow-md"
            >
              <Pen className="h-4 w-4" /> Edit
            </Button>
            <AlertDialogBox/>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl shadow-inner">
            <Mail className="text-indigo-400 h-5 w-5" />
            <span className="text-white">{user?.email || "Email"}</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl shadow-inner">
            <Phone className="text-indigo-400 h-5 w-5" />
            <span className="text-white">{user?.phoneNumber || "Phone"}</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl shadow-inner">
            <MapPin className="text-indigo-400 h-5 w-5" />
            <span className="text-white">{user?.address || "Address"}</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl shadow-inner">
            <IdCard className="text-indigo-400 h-5 w-5" />
            <span className="text-white">{user?.id || "Id"}</span>
          </div>
          {user?.role === "student" && (
            <>
              <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl shadow-inner">
                <GraduationCap className="text-indigo-400 h-5 w-5" />
                <span className="text-white">
                  {user?.semester || "Semester"}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl shadow-inner">
                <Calendar className="text-indigo-400 h-5 w-5" />
                <span className="text-white">{user?.session || "Session"}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
