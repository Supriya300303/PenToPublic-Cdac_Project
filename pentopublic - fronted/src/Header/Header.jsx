import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Sun, Moon } from 'lucide-react'; // Using Lucide icons for consistency

const indianQuotes = [
  "“Arise, awake, and stop not till the goal is reached.” – Swami Vivekananda",
  "“Be the change that you wish to see in the world.” – Mahatma Gandhi",
  "“Learning gives creativity, creativity leads to thinking.” – Dr. APJ Abdul Kalam",
  "“Education is the manifestation of the perfection already in man.” – Swami Vivekananda",
  "“You must be the change you want to see in the world.” – Mahatma Gandhi",
];

const Header = ({ theme, toggleTheme }) => { // Receive theme and toggleTheme as props
  const [quoteIndex, setQuoteIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % indianQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="bg-off-white-light/80 dark:bg-brown-dark/80 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3 no-underline"> {/* Added no-underline here */}
              <div className="w-10 h-10 bg-gradient-to-br from-brown-500 to-brown-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brown-600 to-brown-700 bg-clip-text text-transparent">
                PenToPublic ✍️
              </h1>
            </Link>

            <nav className="flex items-center space-x-6">
              <Link
                to="/"
                className={`px-3 py-2 text-brown-dark dark:text-off-white hover:text-brown-600 dark:hover:text-brown-400 font-medium transition-colors duration-200 ${
                  location.pathname === "/" ? "underline font-semibold" : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 text-brown-dark dark:text-off-white hover:text-brown-600 dark:hover:text-brown-400 font-medium transition-colors duration-200 ${
                  location.pathname === "/about" ? "underline font-semibold" : ""
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-2 text-brown-dark dark:text-off-white hover:text-brown-600 dark:hover:text-brown-400 font-medium transition-colors duration-200 ${
                  location.pathname === "/contact" ? "underline font-semibold" : ""
                }`}
              >
                Contact
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-brown-dark dark:text-off-white hover:bg-brown-100 dark:hover:bg-brown-600 transition-colors duration-200"
              >
                {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="bg-brown-100 dark:bg-brown-800 text-brown-mid dark:text-off-white-dark text-center py-2 text-sm italic shadow-inner">
        <p className="m-0">{indianQuotes[quoteIndex]}</p>
      </div>
    </>
  );
};

export default Header;
