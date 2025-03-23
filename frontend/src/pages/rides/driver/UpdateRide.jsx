import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../util/api";
import { toast } from "react-hot-toast";

const UpdateRide = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await api.get(`/rides/${id}`);
        setRide(res.data.data);
      } catch (error) {
        toast.error("Failed to fetch ride details.");
        navigate("/rides");
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/rides/${id}`, ride);
      toast.success("Ride updated successfully!");
      navigate(`/rides/${id}`);
    } catch (error) {
      toast.error("Failed to update ride.");
    }
  };

  if (loading) return <p>Loading ride details...</p>;
  if (!ride) return <p>Ride not found.</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Update Ride</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-semibold">Pickup Location</label>
          <input
            type="text"
            value={ride.pickupLocation}
            onChange={(e) =>
              setRide({ ...ride, pickupLocation: e.target.value })
            }
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-semibold">Drop Location</label>
          <input
            type="text"
            value={ride.dropLocation}
            onChange={(e) => setRide({ ...ride, dropLocation: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md w-full"
        >
          Update Ride
        </button>
      </form>
    </div>
  );
};

export default UpdateRide;
