import React from "react";
import Navbar from "../../components/Admin/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, MapPin } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Welcome, Admin</h1>
          <p className="text-slate-600 mt-1">
            Here's a quick overview of the system.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white shadow-md rounded-xl hover:shadow-lg transition">
            <CardContent className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-indigo-500" />
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  User Applications
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  View and manage all pending applications
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md rounded-xl hover:shadow-lg transition">
            <CardContent className="flex items-center gap-4">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Users</h3>
                <p className="text-sm text-slate-500 mt-1">
                  View and manage all registered users
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md rounded-xl hover:shadow-lg transition">
            <CardContent className="flex items-center gap-4">
              <MapPin className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Live Tracking
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Monitor real-time locations of all users
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Recent Activity
          </h2>
          <p className="text-slate-500">
            Later we will add tables, charts, or notifications here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
