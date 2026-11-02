import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User is required"],
    },
    otpHash: {
      type: String,
      required: [true, "otp is required"],
    },
  },
  {
    timestamps: true,
  },
);

const otpModel = mongoose.model("Otp", otpSchema);

export default otpModel;
