

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api';
import Spinner from '../common/Spinner';

const Login = ({ setUserInfo }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError("Email and password are required.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/auth/login', formData);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUserInfo(data); // immediate Header update
            navigate('/dashboard');
        } catch (err) {
            console.error("Login error:", err.response || err);
            setError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-10">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back!</h2>
                {error && <p className="text-red-500 bg-red-100 p-3 text-center rounded-md">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" required onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" required onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="text-sm text-right">
                        <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">Forgot password?</Link>
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                        {loading ? <Spinner /> : 'Sign In'}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Don't have an account? <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
