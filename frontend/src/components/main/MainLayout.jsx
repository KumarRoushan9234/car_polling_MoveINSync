import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen ">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-auto w-screen bg-gradient-to-r from-blue-50 to-blue-100 mt-14">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
