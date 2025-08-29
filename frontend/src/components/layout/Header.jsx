import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BellIcon, MagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import NotificationPanel from './NotificationPanel';
import API from '../../api';

const Header = ({ userInfo, setUserInfo }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) fetchNotifications();
  }, [userInfo]);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/users/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    navigate('/login');
  };

  

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to={userInfo ? "/dashboard" : "/"} className="flex items-center gap-2 text-2xl font-bold text-blue-600">
          <DocumentTextIcon className="w-8 h-8"/>
          <span>SecureDocs</span>
        </Link>

        {userInfo && (
          <div className="relative w-1/3">
           

            {searchResults.length > 0 && (
              <ul className="absolute z-50 top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
                {searchResults.map(user => (
                  <li
                    key={user._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchResults([]); // hide dropdown
                      setSearchQuery('');   // clear search input
                      navigate(`/dashboard?user=${user._id}`); // navigate to user docs
                    }}
                  >
                    {user.username} 
                    {/* ({user.email}) */}
                  </li>
                ))} 
              </ul>
            )}   
          </div>
        )}

        <div className="flex items-center gap-6">
          {userInfo ? (
            <>
              <div className="relative">
                <BellIcon
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-7 h-7 text-gray-600 hover:text-blue-600 cursor-pointer"
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
                {showNotifications && (
                  <NotificationPanel
                    notifications={notifications}
                    setNotifications={setNotifications}
                    onClose={() => setShowNotifications(false)}
                  />
                )}
              </div>
              <span className="font-semibold text-gray-700">Hi, {userInfo.username}</span>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="font-semibold text-gray-600 hover:text-blue-600">Login</Link>
              <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
