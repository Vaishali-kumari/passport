import { useState, useEffect, useCallback } from 'react';
import { fetchPosts } from '../services/api';

export const usePosts = (filters = {}) => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [availableFilters, setAvailableFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);

  const load = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPosts(params);
      setPosts(data.posts || []);
      setPagination(data.pagination || null);
      setAvailableFilters(data.filters || {});
      setLastFetchedAt(data.lastFetchedAt);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filters);
  }, [JSON.stringify(filters)]);

  return { posts, pagination, availableFilters, loading, error, lastFetchedAt, reload: load };
};
