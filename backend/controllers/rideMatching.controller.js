import Ride from "../models/ride.model.js";
import axios from "axios";
import polyline from "@mapbox/polyline"; 

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_API_KEY;

console.log(GOOGLE_MAPS_API_KEY);

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
  return Math.round(matchRatio * 100); // Return as percentage
};


const getDistance = (coord1, coord2) => {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371e3; // Earth radius in meters

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
  if (!origin || !destination) return { distanceInKm: null, durationInMinutes: null };

  const googleMapsURL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lon}&destinations=${destination.lat},${destination.lon}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const { data } = await axios.get(googleMapsURL);
    if (data.rows.length > 0) {
      const element = data.rows[0].elements[0];
      return {
        distanceInKm: element.distance.value / 1000,
        durationInMinutes: element.duration.value / 60,
      };
    }
  } catch (error) {
    console.error("Error fetching distance estimate:", error.message);
  }
  return { distanceInKm: null, durationInMinutes: null };
};


export const searchRides = async (req, res) => {
  try {
    const { leavingCoords, destinationCoords, date, numPassengers, preferences, maxFare } = req.body;

    let rides = await Ride.find({ status: "active", availableSeats: { $gte: numPassengers } });

    if (rides.length === 0) {
      return res.status(404).json({ message: "No rides found.", success: false });
    }

    const ridesWithDetails = await Promise.all(
      rides.map(async (ride) => {
        const { distanceInKm } = await getRideEstimates(ride.pickupLocation, leavingCoords);
        const { distanceInKm: dropDistance } = await getRideEstimates(leavingCoords, destinationCoords);

        // Fetch routes for driver and user
        const driverRouteData = await axios.get(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${ride.pickupLocation.lat},${ride.pickupLocation.lon}&destination=${ride.dropLocation.lat},${ride.dropLocation.lon}&key=${GOOGLE_MAPS_API_KEY}`
        );

        const userRouteData = await axios.get(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${leavingCoords.lat},${leavingCoords.lon}&destination=${destinationCoords.lat},${destinationCoords.lon}&key=${GOOGLE_MAPS_API_KEY}`
        );

        const driverRoute = driverRouteData?.data.routes[0]?.overview_polyline?.points || null;
        const userRoute = userRouteData?.data.routes[0]?.overview_polyline?.points || null;

        const routeMatchPercentage = driverRoute && userRoute
          ? await getRouteMatchPercentage(driverRoute, userRoute)
          : 0;

        // Preference Matching Score
        let preferenceScore = 0;
        let totalPreferences = Object.keys(preferences).length;
        for (const key in preferences) {
          if (ride.preferences[key] === preferences[key]) {
            preferenceScore += 1;
          }
        }
        const preferenceMatchPercentage = totalPreferences > 0
          ? Math.round((preferenceScore / totalPreferences) * 100)
          : 0;

        // Driver rating (optional)
        const driverRating = ride.driver.rating || 3.0; // Default rating if not available

        // Cost estimation
        const estimatedCost = Math.round(distanceInKm * ride.fareRange.min * numPassengers);
        if (maxFare && estimatedCost > maxFare) return null; // Exclude rides exceeding max fare

        // **Matching Score Calculation**
        const matchingScore =
          routeMatchPercentage * 0.5 +
          preferenceMatchPercentage * 0.3 +
          driverRating * 10 * 0.2; // Driver rating is weighted 20%

        return {
          ...ride.toObject(),
          distanceInKm,
          dropDistance,
          routeMatchPercentage,
          preferenceMatchPercentage,
          estimatedCost,
          driverRating,
          matchingScore,
        };
      })
    );

    // Filter out null values (rides exceeding maxFare)
    const filteredRides = ridesWithDetails.filter(Boolean);

    // **Sort by matching score, then route match, then driver rating**
    filteredRides.sort((a, b) => {
      return (
        b.matchingScore - a.matchingScore ||
        b.routeMatchPercentage - a.routeMatchPercentage ||
        b.driverRating - a.driverRating
      );
    });

    return res.status(200).json({
      message: "Rides found!",
      success: true,
      data: filteredRides,
    });
  } catch (error) {
    console.error("Error in searchRides:", error.message);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};


