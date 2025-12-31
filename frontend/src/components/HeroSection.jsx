import { motion } from "framer-motion";
import { ChevronRight, MapPin, MessageCircle, Navigation, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import FeatureCard from "./FeatureCard";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
      {/* Background animation */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #6366f1, transparent 40%), radial-gradient(circle at 80% 80%, #22d3ee, transparent 40%)",
        }}
      />

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Real‑Time <span className="text-indigo-400">Location</span>
            <br /> Tracking System
          </h1>
          <p className="mt-6 text-slate-300 text-lg max-w-xl">
            Track buses, routes, and live movement with precision. Built with
            modern web technologies, real‑time updates, and interactive maps.
          </p>

          <div className="mt-8 flex gap-4">
            <Button
              onClick={() => navigate("/login")}
              className="
    relative overflow-hidden
    rounded-2xl px-6 py-6 text-base shadow-lg
    bg-indigo-800 text-white
    group
  "
            >
              {/* Animated background */}
              <span
                className="
      absolute inset-0
      bg-white
      transform scale-0 origin-bottom-left
      transition-transform duration-500 ease-out
      group-hover:scale-100 
      z-0
      rounded-2xl
    "
              />

              {/* Button content */}
              <span className="relative z-1000 flex items-center gap-1 group-hover:text-indigo-600 transition-colors duration-300">
                Start Tracking
                <ChevronRight size={20} />
              </span>
            </Button>

            {/* <Button
              variant="outline"
              className="rounded-2xl px-6 py-6 text-base border-slate-700"
            >
              View Demo
            </Button> */}
          </div>
        </motion.div>

        {/* Right Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FeatureCard
              icon={MapPin}
              title="Live GPS"
              desc="Accurate real‑time location updates."
            />
            <FeatureCard
              icon={Navigation}
              title="Smart Routes"
              desc="Optimized and visualized paths."
            />
            <FeatureCard
              icon={Radar}
              title="Monitoring"
              desc="Track multiple vehicles at once."
            />
            <FeatureCard
              icon={MessageCircle}
              title="Live Chat"
              desc="Stay connected with the community."
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
