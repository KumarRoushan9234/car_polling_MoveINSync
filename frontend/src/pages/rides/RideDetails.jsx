import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MdOutlineAirlineSeatReclineNormal } from "react-icons/md";
import {
  FaUser,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCar,
  FaPhone,
} from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { BsCalendarDate } from "react-icons/bs";
import api from "../../util/api";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import { format } from "date-fns"; // Use date-fns for formatting dates

const RideDetails = () => {
  const { id } = useParams();
  const { authUser } = useAuthStore((state) => state);
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false); // Added state to track redirection
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const res = await api.get(`/rides/${id}`);
        setRide(res.data.data);
      } catch (error) {
        toast.error("Failed to fetch ride details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!ride) return <p className="text-center text-red-500">Ride not found.</p>;

  // Function to check if the time is valid
  const isValidTime = (timeString) => {
    const time = new Date(timeString);
    return !isNaN(time.getTime());
  };

  // Format date or return a fallback string if invalid
  const formatDate = (dateString) => {
    return isValidTime(dateString)
      ? format(new Date(dateString), "dd MMM yyyy")
      : "Invalid Date";
  };

  // Format time or return a fallback string if invalid
  const formatTime = (timeString) => {
    return isValidTime(timeString)
      ? format(new Date(timeString), "hh:mm a")
      : "Invalid Time";
  };

  const formatAddress = (address) => {
    return address || "Not specified";
  };

  const isDriver = authUser?._id === ride.driver?._id;
  const isPassenger = ride.passengers?.some(
    (passenger) => passenger._id === authUser?._id
  );

  return (
    <div className="max-w-5xl mx-auto p-6 text-black flex gap-6">
      {/* Left Content */}
      <div className="w-3/5 space-y-6">
        {/* Date Box */}
        <div className="bg-white p-4 border rounded-lg shadow-md flex items-center space-x-3">
          <BsCalendarDate className="text-blue-600 text-2xl" />
          <span className="text-lg font-bold">
            {formatDate(ride.departureDate)}
          </span>
        </div>

        {/* Route Box */}
        <div className="bg-white p-6 border rounded-lg shadow-md space-y-4">
          <h3 className="text-xl font-bold">Ride Route</h3>
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-blue-600 text-lg" />
            <p className="text-gray-700 font-semibold">
              {formatAddress(ride.pickupLocation?.address)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <IoMdTime className="text-gray-600 text-lg" />
            <span>{formatTime(ride.departureTime)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-red-600 text-lg" />
            <p className="text-gray-700 font-semibold">
              {formatAddress(ride.dropLocation?.address)}
            </p>
          </div>

          {/* Added Info */}
          <h2 className="mt-4 text-black text-lg font-bold">
            Smart Calculations
          </h2>
          <div className="flex items-center space-x-2 mt-4">
            <p className="text-gray-700 font-semibold">
              Distance: {ride.distanceInKm} km | Duration:{" "}
              {ride.durationInMinutes} min
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <p className="text-gray-700 font-semibold">
              Estimated Cost: ₹{ride.estimatedCost}
            </p>
          </div>
        </div>

        {/* Driver Info Box */}
        <div className="bg-white p-6 border rounded-lg shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaUser className="text-gray-600 text-3xl" />
              <div>
                <Link
                  to={`/profile/${ride.driver?._id}`}
                  className="text-lg font-bold text-blue-600 hover:underline"
                >
                  {ride.driver?.name || `Driver#${ride.driver?._id.slice(-4)}`}
                </Link>
                <div className="flex items-center text-green-600 space-x-1">
                  <FaCheckCircle />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-gray-600">
            <p>
              <strong>From:</strong>{" "}
              {formatAddress(ride.pickupLocation?.address)}
            </p>
            <p>
              <strong>To:</strong> {formatAddress(ride.dropLocation?.address)}
            </p>
            <p>
              <strong>Date & Time:</strong> {formatDate(ride.departureDate)} at{" "}
              {formatTime(ride.departureTime)}
            </p>
          </div>
          <p className="text-yellow-700 font-semibold">
            ⚠️ Your booking won't be confirmed until the driver approves your
            request.
          </p>

          {/* Car Details */}
          <div className="flex items-center space-x-3 text-gray-600">
            <FaCar className="text-lg" />
            <span>
              {ride.vehicle?.model} ({ride.vehicle?.color}) - Plate:{" "}
              {ride.vehicle?.plate}
            </span>
          </div>

          {/* Contact Button */}
          <Link
            to={`/chat/${ride.driver?._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700"
          >
            <FaRegMessage />
            <span>Contact Driver</span>
          </Link>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-2/5 flex flex-col items-center">
        {/* Booking Status */}
        {isDriver ? (
          <p className="bg-green-500 text-white p-2 rounded-md">
            Ride created by you
          </p>
        ) : isPassenger ? (
          <p className="bg-blue-500 text-white p-2 rounded-md">
            You have joined the ride
          </p>
        ) : null}

        {/* Book Pool Button */}
        {!isDriver && !isPassenger && (
          <Link
            to={`/book-a-pool/${id}`}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md flex items-center space-x-2 hover:bg-orange-600"
          >
            <FaUser />
            <span>Book a Pool</span>
          </Link>
        )}

        {/* Price Box */}
        <div className="bg-white p-6 border rounded-lg shadow-md mt-6 text-center">
          <h3 className="text-3xl font-bold text-gray-800">
            ₹{ride.fareRange?.min} - ₹{ride.fareRange?.max}
          </h3>
          <p className="text-gray-600 mt-2">
            <IoMdTime className="inline text-lg" />{" "}
            {formatTime(ride.departureTime)} |
            <MdOutlineAirlineSeatReclineNormal className="inline text-lg ml-1" />{" "}
            {ride.availableSeats} Seats Left
          </p>
        </div>
      </div>
    </div>
  );
};

export default RideDetails;
