import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation- not empty
  // check if user already exists: username, email
  // check for images,check for avatar
  // upload them to cloudinary, avatar
  // create user object -create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response

  const { username, email, fullName, password } = req.body;
  //~ check all fields are filled or not
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }
  //~ check already user exist or not
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists!");
  }

  //~ check for images and avatar
  //~ Yeh line Express + Multer ka code hai jo uploaded file ka local path extract karne ke liye likha gaya hai.
  //~ Iska kaam hai:
  //~ ✅ Agar req.files.avatar exist karta hai, toh uske pehle element [0] ka path extract karega.
  //~ ✅ Agar req.files.avatar ya avatar[0] exist nahi karta, toh undefined return hoga.
  //~ ✅ Optional Chaining (?.) ka use kiya gaya hai taaki agar koi value undefined ho toh error na aaye.
  //* ye req.files multer ka method hai multer ko as a middleware lagaya hai isiliye ise hm use kr skte hai

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required!");
  }

  //~ creating user object in database
  const user = await User.create({
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", //~ if have then store url else nothing
    username: username.toLowerCase(),
  });

  //~ removing password and refresh token from response
  const createdUser = User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user!");
  }

  //~ returning the response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully!"));

// 1️⃣ 2 status codes dene ka reason hai:
// Ek actual HTTP response ke liye (res.status(201))
// Ek structured response ke liye jo frontend easily handle kar sake (new ApiResponse(200, ...))
//2️⃣ Is approach se API ka response clean, consistent aur easy-to-handle hota hai.
//3️⃣ Agar error aata hai toh success: false set ho jata hai, jo frontend ko response handle karne me madad karta hai.

//🚀 Yeh ek best practice hai jab aap scalable aur readable APIs bana rahe ho! 🔥
});

export { registerUser };
