import React from 'react';
import PostCard from './PostCard.jsx';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Inbox } from 'lucide-react';

export default function PostGrid({ posts, loading, error, pagination, onPageChange }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 text-sm">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-gray-700 font-medium">Failed to load posts</p>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Inbox className="w-10 h-10 text-gray-400" />
        <p className="text-gray-600 font-medium">No posts found</p>
        <p className="text-gray-400 text-sm">Try adjusting your filters or trigger a new scrape</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">
            Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
            <span className="text-gray-400 ml-2">({pagination.total} posts)</span>
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
