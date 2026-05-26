import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, Layers } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'time', label: 'Latest First' },
  { value: 'engagement', label: 'Most Engaged' },
  { value: 'likes', label: 'Most Liked' }
];

export default function FilterBar({ filters, availableFilters, onFilterChange, onReset }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = filters.platform || filters.region || filters.language ||
    filters.category || filters.sentiment || filters.search || filters.handle;

  return (
    <div className="card p-4 mb-4 space-y-3">
      {/* Search + primary controls */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={filters.search || ''}
            onChange={e => onFilterChange('search', e.target.value)}
            className="input pl-9"
          />
        </div>

        {/* Sort */}
        <select
          value={filters.sortBy || 'time'}
          onChange={e => onFilterChange('sortBy', e.target.value)}
          className="select w-auto min-w-[150px]"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Clustered toggle */}
        <button
          onClick={() => onFilterChange('clustered', filters.clustered === 'true' ? 'false' : 'true')}
          className={`btn gap-2 ${filters.clustered === 'true' ? 'bg-blue-600 text-white' : 'btn-secondary'}`}
        >
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">Clustered</span>
        </button>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`btn-secondary gap-2 ${showAdvanced ? 'ring-2 ring-blue-500' : ''}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </button>

        {hasActiveFilters && (
          <button onClick={onReset} className="btn-ghost text-red-500 hover:bg-red-50">
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 border-t border-gray-100">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Platform</label>
            <select
              value={filters.platform || ''}
              onChange={e => onFilterChange('platform', e.target.value)}
              className="select"
            >
              <option value="">All Platforms</option>
              {(availableFilters.platforms || []).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Region</label>
            <select
              value={filters.region || ''}
              onChange={e => onFilterChange('region', e.target.value)}
              className="select"
            >
              <option value="">All Regions</option>
              {(availableFilters.regions || []).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Category</label>
            <select
              value={filters.category || ''}
              onChange={e => onFilterChange('category', e.target.value)}
              className="select"
            >
              <option value="">All Categories</option>
              {(availableFilters.categories || []).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Sentiment</label>
            <select
              value={filters.sentiment || ''}
              onChange={e => onFilterChange('sentiment', e.target.value)}
              className="select"
            >
              <option value="">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Language</label>
            <select
              value={filters.language || ''}
              onChange={e => onFilterChange('language', e.target.value)}
              className="select"
            >
              <option value="">All Languages</option>
              {(availableFilters.languages || []).map(l => (
                <option key={l} value={l}>{l.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
