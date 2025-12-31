import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constants";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2, ShieldCheck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${ADMIN_API_END_POINT}/login`, input, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.admin));
        toast.success(res.data.message);
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-100 px-4">
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #6366f1, transparent 40%), radial-gradient(circle at 80% 80%, #22d3ee, transparent 40%)",
        }}
      />

      <motion.form
        onSubmit={submitHandler}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-lg p-8 space-y-6"
      >
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
            <ShieldCheck size={20} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Secure access for administrators
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700">Email</Label>
          <Input
            type="email"
            value={input.email}
            name="email"
            onChange={changeEventHandler}
            placeholder="admin@domain.com"
            required
            className="bg-slate-50 border-slate-300 focus:border-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700">Password</Label>
          <Input
            type="password"
            value={input.password}
            name="password"
            onChange={changeEventHandler}
            placeholder="••••••••"
            required
            className="bg-slate-50 border-slate-300 focus:border-indigo-500"
          />
        </div>

        <motion.div whileTap={{ scale: 0.96 }}>
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-4 text-base flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
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

        <p className="text-center text-sm text-slate-500">
          Only admins can access this portal
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
