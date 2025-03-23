import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { motion } from "framer-motion";

const DropLocation = ({ updateFormData, formData }) => {
  const [locationSelected, setLocationSelected] = useState(
    !!formData.dropLocation
  );
  const [inputValue, setInputValue] = useState(
    formData.dropLocation?.address || ""
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

      updateFormData({ dropLocation: location });
      setInputValue(location.address);
      setLocationSelected(true);
      updateMap(location.lat, location.lon);
    });
  };

  // Initialize Google Map
  const initMap = () => {
    const defaultLocation = { lat: 28.6139, lng: 77.209 }; // New Delhi
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
            dropLocation: {
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
      navigate("/rides/create/vehicle"); // Navigate to vehicle details
    }
  };

  return (
    <motion.div
      className="flex flex-row items-start p-5 gap-8 text-gray-950 bg-green-200 h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <button
          className="text-gray-700 hover:text-black text-3xl"
          onClick={() => navigate("/rides/create/pickup-location")}
        >
          <IoArrowBackCircleOutline />
        </button>
      </div>

      {/* Left Section */}
      <div className="w-1/2">
        <h1 className="text-2xl font-semibold mb-4 text-gray-700">
          Where is the drop-off location?
        </h1>

        {/* Location Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter drop location"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="input input-bordered text-white w-full mb-4"
        />

        {/* Next Button */}
        <button
          className={`btn btn-primary w-full mt-4 ${
            !locationSelected && "btn-disabled"
          }`}
          onClick={handleNext}
          disabled={!locationSelected}
        >
          Next
        </button>
      </div>

      {/* Right Section - Map */}
      <div className="w-1/2">
        <p className="text-sm text-gray-500 mb-2 text-center">
          Pick Drop Location from Map
        </p>
        <div className="w-full h-[400px] rounded-lg overflow-hidden">
          <div ref={mapRef} className="w-full h-full"></div>
        </div>

        {/* Use My Location Button */}
        <button
          className="btn btn-secondary w-full mt-3"
          onClick={handleUseMyLocation}
        >
          Use My Location
        </button>
      </div>
    </motion.div>
  );
};

export default DropLocation;
