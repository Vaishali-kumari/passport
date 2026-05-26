import express from 'express';
import { getStore, getLastFetchedAt, getSpamCount } from '../store.js';

const router = express.Router();

/**
 * GET /api/posts/stats
 * Returns category breakdown, sentiment breakdown, platform breakdown, spam count
 */
router.get('/stats', (req, res) => {
  const posts = getStore();
  const categories = {};
  const sentiments = { positive: 0, negative: 0, neutral: 0 };
  const platforms = {};

  for (const post of posts) {
    if (post.category) categories[post.category] = (categories[post.category] || 0) + 1;
    if (post.sentiment) sentiments[post.sentiment] = (sentiments[post.sentiment] || 0) + 1;
    if (post.platform) platforms[post.platform] = (platforms[post.platform] || 0) + 1;
  }

  res.json({
    total: posts.length,
    spamFiltered: getSpamCount(),
    categories: Object.entries(categories).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })),
    sentiments,
    platforms: Object.entries(platforms).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })),
    lastFetchedAt: getLastFetchedAt()
  });
});

/**
 * GET /api/posts/clusters/summary
 */
router.get('/clusters/summary', (req, res) => {
  const posts = getStore();
  const clusters = {};
  for (const post of posts) {
    const key = post.clusterId || 'general';
    if (!clusters[key]) clusters[key] = { key, count: 0, head: null };
    clusters[key].count++;
    if (post.isClusterHead) clusters[key].head = post;
  }
  res.json(Object.values(clusters).sort((a, b) => b.count - a.count));
});

/**
 * GET /api/posts
 * Query params: platform, region, language, category, sentiment, search,
 *               sortBy (time|engagement|likes), order (asc|desc),
 *               clustered (true|false), page, limit
 */
router.get('/', (req, res) => {
  try {
    let posts = getStore();
    const {
      platform, region, language, category, sentiment,
      search, sortBy = 'time', order = 'desc',
      clustered, page = 1, limit = 20, handle
    } = req.query;

    // Filters
    if (platform) posts = posts.filter(p => p.platform?.toLowerCase() === platform.toLowerCase());
    if (region) posts = posts.filter(p => p.region?.toLowerCase() === region.toLowerCase());
    if (language) posts = posts.filter(p => p.language === language);
    if (category) posts = posts.filter(p => p.category === category);
    if (sentiment) posts = posts.filter(p => p.sentiment === sentiment);
    if (handle) posts = posts.filter(p => p.handle?.toLowerCase().includes(handle.toLowerCase()));

    // Search
    if (search) {
      const q = search.toLowerCase();
      posts = posts.filter(p =>
        p.content?.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        p.author?.toLowerCase().includes(q) ||
        (p.translations && Object.values(p.translations).some(t => t?.toLowerCase().includes(q)))
      );
    }

    // Clustered view: only show cluster heads
    if (clustered === 'true') {
      posts = posts.filter(p => p.isClusterHead);
    }

    // Sorting
    posts = [...posts].sort((a, b) => {
      let valA, valB;
      if (sortBy === 'engagement') {
        valA = (a.engagement?.likes || 0) + (a.engagement?.comments || 0) + (a.engagement?.shares || 0);
        valB = (b.engagement?.likes || 0) + (b.engagement?.comments || 0) + (b.engagement?.shares || 0);
      } else if (sortBy === 'likes') {
        valA = a.engagement?.likes || 0;
        valB = b.engagement?.likes || 0;
      } else {
        valA = new Date(a.publishedAt).getTime();
        valB = new Date(b.publishedAt).getTime();
      }
      return order === 'asc' ? valA - valB : valB - valA;
    });

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const total = posts.length;
    const paginated = posts.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      posts: paginated,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      },
      lastFetchedAt: getLastFetchedAt(),
      filters: getAvailableFilters(getStore())
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/posts/:id  — must be LAST to avoid swallowing named routes
 */
router.get('/:id', (req, res) => {
  const post = getStore().find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

const getAvailableFilters = (posts) => ({
  platforms: [...new Set(posts.map(p => p.platform).filter(Boolean))],
  regions: [...new Set(posts.map(p => p.region).filter(Boolean))],
  languages: [...new Set(posts.map(p => p.language).filter(Boolean))],
  categories: [...new Set(posts.map(p => p.category).filter(Boolean))],
  sentiments: ['positive', 'negative', 'neutral']
});

export default router;
