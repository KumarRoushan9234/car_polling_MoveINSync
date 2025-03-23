import axios from "axios";

// --------------------- LOCATION SEARCH ---------------------
export const searchLocation = async (req, res) => {
  const { query, lat, lon } = req.query; // Fetch query, lat, and lon from query params

  if (!query || !lat || !lon) {
    return res.status(400).json({ message: "Query, lat, and lon are required." });
  }

  try {
    // Google Maps Places API call for autocomplete
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
        params: {
          input: query,
          location: `${lat},${lon}`,
          radius: 5000,
          key: process.env.GOOGLE_API_KEY
        }
      }
    );

    if (response.data.status === "OK") {
      // Return the predictions (location suggestions)
      const locationSuggestions = response.data.predictions.map(item => ({
        description: item.description,
        placeId: item.place_id,
      }));

      return res.status(200).json({
        message: "Location suggestions fetched successfully.",
        success: true,
        locations: locationSuggestions,
      });
    } else {
      return res.status(400).json({ message: "No suggestions found.", success: false });
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
