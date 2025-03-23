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

  // Example of preferences array
  const preferences = [
    { key: "smoking", label: "Smoking" },
    { key: "pets", label: "Pets Allowed" },
    { key: "music", label: "Music" },
    // Add more preferences as needed
  ];

  return (
    <div className="bg-white p-6 border rounded-lg shadow-md m-2 h-fit sticky top-20">
      <h3 className="text-xl font-bold mb-4">Filters</h3>

      {/* Payment Slider */}
      <div className="mb-4">
        <label className="text-sm font-semibold">
          Max Payment: ₹{filters.maxPayment || 500}
        </label>
        <input
          type="range"
          min="0"
          max="1000"
          step="50"
          value={filters.maxPayment || 500}
          onChange={handleSliderChange}
          className="w-full mt-2"
        />
      </div>

      {/* Preferences Filters */}
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
