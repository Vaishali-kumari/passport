import express from 'express';
import { fetchAllPosts } from '../services/scraper.js';
import { processPosts } from '../services/nlp.js';
import { setStore, getLastFetchedAt } from '../store.js';

const router = express.Router();

/**
 * POST /api/scrape/trigger
 * Manually trigger a fresh scrape
 */
router.post('/trigger', async (req, res) => {
  try {
    res.json({ message: 'Scrape started', status: 'running' });

    // Run async in background
    setImmediate(async () => {
      try {
        const rawPosts = await fetchAllPosts();
        const processed = await processPosts(rawPosts);
        setStore(processed);
        console.log(`Manual scrape complete: ${processed.length} posts`);
      } catch (err) {
        console.error('Manual scrape error:', err.message);
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/scrape/status
 */
router.get('/status', (req, res) => {
  res.json({
    lastFetchedAt: getLastFetchedAt(),
    status: 'idle'
  });
});

export default router;
