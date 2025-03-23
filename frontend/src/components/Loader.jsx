import React from "react";

const Loader = ({ isLoading }) => {
  if (!isLoading) return null; // If not loading, don't render anything

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <span className="loading loading-ring loading-xl text-white"></span>
    </div>
  );
};

export default Loader;
