//THIS CODE IS FOR WITHOUT OTP BASED AUTHENTICATION

// import userModel from "../module/user.module.js";
// import crypto from "crypto";
// import jwt from "jsonwebtoken";
// import config from "../config/config.js";
// import cookieParser from "cookie-parser";
// import sessionModel from "../module/session.module.js";

// export async function register(req, res) {
//   const { username, password, email } = req.body;

//   const isAlreadyRegisterd = await userModel.findOne({
//     $or: [{ username }, { email }],
//   });

//   if (isAlreadyRegisterd) {
//     res.status(409).json({
//       message: "Username or email is already exist",
//     });
//   }

//   const hashedPassword = crypto
//     .createHash("sha256")
//     .update(password)
//     .digest("hex");

//   const user = await userModel.create({
//     username,
//     password: hashedPassword,
//     email,
//   });

//   //first we created only one token for a user now for protection and secuing the user data we are creating accessToken which is the main token and efreshtoken which is for creating and getting the accessToken and accesstoken will be stored in Memory and refreshtoken in Cookies

//   const refreshToken = jwt.sign(
//     {
//       id: user._id,
//     },
//     config.JWT_SECRET,
//     {
//       expiresIn: "7d",
//     },
//   );
//   //creating refresh token into hash to store in session
//   const refreshTokenHash = crypto
//     .createHash("sha256")
//     .update(refreshToken)
//     .digest("hex");

//   //this feature is being created for logout from devices, when revoke is true it there will me no acces token if revoke is false then only is store the refreshtoken and then can be access token generated for a user that is why the session is created for login and logout...
//   const session = await sessionModel.create({
//     user: user._id,
//     refreshTokenHash,
//     ip: req.ip,
//     userAgent: req.headers["user-agent"],
//   });

//   const accessToken = jwt.sign(
//     {
//       id: user._id,
//       sessionId: session._id,
//     },
//     config.JWT_SECRET,
//     {
//       expiresIn: "15m",
//     },
//   );

//   //store the refreshtoken into the cookie
//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "strict",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });
//   //User successfully create hone ke baad res.status(201).json({...}) frontend ko response bhejta hai, jisme message registration success batata hai, user username aur email bhejta hai, aur token future requests mein user ki authentication ke liye use hota hai.
//   res.status(201).json({
//     message: "User registered sucessfully",
//     user: {
//       username: user.username,
//       email: user.email,
//     },
//     accessToken,
//   });
// }

// export async function login(req, res) {
//   const { email, password } = req.body;

//   const user = await userModel.findOne({ email });
//   if (!user) {
//     return res.status(401).json({
//       message: "Invalid email or password",
//     });
//   }

//   const hashedPassword = crypto
//     .createHash("sha256")
//     .update(password)
//     .digest("hex");
//   const isPasswordValid = hashedPassword === user.password;
//   if (!isPasswordValid) {
//     return res.status(401).json({
//       message: "Invalid email or password",
//     });
//   }
//   const refreshToken = jwt.sign(
//     {
//       id: user._id,
//     },
//     config.JWT_SECRET,
//     {
//       expiresIn: "7d",
//     },
//   );

//   const refreshTokenHash = crypto
//     .createHash("sha256")
//     .update(refreshToken)
//     .digest("hex");

//   const session = await sessionModel.create({
//     user: user._id,
//     refreshTokenHash,
//     ip: req.ip,
//     userAgent: req.headers["user-agent"],
//   });

//   const accessToken = jwt.sign(
//     {
//       id: user._id,
//       sessionId: session._id,
//     },
//     config.JWT_SECRET,
//     {
//       expiresIn: "15m",
//     },
//   );
//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "strict",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });

//   res.status(200).json({
//     message: "Logged in successfully",
//     user: {
//       username: user.username,
//       email: user.email,
//     },
//     accessToken,
//   });
// }

// export async function getMe(req, res) {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({
//       message: "token not found",
//     });
//   }

//   const decoded = jwt.verify(token, config.JWT_SECRET);

//   const user = await userModel.findById(decoded.id);
//   res.status(200).json({
//     message: "User fetched successfully",
//     user: {
//       username: user.username,
//       email: user.email,
//     },
//   });
// }

// export async function refreshToken(req, res) {
//   //bringing refreshtoken from cookies
//   const refreshToken = req.cookies.refreshToken;
//   //if the refreshtoken not found
//   if (!refreshToken) {
//     return res.status(401).json({
//       message: "Refresh token not found",
//     });
//   }

//   const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

//   //for session
//   const refreshTokenHash = crypto
//     .createHash("sha256")
//     .update(refreshToken)
//     .digest("hex");

//   const session = await sessionModel.findOne({
//     refreshTokenHash,
//     revoked: false,
//   });
//   if (!session) {
//     res.status(401).json({
//       message: "Invalid refresh token",
//     });
//   }

//   //if found then create a new accesstoken
//   const accessToken = jwt.sign(
//     {
//       id: decoded.id,
//     },
//     config.JWT_SECRET,
//     {
//       expiresIn: "15m",
//     },
//   );

//   //if we created accesstoken after getting the refreshtoken then fo double safety we can or we should generate a new refreshtoken
//   const newrefreshToken = jwt.sign(
//     {
//       id: decoded.id,
//     },
//     config.JWT_SECRET,
//     {
//       expiresIn: "7d",
//     },
//   );

//   const newrefreshTokenHash = crypto
//     .createHash("sha256")
//     .update(newrefreshToken)
//     .digest("hex");
//   session.refreshTokenHash = newrefreshTokenHash;
//   await session.save();

//   res.cookie("refreshToken", newrefreshToken, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "strict",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });

