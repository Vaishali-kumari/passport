import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const LIBRE_URL = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com';
const LIBRE_KEY = process.env.LIBRETRANSLATE_API_KEY || '';

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ar: 'Arabic',
  zh: 'Chinese',
  ru: 'Russian',
  ja: 'Japanese'
};

/**
 * Translate text using LibreTranslate API.
 * Falls back to a mock translation if the API is unavailable.
 */
export const translateText = async (text, targetLang, sourceLang = 'auto') => {
  if (!text || !targetLang) throw new Error('text and targetLang are required');
  if (targetLang === sourceLang) return text;

  try {
    const payload = {
      q: text,
      source: sourceLang === 'auto' ? 'auto' : sourceLang,
      target: targetLang,
      format: 'text'
    };
    if (LIBRE_KEY) payload.api_key = LIBRE_KEY;

    const response = await axios.post(`${LIBRE_URL}/translate`, payload, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });

    return response.data.translatedText;
  } catch (err) {
    console.error('LibreTranslate error:', err.message);
    // Return mock translation for demo purposes
    return getMockTranslation(text, targetLang);
  }
};

const getMockTranslation = (text, targetLang) => {
  const prefixes = {
    hi: '[हिंदी अनुवाद] ',
    pa: '[ਪੰਜਾਬੀ ਅਨੁਵਾਦ] ',
    es: '[Traducción al español] ',
    fr: '[Traduction française] ',
    de: '[Deutsche Übersetzung] ',
    ar: '[الترجمة العربية] ',
    zh: '[中文翻译] ',
    ru: '[Русский перевод] ',
    ja: '[日本語翻訳] '
  };
  return (prefixes[targetLang] || '[Translation] ') + text;
};
