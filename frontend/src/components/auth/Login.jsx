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
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2, MapPin, ArrowRight, LogIn, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "", role: "" });
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.role) return toast.error("Please select a role");

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/map");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
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
        className="relative z-10 w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-6"
      >
        {/* header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
            <LogIn className="text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-slate-400 mt-1">
            Login to start tracking in real time
          </p>
        </div>

        {/* email */}
        <div className="space-y-2">
          <Label className="text-slate-300">Email</Label>
          <Input
            type="email"
            value={input.email}
            name="email"
            onChange={changeEventHandler}
            placeholder="minhaj@mail.com"
            required
            className="bg-slate-950 border-slate-800 focus:border-indigo-500"
          />
        </div>

        {/* password */}
        <div className="space-y-2">
          <Label className="text-slate-300">Password</Label>
          <Input
            type="password"
            value={input.password}
            name="password"
            onChange={changeEventHandler}
            placeholder="••••••••"
            required
            className="bg-slate-950 border-slate-800 focus:border-indigo-500"
          />
        </div>

        {/* role */}
        <RadioGroup className="flex justify-center gap-6 pt-2">
          {["student", "driver"].map((role) => (
            <Label
              key={role}
              htmlFor={role}
              className={`cursor-pointer px-4 py-2 rounded-xl border transition-all ${
                input.role === role
                  ? "border-indigo-500 bg-indigo-500/20"
                  : "border-slate-700 hover:border-slate-500"
              }`}
            >
              <Input
                type="radio"
                id={role}
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

        {/* button */}
        <motion.div whileTap={{ scale: 0.96 }}>
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
                Login <ChevronRight size={20} />
              </>
            )}
          </Button>
        </motion.div>

        {/* footer */}
        <p className="text-center text-sm text-slate-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