//   res.status(200).json({
//     message: "Access token refresh sucessfully",
//     accessToken,
//   });
// }

// export async function logout(req, res) {
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     return res.status(401).json({
//       message: "Refresh Token not found",
//     });
//   }
//   //refresh token ko waps se hash me kro kyuki session me jo refresh token store kiye the wo hash me that isliye compare krne keliye hash me zrurat padegi
//   const refreshTokenHash = crypto
//     .createHash("sha256")
//     .update(refreshToken)
//     .digest("hex");

//   // Searches the database for an active, unrevoked session matching this hashed token.
//   const session = await sessionModel.findOne({
//     refreshTokenHash,
//     revoked: false,
//   });

//   if (!session) {
//     return res.status(401).json({
//       message: "invalid Refresh Token",
//     });
//   }

//   // Changes the session status in the system to "cancelled" so it can never be used again.
//   session.revoked = true;
//   await session.save();

//   res.clearCookie("refreshToken");

//   res.status(200).json({
//     message: " Logged Out Successfully",
//   });
// }

// export async function logoutAll(req, res) {
//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken) {
//     return res.status(401).json({
//       message: "Refresh Token not found",
//     });
//   }

//   const decoded = jwt.createHash("sha256").update(refreshToken).digest("hex");

//   await sessionModel.updateMany(
//     {
//       user: decoded.id,
//       revoked: false,
//     },
//     {
//       revoked: true,
//     },
//   );

//   res.clearCookie("refreshToken");

//   res.status(200).json({
//     message: "Login out from all devices successfully  ",
//   });
// }

//THIS CODE IS FOR OTP BASED AUTHENTICATION WITH SOME MINOR CHANGES
import userModel from "../module/user.module.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../module/session.module.js";

import { sendEmail } from "../services/email.service.js";
import { generateOtp, getOtpHtml } from "../utils/utils.js";
import otpModel from "../module/otp.module.js";

export async function register(req, res) {
  const { username, password, email } = req.body;

  const isAlreadyRegisterd = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isAlreadyRegisterd) {
    res.status(409).json({
      message: "Username or email is already exist",
    });
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const user = await userModel.create({
    username,
    password: hashedPassword,
    email,
  });

  const otp = generateOtp();
  const html = getOtpHtml(otp);
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  await otpModel.create({
    email,
    user: user._id,
    otpHash,
  });
  await sendEmail(
    email,
    "Verify Your Account",
    `Your otp code is  ${otp}`,
    html,
  );

  res.status(201).json({
    message: "User registered sucessfully",
    user: {
      username: user.username,
      email: user.email,
      verified: user.verified,
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }
  if (!user.verified) {
    return res.status(401).json({
      message: "Please verify your account first",
    });
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  const isPasswordValid = hashedPassword === user.password;
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }
  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.create({
    user: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      sessionId: session._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Logged in successfully",
    user: {
      username: user.username,
      email: user.email,
    },
    accessToken,
  });
}

export async function getMe(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "token not found",
    });
  }

  const decoded = jwt.verify(token, config.JWT_SECRET);

  const user = await userModel.findById(decoded.id);
  res.status(200).json({
    message: "User fetched successfully",
    user: {
      username: user.username,
      email: user.email,
    },
  });
}

export async function refreshToken(req, res) {
  //bringing refreshtoken from cookies
  const refreshToken = req.cookies.refreshToken;
  //if the refreshtoken not found
  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token not found",
    });
  }

  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

  //for session
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });
  if (!session) {
    res.status(401).json({
      message: "Invalid refresh token",
    });
  }

  //if found then create a new accesstoken
  const accessToken = jwt.sign(
    {
      id: decoded.id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  //if we created accesstoken after getting the refreshtoken then fo double safety we can or we should generate a new refreshtoken
  const newrefreshToken = jwt.sign(
    {
      id: decoded.id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const newrefreshTokenHash = crypto
    .createHash("sha256")
    .update(newrefreshToken)
    .digest("hex");
  session.refreshTokenHash = newrefreshTokenHash;
  await session.save();

  res.cookie("refreshToken", newrefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Access token refresh sucessfully",
    accessToken,
  });
}

export async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh Token not found",
    });
  }
  //refresh token ko waps se hash me kro kyuki session me jo refresh token store kiye the wo hash me that isliye compare krne keliye hash me zrurat padegi
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Searches the database for an active, unrevoked session matching this hashed token.
  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    return res.status(401).json({
      message: "invalid Refresh Token",
    });
  }

  // Changes the session status in the system to "cancelled" so it can never be used again.
  session.revoked = true;
  await session.save();

  res.clearCookie("refreshToken");

  res.status(200).json({
    message: " Logged Out Successfully",
  });
}

export async function logoutAll(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh Token not found",
    });
  }

  const decoded = jwt.createHash("sha256").update(refreshToken).digest("hex");

  await sessionModel.updateMany(
    {
      user: decoded.id,
      revoked: false,
    },
    {
      revoked: true,
    },
  );

  res.clearCookie("refreshToken");

  res.status(200).json({
    message: "Login out from all devices successfully  ",
  });
}

export async function verifyEmail(req, res) {
  const { email, otp } = req.body;
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  const otpDoc = await otpModel.findOne({
    email,
    otpHash,
  });
  if (!otpDoc) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }
  const user = await userModel.findByIdAndUpdate(otpDoc.user, {
    verified: true,
  });
  await otpModel.deleteMany({
    user: otpDoc.user,
  });
  res.status(200).json({
    message: "Email verified successfully",
    user: {
      username: user.username,
      email: user.email,
      verified: user.verified,
    },
  });
}
