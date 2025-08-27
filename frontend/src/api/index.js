import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend URL
});

// This function will add the JWT token to the headers of every request
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return req;
});

export default API;

