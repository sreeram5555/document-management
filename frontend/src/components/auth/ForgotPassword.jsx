import React, { useState } from 'react';
import API from '../../api';
import Spinner from '../common/Spinner';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await API.post('/auth/forgotpassword', { email });
            setMessage('Password reset email sent. Please check your inbox.');
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-10">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-800">Reset Password</h2>
                <p className="text-center text-gray-600">Enter your email to receive a password reset link.</p>
                {error && <p className="text-red-500 bg-red-100 p-3 text-center rounded-md">{error}</p>}
                {message && <p className="text-green-500 bg-green-100 p-3 text-center rounded-md">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300">
                        {loading ? <Spinner /> : 'Send Reset Link'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;