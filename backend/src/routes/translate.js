import express from 'express';
import { translateText, SUPPORTED_LANGUAGES } from '../services/translator.js';
import { getStore, setStore } from '../store.js';

const router = express.Router();

/**
 * POST /api/translate
 * Body: { postId, targetLang }
 */
router.post('/', async (req, res) => {
  try {
    const { postId, targetLang, text } = req.body;

    if (!targetLang) return res.status(400).json({ error: 'targetLang is required' });
    if (!SUPPORTED_LANGUAGES[targetLang]) {
      return res.status(400).json({
        error: `Unsupported language. Supported: ${Object.keys(SUPPORTED_LANGUAGES).join(', ')}`
      });
    }

    // Translate arbitrary text
    if (text && !postId) {
      const translated = await translateText(text, targetLang);
      return res.json({ translated, targetLang, language: SUPPORTED_LANGUAGES[targetLang] });
    }

    // Translate a specific post
    if (!postId) return res.status(400).json({ error: 'postId or text is required' });

    const posts = getStore();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return res.status(404).json({ error: 'Post not found' });

    const post = posts[postIndex];

    // Cache translations on the post object
    if (!post.translations) post.translations = {};
    if (!post.translations[targetLang]) {
      post.translations[targetLang] = await translateText(post.content, targetLang, post.language);
    }

    // Update store
    const updatedPosts = [...posts];
    updatedPosts[postIndex] = post;
    setStore(updatedPosts);

    res.json({
      postId,
      targetLang,
      language: SUPPORTED_LANGUAGES[targetLang],
      original: post.content,
      translated: post.translations[targetLang]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/translate/languages
 */
router.get('/languages', (req, res) => {
  res.json(SUPPORTED_LANGUAGES);
});

export default router;
