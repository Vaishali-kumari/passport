import React, { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header.jsx';
import FilterBar from './components/FilterBar.jsx';
import PostGrid from './components/PostGrid.jsx';
import StatsBar from './components/StatsBar.jsx';
import { usePosts } from './hooks/usePosts.js';

const DEFAULT_FILTERS = {
  page: 1,
  limit: 20,
  sortBy: 'time',
  order: 'desc',
  clustered: 'false'
};

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { posts, pagination, availableFilters, loading, error, lastFetchedAt, reload } = usePosts(filters);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header
        lastFetchedAt={lastFetchedAt}
        filters={filters}
        onRefresh={() => reload(filters)}
      />
      <main className="max-w-screen-2xl mx-auto px-4 py-6">
        <StatsBar
          posts={posts}
          pagination={pagination}
          loading={loading}
          filters={filters}
          onCategoryClick={(cat) => updateFilter('category', cat)}
        />
        <FilterBar
          filters={filters}
          availableFilters={availableFilters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
          activeFilters={filters}
        />
        <PostGrid
          posts={posts}
          loading={loading}
          error={error}
          pagination={pagination}
          filters={filters}
          onPageChange={(p) => updateFilter('page', p)}
        />
      </main>
    </div>
  );
}
