import React, { useState } from "react";
import Navbar from "../../components/Admin/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import useGetUserList from "../../hooks/useGetUserList";
import { useDispatch, useSelector } from "react-redux";
import { DialogTrigger } from "@radix-ui/react-dialog";
import axios from "axios";
import { ADMIN_API_END_POINT } from "../../utils/constants";
import { removeUser } from "../../redux/userListSlice";
import { toast } from "sonner";
import photo from "/user-profile-photo.jpg";

const Users = () => {
  useGetUserList();
  const { users } = useSelector((store) => store.userList);
  const dispatch = useDispatch();

  const handleReject = async (applicationId) => {
    try {
      const res = await axios.post(
        `${ADMIN_API_END_POINT}/removeuser`,
        { userId: applicationId },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(removeUser(applicationId));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="p-1 md:p-10">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">Users</h1>

        <div className="bg-white rounded-md  md:rounded-xl shadow-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>ID Photo</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user?._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={user?.profilePhoto || photo}
                        alt="profile"
                        className="ring ring-indigo-700 min-h-10 min-w-10 h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border"
                      />
                      <span className="font-base">{user?.fullname}</span>
                    </div>
                  </TableCell>

                  <TableCell>{user?.email}</TableCell>
                  <TableCell>{user?.phoneNumber}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user?.role?.toLowerCase() === "driver"
                          ? "border-indigo-500 text-indigo-600"
                          : "border-emerald-500 text-emerald-600"
                      }
                    >
                      {user?.role?.toUpperCase()}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs text-slate-500">
                    {user?.id}
                  </TableCell>

                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <img
                          src={user?.idPhoto || photo}
                          alt="ID"
                          className="min-h-16 min-w-16 md:h-20 md:w-20 rounded-lg object-cover border cursor-pointer hover:scale-105 transition"
                        />
                      </DialogTrigger>

                      <DialogContent className="mx-w-90 mx-h-90 p-4 ">
                        <div className="flex flex-col items-center gap-3">
                          <h3 className="text-lg font-semibold">ID Preview</h3>
                          <img
                            src={user?.idPhoto || photo}
                            alt="ID Large"
                            className="max-w-full rounded-xl object-contain border"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>

                  <TableCell className="max-w-[180px] truncate">
                    {user?.address}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="border-red-500 text-red-600 hover:bg-red-100 flex items-center gap-1 rounded-full cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove User?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove{" "}
                              <b>{user?.fullname}</b>? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleReject(user?._id)}
                            >
                              Yes, Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Users;
