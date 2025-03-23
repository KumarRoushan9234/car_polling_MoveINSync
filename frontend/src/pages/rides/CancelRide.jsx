import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../util/api";
import { toast } from "react-hot-toast";

const CancelRide = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleCancel = async () => {
    try {
      await api.delete(`/rides/${id}`);
      toast.success("Ride canceled successfully.");
      navigate("/rides");
    } catch (error) {
      toast.error("Failed to cancel ride.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md text-center">
      <h2 className="text-xl font-bold mb-4">Cancel Ride</h2>
      <p>Are you sure you want to cancel this ride?</p>
      <div className="flex gap-2 mt-4 justify-center">
        <button
          onClick={handleCancel}
          className="bg-red-500 text-white p-2 rounded-md"
        >
          Yes, Cancel
        </button>
        <button
          onClick={() => navigate(`/rides/${id}`)}
          className="bg-gray-500 text-white p-2 rounded-md"
        >
          No, Go Back
        </button>
      </div>
    </div>
  );
};

export default CancelRide;
