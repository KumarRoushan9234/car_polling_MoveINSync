import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../util/api";
import { FaPhone, FaCar, FaMoneyBillWave } from "react-icons/fa";
import { MdMoneyOff } from "react-icons/md";

const BookRide = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [numPassengers, setNumPassengers] = useState(1);
  const [offeredFare, setOfferedFare] = useState(ride?.fareRange?.min || 0);
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState("UPI");
  const [message, setMessage] = useState(
    "Hello, I've just booked your ride! I'd be glad to travel with you. Can I get more information on ...?"
  );

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const res = await api.get(`/rides/${id}`);
        setRide(res.data.data);
        setNumPassengers(res.data.data.numPassengers || 1);
      } catch (error) {
        toast.error("Failed to fetch ride details.");
      }
    };
    fetchRideDetails();
  }, [id]);

  const handleSubmit = async () => {
    const bookingData = {
      numPassengers,
      offeredFare,
      preferredPaymentMethod,
    };

    try {
      const res = await api.post(`/rides/${id}/join`, bookingData);
      toast.success(res.data.message);

      navigate(`/rides/${id}`);
    } catch (error) {
      toast.error(`Booking failed. Please try again. ${error}`);

      navigate("/rides");
    }
  };

  if (!ride) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="flex justify-between gap-8">
        <div className="w-2/3 bg-white p-6 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Ride Details
          </h2>
          <div className="space-y-6 mt-5">
            <div className="text-gray-600">
              <div className="flex items-center space-x-3">
                <FaCar className="text-gray-500 text-xl" />
                <span className="font-semibold text-gray-700">From: </span>
                <div className="flex items-center space-x-2">
                  <span>{ride.pickupLocation?.address}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaCar className="text-gray-500 text-xl" />
                <span className="font-semibold text-gray-700">To: </span>
                <div className="flex items-center space-x-2">
                  <span>{ride.dropLocation?.address}</span>
                </div>
              </div>
            </div>

            <div className="text-gray-600 mt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">
                  Departure Time:
                </span>
                <span>
                  {ride.departureDate} at {ride.departureTime}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold text-gray-700">
                  Estimated Time:
                </span>
                <span>{ride.durationInMinutes} mins</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold text-gray-700">
                  Estimated Distance:
                </span>
                <span>{ride.distanceInKm} km</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <MdMoneyOff className="text-gray-500 text-xl" />
              <span className="font-semibold text-gray-700">Fare Range:</span>
              <span className="text-gray-800">
                ₹{ride.fareRange?.min} - ₹{ride.fareRange?.max}
              </span>
              <input
                type="range"
                min={ride.fareRange?.min}
                max={ride.fareRange?.max}
                value={offeredFare}
                onChange={(e) => setOfferedFare(e.target.value)}
                className="w-full mt-4"
              />
              <div className="text-center mt-2 text-gray-600">
                Selected Fare: ₹{" "}
                <p className="text-yellow-300">{offeredFare}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/3 bg-white p-6 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Driver Details
          </h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <FaCar className="text-gray-500 text-xl" />
              <span className="font-semibold text-gray-700">Driver Name:</span>
              <span className="text-gray-800">{ride.driver?.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhone className="text-gray-500 text-xl" />
              <span className="font-semibold text-gray-700">Email:</span>
              <span className="text-gray-800">{ride.driver?.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaCar className="text-gray-500 text-xl" />
              <span className="font-semibold text-gray-700">Car Model:</span>
              <span className="text-gray-800">{ride.vehicle?.model}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaCar className="text-gray-500 text-xl" />
              <span className="font-semibold text-gray-700">Car Plate:</span>
              <span className="text-gray-800">{ride.vehicle?.plate}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaCar className="text-gray-500 text-xl" />
              <span className="font-semibold text-gray-700">Car Color:</span>
              <span className="text-gray-800">{ride.vehicle?.color}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Your Booking
        </h3>

        <div className="flex items-center space-x-3 mb-6">
          <label className="font-semibold text-gray-700">
            Number of Passengers:
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setNumPassengers(Math.max(1, numPassengers - 1))}
              className="p-2 border rounded-lg text-black"
            >
              -
            </button>
            <span className="text-gray-600">{numPassengers}</span>
            <button
              onClick={() =>
                setNumPassengers(
                  Math.min(ride.availableSeats, numPassengers + 1)
                )
              }
              className="p-2 border rounded-lg text-black"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-6">
          <label className="font-semibold text-gray-700">
            Preferred Payment Method:
          </label>
          <select
            value={preferredPaymentMethod}
            onChange={(e) => setPreferredPaymentMethod(e.target.value)}
            className="w-40 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          >
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="font-semibold text-gray-700 ">
            Message to Driver:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            rows="5"
            placeholder="Type your message to the driver..."
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaMoneyBillWave className="inline-block mr-2" />
          Request Booking
        </button>
      </div>
    </div>
  );
};

export default BookRide;
