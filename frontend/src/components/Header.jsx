import React, { useState } from 'react';
import { RefreshCw, Download, Globe, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { triggerScrape, exportCSV, exportPDF } from '../services/api';
import toast from 'react-hot-toast';

export default function Header({ lastFetchedAt, filters, onRefresh }) {
  const [scraping, setScraping] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const handleScrape = async () => {
    setScraping(true);
    try {
      await triggerScrape();
      toast.success('Scrape started! Data will refresh in ~30 seconds.');
      setTimeout(() => {
        onRefresh();
        setScraping(false);
      }, 8000);
    } catch {
      toast.error('Failed to trigger scrape');
      setScraping(false);
    }
  };

  const exportParams = {
    ...(filters.platform && { platform: filters.platform }),
    ...(filters.region && { region: filters.region }),
    ...(filters.category && { category: filters.category }),
    ...(filters.sentiment && { sentiment: filters.sentiment }),
    ...(filters.search && { search: filters.search })
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-900 leading-tight truncate">
              Passport Social Dashboard
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              {lastFetchedAt
                ? `Last updated ${formatDistanceToNow(new Date(lastFetchedAt), { addSuffix: true })}`
                : 'Loading data...'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleScrape}
            disabled={scraping}
            className="btn-secondary text-xs sm:text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${scraping ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{scraping ? 'Scraping...' : 'Refresh'}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowExport(!showExport)}
              className="btn-secondary text-xs sm:text-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            {showExport && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px]">
                <button
                  onClick={() => { exportCSV(exportParams); setShowExport(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-green-600" /> Export CSV
                </button>
                <button
                  onClick={() => { exportPDF(exportParams); setShowExport(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100"
                >
                  <BookOpen className="w-4 h-4 text-red-600" /> Export PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
