import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, AlertCircle, Sun, Moon } from "lucide-react"; // Import necessary icons

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for showing/hiding confirm password
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");
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

  const handleReset = async () => {
    setError(""); // Clear previous errors

    if (!password || !confirm) {
      setError("Please enter both new password and confirm password.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    // Basic password validation (can be expanded as needed)
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true); // Set loading to true

    try {
      await axios.post("/api/ForgotPassword/reset-password", { email, newPassword: password });
      localStorage.removeItem("resetEmail"); // Clear email from local storage after successful reset
      navigate("/login");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Use specific error message from backend
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white-light dark:bg-brown-dark px-4">
      <div className="bg-white dark:bg-brown-700 p-6 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-brown-dark dark:text-off-white">Reset Password</h2>
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full text-brown-dark dark:text-off-white hover:bg-brown-100 dark:hover:bg-brown-600 transition-colors duration-200"
          >
            {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>
        
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            className="w-full p-2 border rounded-lg pr-10
              border-brown-300 dark:border-brown-500 focus:border-brown-500 dark:focus:border-brown-400 focus:ring-brown-200 dark:focus:ring-600
              bg-off-white dark:bg-brown-800 text-brown-dark dark:text-off-white focus:outline-none focus:ring-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brown-500 dark:text-brown-300 hover:text-brown-700 dark:hover:text-brown-100 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="relative mb-3">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="w-full p-2 border rounded-lg pr-10
              border-brown-300 dark:border-brown-500 focus:border-brown-500 dark:focus:border-brown-400 focus:ring-brown-200 dark:focus:ring-600
              bg-off-white dark:bg-brown-800 text-brown-dark dark:text-off-white focus:outline-none focus:ring-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brown-500 dark:text-brown-300 hover:text-brown-700 dark:hover:text-brown-100 focus:outline-none"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {error && (
          <p className="text-red-500 dark:text-red-300 text-sm mb-2 flex items-center space-x-1">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </p>
        )}
        <button
          className="w-full bg-brown-600 text-white py-2 rounded-xl hover:bg-brown-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          onClick={handleReset}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </div>
    </div>
  );
}
