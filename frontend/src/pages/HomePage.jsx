import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
        <DocumentTextIcon className="w-24 h-24 text-blue-500 mb-4" />
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            Secure Document Hub
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
            Create, manage, and share your documents with robust password protection for viewing and editing. Your central place for secure collaboration.
        </p>
        <div className="flex space-x-4">
            <Link 
                to="/login" 
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
                Login
            </Link>
            <Link 
                to="/signup" 
                className="px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition duration-300 transform hover:scale-105"
            >
                Get Started
            </Link>
        </div>
    </div>
  );
};

export default HomePage;