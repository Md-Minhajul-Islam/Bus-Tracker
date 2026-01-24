import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    no: {
      type: Number,
      required: true,
      unique: true,
    },
    route: {
      type: [String],
      required: true,
    },
    routeLocation: {
      type: [[Number]],
    },
    stopLocation: {
      type: [[Number]],
    },
    color: {
      type: String,
      required: true,
      default: "#3b82f6",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Route", routeSchema);
