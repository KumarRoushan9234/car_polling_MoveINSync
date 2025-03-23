import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VehicleDetails = ({ updateFormData, formData }) => {
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState({
    type: formData.vehicle?.type || "",
    model: formData.vehicle?.model || "",
    plate: formData.vehicle?.plate || "",
    color: formData.vehicle?.color || "",
  });

  useEffect(() => {
    console.log("Current Vehicle Data:", vehicle);
  }, [vehicle]);

  const handleNext = () => {
    if (!vehicle.type || !vehicle.model || !vehicle.plate || !vehicle.color) {
      alert("Please fill all vehicle details.");
      return;
    }
    updateFormData({ vehicle });
    navigate("/rides/create/fare");
  };

  return (
    // bg-gradient-to-r from-green-200 via-green-400 to-green-600 min-h-screen
    <div className="flex flex-col items-center p-5 h-screen bg-green-200">
      <h1 className="text-3xl font-semibold text-gray-600 mb-4">
        Enter your vehicle details
      </h1>

      <label className="text-gray-600 mb-2">Vehicle Type:</label>
      <select
        className="select select-bordered w-full max-w-md mt-2 text-whites"
        value={vehicle.type}
        onChange={(e) => setVehicle({ ...vehicle, type: e.target.value })}
      >
        <option value="" disabled>
          Select Type
        </option>
        <option value="Hatchback">Hatchback</option>
        <option value="Sedan">Sedan</option>
        <option value="SUV">SUV</option>
        <option value="MUV">MUV</option>
        <option value="Coupe">Coupe</option>
        <option value="Convertible">Convertible</option>
        <option value="PickupTruck">Pickup Truck</option>
      </select>

      <input
        type="text"
        className="input input-bordered w-full max-w-md mt-4"
        placeholder="Model"
        value={vehicle.model}
        onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
      />
      <input
        type="text"
        className="input input-bordered w-full max-w-md mt-4"
        placeholder="Plate Number"
        value={vehicle.plate}
        onChange={(e) => setVehicle({ ...vehicle, plate: e.target.value })}
      />
      <input
        type="text"
        className="input input-bordered w-full max-w-md mt-4"
        placeholder="Color"
        value={vehicle.color}
        onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
      />

      <button
        className="btn bg-green-700 text-white mt-6 hover:bg-green-800 transition-all"
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
};

export default VehicleDetails;
