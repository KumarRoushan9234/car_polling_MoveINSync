import React from "react";

const Filters = ({ filters, setFilters }) => {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSliderChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      maxPayment: Number(e.target.value),
    }));
  };

  const preferences = [
    { key: "smokingAllowed", label: "Smoking Allowed" },
    { key: "music", label: "Music" },
    { key: "petsAllowed", label: "Pets Allowed" },
    { key: "femaleOnly", label: "Female Only" },
    { key: "chattyDriver", label: "Chatty Driver" },
    { key: "quietRide", label: "Quiet Ride" },
    { key: "airConditioning", label: "Air Conditioning" },
    { key: "luggageSpace", label: "Luggage Space" },
    { key: "windowSeatPreferred", label: "Window Seat Preferred" },
  ];

  return (
    <div className="bg-white p-6 border rounded-lg shadow-md m-2 h-fit sticky top-20">
      <h3 className="text-xl font-bold mb-4">Filters</h3>

      {/* Payment Slider */}
      <div className="mb-4">
        <label className="text-sm font-semibold">
          Max Payment: ₹{filters.maxPayment}
        </label>
        <input
          type="range"
          min="0"
          max="1000"
          step="50"
          value={filters.maxPayment}
          onChange={handleSliderChange}
          className="w-full mt-2"
        />
      </div>

      {/* Preferences */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        {preferences.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={key}
              checked={filters[key] || false}
              onChange={handleCheckboxChange}
              className="accent-blue-600"
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filters;
