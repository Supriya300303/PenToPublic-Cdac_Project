import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "@/services/authService";
import { AlertCircle, Sun, Moon } from "lucide-react"; // Import Sun and Moon icons

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light'); // State for theme

  // Effect to set initial theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Effect to apply theme class to documentElement and save to localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSendOtp = async () => {
    setError(""); // Clear previous errors
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true); // Set loading to true

    try {
      await sendOtp(email); // ⬅ Using service abstraction
      localStorage.setItem("resetEmail", email);
      navigate("/verify-otp");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Use specific error message from backend
      } else {
        setError("Failed to send OTP. Please check your email and try again.");
      }
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white-light dark:bg-brown-dark px-4">
      <div className="bg-white dark:bg-brown-700 p-6 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-brown-dark dark:text-off-white">Forgot Password</h2>
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full text-brown-dark dark:text-off-white hover:bg-brown-100 dark:hover:bg-brown-600 transition-colors duration-200"
          >
            {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>
        
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border rounded-lg mb-3 
            border-brown-300 dark:border-brown-500 focus:border-brown-500 dark:focus:border-brown-400 focus:ring-brown-200 dark:focus:ring-brown-600
            bg-off-white dark:bg-brown-800 text-brown-dark dark:text-off-white focus:outline-none focus:ring-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && (
          <p className="text-red-500 dark:text-red-300 text-sm mb-2 flex items-center space-x-1">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </p>
        )}
        <button
          className="w-full bg-brown-600 text-white py-2 rounded-xl hover:bg-brown-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          onClick={handleSendOtp}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Sending OTP...
            </>
          ) : (
            "Send OTP"
          )}
        </button>
      </div>
    </div>
  );
}
