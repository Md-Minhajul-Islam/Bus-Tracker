import mongoose from "mongoose";

const userApplicationSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "driver"],
      required: true,
    },
    idPhoto: {
      type: String,
      required: true,
    },
    idPhotoCloudId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("UserApplication", userApplicationSchema);
