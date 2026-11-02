import mongoose from "mongoose";

export const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User is required"],
    },
    refreshTokenHash: {
      type: String,
      required: [true, " RefreshToken Hash is required"],
    },
    ip: {
      type: String,
      required: [true, "IP address is required"],
    },
    userAgent: {
      type: String, 
      required: [true, "User Agent is required"],
    },
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: false,
  },
);

const sessionModel = mongoose.model("sessions", sessionSchema);

export default sessionModel;
