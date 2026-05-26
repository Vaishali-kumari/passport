import { fetchRedditPosts } from './scrapers/reddit.js';
import { generateMockPosts } from './scrapers/mockData.js';
import dotenv from 'dotenv';
dotenv.config();

const USE_MOCK = process.env.USE_MOCK_DATA === 'true';

/**
 * Aggregates posts from all sources.
 * When USE_MOCK_DATA=true, returns realistic mock data for all platforms.
 * When false, fetches live Reddit data + mock for other platforms.
 */
export const fetchAllPosts = async () => {
  const results = [];

  if (USE_MOCK) {
    console.log('Using mock data mode');
    return generateMockPosts(80);
  }

  // Live Reddit fetch
  try {
    const redditPosts = await fetchRedditPosts();
    results.push(...redditPosts);
    console.log(`Reddit: ${redditPosts.length} posts`);
  } catch (err) {
    console.error('Reddit scrape failed:', err.message);
  }

  // Mock data for platforms requiring paid API access
  const mockPosts = generateMockPosts(50);
  results.push(...mockPosts);

  return results;
};
