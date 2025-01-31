import axios from "axios";


export const __DEV__ = false;
export let ADDRESS = 'http://localhost:3001';

if (__DEV__) {
  ADDRESS = '';
}

export const authInstance = axios.create({
  baseURL: ADDRESS,
  timeout: 10000,
})


// Add a request interceptor
authInstance.interceptors.request.use(
  config => {
    // Do something before request is sent
    const accessToken = localStorage.getItem('accessToken');
    config.headers = {
      ...config.headers,
      Authorization: !accessToken ? `Bearer ` : `Bearer ${accessToken}`,
    };
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
authInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  },
);
