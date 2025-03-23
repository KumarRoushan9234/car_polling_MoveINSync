import React from "react";

const Help = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-800">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-semibold text-blue-600">Help & Support</h2>
        <p className="mt-2 text-lg text-gray-600">
          Your guide to using the carpooling system
        </p>
      </div>

      {/* App Purpose */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          What is this app?
        </h3>
        <p className="text-lg text-gray-600">
          This app is designed to help you find carpooling opportunities, share
          rides, and connect with other users. Whether you are a driver or a
          rider, our platform makes carpooling simple, cost-effective, and
          eco-friendly. It helps reduce traffic congestion, cut down on fuel
          consumption, and improve the overall travel experience.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          <div className="p-4 border-b">
            <h4 className="text-lg font-medium text-gray-700">
              How do I create a ride?
            </h4>
            <p className="text-gray-600">
              To create a ride, simply go to the "Create Ride" page, fill out
              the details like your pickup location, departure time, vehicle
              information, and fare range. You can then submit the ride and wait
              for passengers to join.
            </p>
          </div>
          <div className="p-4 border-b">
            <h4 className="text-lg font-medium text-gray-700">
              How do I join a ride as a passenger?
            </h4>
            <p className="text-gray-600">
              To join a ride, search for available rides based on your location
              and preferences. Once you find a ride that suits you, you can
              request to join, and the driver will approve or reject your
              request.
            </p>
          </div>
          <div className="p-4 border-b">
            <h4 className="text-lg font-medium text-gray-700">
              How are fares determined?
            </h4>
            <p className="text-gray-600">
              The fare for a ride is set by the driver and is based on factors
              such as distance, fuel costs, and availability. You can check the
              fare range before requesting to join a ride.
            </p>
          </div>
          <div className="p-4 border-b">
            <h4 className="text-lg font-medium text-gray-700">
              Can I modify my ride details?
            </h4>
            <p className="text-gray-600">
              Yes, you can update your ride details, including fare range,
              vehicle information, and available seats. Simply go to your ride
              details page and update the fields as needed.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          How to Use the App
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 text-white p-4 rounded-full">
              <i className="fas fa-car"></i>
            </div>
            <p className="text-lg text-gray-600">
              Step 1: **Create a Ride** - As a driver, create a new ride by
              specifying the pickup and drop locations, departure time, and
              vehicle details.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-green-600 text-white p-4 rounded-full">
              <i className="fas fa-users"></i>
            </div>
            <p className="text-lg text-gray-600">
              Step 2: **Request a Ride** - As a passenger, search for available
              rides and request to join one that fits your schedule and
              preferences.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-600 text-white p-4 rounded-full">
              <i className="fas fa-check-circle"></i>
            </div>
            <p className="text-lg text-gray-600">
              Step 3: **Confirm & Ride** - Once the driver accepts your request,
              you can start your journey together!
            </p>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Need Help?
        </h3>
        <p className="text-lg text-gray-600 mb-4">
          If you're facing any issues or need further assistance, feel free to
          reach out to our support team.
        </p>
        <div className="flex justify-center space-x-6">
          <a
            href="mailto:support@carpoolapp.com"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Email Support
          </a>
          <a
            href="tel:+1234567890"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Call Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;
