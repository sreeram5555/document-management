
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import OTPVerification from './components/auth/OTPVerification';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import DocumentEditor from './components/documents/DocumentEditor';
import DocumentViewer from './components/documents/DocumentViewer';
import ErrorBoundary from "./components/documents/ErrorBoundary";


function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) setUserInfo(JSON.parse(storedUserInfo));
  }, []);

  return (
    <Router>
      <div className="bg-gray-50 min-h-screen font-sans">
        <Header userInfo={userInfo} setUserInfo={setUserInfo} />
        <main className="container mx-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<HomePage />} exact />
            <Route path="/dashboard" element={<Dashboard userInfo={userInfo} />} />
            <Route path="/login" element={<Login setUserInfo={setUserInfo} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />
            <Route path="/document/new" element={<DocumentEditor />} />
            <Route
  path="/document/:id/edit"
  element={
    <ErrorBoundary>
      <DocumentEditor />
    </ErrorBoundary>
  }
/>
            <Route path="/document/:id/view" element={<DocumentViewer />} />
            <Route path="/user/:userId/documents" element={<Dashboard userInfo={userInfo} />} />
 
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

