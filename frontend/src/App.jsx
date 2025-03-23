import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/authStore";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Loader from "./components/Loader";
import MainLayout from "./components/main/MainLayout";

// Pages
import Home from "./pages/Home";
import ProfilePage from "./pages/Profile";
import Welcome from "./pages/Welcome";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";

// Rides
import RidesList from "./pages/rides/RidesList";
import RideDetails from "./pages/rides/RideDetails";

import CancelRide from "./pages/rides/CancelRide";
import RespondRideRequest from "./pages/rides/driver/RespondRideRequest";
import RidePassengers from "./pages/rides/driver/RidePassengers";
import UpdateRide from "./pages/rides/driver/UpdateRide";

// ride main
import CreateRide from "./pages/rides/driver/createRide/CreateRide";
import BookRide from "./pages/rides/BookRide";
import YourRides from "./pages/rides/YourRides/YourRides";

import Driver from "./pages/rides/YourRides/Driver";
import Help from "./pages/Help";
import Others_Profile from "./pages/Others_Profile";
import Inbox from "./pages/Inbox";
import Chat from "./pages/Chat";
import PhoneVerify from "./pages/PhoneVerify";

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) return <Loader />;

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/" element={<Welcome />} />

        {/* Redirect to Home if Authenticated */}
        <Route
          path="/"
          element={
            authUser ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Others_Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver-page/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Driver />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/driver/verify_phone"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PhoneVerify />
              </MainLayout>
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/verify_phone"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PhoneVerify />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger-page/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Driver />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Inbox />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:receiverId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Chat />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rides"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RidesList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/your_rides"
          element={
            <ProtectedRoute>
              <MainLayout>
                <YourRides />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rides/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RideDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-a-pool/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <BookRide />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rides/create/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CreateRide />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rides/:id/update"
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateRide />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rides/:id/passengers"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RidePassengers />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rides/:id/respond"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RespondRideRequest />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rides/:id/cancel"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CancelRide />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Help />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
