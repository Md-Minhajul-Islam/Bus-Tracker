import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
    profilePhoto: {
      type: String,
    },
    profilePhotoCloudId: {
      type: String,
    },
    idPhoto: {
      type: String,
    },
    idPhotoCloudId: {
      type: String,
    },
    id: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
