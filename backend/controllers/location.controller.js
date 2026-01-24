import axios from "axios";
import { createError } from "../middlewares/common/errorHandler.js";
import Location from "../models/location.model.js";
import { getIO } from "../SocketIO/socket.js";
import Route from "../models/route.model.js";
import User from "../models/user.model.js";
import { sendEmail } from "../middlewares/nodeMailer/nodeMailer.js";

export async function getLocation(req, res, next) {
  try {
    const locations = await Location.find().populate("sender", "role");
    res.status(200).json({
      success: true,
      locations,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateLocation(req, res, next) {
  try {
    let { lat, lng, color } = req.body;

    lat = Number(lat);
    lng = Number(lng);
    const sender = req.id;

    if(!color) color = "#3b82f6";

    if (!lat || !lng || !sender) {
      throw createError("Something went wrong", 400);
    }
    let location = await Location.findOne({ sender });
    if (!location) {
      location = await Location.create({
        locations: [[lat, lng]],
        sender,
        color,
      });
    } else {
      location.locations.push([lat, lng]);
      await location.save();
    }
    location = await location.populate("sender", "role");

    const io = getIO();
    io.emit("receive_location", location);

    res.status(200).json({ location, success: true });
  } catch (error) {
    next(error);
  }
}

export async function sendLocationMail(req, res, next) {
  try {
    const { lat, lng, routeId } = req.body;

    if (!lat || !lng || !routeId) {
      throw createError("Something went wrong.", 400);
    }

    const route = await Route.findById(routeId);

    if (!route) {
      throw createError("No route found.", 400);
    }

    //Call Nominatim Reverse API
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`;

    const geoRes = await axios.get(url, {
      headers: {
        "Accept-Language": "en",
        "User-Agent": "BGC-Bus-Tracking-System",
      },
    });

    const address = geoRes.data?.display_name || "Address not found";
    const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
    const subject = "Bus Current Location";

    const text = `The bus of Route ${route?.no} is now at ${address}. \n View on map:${mapLink}`;

    const users = await User.find({
      route: route.no,
    }).select("email");

    for (const u of users) {
      await sendEmail(u.email, subject, text);
    }

    res.status(200).json({
      success: true,
      message: "Location email sent successfully",
      address,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}
