import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Driver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        // const res = await axios.get(
        //   `http://localhost:5000/api/rides/${id}/passengers`,
        //   {
        //     withCredentials: true,
        //   }
        // );
        // console.log("messages : ", res);

        const response = await axios.get(
          `http://localhost:5000/api/rides/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log("ride-details : ", response);

        setRideDetails(response.data.data);
        setRequests(response.data.data.passengers);
      } catch (error) {
        toast.error("Error fetching ride details.");
      } finally {
        setLoading(false);
      }
    };
    fetchRideDetails();
  }, [id]);

  const handleRequestResponse = async (passengerId, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/rides/${id}/respond`,
        { passengerId, status },
        { withCredentials: true }
      );

      console.log(res);
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === passengerId ? { ...request, status } : request
        )
      );
      if (res.data.success == true) {
        toast.success(
          `Request ${status === "accepted" ? "approved" : "declined"}`
        );
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to respond to request.");
    }
  };

  const handleCloseRide = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/rides/${id}/close`,
        {},
        { withCredentials: true }
      );

      console.log(res);

      toast.success("Ride closed for new bookings.");
      navigate("/rides");
    } catch (error) {
      toast.error("Failed to close the ride.");
    }
  };

  const handleEndRide = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/rides/${id}/complete`,
        {},
        { withCredentials: true }
      );

      console.log(res);

      toast.success("Ride completed!");
      navigate("/rides");
    } catch (error) {
      toast.error("Failed to complete the ride.");
    }
  };

  const handleDeleteRide = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/rides/${id}`, {
        withCredentials: true,
      });
      toast.success("Ride deleted successfully.");
      navigate("/rides");
    } catch (error) {
      toast.error("Failed to delete the ride.");
    }
  };

  if (loading) return <div className="text-gray-950">Loading...</div>;
  if (!rideDetails)
    return <div className="text-gray-950">No ride details found.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-950">
      <h2 className="text-3xl font-bold mb-4">Driver's Ride Details</h2>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-green-100 p-6 rounded-lg shadow-md mb-6"
      >
        <h3 className="text-xl font-semibold mb-4">Ride Information</h3>
        <div className="space-y-4">
          <p>
            <strong>Driver:</strong> {rideDetails.driver.name} (
            {rideDetails.driver.email})
          </p>
          <p>
            <strong>Status:</strong> {rideDetails.status}
          </p>
          <p>
            <strong>Vehicle:</strong> {rideDetails.vehicle.model} (
            {rideDetails.vehicle.color}) - {rideDetails.vehicle.plate}
          </p>
          <p>
            <strong>Fare Range:</strong> ₹{rideDetails.fareRange.min} - ₹
            {rideDetails.fareRange.max}
          </p>
          <p>
            <strong>Available Seats:</strong> {rideDetails.availableSeats}
          </p>
          <p>
            <strong>Available Seats:</strong> {rideDetails.availableSeats}
          </p>
          <p>
            <strong>Departure Time:</strong> {rideDetails.departureDate} at{" "}
            {rideDetails.departureTime}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-green-100 p-6 rounded-lg shadow-md mb-6"
      >
        <h3 className="text-xl font-semibold mb-4">Passengers</h3>
        {requests.length > 0 ? (
          requests.map((request) => (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 border-b pb-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p>
                    <strong>Name:</strong>{" "}
                    {request.user?.name?.trim() || "Rider"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {request.user?.email?.trim() || "Not Provided"}
                  </p>

                  <p>
                    <strong>Seats Requested:</strong> {request.numPassengers}
                  </p>

                  <p>
                    <strong>Status : </strong> {request.status}
                  </p>
                  <p>
                    <strong>Due Payment:</strong> ₹{request.duePayment}
                  </p>
                  <p>
                    <strong>Payment Status:</strong> {request.paymentStatus}
                  </p>
                  <p>
                    <strong>Preferred Payment:</strong>{" "}
                    {request.preferredPaymentMethod}
                  </p>
                  <p>
                    <strong>Preferences:</strong>
                  </p>
                  <ul className="list-disc ml-6 text-sm text-gray-600">
                    <li>
                      Smoking:{" "}
                      {request.preferences.smokingAllowed
                        ? "Allowed"
                        : "Not Allowed"}
                    </li>
                    <li>Music: {request.preferences.music ? "Yes" : "No"}</li>
                    <li>
                      Pets:{" "}
                      {request.preferences.petsAllowed
                        ? "Allowed"
                        : "Not Allowed"}
                    </li>
                    <li>
                      Female-Only:{" "}
                      {request.preferences.femaleOnly ? "Yes" : "No"}
                    </li>
                    <li>
                      Chatty Driver:{" "}
                      {request.preferences.chattyDriver ? "Yes" : "No"}
                    </li>
                    <li>
                      Quiet Ride: {request.preferences.quietRide ? "Yes" : "No"}
                    </li>
                  </ul>
                </div>
                {request.status === "pending" &&
                  rideDetails.availableSeats > 0 && (
                    <div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleRequestResponse(request._id, "accepted")
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2 transition hover:bg-green-700"
                      >
                        Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleRequestResponse(request._id, "rejected")
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-lg transition hover:bg-red-700"
                      >
                        Reject
                      </motion.button>
                    </div>
                  )}
              </div>
            </motion.div>
          ))
        ) : (
          <p>No passengers have requested this ride yet.</p>
        )}
      </motion.div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCloseRide}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg transition hover:bg-gray-700"
        >
          Close Ride
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEndRide}
          className="bg-yellow-600 text-white px-6 py-3 rounded-lg transition hover:bg-yellow-700"
        >
          End Ride
        </motion.button>
        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDeleteRide}
          className="bg-red-600 text-white px-6 py-3 rounded-lg transition hover:bg-red-700"
        >
          Delete Ride
        </motion.button> */}
      </div>
    </div>
  );
};

export default Driver;
