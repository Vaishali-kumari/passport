import Snoowrap from 'snoowrap';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const PASSPORT_SUBREDDITS = [
  'Passports', 'travel', 'immigration', 'india', 'USCIS',
  'expats', 'digitalnomad', 'solotravel', 'visa'
];

const KEYWORDS = ['passport', 'visa', 'tatkal', 'renewal', 'appointment'];

export const fetchRedditPosts = async () => {
  const r = new Snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT || 'PassportDashboard/1.0.0',
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME || '',
    password: process.env.REDDIT_PASSWORD || ''
  });

  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const posts = [];

  for (const subreddit of PASSPORT_SUBREDDITS) {
    try {
      const listing = await r.getSubreddit(subreddit).getNew({ limit: 25 });
      for (const post of listing) {
        const createdMs = post.created_utc * 1000;
        if (createdMs < cutoff) continue;

        const text = `${post.title} ${post.selftext || ''}`.toLowerCase();
        const relevant = KEYWORDS.some(kw => text.includes(kw));
        if (!relevant) continue;

        posts.push({
          id: `reddit_${post.id}`,
          platform: 'Reddit',
          author: post.author?.name || 'unknown',
          handle: `u/${post.author?.name || 'unknown'}`,
          content: post.selftext
            ? `${post.title}\n\n${post.selftext}`
            : post.title,
          url: `https://reddit.com${post.permalink}`,
          publishedAt: new Date(createdMs).toISOString(),
          engagement: {
            likes: post.score || 0,
            comments: post.num_comments || 0,
            shares: 0
          },
          region: 'Global',
          language: 'en',
          rawId: post.id
        });
      }
    } catch (err) {
      console.error(`Reddit r/${subreddit} error:`, err.message);
    }
  }

  return posts;
};
