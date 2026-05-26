import axios from 'axios';

// VITE_API_URL is set via .env.production or Render environment variable
// In dev, Vite proxy routes /api → localhost:5000
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000
});

export const fetchPosts = (params = {}) =>
  api.get('/posts', { params }).then(r => r.data);

export const fetchPost = (id) =>
  api.get(`/posts/${id}`).then(r => r.data);

export const fetchStats = () =>
  api.get('/posts/stats').then(r => r.data);

export const fetchClusterSummary = () =>
  api.get('/posts/clusters/summary').then(r => r.data);

export const translatePost = (postId, targetLang) =>
  api.post('/translate', { postId, targetLang }).then(r => r.data);

export const translateText = (text, targetLang) =>
  api.post('/translate', { text, targetLang }).then(r => r.data);

export const fetchLanguages = () =>
  api.get('/translate/languages').then(r => r.data);

export const triggerScrape = () =>
  api.post('/scrape/trigger').then(r => r.data);

export const fetchScrapeStatus = () =>
  api.get('/scrape/status').then(r => r.data);

export const exportCSV = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  window.open(`${BASE_URL}/export/csv?${query}`, '_blank');
};

export const exportPDF = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  window.open(`${BASE_URL}/export/pdf?${query}`, '_blank');
};

export default api;
