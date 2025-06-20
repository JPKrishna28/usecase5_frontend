import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

export const getStatus = () => {
  return api.get('/status');
};

export const getAudioStatus = (audioId) => {
  return api.get(`/status/${audioId}`);
};

export const uploadAudio = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getResults = (page = 1, perPage = 10) => {
  return api.get('/results', {
    params: { page, per_page: perPage }
  });
};

export const getResult = (resultId) => {
  return api.get(`/results/${resultId}`);
};

export const getNearbyIncidents = (lat, lon) => {
  return api.get('/nearby-incidents', {
    params: { lat, lon }
  });
};