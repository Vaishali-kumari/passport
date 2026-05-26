import React, { useEffect, useState } from 'react';
import { FileText, TrendingUp, Globe, Tag, ShieldX, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchStats } from '../services/api';

const CATEGORY_COLORS = {
  'Tatkal':                  'bg-orange-500',
  'Renewal':                 'bg-blue-500',
  'Application':             'bg-indigo-500',
  'Appointments':            'bg-cyan-500',
  'Visa':                    'bg-purple-500',
  'Travel Issues':           'bg-yellow-500',
  'Government Announcements':'bg-green-500',
  'Scams/Fraud':             'bg-red-500',
  'News':                    'bg-pink-500',
  'Personal Experiences':    'bg-gray-400',
};

const SENTIMENT_COLORS = {
  positive: 'bg-green-500',
  negative: 'bg-red-500',
  neutral:  'bg-gray-400',
};

export default function StatsBar({ filters, onCategoryClick }) {
  const [stats, setStats] = useState(null);
  const [showCategories, setShowCategories] = useState(true);

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
  }, [filters]);

  if (!stats) return null;

  const total = stats.total || 0;
  const spam = stats.spamFiltered || 0;
  const sentiments = stats.sentiments || {};
  const categories = stats.categories || [];
  const platforms = stats.platforms || [];

  const sentimentTotal = (sentiments.positive || 0) + (sentiments.negative || 0) + (sentiments.neutral || 0);
  const positivePct = sentimentTotal ? Math.round((sentiments.positive / sentimentTotal) * 100) : 0;
  const negativePct = sentimentTotal ? Math.round((sentiments.negative / sentimentTotal) * 100) : 0;
  const neutralPct  = sentimentTotal ? Math.round((sentiments.neutral  / sentimentTotal) * 100) : 0;

  return (
    <div className="space-y-3 mb-4">
      {/* Top stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Posts Loaded</p>
            <p className="text-xl font-bold text-gray-900">{total}</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-50 flex-shrink-0">
            <ShieldX className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Spam Filtered</p>
            <p className="text-xl font-bold text-gray-900">{spam}</p>
            <p className="text-xs text-red-500">auto-removed</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-50 flex-shrink-0">
            <Globe className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Platforms</p>
            <p className="text-xl font-bold text-gray-900">{platforms.length}</p>
            <p className="text-xs text-gray-400 truncate">{platforms.slice(0,3).map(p=>p.name).join(', ')}</p>
          </div>
        </div>

        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Sentiment
          </p>
          <div className="flex rounded-full overflow-hidden h-3 mb-1.5">
            {positivePct > 0 && <div className="bg-green-500 transition-all" style={{ width: `${positivePct}%` }} title={`Positive ${positivePct}%`} />}
            {negativePct > 0 && <div className="bg-red-500 transition-all"   style={{ width: `${negativePct}%` }} title={`Negative ${negativePct}%`} />}
            {neutralPct  > 0 && <div className="bg-gray-300 transition-all"  style={{ width: `${neutralPct}%`  }} title={`Neutral ${neutralPct}%`}  />}
          </div>
          <div className="flex gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"/>+{positivePct}%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"/>-{negativePct}%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block"/>~{neutralPct}%</span>
          </div>
        </div>
      </div>

      {/* Category breakdown — clickable */}
      {categories.length > 0 && (
        <div className="card p-4">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 mb-3"
          >
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              Auto-Categorisation
              <span className="text-xs font-normal text-gray-400">(click a category to filter)</span>
            </span>
            {showCategories ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {showCategories && (
            <div className="flex flex-wrap gap-2">
              {categories.map(({ name, count }) => {
                const isActive = filters?.category === name;
                const barColor = CATEGORY_COLORS[name] || 'bg-gray-400';
                const maxCount = categories[0]?.count || 1;
                return (
                  <button
                    key={name}
                    onClick={() => onCategoryClick(isActive ? '' : name)}
                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
                      ${isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-white' : barColor}`} />
                    {name}
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold
                      ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
