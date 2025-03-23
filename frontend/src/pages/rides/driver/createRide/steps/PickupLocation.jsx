import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PickupLocation = ({ updateFormData, formData }) => {
  const [locationSelected, setLocationSelected] = useState(
    !!formData.pickupLocation
  );
  const [inputValue, setInputValue] = useState(
    formData.pickupLocation?.address || ""
  );
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const geocoderRef = useRef(null);

  useEffect(() => {
    const checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(checkGoogleMaps);
        initAutocomplete();
        initMap();
        geocoderRef.current = new window.google.maps.Geocoder();
      }
    }, 500);

    return () => clearInterval(checkGoogleMaps);
  }, []);

  // Initialize Autocomplete for search input
  const initAutocomplete = () => {
    if (!inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ["geocode"] }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry || !place.formatted_address) return;

      const location = {
        lat: place.geometry.location.lat(),
        lon: place.geometry.location.lng(),
        address: place.formatted_address,
      };

      updateFormData({ pickupLocation: location });
      setInputValue(location.address);
      setLocationSelected(true);
      updateMap(location.lat, location.lon);
    });
  };

  // Initialize Google Map
  const initMap = () => {
    const defaultLocation = formData.pickupLocation
      ? { lat: formData.pickupLocation.lat, lng: formData.pickupLocation.lon }
      : { lat: 28.7041, lng: 77.1025 }; // New Delhi

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 12,
    });

    const markerInstance = new window.google.maps.Marker({
      position: defaultLocation,
      map: mapInstance,
      draggable: true,
    });

    setMap(mapInstance);
    setMarker(markerInstance);

    markerInstance.addListener("dragend", () => {
      const newPos = markerInstance.getPosition();
      reverseGeocode(newPos.lat(), newPos.lng());
    });

    mapInstance.addListener("click", (event) => {
      const clickedLat = event.latLng.lat();
      const clickedLng = event.latLng.lng();
      markerInstance.setPosition({ lat: clickedLat, lng: clickedLng });
      reverseGeocode(clickedLat, clickedLng);
    });
  };

  const updateMap = (lat, lon) => {
    if (map && marker) {
      const newPosition = new window.google.maps.LatLng(lat, lon);
      map.setCenter(newPosition);
      marker.setPosition(newPosition);
    }
  };

  const reverseGeocode = (lat, lng) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === "OK" && results[0]) {
          setInputValue(results[0].formatted_address);
          updateFormData({
            pickupLocation: {
              lat,
              lon: lng,
              address: results[0].formatted_address,
            },
          });
          setLocationSelected(true);
        } else {
          console.error("Reverse geocoding failed:", status);
        }
      }
    );
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateMap(latitude, longitude);
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Failed to get current location. Please enable location services."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleNext = () => {
    if (locationSelected) {
      navigate("/rides/create/departure-time");
    }
  };

  return (
    <motion.div
      className="flex flex-row items-start p-5 gap-8 text-gray-950 bg-green-200 h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left Section */}
      <div className="w-1/2">
        <h1 className="text-2xl font-semibold mb-4">
          Where will you start your ride?
        </h1>

        {/* Pickup Location Input */}
        <motion.input
          ref={inputRef}
          type="text"
          placeholder="Enter a location"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="input input-bordered text-white w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />

        {/* Next Button */}
        <motion.button
          className={`btn btn-primary mt-4 ${
            !locationSelected && "btn-disabled"
          }`}
          onClick={handleNext}
          disabled={!locationSelected}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Next
        </motion.button>
      </div>

      {/* Right Section - Map */}
      <div className="w-1/2">
        <p className="text-sm text-gray-500 mb-2 text-center">
          Pick Location from Map
        </p>
        <div className="w-full h-[400px] rounded-lg overflow-hidden">
          <div ref={mapRef} className="w-full h-full"></div>
        </div>
        <motion.button
          className="btn btn-secondary w-full mt-3"
          onClick={handleUseMyLocation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Use My Location
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PickupLocation;
