import React from "react";
import {useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarImage } from "./ui/avatar";
import { LogOut, User2 } from "lucide-react";
import { Link} from "react-router-dom";
import { USER_API_END_POINT } from "../utils/constants";
import profilePhoto from "/user-profile-photo.jpg";
import useLogout from "../hooks/useLogout";

const ProfileCard = () => {
  const { user } = useSelector((store) => store.auth);
  const logoutHandler = useLogout();


  return (
    <div className="absolute top-4 right-4 md:right-10 z-1000">
      <Popover>
        <PopoverTrigger asChild>
          <Avatar className="md:w-10 md:h-10 cursor-pointer ring-2 ring-indigo-400 hover:ring-[#6A38C2] transition">
            <AvatarImage
              src={user?.profilePhoto || profilePhoto}
              alt="profile"
              className="object-cover"
            />
          </Avatar>
        </PopoverTrigger>

        <PopoverContent className="w-50 md:w-60 z-1000 mr-1 text-xs md:text-base">
          <div>
            <div className="flex items-center gap-3 border-b pb-3">
              <Avatar>
                <AvatarImage
                  src={user?.profilePhoto || profilePhoto}
                  className="object-cover  "
                />
              </Avatar>
              <div>
                <h4 className="font-semibold">{user?.fullname}</h4>
              </div>
            </div>

            <div className="flex flex-col mt-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-[#6A38C2]"
              >
                <User2 />
                <span>View Profile</span>
              </Link>

              <button
                onClick={logoutHandler}
                className="flex items-center gap-2 mt-3 text-gray-700 hover:text-red-500"
              >
                <LogOut />
                Logout
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProfileCard;
