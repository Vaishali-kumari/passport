import React, { useState } from 'react';
import {
  Heart, MessageCircle, Share2, ExternalLink, Globe,
  ChevronDown, ChevronUp, Layers, Loader2, MapPin, Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { translatePost, fetchLanguages } from '../services/api';
import toast from 'react-hot-toast';

const PLATFORM_COLORS = {
  'Twitter/X': 'bg-black text-white',
  'Reddit': 'bg-orange-500 text-white',
  'Facebook': 'bg-blue-600 text-white',
  'Instagram': 'bg-pink-500 text-white',
  'LinkedIn': 'bg-blue-700 text-white',
  'YouTube': 'bg-red-600 text-white',
  'TikTok': 'bg-gray-900 text-white',
  'default': 'bg-gray-500 text-white'
};

const SENTIMENT_STYLES = {
  positive: 'bg-green-100 text-green-700',
  negative: 'bg-red-100 text-red-700',
  neutral: 'bg-gray-100 text-gray-600'
};

const CATEGORY_STYLES = {
  'Scams/Fraud': 'bg-red-50 text-red-700 border-red-200',
  'Government Announcements': 'bg-blue-50 text-blue-700 border-blue-200',
  'Tatkal': 'bg-orange-50 text-orange-700 border-orange-200',
  'Visa': 'bg-purple-50 text-purple-700 border-purple-200',
  'default': 'bg-gray-50 text-gray-700 border-gray-200'
};

const LANGUAGES = {
  en: 'English', hi: 'Hindi', pa: 'Punjabi', es: 'Spanish',
  fr: 'French', de: 'German', ar: 'Arabic', zh: 'Chinese',
  ru: 'Russian', ja: 'Japanese'
};

export default function PostCard({ post }) {
  const [expanded, setExpanded] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translation, setTranslation] = useState(null);
  const [selectedLang, setSelectedLang] = useState('hi');

  const platformColor = PLATFORM_COLORS[post.platform] || PLATFORM_COLORS.default;
  const sentimentStyle = SENTIMENT_STYLES[post.sentiment] || SENTIMENT_STYLES.neutral;
  const categoryStyle = CATEGORY_STYLES[post.category] || CATEGORY_STYLES.default;

  const handleTranslate = async () => {
    if (!selectedLang) return;
    setTranslating(true);
    try {
      const result = await translatePost(post.id, selectedLang);
      setTranslation({ lang: selectedLang, langName: LANGUAGES[selectedLang], text: result.translated });
      toast.success(`Translated to ${LANGUAGES[selectedLang]}`);
    } catch (err) {
      toast.error('Translation failed');
    } finally {
      setTranslating(false);
    }
  };

  const totalEngagement = (post.engagement?.likes || 0) +
    (post.engagement?.comments || 0) +
    (post.engagement?.shares || 0);

  const isLong = post.content?.length > 200;
  const displayContent = expanded || !isLong
    ? post.content
    : post.content?.substring(0, 200) + '...';

  return (
    <div className="card flex flex-col hover:shadow-md transition-shadow duration-200">
      {/* Card Header */}
      <div className="p-4 pb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`badge ${platformColor} flex-shrink-0`}>
            {post.platform}
          </span>
          {post.clusterSize > 1 && (
            <span className="badge bg-indigo-100 text-indigo-700 flex-shrink-0 gap-1">
              <Layers className="w-3 h-3" />
              {post.clusterSize}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {post.sentiment && (
            <span className={`badge ${sentimentStyle}`}>
              {post.sentiment}
            </span>
          )}
        </div>
      </div>

      {/* Author + Meta */}
      <div className="px-4 pb-2 flex items-center gap-3 text-xs text-gray-500">
        <span className="font-medium text-gray-700 truncate">{post.handle || post.author}</span>
        {post.region && post.region !== 'Unknown' && (
          <span className="flex items-center gap-1 flex-shrink-0">
            <MapPin className="w-3 h-3" /> {post.region}
          </span>
        )}
        <span className="flex items-center gap-1 flex-shrink-0 ml-auto">
          <Clock className="w-3 h-3" />
          {post.publishedAt
            ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
            : 'Unknown'}
        </span>
      </div>

      {/* Category */}
      {post.category && (
        <div className="px-4 pb-2">
          <span className={`badge border ${categoryStyle}`}>{post.category}</span>
        </div>
      )}

      {/* Summary */}
      {post.summary && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 italic bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
            {post.summary}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="px-4 pb-3 flex-1">
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
          {displayContent}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-blue-600 hover:text-blue-700 mt-1 flex items-center gap-1"
          >
            {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Show more</>}
          </button>
        )}
      </div>

      {/* Translation */}
      {showTranslate && (
        <div className="px-4 pb-3 border-t border-gray-100 pt-3">
          <div className="flex gap-2 items-center mb-2">
            <select
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value)}
              className="select flex-1 text-xs py-1.5"
            >
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
            <button
              onClick={handleTranslate}
              disabled={translating}
              className="btn-primary text-xs py-1.5 px-3 flex-shrink-0"
            >
              {translating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Translate'}
            </button>
          </div>
          {translation && (
            <div className="bg-blue-50 rounded-lg p-3 text-xs text-gray-700 border border-blue-100">
              <p className="font-medium text-blue-700 mb-1">{translation.langName}</p>
              <p className="leading-relaxed">{translation.text}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-red-400" />
            {(post.engagement?.likes || 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
            {(post.engagement?.comments || 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5 text-green-400" />
            {(post.engagement?.shares || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowTranslate(!showTranslate)}
            className={`btn-ghost text-xs py-1 px-2 ${showTranslate ? 'text-blue-600 bg-blue-50' : ''}`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline ml-1">Translate</span>
          </button>
          {post.url && (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs py-1 px-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
