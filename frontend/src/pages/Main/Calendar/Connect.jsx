import { useState, useEffect } from "react";
import { X, ArrowRight, CheckCircle } from "lucide-react";

import Calendar from "../../../assets/calendar.png"
import Meet from "../../../assets/meet.png"

import axios from "axios"
import API_ROUTE from "../../../constant/APIRoutes"
import toast from "react-hot-toast"

export default function ConnectGoogle({ isOpen, onClose }) {

  if (!isOpen) return null;

  const handleConnectGoogle = () => {
    // Add your Google OAuth integration logic here
    toast.success("Google integration coming soon!");
  };

  const handleSkipForNow = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">

        {/* Modal Content */}
        <div className="p-6 text-center space-y-6 my-4">
          {/* Google Services Icons */}
          <div className="flex justify-center items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl">
              <img src={Calendar} width={60} height={60} alt="Google Calendar" className="mx-auto" />
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl">
              <img src={Meet} width={60} height={60} alt="Google Meet" className="mx-auto" />
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-700">
              Get the Best Experience
            </h3>
            <p className="text-gray-500 leading-relaxed">
              Connect your Google account to sync events automatically and schedule meetings seamlessly for the optimal calendar experience.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={handleConnectGoogle}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Connect Google Account
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleSkipForNow}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}