/**
 * In-memory store for posts.
 * In production, replace with a database (PostgreSQL, MongoDB, etc.)
 */

let posts = [];
let lastFetchedAt = null;
let spamFilteredCount = 0;

export const getStore = () => posts;

export const setStore = (newPosts) => {
  posts = newPosts;
  lastFetchedAt = new Date().toISOString();
};

export const setSpamCount = (count) => { spamFilteredCount = count; };
export const getSpamCount = () => spamFilteredCount;

export const addPosts = (newPosts) => {
  // Deduplicate by id
  const existingIds = new Set(posts.map(p => p.id));
  const unique = newPosts.filter(p => !existingIds.has(p.id));
  posts = [...posts, ...unique];
  lastFetchedAt = new Date().toISOString();
};

export const getLastFetchedAt = () => lastFetchedAt;

export const clearStore = () => {
  posts = [];
  lastFetchedAt = null;
};
