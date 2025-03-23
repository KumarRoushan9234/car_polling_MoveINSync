import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../util/api";
import toast from "react-hot-toast";

export const useAuthStore = create(
  persist(
    (set,get) => ({
      authUser: null,
      email: null,
      onlineUsers: [],
      isSigningUp: false,
      isLoggingIn: false,
      isSigningOut: false,
      isUpdatingProfile: false,
      isCheckingAuth: true,
      isVerifyingEmail: false,
      isSendingResetEmail: false,
      isResettingPassword: false,

      
      checkAuth: async () => {
        try {
          const res = await api.get("/auth/check-auth");
          console.log("check-Auth : ",res.data.data);
          if (res.data.data) {
            set({ authUser: res.data.data });
            console.log("auth sucess");
          }
          set({ authUser: res.data.data });
        } catch (error) {
          console.error("CheckAuth Error:", error.response?.data?.message || error.message);
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },


      login: async (formData) => {
        set({ isLoggingIn: true });
        try {
          const res = await api.post("/auth/login", formData);
          console.log("login :",res);
          if (res.data.success) {
            set({ authUser: res.data.data });
            toast.success("Logged in successfully!");
            await get().checkAuth(); 
            // <-- Add this line
            return { success: true };
          } else {
            toast.error("Invalid email or password.");
          }
        } catch (error) {
          console.error("Login Error:", error.response?.data?.message || error.message);
          toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
          set({ isLoggingIn: false });
        }
      },

      signup: async (data) => {
        console.log("Sending registration request with:(frontend) : ",data);
        set({ isSigningUp: true });
        set({email:data.email});
        
        try {
          const res = await api.post("/auth/register", data);
          console.log("Signup response:", res.data);

          if (res.data.success) {
            return { success: true, message: "Registration successful! Please check your email for verification." };
          } else {
            return { success: false, message: res.data.message || "An unknown error occurred." };
          }
        } catch (error) {
          console.error("Signup Error:", error);
          if (error.response) {
              console.error("Server Error Response:", error.response.data);
          } 
          else {
              console.error("No response received from server");
          }
          return { success: false, message: error.response?.data?.message || "Something went wrong!" };
      } finally {
          set({ isSigningUp: false });
        }
      },
    
      verifyEmail: async (token, email) => {
        set({ isVerifyingEmail: true });
        try {
          console.log(token, email);
          const res = await api.post("/auth/verify-email", { email,otp:token });
          toast.success("Email verified successfully!");
          set({ authUser: res.data.data });
        } catch (error) {
          console.error("Email Verification Error:", error.response?.data?.message || error.message);
          toast.error(error.response?.data?.message || "Invalid or expired token!");
        } finally {
          set({ isVerifyingEmail: false });
        }
      },

      logout: async () => {
        set({ isSigningOut: true });
        try {
          await api.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully!");
        } catch (error) {
          console.error("Logout Error:", error.response?.data?.message || error.message);
          toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
          set({ isSigningOut: false });
        }
      },

      
      updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await api.put("/auth/update-profile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully!");
        } catch (error) {
          console.error("Update Profile Error:", error.response?.data?.message || error.message);
          toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      
      forgotPassword: async (email) => {
        set({ isSendingResetEmail: true });
        try {
          await api.post("/auth/forgot-password", { email });
          toast.success("Password reset email sent!");
        } catch (error) {
          console.error("Forgot Password Error:", error.response?.data?.message || error.message);
          toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
          set({ isSendingResetEmail: false });
        }
      },

      // ✅ Reset password
      resetPassword: async (data) => {
        set({ isResettingPassword: true });
        try {
          const res = await api.post("/auth/reset-password", data);
          toast.success("Password reset successfully! Please log in.");
          set({ authUser: res.data });
        } catch (error) {
          console.error("Reset Password Error:", error.response?.data?.message || error.message);
          toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
          set({ isResettingPassword: false });
        }
      },
    }),
    {
      name: "auth-storage", // Name of local storage key
      getStorage: () => localStorage, // Use localStorage to persist auth state
    }
  )
);