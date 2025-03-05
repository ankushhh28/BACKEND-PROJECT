import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      /*Jab hum index: true kisi field me use karte hain Mongoose schema me, toh MongoDB us field pe ek index create kar deta hai.
👉 Indexing ka kaam hota hai queries ko fast banana, taaki database me efficiently searching ho sake.
👉 Without Indexing, MongoDB har ek document ko scan karta hai, jo slow hota hai.
👉 With Indexing, MongoDB directly indexed data pe search karta hai, jo bahut fast hota hai.*/
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    Avatar: {
      type: String, //^ cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //^ cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//! Encrypting the password through mongoose middlewares(hooks)...
userSchema.pre("save", async function (next) {
  //* agr password modified nhi hai to next kr do
  if (!this.isModified("password")) next();

  //* for the encrption of the password
  //* 10 → Salt rounds hai (jitna zyada, utna secure hashing)
  this.password = bcrypt.hash(this.password, 10);
  next();
});

//! creating custom fn for comparing the password with the hashed password stored in the DB
userSchema.methods.isPasswordCorrect = async function (password) {
  //* bcrypt.compare() function hashed password ko decrypt nahi karta,Balki yeh plain password ka hash generate karke database wale hash se compare karta hai
  return await bcrypt.compare(password, this.password);
};

//~ jwt: jwt ek bearer token hai mtlb jo usko bear krta hai hm usko data bhej denge
// ~ refreshtokens snd accesstokens dono hi jwt token hai but usage ka difference hai
//! Methods for creating Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  
};

//! Methods for creating Refresh Token isme information km hoti hai
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
