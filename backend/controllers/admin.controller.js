import { createError } from "../middlewares/common/errorHandler.js";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import UserApplication from "../models/userapplication.model.js";
import Route from "../models/route.model.js";
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

// Route
export async function getRoutes(req, res, next) {
  try {
    const routes = await Route.find();

    res.status(200).json({
      success: true,
      data: routes,
    });
  } catch (error) {
    next(error);
  }
}

export async function createRoute(req, res, next) {
  try {
    let { no, route, color, routeLocation, stopLocation } = req.body;
    no = no?.trim();
    route = route?.trim();
    color = color?.trim();

    if (no === undefined || no === null || isNaN(Number(no))) {
      throw createError("Route number must be a valid number", 400);
    }
    no = Number(no);

    const existsRoute = await Route.findOne({ no });
    if (existsRoute) {
      throw createError("Route number already  exists.", 400);
    }

    if (!route || typeof route !== "string") {
      throw createError("Route must be a comma-separated string", 400);
    }

    const routeArray = route
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean); // removes empty strings

    if (!routeArray || routeArray?.length < 2) {
      throw createError("Route must have atleast two points.", 400);
    }
    if (!color || typeof color !== "string") {
      throw createError("Color is required.", 400);
    }

    // Check if routeLocation is an array containing a JSON string

    const isValidArray = (arr) =>
      Array.isArray(arr) &&
      arr.every(
        (inner) =>
          Array.isArray(inner) &&
          inner.length === 2 &&
          inner.every(Number.isFinite),
      );

    if (routeLocation && typeof routeLocation === "string") {
      routeLocation = JSON.parse(routeLocation);

      if (
        Array.isArray(routeLocation) &&
        routeLocation.length > 0 &&
        typeof routeLocation[0] === "string"
      ) {
        routeLocation = JSON.parse(routeLocation[0]);
      }
      if (!isValidArray(routeLocation)) {
        throw createError("Invalid coordinates format", 400);
      }
    }
    if (stopLocation && typeof stopLocation === "string") {
      stopLocation = JSON.parse(stopLocation);

      if (
        Array.isArray(stopLocation) &&
        stopLocation.length > 0 &&
        typeof stopLocation[0] === "string"
      ) {
        stopLocation = JSON.parse(stopLocation[0]);
      }
      if (!isValidArray(stopLocation)) {
        throw createError("Invalid coordinates format", 400);
      }
    }

    const newRoute = await Route.create({
      no,
      route: routeArray,
      color,
      routeLocation,
      stopLocation,
    });

    res.status(201).json({
      success: true,
      message: "Route created successfully",
      data: newRoute,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateRoute(req, res, next) {
  try {
    let { id, no, route, color, routeLocation, stopLocation } = req.body;

    const existingRoute = await Route.findById(id);
    if (!existingRoute) {
      throw createError("Route not found", 404);
    }

    if (no !== undefined) {
      if (isNaN(Number(no))) {
        throw createError("Route number must be a valid number", 400);
      }

      const numberExists = await Route.findOne({
        no: Number(no),
        _id: { $ne: id },
      });

      if (numberExists) {
        throw createError("Route number already exists", 409);
      }

      existingRoute.no = Number(no);
    }

    if (route !== undefined) {
      if (typeof route !== "string") {
        throw createError("Route must be a comma-separated string", 400);
      }

      const routeArray = route
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean);

      if (routeArray.length < 2) {
        throw createError("Route must have at least two points.", 400);
      }

      existingRoute.route = routeArray;
    }

    if (color !== undefined) {
      color = color?.trim();
      existingRoute.color = color;
    }

    // Check if routeLocation is an array containing a JSON string

    const isValidArray = (arr) =>
      Array.isArray(arr) &&
      arr.every(
        (inner) =>
          Array.isArray(inner) &&
          inner.length === 2 &&
          inner.every(Number.isFinite),
      );

    if (routeLocation && typeof routeLocation === "string") {
      routeLocation = JSON.parse(routeLocation);

      if (
        Array.isArray(routeLocation) &&
        routeLocation.length > 0 &&
        typeof routeLocation[0] === "string"
      ) {
        routeLocation = JSON.parse(routeLocation[0]);
      }
      if (!isValidArray(routeLocation)) {
        throw createError("Invalid coordinates format", 400);
      }

      existingRoute.routeLocation = routeLocation;
    }
    if (stopLocation && typeof stopLocation === "string") {
      stopLocation = JSON.parse(stopLocation);

      if (
        Array.isArray(stopLocation) &&
        stopLocation.length > 0 &&
        typeof stopLocation[0] === "string"
      ) {
        stopLocation = JSON.parse(stopLocation[0]);
      }
      if (!isValidArray(stopLocation)) {
        throw createError("Invalid coordinates format", 400);
      }
      existingRoute.stopLocation = stopLocation;
    }

    await existingRoute.save();

    res.status(200).json({
      success: true,
      message: "Route updated successfully",
      data: existingRoute,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
}

export async function removeRoute(req, res, next) {
  try {
    const { id } = req.body;

    const deletedRoute = await Route.findByIdAndDelete(id);

    if (!deletedRoute) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Route deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
