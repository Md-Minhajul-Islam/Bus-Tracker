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
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import useDeleteProfile from "../hooks/useDeleteProfile";

export function AlertDialogBox() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");

  const changeEventHandler = (e) => {
    setPassword(e.target.value);
  };
  const deleteHandler = useDeleteProfile({ password });

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);

        if (!isOpen) {
          setPassword(null);
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <Button className="flex items-center gap-2 border border-red-500 text-red-400 hover:bg-red-600/30 hover:text-white transition-all rounded-xl px-4 py-2 shadow-md">
          <Trash className="h-4 w-4" /> Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-slate-900 border border-slate-800 text-white rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">
            Delete Profile?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            This action cannot be undone. Your profile and all related data will
            be permanently deleted.
            <div className="flex flex-col gap-3 mt-2">
              <Label className="text-slate-200">Enter Password</Label>
              <Input
                onChange={changeEventHandler}
                type="password"
                name="Password"
                value={password}
              ></Input>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-700">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={deleteHandler}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
