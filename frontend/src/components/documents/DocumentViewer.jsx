import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../../api';
import Spinner from '../common/Spinner';
import Modal from '../common/Modal';

const DocumentViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isOwner = location.state?.isOwner;

    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(!isOwner);
    const [passwordPrompt, setPasswordPrompt] = useState('');


   useEffect(() => {
    if (isOwner) {
        const fetchDocument = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
                const { data } = await API.get(`/documents/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDocument(data);
            } catch (err) {
                setError('Failed to load document.');
            } finally {
                setLoading(false);
            }
        };
        fetchDocument();
    }
}, [id, isOwner]);



    const handlePasswordSubmit = async () => {
        try {
            const { data } = await API.post(`/documents/${id}/view`, { password: passwordPrompt });
            setDocument(data);
            setIsModalOpen(false);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Password failed.');
            setLoading(false);
        }
    };
    
    if (loading && !isModalOpen) return <div className="flex justify-center mt-10"><Spinner /></div>;

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            {isModalOpen ? (
                 <Modal onClose={() => navigate('/dashboard')}>
                    <h3 className="text-xl font-semibold mb-4">View Access Required</h3>
                    <p className="mb-4 text-gray-600">Please enter the viewership password to access this document.</p>
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    <input 
                        type="password"
                        value={passwordPrompt}
                        onChange={(e) => setPasswordPrompt(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter view password"
                    />
                    <div className="mt-4 flex justify-end gap-3">
                        <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                        <button onClick={handlePasswordSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
                    </div>
                </Modal>
            ) : document && (
                <>
                    <h1 className="text-4xl font-extrabold mb-4 border-b pb-4">{document.title}</h1>
                    <div className="prose max-w-none whitespace-pre-wrap">{document.content}</div>
                </>
            )}
        </div>
    );
};

export default DocumentViewer;