import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../util/api";
import { toast } from "react-hot-toast";
import rideModel from "../../../../../backend/models/ride.model";

// handels the create routing page
const CreateRide = () => {
  const [formData, setFormData] = useState({
    vehicle: { plate: "", model: "" },
    maxPassengers: "",
    fareRange: "",
    departureTime: "",
    pickupLocation: "",
    dropLocation: "",
    preferences: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      vehicle: { ...prevData.vehicle, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/rides/create", formData);
      toast.success("Ride created successfully!");
      navigate("/rides");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating ride.");
    }
  };

  // page by page create ride

  return (
    <div className="max-w-lg mx-auto p-6 bg-white text-black shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Create a Ride</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Vehicle Model</label>
          <input
            type="text"
            name="model"
            onChange={handleVehicleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block">Vehicle Plate</label>
          <input
            type="text"
            name="plate"
            onChange={handleVehicleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block">Max Passengers</label>
          <input
            type="number"
            name="maxPassengers"
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block">Fare Range</label>
          <input
            type="text"
            name="fareRange"
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block">Departure Time</label>
          <input
            type="datetime-local"
            name="departureTime"
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block">Pickup Location</label>
          <input
            type="text"
            name="pickupLocation"
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block">Drop Location</label>
          <input
            type="text"
            name="dropLocation"
            onChange={handleChange}
            required
            className="w-full p-2 border"
          />
        </div>
        <div>
          <label className="block">Preferences (optional)</label>
          <input
            type="text"
            name="preferences"
            onChange={handleChange}
            className="w-full p-2 border"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md w-full"
        >
          Create Ride
        </button>
      </form>
    </div>
  );
};

export default CreateRide;
