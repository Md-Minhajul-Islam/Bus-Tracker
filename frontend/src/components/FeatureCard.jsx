import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring" }}>
      <Card
        className="bg-slate-900/70 border-slate-800 rounded-2xl shadow-xl"
      >
        <CardContent className="p-6">
          <div className="flex justify-center">
            <Icon className="h-8 w-8 text-indigo-400" />
          </div>
          <div className="text-center">
            <h3 className="text-white mt-4 font-semibold text-lg">{title}</h3>
            <p className="mt-2 text-sm text-slate-400">{desc}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
