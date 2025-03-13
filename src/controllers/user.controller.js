import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    //~ find user through id
    const user = await User.findById(userId);

    //~ generating access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    //~ save refresh token in the DB
    //~ adding value to the  refresh token field in userSchema
    user.refreshToken = refreshToken;
    //~ save this field in the DB through mongoose method save()
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

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
  const existedUser = await User.findOne({
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
  console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

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
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

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

  //🚀 Yeh ek best practice hai jab aap scalable aur readable APIs bana rahe ho!
});

const loginUser = asyncHandler(async (req, res) => {
  // req body->data
  // username or email
  // find the user
  // password check
  // access and refresh token
  // send cookie

  //~ requesting the data
  const { username, email, password } = req.body;

  //~ check empty fields
  if (!username || !email) {
    throw new ApiError(400, "username or email is required!");
  }

  //~ find user in DB
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User doesn't exist!");
  }

  //~ check password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  //~ remove password and refreshToken field from loggedInUser
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //~ send cookie
  const options = {
    httpOnly: true,
    //* Iska matlab hai ki ye cookie sirf server ke through access ho sakti hai, client-side JavaScript ise access nahi kar sakta.
    secure: true,
    //* Iska matlab hai ki ye cookie sirf encrypted (HTTPS) connections pe hi bheji jayegi.
    //* HTTP ke upar nahi chalegi, jo security badhata hai.
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged In successfully!"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //~ remove the tokens from DB
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
    /* Jab aap findByIdAndUpdate() ka use karte ho, toh by default yeh function purana (update hone se pehle ka) document return karta hai.
    Lekin agar aap { new: true } pass karte ho, toh yeh update hone ke baad ka naya document return karega.*/
  );

  //~ remove the data from the cookie
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully!"));
});

export { registerUser, loginUser, logoutUser };
