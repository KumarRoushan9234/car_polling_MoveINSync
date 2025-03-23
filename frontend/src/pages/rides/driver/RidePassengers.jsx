import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../util/api";
import { toast } from "react-hot-toast";

const RidePassengers = () => {
  const { id } = useParams();
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const res = await api.get(`/rides/${id}/passengers`);
        setPassengers(res.data.data);
      } catch (error) {
        toast.error("Failed to fetch passengers.");
      }
    };
    fetchPassengers();
  }, [id]);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Passengers</h2>
      {passengers.length === 0 ? (
        <p>No passengers yet.</p>
      ) : (
        <ul className="space-y-2">
          {passengers.map((passenger) => (
            <li key={passenger._id} className="p-2 border rounded-md">
              <p>
                <strong>Name:</strong> {passenger.user.name}
              </p>
              <p>
                <strong>Status:</strong> {passenger.status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RidePassengers;
