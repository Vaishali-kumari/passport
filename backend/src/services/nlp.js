import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { setSpamCount } from '../store.js';
import dotenv from 'dotenv';
dotenv.config();

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const CATEGORIES = [
  'Application', 'Renewal', 'Appointments', 'Tatkal',
  'Visa', 'Travel Issues', 'Government Announcements',
  'Scams/Fraud', 'News', 'Personal Experiences'
];

/**
 * Main NLP pipeline: filter gibberish, categorise, summarise, detect sentiment, cluster
 */
export const processPosts = async (rawPosts) => {
  if (!rawPosts || rawPosts.length === 0) return [];

  let posts = rawPosts.map(p => ({ ...p }));

  if (openai) {
    posts = await processWithOpenAI(posts);
  } else {
    posts = processWithRules(posts);
  }

  const spamCount = rawPosts.length - posts.length;
  setSpamCount(spamCount);

  // Cluster similar posts
  posts = clusterPosts(posts);

  return posts;
};

// ─── OpenAI-powered pipeline ────────────────────────────────────────────────

const processWithOpenAI = async (posts) => {
  const BATCH = 10;
  const results = [];

  for (let i = 0; i < posts.length; i += BATCH) {
    const batch = posts.slice(i, i + BATCH);
    const processed = await Promise.all(batch.map(p => analysePostWithAI(p)));
    results.push(...processed);
  }

  return results.filter(p => !p.isGibberish);
};

const analysePostWithAI = async (post) => {
  try {
    const prompt = `Analyse this social media post about passports and return a JSON object.

Post: "${post.content.substring(0, 500)}"

Return ONLY valid JSON with these fields:
{
  "isGibberish": boolean (true if spam/bot/gibberish/irrelevant),
  "category": one of [${CATEGORIES.map(c => `"${c}"`).join(', ')}],
  "sentiment": one of ["positive", "negative", "neutral"],
  "summary": "~30 word summary of what this post is about",
  "clusterKey": "2-4 word topic key for grouping similar posts (e.g. 'tatkal renewal process', 'passport photo requirements')"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 200
    });

    const json = JSON.parse(response.choices[0].message.content.trim());
    return { ...post, ...json, processedBy: 'openai' };
  } catch (err) {
    console.error('OpenAI analysis error:', err.message);
    return { ...processWithRules([post])[0], processedBy: 'rules_fallback' };
  }
};

// ─── Rule-based fallback pipeline ───────────────────────────────────────────

const GIBBERISH_PATTERNS = [
  /^[a-z]{1,3}\s+[a-z]{1,3}\s+[a-z]{1,3}/i,
  /(.)\1{4,}/,
  /buy.{0,20}passport/i,
  /click.{0,20}link/i,
  /free.{0,20}passport/i,
  /guaranteed.{0,20}delivery/i,
  /xxx+/i,
  /\$\$\$/
];

const CATEGORY_KEYWORDS = {
  'Tatkal': ['tatkal', 'urgent', 'emergency passport', 'fast track'],
  'Renewal': ['renew', 'renewal', 'expired passport', 'reissue'],
  'Application': ['apply', 'application', 'first time', 'new passport', 'applicant'],
  'Appointments': ['appointment', 'slot', 'booking', 'schedule', 'psk', 'passport seva'],
  'Visa': ['visa', 'schengen', 'stamping', 'visa rejection', 'visa on arrival'],
  'Travel Issues': ['lost passport', 'damaged', 'stolen', 'travel ban', 'denied boarding', 'flight'],
  'Government Announcements': ['government', 'announce', 'new rule', 'policy', 'ministry', 'mea', 'official'],
  'Scams/Fraud': ['scam', 'fraud', 'fake', 'bribe', 'agent', 'cheat', 'otp', 'warning'],
  'News': ['news', 'report', 'launch', 'initiative', 'update', 'new feature'],
  'Personal Experiences': ['my experience', 'i got', 'finally', 'review', 'tip', 'pro tip', 'lesson']
};

const SENTIMENT_POSITIVE = ['great', 'excellent', 'smooth', 'fast', 'helpful', 'happy', 'finally', 'kudos', 'improved', 'easy', 'quick', 'good'];
const SENTIMENT_NEGATIVE = ['rejected', 'failed', 'terrible', 'awful', 'scam', 'fraud', 'delay', 'stuck', 'cancelled', 'bribe', 'warning', 'lost', 'damaged'];

export const processWithRules = (posts) => {
  return posts.map(post => {
    const text = post.content.toLowerCase();

    // Gibberish check
    const isGibberish = GIBBERISH_PATTERNS.some(p => p.test(post.content)) ||
      post.content.length < 20 ||
      (post.content.split(' ').length < 5);

    if (isGibberish) return { ...post, isGibberish: true };

    // Category
    let category = 'Personal Experiences';
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some(kw => text.includes(kw))) {
        category = cat;
        break;
      }
    }

    // Sentiment
    const posScore = SENTIMENT_POSITIVE.filter(w => text.includes(w)).length;
    const negScore = SENTIMENT_NEGATIVE.filter(w => text.includes(w)).length;
    const sentiment = posScore > negScore ? 'positive' : negScore > posScore ? 'negative' : 'neutral';

    // Summary (first 30 words)
    const words = post.content.replace(/\n/g, ' ').split(/\s+/).filter(Boolean);
    const summary = words.slice(0, 30).join(' ') + (words.length > 30 ? '...' : '');

    // Cluster key
    const clusterKey = deriveClusterKey(text, category);

    return {
      ...post,
      isGibberish: false,
      category,
      sentiment,
      summary,
      clusterKey,
      processedBy: 'rules'
    };
  }).filter(p => !p.isGibberish);
};

const deriveClusterKey = (text, category) => {
  if (text.includes('tatkal')) return 'tatkal passport service';
  if (text.includes('photo')) return 'passport photo requirements';
  if (text.includes('appointment') || text.includes('slot')) return 'appointment booking';
  if (text.includes('scam') || text.includes('fraud') || text.includes('fake')) return 'passport scams fraud';
  if (text.includes('renew')) return 'passport renewal process';
  if (text.includes('visa')) return 'visa requirements';
  if (text.includes('lost') || text.includes('damaged')) return 'lost damaged passport';
  if (text.includes('government') || text.includes('announce')) return 'government announcements';
  if (text.includes('nri') || text.includes('abroad') || text.includes('expat')) return 'nri passport abroad';
  return category.toLowerCase();
};

// ─── Clustering ──────────────────────────────────────────────────────────────

export const clusterPosts = (posts) => {
  const clusters = {};

  for (const post of posts) {
    const key = post.clusterKey || 'general';
    if (!clusters[key]) clusters[key] = [];
    clusters[key].push(post);
  }

  return posts.map(post => {
    const key = post.clusterKey || 'general';
    const clusterPosts = clusters[key] || [];
    return {
      ...post,
      clusterId: key,
      clusterSize: clusterPosts.length,
      isClusterHead: clusterPosts[0]?.id === post.id
    };
  });
};
