import mongoose from "mongoose";
import Ride from "../models/ride.model.js";
import User from "../models/user.model.js";

import {sendEmail} from "../utils/sendEmail.js";
import axios from 'axios';

// ---------------------ok CREATE A NEW RIDE email---------------------
export const createRide = async (req, res) => {
  try {
    console.log("Creating a new ride...");
    const { 
      additionalNotes, vehicle, maxPassengers, fareRange, 
      departureDate, departureTime, pickupLocation, dropLocation, preferences 
    } = req.body;
    const driver = req.user._id;

    // Check if vehicle plate is provided
    if (!vehicle || !vehicle.plate) {
      return res.status(400).json({
        message: "Vehicle details are required.",
        success: false,
      });
    }

    vehicle.plate = vehicle.plate.toUpperCase();

    // Validate phone number
    const driverDetails = await User.findById(driver);
    if (!driverDetails.isphoneVerified) {
      return res.status(403).json({
        message: "Phone number must be verified to create a ride.",
        success: false,
      });
    }

    // Validate date and time
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!departureDate.match(dateRegex)) {
      return res.status(400).json({
        message: "Invalid date format. Use YYYY-MM-DD.",
        success: false,
      });
    }

    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!departureTime.match(timeRegex)) {
      return res.status(400).json({
        message: "Invalid time format. Use HH:MM (24-hour format).",
        success: false,
      });
    }

    const now = new Date();
    const rideDate = new Date(departureDate + "T00:00:00Z");

    if (rideDate < now.setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        message: "Departure date must be today or a future date.",
        success: false,
      });
    }

    if (rideDate.getTime() === now.setHours(0, 0, 0, 0)) {
      const [hours, minutes] = departureTime.split(":").map(Number);
      if (hours < now.getHours() || (hours === now.getHours() && minutes <= now.getMinutes())) {
        return res.status(400).json({
          message: "Departure time must be in the future.",
          success: false,
        });
      }
    }

    // Check required fields
    if (
      !vehicle.model || !maxPassengers || !fareRange ||
      !pickupLocation?.lat || !pickupLocation?.lon || !pickupLocation?.address?.trim() ||
      !dropLocation?.lat || !dropLocation?.lon || !dropLocation?.address?.trim()
    ) {
      return res.status(400).json({
        message: "All required fields must be filled properly.",
        success: false,
      });
    }

    const existingRide = await Ride.findOne({ 
      driver, 
      status: { $in: ["active", "pending", "closed"] } 
    });

    if (existingRide) {
      return res.status(400).json({ 
        message: "You already have an active ride. Please complete or delete it before creating a new one.", 
        success: false 
      });
    }

    const existingVehicle = await Ride.findOne({ 
      "vehicle.plate": vehicle.plate, 
      status: { $in: ["active", "pending", "closed"] } 
    });

    if (existingVehicle) {
      return res.status(400).json({ 
        message: "This vehicle is already in use for an active ride.", 
        success: false 
      });
    }

    // Custom function to calculate distance between two lat-lon points (Haversine formula)
    function haversine(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the Earth in km
      const φ1 = lat1 * (Math.PI / 180);
      const φ2 = lat2 * (Math.PI / 180);
      const Δφ = (lat2 - lat1) * (Math.PI / 180);
      const Δλ = (lon2 - lon1) * (Math.PI / 180);

      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; 
    }

    const distanceInKm = haversine(pickupLocation.lat, pickupLocation.lon, dropLocation.lat, dropLocation.lon);

    const averageSpeed = 35; 
    const durationInHours = distanceInKm / averageSpeed;
    const durationInMinutes = Math.round(durationInHours * 60); 

    const estimatedCost = Math.round(distanceInKm * 12); // 12 rupees per km

    const newRide = new Ride({
      driver,
      vehicle,
      maxPassengers,
      availableSeats: maxPassengers,
      fareRange,
      departureDate,
      departureTime,
      pickupLocation,
      dropLocation,
      preferences,
      additionalNotes,
      distanceInKm, // Add distance
      durationInMinutes, // Add duration
      estimatedCost, // Add estimated cost
    });

    await newRide.save();

    // Send an email to the driver
    await sendEmail(
      driverDetails.email,
      "Ride Created Successfully!",
      `Your ride from ${pickupLocation.address} to ${dropLocation.address} on ${departureDate} at ${departureTime} has been created. Distance: ${distanceInKm} km, Duration: ${durationInMinutes} minutes, Estimated Cost: ₹${estimatedCost}.`
    );

    console.log("Ride created successfully!");

    return res.status(201).json({ 
      message: "Ride created successfully!", 
      success: true, 
      data: newRide 
    });

  } catch (error) {
    console.error("Error creating ride:", error.message);
    return res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};




