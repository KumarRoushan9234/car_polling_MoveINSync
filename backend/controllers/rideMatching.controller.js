import Ride from "../models/ride.model.js";
import axios from "axios";
import polyline from "@mapbox/polyline"; // Decode Google Maps polylines

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_API_KEY;

/**
 * Function to calculate route similarity percentage
 */
const getRouteMatchPercentage = async (driverRoute, userRoute) => {
  const driverPoints = polyline.decode(driverRoute);
  const userPoints = polyline.decode(userRoute);

  let matchedPoints = 0;

  userPoints.forEach((userPoint) => {
    if (driverPoints.some((driverPoint) => getDistance(driverPoint, userPoint) < 500)) {
      matchedPoints++;
    }
  });

  const matchRatio = matchedPoints / userPoints.length;

  if (matchRatio >= 0.9) return 100; 
  if (matchRatio >= 0.75) return 75; 
  if (matchRatio >= 0.5) return 50; 
  return 0;
};

/**
 * Function to calculate distance between two coordinates (Haversine Formula)
 */
const getDistance = (coord1, coord2) => {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371e3; 
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; 
};

const getRideEstimates = async (origin, destination) => {
  if (!origin || !destination) {
    return { distanceInKm: null, durationInMinutes: null };
  }
  
  const googleMapsURL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lon}&destinations=${destination.lat},${destination.lon}&key=${GOOGLE_MAPS_API_KEY}`;
  
  try {
    const { data } = await axios.get(googleMapsURL);
    if (data.rows.length > 0) {
      const element = data.rows[0].elements[0];
      const distanceInKm = element.distance.value / 1000; 
      const durationInMinutes = element.duration.value / 60; 
      return { distanceInKm, durationInMinutes };
    }
  } catch (error) {
    console.error("Error fetching distance estimate:", error.message);
  }

  return { distanceInKm: null, durationInMinutes: null };
};

// export const getAllRides = async (req, res) => {
//   try {
//     const { pickup, drop } = req.query; // Query parameters for pickup and drop locations

//     // Check if pickup and drop are valid lat/lon objects
//     if (!pickup || !drop || !pickup.lat || !pickup.lon || !drop.lat || !drop.lon) {
//       return res.status(400).json({ success: false, message: "Invalid pickup or drop coordinates." });
//     }

//     let query = { status: "active" };
//     if (pickup) query.pickupLocation = pickup;
//     if (drop) query.dropLocation = drop;

//     const rides = await Ride.find(query).populate("driver", "name email");

//     if (rides.length === 0) {
//       return res.status(404).json({ success: false, message: "No rides found." });
//     }

//     const ridesWithDetails = await Promise.all(
//       rides.map(async (ride) => {
//         const [rideEstimates, driverRouteData, userRouteData] = await Promise.all([
//           getRideEstimates(ride.pickupLocation, pickup),
//           axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${ride.pickupLocation.lat},${ride.pickupLocation.lon}&destination=${ride.dropLocation.lat},${ride.dropLocation.lon}&key=${GOOGLE_MAPS_API_KEY}`),
//           axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${pickup.lat},${pickup.lon}&destination=${drop.lat},${drop.lon}&key=${GOOGLE_MAPS_API_KEY}`)
//         ]);

//         const driverRoute = driverRouteData?.data.routes[0]?.overview_polyline?.points || null;
//         const userRoute = userRouteData?.data.routes[0]?.overview_polyline?.points || null;

//         const matchPercentage = driverRoute && userRoute ? await getRouteMatchPercentage(driverRoute, userRoute) : 0;
//         const estimatedCost = Math.round(rideEstimates.distanceInKm * ride.farePerKm);

//         return {
//           ...ride.toObject(),
//           distanceInKm: rideEstimates.distanceInKm,
//           durationInMinutes: rideEstimates.durationInMinutes,
//           matchPercentage,
//           estimatedCost,
//         };
//       })
//     );

//     ridesWithDetails.sort((a, b) => {
//       if (a.distanceInKm !== b.distanceInKm) return a.distanceInKm - b.distanceInKm;
//       if (b.matchPercentage !== a.matchPercentage) return b.matchPercentage - a.matchPercentage;
//       return a.estimatedCost - b.estimatedCost;
//     });

