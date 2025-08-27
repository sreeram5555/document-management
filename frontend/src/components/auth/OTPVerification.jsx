import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../api';
import Spinner from '../common/Spinner';

const OTPVerification = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        // Redirect if email is not in state (e.g., direct navigation to this page)
        navigate('/signup');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/auth/verify-email', { email, otp });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/dashboard');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-10">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-800">Verify Your Email</h2>
                <p className="text-center text-gray-600">An OTP has been sent to {email}. Please check your inbox.</p>
                {error && <p className="text-red-500 bg-red-100 p-3 text-center rounded-md">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                        <input type="text" value={otp} required onChange={(e) => setOtp(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300">
                        {loading ? <Spinner /> : 'Verify Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OTPVerification;