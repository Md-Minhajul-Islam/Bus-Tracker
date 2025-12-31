import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    locations: {
      type: [[Number]],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Location", locationSchema);
