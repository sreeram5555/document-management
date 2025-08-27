import React from 'react';
import API from '../../api';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

const NotificationPanel = ({ notifications, setNotifications, onClose }) => {
    const handleMarkAsRead = async () => {
        try {
            await API.put('/users/notifications');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark notifications as read', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/users/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (error) {
            console.error('Failed to delete notification', error);
        }
    };

    return (
        <div className="absolute right-0 mt-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
            <div className="p-3 flex justify-between items-center border-b">
                <h3 className="font-semibold">Notifications</h3>
                <XMarkIcon className="w-5 h-5 text-gray-500 cursor-pointer" onClick={onClose} />
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div key={n._id} className={`p-3 border-b hover:bg-gray-50 flex justify-between items-start ${!n.isRead ? 'bg-blue-50' : ''}`}>
                            <p className="text-sm text-gray-700 pr-2">{n.message}</p>
                            <TrashIcon onClick={() => handleDelete(n._id)} className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer flex-shrink-0" />
                        </div>
                    ))
                ) : (
                    <p className="p-4 text-center text-sm text-gray-500">No notifications yet.</p>
                )}
            </div>
            {notifications.some(n => !n.isRead) && (
                <div className="p-2 border-t text-center">
                    <button onClick={handleMarkAsRead} className="text-sm font-medium text-blue-600 hover:underline">
                        Mark all as read
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;