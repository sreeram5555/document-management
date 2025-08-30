

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api";
import Spinner from "../common/Spinner";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");
    setSuggestions([]);

    try {
      await API.post("/auth/signup", formData);
      setLoading(false);
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (err) {
      setLoading(false);
      if (err.response?.data?.suggestions?.length > 0) {
        const suggestedUsername = err.response.data.suggestions[0];
        setFormData({ ...formData, username: suggestedUsername }); // auto-fill
        setError(`Username already exists. Suggested: ${suggestedUsername}`);
        setSuggestions(err.response.data.suggestions); // optional dropdown
      } else if (err.response?.data?.message) {
        setError(err.response.data.message); // clean message
      } else {
        setError("Something went wrong. Please try again.");
      }
    }

  
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Your Account
        </h2>

        {error && (
          <p className="text-red-500 bg-red-100 p-3 text-center rounded-md">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                {suggestions.map((sugg, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setFormData({ ...formData, username: sugg })}
                  >
                    {/* {sugg} */}
                    {suggestions.length > 0 && (
                      <ul className="bg-gray-100 border p-2 rounded mt-1">
                        {suggestions.map((s, i) => (
                          <li
                            key={i}
                            onClick={() =>
                              setFormData({ ...formData, username: s })
                            }
                            className="cursor-pointer hover:bg-gray-200 px-2 py-1"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? <Spinner /> : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
