import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../middlewares/common/errorHandler.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import UserApplication from "../models/userapplication.model.js";
import Location from "../models/location.model.js";

export async function signup(req, res, next) {
  try {
    let { fullname, email, phoneNumber, password, role } = req.body;
    fullname = fullname?.trim();
    email = email?.trim();
    phoneNumber = phoneNumber?.trim();
    password = password?.trim();
    role = role?.trim();

    if (
      !fullname ||
      !email ||
      !phoneNumber ||
      !password ||
      !role ||
      !req.file ||
      (role !== "student" && role !== "driver")
    ) {
      throw createError("Something is missing.", 400);
    }

    const user = await User.findOne({ email });
    if (user) {
      throw createError("User already exist with this email.", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
      folder: process.env.FOLDER_NAME,
    });

    await UserApplication.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      idPhoto: cloudResponse.secure_url,
      idPhotoCloudId: cloudResponse.public_id,
    });

    res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    let { email, password, role } = req.body;
    email = email?.trim();
    password = password?.trim();
    role = role?.trim();

    if (!email || !password || !role) {
      throw createError("Something is missing.", 400);
    }
    let user = await User.findOne({ email });
    if (!user) {
      throw createError("Incorrect email or password.", 400);
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError("Incorrect email or password.", 400);
    }

    if (role !== user.role) {
      throw createError("Account doesn't exist with current role.", 400);
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profilePhoto: user.profilePhoto,
      id: user.id,
      address: user.address,
    };

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // must be true on HTTPS
        sameSite: "none", // allow cross-origin
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const sender = req.id;

    await Location.deleteOne({ sender });

    res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    let {
      fullname,
      email,
      phoneNumber,
      id,
      address,
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    fullname = fullname?.trim();
    email = email?.trim();
    phoneNumber = phoneNumber?.trim();
    id = id?.trim();
    address = address?.trim();
    currentPassword = currentPassword?.trim();
    newPassword = newPassword?.trim();
    confirmPassword = confirmPassword?.trim();

    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      throw createError("User not found.", 404);
    }
    if (fullname) user.fullname = fullname;
    if (email && email !== user.email) {
      const findUser = await User.findOne({ email });
      if (findUser) {
        throw createError("User already exist with this email.", 400);
      }
      user.email = email;
    }
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (id) user.id = id;
    if (address) user.address = address;

    if (req.file) {
      const file = req.file;

      if (user.profilePhotoCloudId) {
        await cloudinary.uploader.destroy(user.profilePhotoCloudId);
      }

      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: process.env.FOLDER_NAME,
      });
      user.profilePhotoCloudId = cloudResponse.public_id;
      user.profilePhoto = cloudResponse.secure_url;
    }
    if (currentPassword && newPassword && newPassword === confirmPassword) {
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordMatch) {
        throw createError("Incorrect email or password.", 400);
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      address: user.address,
      id: user.id,
      profilePhoto: user.profilePhoto,
    };

    res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function removeUser(req, res, next) {
  try {
    const userId = req.id;
    const { password } = req.body;
    if (!password) {
      throw createError("Enter Password", 400);
    }
    let user = await User.findById(userId);

    if (!user) {
      throw createError("Oops! Something went wrong");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError("Oops! Something went wrong");
    }

    if (user.profilePhotoCloudId) {
      await cloudinary.uploader.destroy(user.profilePhotoCloudId);
    }

    if (user.idPhotoCloudId) {
      await cloudinary.uploader.destroy(user.idPhotoCloudId);
    }

    user = await User.findByIdAndDelete(userId);
    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
