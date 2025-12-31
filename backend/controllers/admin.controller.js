import { createError } from "../middlewares/common/errorHandler.js";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import UserApplication from "../models/userapplication.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";

export async function signup(req, res, next) {
  try {
    let { email, password } = req.body;
    email = email?.trim();
    password = password?.trim();

    if (!email || !password) {
      throw createError("Something is missing.", 400);
    }

    const admin = await Admin.findOne({ email });
    if (admin) {
      throw createError("Admin already exist with this email.", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashedPassword,
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
    let { email, password } = req.body;
    email = email?.trim();
    password = password?.trim();

    if (!email || !password) {
      throw createError("Something is missing.", 400);
    }
    let admin = await Admin.findOne({ email });
    if (!admin) {
      throw createError("Incorrect email or password.", 400);
    }
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      throw createError("Incorrect email or password.", 400);
    }

    const tokenData = {
      adminId: admin._id,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    admin = {
      _id: admin._id,
      email: admin.email,
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
        message: `Welcome back to the admin panel`,
        admin,
        success: true,
      });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function getApplication(req, res, next) {
  try {
    const applications = await UserApplication.find();
    res.status(200).json({
      applications,
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUser(req, res, next) {
  try {
    const users = await User.find();
    res.status(200).json({
      users,
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

export async function registerUser(req, res, next) {
  try {
    let {
      _id,
      fullname,
      email,
      phoneNumber,
      password,
      role,
      idPhoto,
      idPhotoCloudId,
    } = req.body;
    fullname = fullname?.trim();
    email = email?.trim();
    phoneNumber = phoneNumber?.trim();
    password = password?.trim();
    role = role?.trim();

    if (
      !_id ||
      !fullname ||
      !email ||
      !phoneNumber ||
      !password ||
      !role ||
      (role !== "student" && role !== "driver") ||
      !idPhoto ||
      !idPhotoCloudId
    ) {
      throw createError("Something is missing.", 400);
    }

    const user = await User.findOne({ email });
    if (user) {
      throw createError("User already exist with this email.", 400);
    }

    await User.create({
      fullname,
      email,
      phoneNumber,
      password,
      role,
      idPhoto,
      idPhotoCloudId,
    });

    req.body.applicationId = _id;
    req.body.registerUser = true;

    next();
  } catch (err) {
    next(err);
  }
}

export async function removeApplication(req, res, next) {
  try {
    const { applicationId } = req.body;

    if (!applicationId) {
      throw createError("Something went wrong");
    }

    let app = await UserApplication.findById(applicationId);

    if (!app) {
      throw createError("Something went wrong");
    }

    if (app.idPhotoCloudId && !req.body.registerUser) {
      await cloudinary.uploader.destroy(app.idPhotoCloudId);
    }

    app = await UserApplication.findByIdAndDelete(applicationId);

    if (req.body.registerUser) {
      res.status(201).json({
        message: "Account created successfully.",
        success: true,
      });
    }
    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function removeUser(req, res, next) {
  try {
    const { userId } = req.body;
    if (!userId) {
      throw createError("Something went wrong", 400);
    }
    let user = await User.findById(userId);

    if (!user) {
      throw createError("No user found");
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
