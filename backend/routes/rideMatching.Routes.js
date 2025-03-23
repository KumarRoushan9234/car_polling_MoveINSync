import express from "express";
import { searchRides, } from "../controllers/rideMatching.controller.js";

// getAllRides
const router = express.Router();

// router.get("/", getAllRides); 
router.post("/search", searchRides); 

export default router;
