import cron from 'node-cron';
import { fetchAllPosts } from './services/scraper.js';
import { processPosts } from './services/nlp.js';
import { setStore } from './store.js';

export const startScheduler = async () => {
  console.log('Scheduler started. Running initial fetch...');
  await runFetch();

  // Re-fetch every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('Scheduled fetch triggered at', new Date().toISOString());
    await runFetch();
  });
};

const runFetch = async () => {
  try {
    const rawPosts = await fetchAllPosts();
    console.log(`Fetched ${rawPosts.length} raw posts`);
    const processed = await processPosts(rawPosts);
    console.log(`Processed ${processed.length} posts after NLP pipeline`);
    setStore(processed);
  } catch (err) {
    console.error('Fetch/process error:', err.message);
  }
};
