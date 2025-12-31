import { Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Profile from "./pages/Profile";
import AdminLogin from "./components/Admin/auth/Login";
import Dashboard from "./pages/Admin/Dashboard";
import UserApplications from "./pages/Admin/UserApplications";
import Users from "./pages/Admin/Users";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/map" element={<Map />} />
        <Route path="/profile" element={<Profile />} />

        {/* ADMIN  */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/userapplications" element={<UserApplications />} />
        <Route path="/admin/users" element={<Users/>} />
      </Routes>
    </div>
  );
}

export default App;
