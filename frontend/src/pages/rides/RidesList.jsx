import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import api from "../../util/api";
import { toast } from "react-hot-toast";
import SearchBar from "../../components/ride/SearchBar";
import RideCard from "../../components/ride/RideCard";
import Filters from "../../components/ride/Filters";

const RidesList = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    maxPayment: 500,
    smokingAllowed: false,
    music: false,
    petsAllowed: false,
    femaleOnly: false,
    chattyDriver: false,
    quietRide: false,
    airConditioning: false,
    luggageSpace: false,
    windowSeatPreferred: false,
  });

  const searchData = location.state || null;

  useEffect(() => {
    fetchRides();
  }, [searchData, filters]);

  const fetchRides = async () => {
    setLoading(true);
    try {
      let res;
      if (!searchData) {
        res = await api.get("/rides");
      } else {
        res = await api.get("/rides/search", {
          params: {
            leavingCoords: searchData.leavingCoords,
            destinationCoords: searchData.destinationCoords,
            date: searchData.date,
            numPassengers: searchData.numPassengers,
            preferences: filters,
          },
        });
      }

      setRides(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch rides.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto text-black">
      <div className="sticky top-0 bg-white z-10 p-6 shadow-md">
        <SearchBar />
      </div>

      <div className="flex gap-6 mt-4">
        <div className="w-2/5">
          <Filters filters={filters} setFilters={setFilters} />
        </div>

        <div className="w-3/5 h-[70vh] overflow-y-auto pr-2 pb-10">
          <h2 className="text-2xl font-bold mb-4">Available Rides</h2>

          {loading ? (
            <p className="text-gray-500">Loading rides...</p>
          ) : rides.length === 0 ? (
            <p className="text-gray-500">No rides available.</p>
          ) : (
            <div className="space-y-6">
              {rides.map((ride) => (
                <RideCard key={ride._id} ride={ride} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RidesList;
