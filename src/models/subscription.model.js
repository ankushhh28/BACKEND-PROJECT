import mongoose, { Schema } from "mongoose";
import { User } from "./user.model";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      //~ one who is subscribing
      type: Schema.Types.ObjectId,
      ref: User,
    },
    channel: {
      //~ one to whom "subscriber" is subscribing
      type: Schema.Types.ObjectId,
      ref: User,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
