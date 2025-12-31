import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Users, FileText, Menu, X, ShieldCheck } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";
import { ADMIN_API_END_POINT } from "../../utils/constants";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${ADMIN_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (res?.data?.success) {
        dispatch(setUser(null));
        navigate("/admin/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div
        onClick={() => navigate("/admin/dashboard")}
        className="
    flex items-center gap-2 cursor-pointer
    text-indigo-600 font-bold text-lg
    hover:text-indigo-700 transition
  "
      >
        <ShieldCheck className="h-6 w-6" />
        <span>Admin Portal</span>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <Link
          to="/admin/userapplications"
          className="flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-indigo-50 text-slate-700 font-medium"
        >
          <FileText size={16} /> User Applications
        </Link>

        <Link
          to="/admin/users"
          className="flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-indigo-50 text-slate-700 font-medium"
        >
          <Users size={16} /> Users
        </Link>

        <Button
          variant="ghost"
          className="flex items-center gap-1 text-red-500 hover:bg-red-50"
          onClick={logoutHandler}
        >
          <LogOut size={16} /> Logout
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        className="md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full right-0 w-56 bg-white shadow-lg rounded-b-xl flex flex-col py-2 md:hidden">
          <Link
            to="/admin/userapplications"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 hover:bg-indigo-50 text-slate-700 font-medium rounded-lg transition"
          >
            <FileText size={16} /> User Applications
          </Link>

          <Link
            to="/admin/users"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 hover:bg-indigo-50 text-slate-700 font-medium rounded-lg transition"
          >
            <Users size={16} /> Users
          </Link>

          <Button
            variant="ghost"
            onClick={logoutHandler}
            className="flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 font-medium rounded-lg transition mt-1"
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