// ---------------------ok GET ALL AVAILABLE RIDES ---------------------
export const getAllRides = async (req, res) => {
  try {
    const { pickup, drop } = req.query; // Optional filters

    let query = { status: "active" };

    if(pickup){
      query.pickupLocation = pickup;
    } 
    if(drop){ 
      query.dropLocation = drop;
    }

    const rides = await Ride.find(query).populate("driver", "name email");
    return res.status(200).json({ 
      success: true,
      message:"all rides fetched", 
      data:rides 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};

// ---------------------ok GET A SPECIFIC RIDE ---------------------
export const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate("driver", "name email");

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
        success: false
      });
    }

    // Custom function to calculate distance between two lat-lon points (Haversine formula)
    function haversine(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the Earth in km
      const φ1 = lat1 * (Math.PI / 180);
      const φ2 = lat2 * (Math.PI / 180);
      const Δφ = (lat2 - lat1) * (Math.PI / 180);
      const Δλ = (lon2 - lon1) * (Math.PI / 180);

      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; // returns distance in km
    }

    // Calculate distance, duration, and cost if not available
    if (!ride.distanceInKm || !ride.durationInMinutes || !ride.estimatedCost) {
      const { pickupLocation, dropLocation, fareRange } = ride;

      // Calculate the distance
      const distanceInKm = haversine(pickupLocation.lat, pickupLocation.lon, dropLocation.lat, dropLocation.lon);

      // Calculate the estimated duration (assuming an average speed of 55 km/h)
      const averageSpeed = 50; // km/h
      const durationInHours = distanceInKm / averageSpeed;
      const durationInMinutes = Math.round(durationInHours * 60); // Convert hours to minutes

      // Calculate the estimated cost (8 rupees per km)
      const estimatedCost = Math.round(distanceInKm * 4.5); // 4.5 rupees per km

      // Update the ride object with the calculated values
      ride.distanceInKm = distanceInKm;
      ride.durationInMinutes = durationInMinutes;
      ride.estimatedCost = estimatedCost;

      // Save the updated ride document to the database
      await ride.save();
    }

    return res.status(200).json({
      success: true,
      message: "Ride fetched successfully",
      data: ride,
    });
  } catch (error) {
    console.error("Error fetching ride:", error.message);
    return res.status(500).json({
      message: error.message,
      success: false
    });
  }
};


