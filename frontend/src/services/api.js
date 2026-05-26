import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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
  window.open(`/api/export/csv?${query}`, '_blank');
};

export const exportPDF = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  window.open(`/api/export/pdf?${query}`, '_blank');
};

export default api;
