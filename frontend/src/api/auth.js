import axios from 'axios';

// URL backend  Docker
const API = 'http://3.227.144.60:3000/api';

export const registerRequest = user => axios.post(`${API}/register`, user);
export const loginRequest = user => axios.post(`${API}/login`, user);