import { createError } from "../middlewares/common/errorHandler.js";
import Message from "../models/message.model.js";
import { getIO } from "../SocketIO/socket.js";

export const sendMessage = async (req, res, next) => {
  try {
    let { text } = req.body;
    text = text?.trim();
    const sender = req.id;

    if (!text || !sender) {
      throw createError("Something went wrong");
    }

    let message = await Message.create({
      text,
      sender,
    });

    message = await message.populate("sender", "fullname email profilePhoto");

    const io = getIO();
    io.emit("receive_message", message);

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessage = async (req, res, next) => {
  try {
    const messages = await Message.find().populate(
      "sender",
      "fullname profilePhoto"
    );
    res.status(200).json({
      messages,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
