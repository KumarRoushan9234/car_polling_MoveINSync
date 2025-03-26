import express from "express";
import { createRide, getAllRides, getRideById, updateRide, cancelRide, requestJoinRide, respondToRideRequest, leaveRide, completeRide,getPassengersForRide,closeRide,getDriverRides,getPassengerRides } from "../controllers/ride.controller.js";
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/create", protectRoute, createRide); 

router.get("/", getAllRides); 
router.get("/passenger_rides", protectRoute, getPassengerRides);
router.get("/driver_rides", protectRoute, getDriverRides);

router.get("/:id", getRideById); 
router.put("/:id", protectRoute, updateRide); 



router.get("/:id/passengers", protectRoute, getPassengersForRide);
router.put("/:id/respond", protectRoute, respondToRideRequest); 
router.delete("/:id", protectRoute, cancelRide);

router.post("/:id/complete", protectRoute, completeRide); 

router.post("/:id/close", protectRoute, closeRide); // => done

//passenger
router.put("/:id/leave", protectRoute, leaveRide); // => done
router.post("/:id/join", protectRoute, requestJoinRide);  // => done




export default router;
