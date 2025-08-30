import axios from 'axios';

// const APII = axios.create({
//   baseURL: import.meta.env.VITE_API_URL, 
// });

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, 
});


API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return req;
});

export default API;