// ---------------------ok UPDATE A RIDE (ONLY DRIVER) email---------------------
export const updateRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride){
      return res.status(404).json({ 
        message: "Ride not found", 
        success: false 
      });
    } 

    if (ride.driver.toString() !== req.user._id.toString()){
      return res.status(403).json({ 
        message: "Unauthorized", 
        success: false });
    }

    const { fareRange, availableSeats, vehicle } = req.body;

    const passengersJoined = ride.passengers.some(
      (p) => p.status === "accepted"
    );

    // Prevent fare increase if passengers have joined
    if (fareRange && passengersJoined) {
      if (fareRange.min > ride.fareRange.min || fareRange.max > ride.fareRange.max) {
        return res.status(400).json({
          message: "Cannot increase fare after passengers have joined",
          success: false,
        });
      }
    }

    // Prevent reducing availableSeats below the number of accepted passengers
    const bookedSeats = ride.passengers.reduce(
      (sum, p) => (p.status === "accepted" ? sum + p.numPassengers : sum),
      0
    );
    
    if (availableSeats !== undefined && availableSeats < bookedSeats) {
      return res.status(400).json({
        message: `Cannot reduce available seats below booked seats (${bookedSeats})`,
        success: false,
      });
    }
    
    // Prevent updating vehicle details once passengers are added
    if (vehicle && passengersJoined) {
      return res.status(400).json({
        message: "Cannot change vehicle details after passengers have joined",
        success: false,
      });
    }

    Object.assign(ride, req.body);
    await ride.save();

    return res.status(200).json({ 
      message: "Ride updated successfully", 
      success: true, 
      data: ride, 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};

// ---------------------ok JOIN A RIDE (AS A RIDER) email---------------------
export const requestJoinRide = async (req, res) => {
  try {
    console.log(req.body);
    const { numPassengers, offeredFare, preferredPaymentMethod } = req.body;

    const ride = await Ride.findById(req.params.id);
    const user = await User.findById(req.user._id);

    console.log(ride);
    if (!user.isphoneVerified) {
      return res.status(403).json({
        message: "Phone number must be verified to join a ride.",
        success: false,
      });
    }

    if (!ride){
      return res.status(404).json({ 
        message: "Ride not found", 
        success: false });
    } 

    if (ride.availableSeats < numPassengers){ 
      return res.status(400).json({ 
        message: `Only ${ride.availableSeats} seats are available.`, 
        success: false 
      });
    }

    console.log('Ride:', ride);
    console.log('Available seats:', ride.availableSeats);

    if (ride.status == "closed"){ 
      return res.status(400).json({ 
        message: "Ride bookings are closed for ride | for now", 
        success: false 
      });
    }

    // Validate fare within range 
    if (offeredFare < ride.fareRange.min || offeredFare > ride.fareRange.max) {
      return res.status(400).json({ 
        message: `Fare must be between ${ride.fareRange.min} and ${ride.fareRange.max}.`,
        success: false 
      });
    }

    // Check if user is already in the ride
    const existingPassenger = ride.passengers.find(p => p.user.toString() === req.user._id.toString());
    if (existingPassenger) {
      return res.status(400).json({
        message: "You have already requested to join this ride.",
        success: false,
      });
    }

    
    // Add passenger request
    ride.passengers.push({
      user: req.user._id,
      numPassengers,
      duePayment: offeredFare * numPassengers,
      paymentStatus: "pending",
      preferredPaymentMethod,
      status: "pending",
    });
    await ride.save();

    const driverDetails = await User.findById(ride.driver);
    await sendEmail(
      driverDetails.email,
      "New Ride Request",
      `${user.name} has requested ${numPassengers} seats on your ride from ${ride.pickupLocation} to ${ride.dropLocation}.`
    );

    await sendEmail(
      user.email,
      "New Ride Request",
      `${user.name} your request for ride from ${ride.pickupLocation} to ${ride.dropLocation} has been send.`
    );

    return res.status(200).json({ 
      message: "Ride request sent", 
      success: true 
    });
  } catch(error){
    console.error("Error in requestJoinRide:", error.message);
    return res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};

// --------------------- get all requests ---------------------
export const getPassengersForRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate("driver", "name email phone")
      .populate("passengers.user", "name email phone gender age");

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
        success: false,
      });
    }

    if (ride.passengers.length === 0) {
      return res.status(404).json({
        message: "No passengers found for this ride",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Passengers fetched successfully",
      success: true,
      rideDetails: {
        driver: ride.driver,
        vehicle: ride.vehicle,
        fareRange: ride.fareRange,
        availableSeats: ride.availableSeats,
        passengers: ride.passengers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// ---------------------ok DRIVER ACCEPTS/REJECTS A RIDE REQUEST ok---------------------
export const respondToRideRequest = async (req, res) => {
  try {
    const { passengerId, status } = req.body;
    const ride = await Ride.findById(req.params.id);

    if(!ride){
      return res.status(404).json({
        message: "Ride not found",
        success: false 
      });
    } 

    if(ride.driver.toString() !== req.user._id.toString()){
      return res.status(403).json({ 
        message: "Unauthorized action.", 
        success: false 
      });
    }

    // const passenger = ride.passengers.find(p => p.user.toString() === passengerId);

    // if (!passenger){
    //   return res.status(404).json({ 
    //     message: "Passenger not found", 
    //     success: false 
    //   });
    // }
    // passenger.status = status;

    const passengerIndex = ride.passengers.findIndex(p => p.user.toString() === passengerId);
    if (passengerIndex === -1) {
      return res.status(404).json({ 
        message: "Passenger not found in this ride.",
        success: false 
      });
    }

    const passenger = ride.passengers[passengerIndex];

    // Check if passenger is already approved
    if (passenger.status === "accepted" && status === "accepted") {
      return res.status(400).json({
        message: "Passenger is already accepted.",
        success: false,
      });
    }

    if(status === "accepted"){
      if(ride.availableSeats < passenger.numPassengers){
        return res.status(400).json({
          message: "Not enough seats available anymore.",
          success: false 
        });
      }
      ride.availableSeats -= passenger.numPassengers;
      passenger.status = "accepted";
    } else{
      passenger.status = "rejected";
    }

    await ride.save();

    const user = await User.findById(passenger.user);
    const driver = await User.findById(ride.driver);

    if (status === "accepted") {
      // Send full details of driver and rider to each other
      await sendEmail(
        user.email,
        "Ride Request Accepted",
        `Your ride request was accepted! Here are your driver details:\n\n
         - Name: ${driver.name}
         - Vehicle: ${ride.vehicle.model} (${ride.vehicle.color})
         - Payment Method: ${ride.paymentPreferences.driver}
         - Contact: ${driver.email}`
      );

      await sendEmail(
        driver.email,
        "Passenger Accepted",
        `You have accepted ${user.name} into your ride. Here are their details:\n\n
         - Name: ${user.name}
         - Number of Seats: ${passenger.numPassengers}
         - Preferred Payment: ${passenger.preferredPaymentMethod}
         - Contact: ${user.email}`
      );
    }

    return res.status(200).json({ 
      message: `Ride request ${status}`, 
      success: true 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: error.message, 
      success: false });
  }
};

// ---------------------ok RIDER LEAVES THE RIDE ok---------------------
export const leaveRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate("driver");

    if (!ride){
       return res.status(404).json({
        message: "Ride not found",
        success: false 
      });
    }

    const index = ride.passengers.findIndex(p => p.user.toString() === req.user._id.toString());

    if(index === -1){
      return res.status(400).json({ 
        message: "You are not part of this ride",
        success: false 
      });
    }

    const passenger = ride.passengers[index];

    ride.passengers.splice(index, 1);
    ride.availableSeats += 1;

    await ride.save();

    await sendEmail(
      ride.driver.email,
      "Passenger Left the Ride",
      `${req.user.name} has left your ride from ${ride.pickupLocation} to ${ride.dropLocation}.`
    );

    return res.status(200).json({
       message: "Left the ride successfully", 
       success: true 
      });
  } catch(error){
    return res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};


// ---------------------ok COMPLETE A RIDE ok---------------------
export const completeRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate("passengers.user");

    if (!ride){
      return res.status(404).json({ 
        message: "Ride not found", 
        success: false 
      });
    }
    if(ride.driver.toString() !== req.user._id.toString()){
      return res.status(403).json({ 
        message: "Unauthorized", 
        success: false 
      });
    }

    ride.status = "completed";
    await ride.save();


     // Notify all passengers
     for (const passenger of ride.passengers) {
      await sendEmail(
        passenger.user.email,
        "Ride Completed",
        `Your ride from ${ride.pickupLocation} to ${ride.dropLocation} has been successfully completed.`
      );
    }

    return res.status(200).json({ 
      message: "Ride marked as completed", 
      success: true 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};


// --------------------- CLOSE A RIDE ---------------------
export const closeRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate("passengers.user");

    if(!ride){
      return res.status(404).json({ 
        message: "Ride not found", 
        success: false 
      });
    } 
    if(ride.driver.toString() !== req.user._id.toString()){
      return res.status(403).json({ 
        message: "Unauthorized", 
        success: false 
      });
    }

    ride.status = "closed";
    await ride.save();

    // Notify all passengers
    for (const passenger of ride.passengers) {
      await sendEmail(
        passenger.user.email,
        "Ride Closed",
        `The ride from ${ride.pickupLocation} to ${ride.dropLocation} has been closed by the driver. No new passengers can join.`
      );
    }

    return res.status(200).json({ 
      message: "Ride closed successfully | no more passengers allowed", 
      success: true 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};

// ---------------------ok CANCEL A RIDE  ok---------------------
export const cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate("passengers.user");

    if(!ride){
      return res.status(404).json({ 
        message: "Ride not found", 
        success: false 
      });
    } 

    if(ride.driver.toString() !== req.user._id.toString()){
      return res.status(403).json({ 
        message: "Unauthorized", 
        success: false 
      });
    }

    ride.status = "cancelled";
    await ride.save();

    // Notify all passengers
    for (const passenger of ride.passengers) {
      await sendEmail(
        passenger.user.email,
        "Ride Cancelled",
        `The ride from ${ride.pickupLocation} to ${ride.dropLocation} has been cancelled by the driver. We apologize for any inconvenience.`
      );
    }

    return res.status(200).json({ 
      message: "Ride cancelled successfully", 
      success: true 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};


// ---------------------ok DELETE A RIDE (ONLY DRIVER) ok---------------------
// export const deleteRide = async (req, res) => {
//   try {
//     const ride = await Ride.findById(req.params.id);

//     if(!ride){
//       return res.status(404).json({ 
//         message: "Ride not found", 
//         success: false 
//       });
//     }

//     if(ride.driver.toString() !== req.user._id.toString()){
//       return res.status(403).json({ 
//         message: "Unauthorized", 
//         success: false 
//       });
//     }

//     await ride.deleteOne();
//     return res.status(200).json({ 
//       message: "Ride deleted successfully", 
//       success: true 
//     });
//   } catch (error) {
//     return res.status(500).json({ 
//       message: error.message, 
//       success: false 
//     });
//   }
// };


// Get all rides created by the authenticated user (driver)
export const getDriverRides = async (req, res) => {
  try {
    const driverId = req.user._id; // Get the driver ID from the authenticated user

    const rides = await Ride.find({ driver: driverId }).populate("driver", "name email");

    if (rides.length === 0) {
      return res.status(404).json({
        message: "No rides found for this driver",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Driver's rides fetched successfully",
      data: rides,
    });
  } catch (error) {
    console.error("Error fetching driver's rides:", error.message);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};





// Get all rides where the authenticated user is a passenger
export const getPassengerRides = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the authenticated user

    const rides = await Ride.find({
      "passengers.user": userId, // Check if the user is in the passengers array
    }).populate("driver", "name email");

    if (rides.length === 0) {
      return res.status(404).json({
        message: "No rides found for this user as a passenger",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Passenger's rides fetched successfully",
      data: rides,
    });
  } catch (error) {
    console.error("Error fetching passenger's rides:", error.message);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};





