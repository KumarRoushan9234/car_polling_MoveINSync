import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fname:{
      type: String,
      trim: true,
      // required: true,
    },
    lname:{
      type: String,
      trim: true,
      // required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    phone:{
      type:Number,
      trim: true,
      sparse: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 64,
    },
    picture: {
      type: String,
      // default: "",
    },
    passwordResetCode: {
      type: String,
      default: "",
    },
    isemailVerified: {
      type: Boolean,
      default: false, 
    },
    emailverificationCode: {
      type: String,
      default: "1234", 
    },
    isphoneVerified: {
      type: Boolean,
      default: false, 
    },
    phoneverificationCode: {
      type: String,
      default: "1234", 
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);