//     return res.status(200).json({
//       success: true,
//       message: "All rides fetched",
//       data: ridesWithDetails,
//     });
//   } catch (error) {
//     console.error("Error in getAllRides:", error.message);
//     return res.status(500).json({ message: error.message, success: false });
//   }
// };


export const searchRides = async (req, res) => {
  try {
    const { leavingCoords, destinationCoords, date, numPassengers, preferences, maxFare } = req.body;

    // Find active rides that have available seats greater than or equal to the requested number of passengers
    let rides = await Ride.find({ 
      status: "active", 
      availableSeats: { $gte: numPassengers } 
    });

    if (rides.length === 0) {
      return res.status(404).json({ message: "No rides found.", success: false });
    }

    // Fetch ride details for each ride (distance, route match, estimated cost, etc.)
    const ridesWithDetails = await Promise.all(
      rides.map(async (ride) => {
        const { distanceInKm, durationInMinutes } = await getRideEstimates(ride.pickupLocation, leavingCoords);
        const { distanceInKm: dropDistance, durationInMinutes: dropDuration } = await getRideEstimates(
          leavingCoords,
          destinationCoords
        );

        // Fetch directions for the driver's route
        const googleDirectionsURL = `https://maps.googleapis.com/maps/api/directions/json?origin=${ride.pickupLocation.lat},${ride.pickupLocation.lon}&destination=${ride.dropLocation.lat},${ride.dropLocation.lon}&key=${GOOGLE_MAPS_API_KEY}`;
        const { data: driverData } = await axios.get(googleDirectionsURL);

        if (!driverData || !driverData.routes || driverData.routes.length === 0) {
          console.log("Google Directions API did not return a valid route for driver.");
          return {
            ...ride.toObject(),
            matchPercentage: 0,
            estimatedCost: 0,
          };
        }

        const driverRoute = driverData.routes[0]?.overview_polyline?.points || null;

        // Fetch directions for the user's route
        const userDirectionsURL = `https://maps.googleapis.com/maps/api/directions/json?origin=${leavingCoords.lat},${leavingCoords.lon}&destination=${destinationCoords.lat},${destinationCoords.lon}&key=${GOOGLE_MAPS_API_KEY}`;
        const { data: userData } = await axios.get(userDirectionsURL);

        if (!userData || !userData.routes || userData.routes.length === 0) {
          console.log("Google Directions API did not return a valid route for user.");
          return {
            ...ride.toObject(),
            matchPercentage: 0,
            estimatedCost: 0,
          };
        }

        const userRoute = userData.routes[0]?.overview_polyline?.points || null;

        const matchPercentage = driverRoute && userRoute ? await getRouteMatchPercentage(driverRoute, userRoute) : 0;

        // Calculate preference match score (based on user preferences)
        let preferenceScore = 0;
        for (const key in preferences) {
          if (preferences[key] === ride.preferences[key]) {
            preferenceScore += 1;
          }
        }
        const preferenceMatchPercentage = (preferenceScore / Object.keys(preferences).length) * 100;

        // Estimate the cost based on distance and fare per km
        const estimatedCost = Math.round(distanceInKm * ride.farePerKm * numPassengers); 

        // Return ride details
        return {
          ...ride.toObject(),
          distanceInKm,
          durationInMinutes,
          dropDistance,
          dropDuration,
          matchPercentage,
          preferenceMatchPercentage,
          estimatedCost,
        };
      })
    );

    // Sort rides based on distance, route match percentage, preference match, and estimated cost
    ridesWithDetails.sort((a, b) => {
      return (
        a.distanceInKm - b.distanceInKm ||
        b.matchPercentage - a.matchPercentage ||
        b.preferenceMatchPercentage - a.preferenceMatchPercentage ||
        a.estimatedCost - b.estimatedCost
      );
    });

    return res.status(200).json({
      message: "Rides found!",
      success: true,
      data: ridesWithDetails,
    });
  } catch (error) {
    console.error("Error in searchRides:", error.message);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

