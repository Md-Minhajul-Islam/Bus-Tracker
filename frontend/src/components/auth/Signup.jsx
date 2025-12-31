import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constants";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2, UserPlus, ArrowRight, Upload, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });

  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {

    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.role) return toast.error("Please select a role");
    if (input.role == 'student' && !input.file) return toast.error("Please upload your student ID")
    else if (!input.file) return toast.error("Please upload you NID");

    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/signup`, formData, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-center px-4">
      {/* animated background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #6366f1, transparent 40%), radial-gradient(circle at 80% 80%, #22d3ee, transparent 40%)",
        }}
      />

      {/* card */}
      <motion.form
        onSubmit={submitHandler}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg bg-slate-900/70 border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-6"
      >
        {/* header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
            <UserPlus className="text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-slate-400 mt-1">
            Join and start tracking in real time
          </p>
        </div>

        {/* inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Full Name</Label>
            <Input
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              placeholder="Minhaj"
              required
              className="bg-slate-950 border-slate-800 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="min@mail.com"
              required
              className="bg-slate-950 border-slate-800 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Phone Number</Label>
            <Input
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="01XXXXXXXXX"
              required
              className="bg-slate-950 border-slate-800 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Password</Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="••••••••"
              required
              className="bg-slate-950 border-slate-800 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* role + file */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
          <RadioGroup className="flex gap-4">
            {["student", "driver"].map((role) => (
              <Label
                key={role}
                className={`cursor-pointer px-4 py-2 rounded-xl border transition-all ${
                  input.role === role
                    ? "border-indigo-500 bg-indigo-500/20"
                    : "border-slate-700 hover:border-slate-500"
                }`}
              >
                <Input
                  type="radio"
                  name="role"
                  value={role}
                  checked={input.role === role}
                  onChange={changeEventHandler}
                  className="hidden"
                />
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Label>
            ))}
          </RadioGroup>

          <Label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
            <Upload size={16} />{" "}
            {input?.file?.name ? input.file.name.slice(0, 10) : input?.role === 'driver' ? "Upload NID" : "Upload ID"}
            <Input
              type="file"
              accept="image/*"
              onChange={changeFileHandler}
              className="hidden"
            />
          </Label>
        </div>

        {/* button */}
        <motion.div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-6 text-base flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              <>
                Sign Up <ChevronRight size={20} />
              </>
            )}
          </Button>
        </motion.div>

        {/* footer */}
        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Signup;
