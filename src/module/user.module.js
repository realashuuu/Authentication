import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username must be required"],
    unique: [true, "Username must be unique"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    unique: [true, "password must be unique"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email must be required"],
  },
  verified: {
    type: Boolean,
    default: false,
  }, 
});

const userModel = mongoose.model("Users", userSchema);

export default userModel;
