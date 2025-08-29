

import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ dynamic URL
});

// Add JWT to every request
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return req;
});

export default API;
