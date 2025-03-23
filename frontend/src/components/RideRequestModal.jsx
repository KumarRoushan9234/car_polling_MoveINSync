import React from "react";
import { FaUser } from "react-icons/fa";

const RideRequestModal = ({ request, onClose, onResponse }) => {
  if (!request) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h3 className="text-xl font-semibold mb-4">
          Request from {request.user.name}
        </h3>
        <p>
          <strong>Payment Status:</strong> {request.paymentStatus}
        </p>
        <p>
          <strong>Seats Requested:</strong> {request.numPassengers}
        </p>
        <p>
          <strong>Preferred Payment:</strong> {request.preferredPaymentMethod}
        </p>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => {
              onResponse(request._id, "accepted");
              onClose();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Accept
          </button>
          <button
            onClick={() => {
              onResponse(request._id, "rejected");
              onClose();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Reject
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RideRequestModal;
