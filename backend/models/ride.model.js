import mongoose from "mongoose";
const { Schema } = mongoose;

const rideSchema = new Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      type: {
        type: String, // e.g., "Sedan", "SUV", "Hatchback"
      },
      model: {
        type: String, // e.g., "Honda City"
        required: true,
      },
      plate: {
        type: String, // e.g., "MH 12 AB 1234"
        required: true,
      },
      color: String, // Optional (e.g., "Red")
    },
    maxPassengers: {
      type: Number,
      required: true,
      min: 1,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    fareRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    departureDate: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    departureTime: {
      type: String, // Format: HH:MM (24-hour)
      required: true,
    },
    pickupLocation: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
      address: { type: String, required: true },
    },
    dropLocation: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
      address: { type: String, required: true },
    },
    preferences: {
      smokingAllowed: { type: Boolean, default: false },
      music: { type: Boolean, default: true },
      petsAllowed: { type: Boolean, default: false },
      femaleOnly: { type: Boolean, default: false },
      chattyDriver: { type: Boolean, default: true },
      quietRide: { type: Boolean, default: false },
      airConditioning: { type: Boolean, default: true }, // New preference
      luggageSpace: { type: Boolean, default: true }, // New preference
      windowSeatPreferred: { type: Boolean, default: false }, // New preference
    },
    paymentPreferences: {
      driver: {
        type: String,
        enum: ["cash", "UPI", "card", "crypto"],
        default: "cash",
      },
      passengers: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          preferredMethod: {
            type: String,
            enum: ["cash", "UPI", "card", "crypto"],
            default: "cash",
          },
        },
      ],
    },
    passengers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        numPassengers: {
          type: Number,
          required: true,
          min: 1,
        },
        duePayment: {
          type: Number,
          default: 0, // Amount owed
        },
        paymentStatus: {
          type: String,
          enum: ["pending", "paid"],
          default: "pending",
        },
        preferredPaymentMethod: {
          type: String,
          enum: ["cash", "UPI", "card", "crypto"],
          default: "cash",
        },
        userRating: {
          type: Number,
          min: 1,
          max: 5,
          default: null,
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        preferences: {
          smokingAllowed: { type: Boolean, default: false },
          music: { type: Boolean, default: true },
          petsAllowed: { type: Boolean, default: false },
          femaleOnly: { type: Boolean, default: false },
          chattyDriver: { type: Boolean, default: true },
          quietRide: { type: Boolean, default: false },
        },
        additionalNotes: {
          type: String,
          default: "",
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "completed", "cancelled", "closed"],
      default: "active",
    },
    additionalNotes: {
      type: String,
      default: "You will enjoy this ride!",
    },
    distanceInKm: { type: Number}, // in kilometers
    durationInMinutes: { type: Number}, // in minutes
    estimatedCost: { type: Number}, // in rupees
  },
  { timestamps: true }
);

export default mongoose.model("Ride", rideSchema);
