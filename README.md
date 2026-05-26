# Passport Social Media Scraper Dashboard

A full-stack dashboard that aggregates, processes, and displays passport-related social media posts from the last 24 hours — built for the Zebvo Newswire assignment.

## Live Demo

> Deploy to Render/Railway (backend) + Vercel/Netlify (frontend) — see deployment section below.

---

## Features

| Feature | Status |
|---|---|
| Real-time scraping (Reddit live + mock for other platforms) | ✅ |
| NLP: Auto-categorisation (10 categories) | ✅ |
| NLP: Gibberish / spam filter | ✅ |
| NLP: ~30-word AI summary per post | ✅ |
| NLP: Sentiment analysis (positive/negative/neutral) | ✅ |
| Clustered view (group similar posts) | ✅ |
| Translation to 10 languages | ✅ |
| Filters: platform, region, language, category, sentiment | ✅ |
| Sorting: latest, most engaged, most liked | ✅ |
| Keyword search | ✅ |
| Export to CSV | ✅ |
| Export to PDF | ✅ |
| Auto-refresh every 30 minutes | ✅ |
| Responsive UI | ✅ |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  FilterBar → PostGrid → PostCard → TranslateWidget       │
│  Vite + Tailwind CSS + Lucide Icons                      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP /api/*
┌────────────────────▼────────────────────────────────────┐
│                  Backend (Express.js)                    │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │ /posts   │  │/translate│  │ /scrape  │  │/export │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │              NLP Pipeline                        │    │
│  │  gibberish filter → categorise → sentiment       │    │
│  │  → summarise → cluster                           │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Scrapers                            │    │
│  │  Reddit (live) + Mock data (other platforms)     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  In-memory store (swap for DB in production)     │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
         │                              │
┌────────▼──────┐              ┌────────▼──────┐
│ Reddit API    │              │ LibreTranslate │
│ (free, live)  │              │ (translation)  │
└───────────────┘              └───────────────┘
         │
┌────────▼──────┐
│ OpenAI API    │
│ (optional NLP)│
└───────────────┘
```

### Data Flow

1. **Scheduler** triggers every 30 min (or on-demand via `/api/scrape/trigger`)
2. **Scraper** fetches from Reddit (live) + generates realistic mock data for other platforms
3. **NLP Pipeline** runs on each post:
   - Gibberish filter removes spam/bots
   - Rule-based (or OpenAI-powered) categorisation into 10 categories
   - Sentiment detection
   - 30-word summary generation
   - Cluster key assignment for grouping similar posts
4. **Store** holds processed posts in memory
5. **API** serves filtered/sorted/paginated posts to frontend
6. **Frontend** renders posts with real-time filters, translation, and export

---

## Setup

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/passport-dashboard.git
cd passport-dashboard

# Backend
cd backend
npm install
cp .env.example .env

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

Edit `backend/.env`:

```env
PORT=5000

# Optional: OpenAI for better NLP (falls back to rule-based if not set)
OPENAI_API_KEY=sk-...

# Optional: Reddit live data (create app at reddit.com/prefs/apps)
REDDIT_CLIENT_ID=your_id
REDDIT_CLIENT_SECRET=your_secret
REDDIT_USER_AGENT=PassportDashboard/1.0.0

# Optional: LibreTranslate (falls back to mock translation if unavailable)
LIBRETRANSLATE_URL=https://libretranslate.com
LIBRETRANSLATE_API_KEY=

# Set to false to use live Reddit + mock for other platforms
USE_MOCK_DATA=true
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev   # or: npm start

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open http://localhost:3000

---

## API Documentation

### Base URL: `http://localhost:5000/api`

#### GET /posts
Fetch posts with filters and pagination.

| Param | Type | Description |
|---|---|---|
| platform | string | Filter by platform (Twitter/X, Reddit, etc.) |
| region | string | Filter by region/country |
| language | string | Filter by language code (en, hi, etc.) |
| category | string | Filter by category |
| sentiment | string | positive / negative / neutral |
| search | string | Keyword search |
| sortBy | string | time / engagement / likes |
| order | string | asc / desc |
| clustered | boolean | Show only cluster heads |
| page | number | Page number (default: 1) |
| limit | number | Posts per page (default: 20) |

**Response:**
```json
{
  "posts": [...],
  "pagination": { "total": 56, "page": 1, "limit": 20, "totalPages": 3 },
  "lastFetchedAt": "2024-01-01T12:00:00Z",
  "filters": { "platforms": [...], "regions": [...], ... }
}
```

#### GET /posts/:id
Get a single post by ID.

#### GET /posts/clusters/summary
Get cluster summary (topic groups with counts).

#### POST /translate
Translate a post or arbitrary text.

```json
// Translate a post
{ "postId": "uuid", "targetLang": "hi" }

// Translate text
{ "text": "My passport expired", "targetLang": "fr" }
```

#### GET /translate/languages
Returns supported languages map.

#### POST /scrape/trigger
Trigger a manual scrape (runs async, returns immediately).

#### GET /scrape/status
Returns last fetch timestamp and status.

#### GET /export/csv
Export filtered posts as CSV. Accepts same filter params as GET /posts.

#### GET /export/pdf
Export filtered posts as PDF. Accepts same filter params as GET /posts.

---

## Deployment

### Backend (Render)
1. Create a new Web Service on [render.com](https://render.com)
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `.env`

### Frontend (Vercel)
1. Import repo on [vercel.com](https://vercel.com)
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env var: `VITE_API_URL=https://your-backend.onrender.com`

Update `frontend/vite.config.js` proxy target to your deployed backend URL.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Lucide Icons |
| Backend | Node.js, Express.js |
| NLP | OpenAI GPT-3.5 (optional) + rule-based fallback |
| Translation | LibreTranslate API |
| Live Data | Reddit API via snoowrap |
| Export | json2csv, PDFKit |
| Scheduling | node-cron |

---

## Notes on Real Social Media APIs

Most major platforms (Twitter/X, Facebook, Instagram, TikTok, LinkedIn) require paid API access or approved developer accounts. This project:
- Uses **Reddit's free public API** for live data
- Uses **realistic mock data** for other platforms to demonstrate the full pipeline
- Is architected to easily swap in real API clients when credentials are available

---

*Built for Zebvo Newswire Private Limited — Full-Stack Development Task*
