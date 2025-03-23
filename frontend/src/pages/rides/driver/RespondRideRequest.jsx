import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../util/api";
import { toast } from "react-hot-toast";

const RespondRideRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get(`/rides/${id}/passengers`);
        setRequests(res.data.data.filter((p) => p.status === "pending"));
      } catch (error) {
        toast.error("Failed to fetch requests.");
      }
    };
    fetchRequests();
  }, [id]);

  const handleResponse = async (passengerId, status) => {
    try {
      await api.put(`/rides/${id}/respond`, { passengerId, status });
      toast.success(`Request ${status}!`);
      setRequests(requests.filter((r) => r._id !== passengerId));
    } catch (error) {
      toast.error("Failed to respond to request.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Ride Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul className="space-y-2">
          {requests.map((request) => (
            <li key={request._id} className="p-2 border rounded-md">
              <p>
                <strong>Name:</strong> {request.user.name}
              </p>
              <p>
                <strong>Seats:</strong> {request.numPassengers}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleResponse(request._id, "accepted")}
                  className="bg-green-500 text-white p-2 rounded-md"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleResponse(request._id, "rejected")}
                  className="bg-red-500 text-white p-2 rounded-md"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RespondRideRequest;
