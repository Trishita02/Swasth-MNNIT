import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <AlertCircle className="text-red-500 h-16 w-16 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-800 mt-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mt-2">
          Oops! The page you are looking for does not exist or has been moved.
        </p>

        <div className="flex justify-center mt-6">
          <img
            src="https://source.unsplash.com/400x250/?hospital,healthcare"
            alt="Healthcare Illustration"
            className="rounded-lg shadow-md"
          />
        </div>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-all"
        >
          <Home className="h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
