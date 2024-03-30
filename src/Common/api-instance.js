
import axios from 'axios';
import AppStore from '../../src/redux/store';
import toast from 'react-hot-toast';
import localStorage from 'redux-persist/es/storage';

export const BASE_URL = process.env.REACT_APP_API_URL;

const handleErrors = (error) => {
  let errorMessage = '';

  if (error.response) {
    switch (error.response.status) {
      case 400:
      
     
        toast.error(error.response.data?.massage);
        errorMessage = error.response.data.message || 'Bad Request';
        break;
      case 401:
        toast.error('Unauthorized:', error.response.data);
        localStorage.removeItem("persist:root");
        localStorage.removeItem("key");
        window.location.href="/login";
        errorMessage = 'Unauthorized';
        break;
      case 404:
        toast.error('Not Found:');
        errorMessage = 'Not Found';
        break;
      case 500:
        toast.error("Internal Server Error");
        errorMessage = 'Internal Server Error';
        break;
      default:
        toast.error('Unhandled Error:', error.response.status, error.response.data);
        errorMessage = 'Unhandled Error';
    }
  } else if (error.request) {
    errorMessage = 'No response received';
  } else {
    errorMessage = error.message || 'Error occurred';
  }

  // Return standardized error object
  return { error: errorMessage, status: error.response ? error.response.status : null };
};


const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer${AppStore?.store?.getState()?.token}`,
  },
});


const post = async (endpoint, data) => {
  try {
    const response = await instance.post(endpoint, data,{
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${AppStore?.store?.getState()?.token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleErrors(error); // Throw standardized error
  }
};

const postJson = async (endpoint, data) => {
  try {
    const response = await instance.post(endpoint, data,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AppStore?.store?.getState()?.token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error)
    throw handleErrors(error); // Throw standardized error
  }
};

const putJson = async (endpoint, data) => {
  try {
    const response = await instance.put(endpoint, data,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AppStore?.store?.getState()?.token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error)
    throw handleErrors(error); // Throw standardized error
  }
};



export {  post, postJson,putJson };
