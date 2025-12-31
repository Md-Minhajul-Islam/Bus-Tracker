import React from "react";
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
import { Check, X } from "lucide-react";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useGetUserApplication from "../../hooks/useGetUserApplication";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ADMIN_API_END_POINT } from "../../utils/constants";
import { toast } from "sonner";
import { removeUserApplication } from "@/redux/userApplicationSlice";

const UserApplications = () => {
  useGetUserApplication();
  const dispatch = useDispatch();

  const handleAccept = async (application) => {
    try {
      const res = await axios.post(
        `${ADMIN_API_END_POINT}/registeruser`,
        application,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(removeUserApplication(application?._id));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      const res = await axios.post(
        `${ADMIN_API_END_POINT}/removeapplication`,
        { applicationId },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(removeUserApplication(applicationId));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const { applications } = useSelector((store) => store.userApplication);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="p-2 md:p-10">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
            User Applications
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Review and approve new user requests
          </p>
        </div>

        <div className="bg-white rounded-md md:rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100">
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>ID</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {applications?.map((app) => (
                <TableRow key={app.id} className="hover:bg-slate-50 transition">
                  <TableCell className="font-medium">{app?.fullname}</TableCell>
                  <TableCell>{app?.email}</TableCell>
                  <TableCell>{app?.phoneNumber}</TableCell>
                  <TableCell>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-600">
                      {app?.role}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <img
                          src={app?.idPhoto}
                          alt="ID"
                          className="min-h-16 min-w-16 md:h-20 md:w-20 rounded-lg object-cover border cursor-pointer hover:scale-105 transition"
                        />
                      </DialogTrigger>

                      <DialogContent className="max-w-md p-4">
                        <div className="flex flex-col items-center gap-3">
                          <h3 className="text-lg font-semibold">ID Preview</h3>
                          <img
                            src={app?.idPhoto}
                            alt="ID Large"
                            className="w-full rounded-xl object-contain border"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500  text-green-600 hover:bg-green-50 flex items-center gap-1 rounded-xl"
                          >
                            <Check size={14} /> Accept
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Accept User?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to approve{" "}
                              <b>{app?.fullname}</b>? This action will allow the
                              user to access the system.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleAccept(app)}
                            >
                              Yes, Accept
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50 flex items-center gap-1 rounded-xl"
                          >
                            <X size={14} /> Reject
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject User?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject{" "}
                              <b>{app?.fullname}</b>? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleReject(app?._id)}
                            >
                              Yes, Reject
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

export default UserApplications;
