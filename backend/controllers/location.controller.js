import { createError } from "../middlewares/common/errorHandler.js";
import Location from "../models/location.model.js";
import { getIO } from "../SocketIO/socket.js";

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
    let { lat, lng } = req.body;

    lat = Number(lat);
    lng = Number(lng);
    const sender = req.id;

    if (!lat || !lng || !sender) {
      throw createError("Something went wrong", 400);
    }
    let location = await Location.findOne({ sender });
    if (!location) {
      location = await Location.create({
        locations: [[lat, lng]],
        sender,
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

