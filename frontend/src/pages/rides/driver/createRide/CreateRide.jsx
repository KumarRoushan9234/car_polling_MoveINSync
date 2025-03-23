import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import PickupLocation from "./steps/PickupLocation";
import DepartureTime from "./steps/DepartureTime";
import DropLocation from "./steps/DropLocation";
import VehicleDetails from "./steps/VehicleDetails";
import FareRange from "./steps/FareRange";
import MaxPassengers from "./steps/MaxPassengers";
import Preferences from "./steps/Preferences";
import AdditionalNotes from "./steps/AdditionalNotes";
import RideCreated from "./steps/RideCreated";
import StartCreateRide from "./StartCreateRide";
import ConfirmRide from "./steps/ConfirmRide";

const CreateRide = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pickupLocation: { lat: "", lon: "", address: "" },
    dropLocation: { lat: "", lon: "", address: "" },
    departureDate: "",
    departureTime: "",
    vehicle: { type: "", model: "", plate: "", color: "" },
    fareRange: { min: 100, max: 300 },
    maxPassengers: 1,
    preferences: {
      smokingAllowed: false,
      music: false,
      petsAllowed: false,
      femaleOnly: false,
      chattyDriver: false,
    },
    additionalNotes: "",
  });

  // Function to update form data and ensure deep merging
  const updateFormData = (data) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
      vehicle: data.vehicle
        ? { ...prev.vehicle, ...data.vehicle }
        : prev.vehicle,
      fareRange: data.fareRange
        ? { ...prev.fareRange, ...data.fareRange }
        : prev.fareRange,
      preferences: data.preferences
        ? { ...prev.preferences, ...data.preferences }
        : prev.preferences,
      pickupLocation: data.pickupLocation
        ? { ...prev.pickupLocation, ...data.pickupLocation }
        : prev.pickupLocation,
      dropLocation: data.dropLocation
        ? { ...prev.dropLocation, ...data.dropLocation }
        : prev.dropLocation,
    }));
  };

  // Function to submit ride details
  const submitRide = async () => {
    try {
      console.log("Submitting Ride Data:", formData);
      toast.loading("Creating ride...");

      const res = await axios.post(
        "http://localhost:5000/api/rides/create",
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Ride Created Successfully:", res.data);
      toast.dismiss();
      toast.success("Ride created successfully!");

      navigate("/rides/create/success", { state: { ride: res.data.data } });
    } catch (error) {
      console.error("Error creating ride:", error.response?.data || error);
      toast.dismiss();
      toast.error(
        error.response?.data?.message ||
          "Failed to create ride. Please try again."
      );
      navigate("/home");
    }
  };

  return (
    <div className="text-sm">
      <Routes>
        <Route index element={<StartCreateRide />} />
        <Route
          path="pickup-location"
          element={
            <PickupLocation
              updateFormData={updateFormData}
              formData={formData}
            />
          }
        />
        <Route
          path="departure-time"
          element={
            <DepartureTime
              updateFormData={updateFormData}
              formData={formData}
            />
          }
        />
        <Route
          path="drop-location"
          element={
            <DropLocation updateFormData={updateFormData} formData={formData} />
          }
        />
        <Route
          path="vehicle"
          element={
            <VehicleDetails
              updateFormData={updateFormData}
              formData={formData}
            />
          }
        />
        <Route
          path="fare"
          element={
            <FareRange updateFormData={updateFormData} formData={formData} />
          }
        />
        <Route
          path="max-passengers"
          element={
            <MaxPassengers
              updateFormData={updateFormData}
              formData={formData}
            />
          }
        />
        <Route
          path="preferences"
          element={
            <Preferences updateFormData={updateFormData} formData={formData} />
          }
        />
        <Route
          path="additional-notes"
          element={
            <AdditionalNotes
              updateFormData={updateFormData}
              formData={formData}
            />
          }
        />
        <Route
          path="confirm"
          element={<ConfirmRide formData={formData} submitRide={submitRide} />}
        />
        <Route path="success" element={<RideCreated />} />
      </Routes>
    </div>
  );
};

export default CreateRide;
