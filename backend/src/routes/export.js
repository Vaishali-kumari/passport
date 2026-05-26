import express from 'express';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import { getStore } from '../store.js';

const router = express.Router();

const applyFilters = (posts, query) => {
  let filtered = [...posts];
  const { platform, region, language, category, sentiment, search } = query;
  if (platform) filtered = filtered.filter(p => p.platform?.toLowerCase() === platform.toLowerCase());
  if (region) filtered = filtered.filter(p => p.region?.toLowerCase() === region.toLowerCase());
  if (language) filtered = filtered.filter(p => p.language === language);
  if (category) filtered = filtered.filter(p => p.category === category);
  if (sentiment) filtered = filtered.filter(p => p.sentiment === sentiment);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.content?.toLowerCase().includes(q) || p.summary?.toLowerCase().includes(q)
    );
  }
  return filtered;
};

/**
 * GET /api/export/csv
 */
router.get('/csv', (req, res) => {
  try {
    const posts = applyFilters(getStore(), req.query);
    const fields = [
      { label: 'ID', value: 'id' },
      { label: 'Platform', value: 'platform' },
      { label: 'Author', value: 'author' },
      { label: 'Handle', value: 'handle' },
      { label: 'Content', value: 'content' },
      { label: 'Summary', value: 'summary' },
      { label: 'Category', value: 'category' },
      { label: 'Sentiment', value: 'sentiment' },
      { label: 'Region', value: 'region' },
      { label: 'Language', value: 'language' },
      { label: 'Published At', value: 'publishedAt' },
      { label: 'Likes', value: row => row.engagement?.likes || 0 },
      { label: 'Comments', value: row => row.engagement?.comments || 0 },
      { label: 'Shares', value: row => row.engagement?.shares || 0 },
      { label: 'URL', value: 'url' }
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(posts);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="passport-posts.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/export/pdf
 */
router.get('/pdf', (req, res) => {
  try {
    const posts = applyFilters(getStore(), req.query).slice(0, 100); // cap at 100 for PDF

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="passport-posts.pdf"');
    doc.pipe(res);

    // Title
    doc.fontSize(20).font('Helvetica-Bold').text('Passport Social Media Dashboard', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleString()}  |  Total posts: ${posts.length}`, { align: 'center' });
    doc.moveDown(1.5);

    posts.forEach((post, i) => {
      if (doc.y > 700) doc.addPage();

      doc.fontSize(11).font('Helvetica-Bold').text(`${i + 1}. ${post.platform} — ${post.author}`, { continued: false });
      doc.fontSize(9).font('Helvetica').fillColor('#555555')
        .text(`${post.category || 'Uncategorised'} | ${post.sentiment || ''} | ${post.region || ''} | ${new Date(post.publishedAt).toLocaleString()}`);
      doc.fillColor('#000000').fontSize(10).text(post.summary || post.content.substring(0, 150), { indent: 10 });
      doc.fontSize(8).fillColor('#0066cc').text(post.url || '', { indent: 10 });
      doc.fillColor('#000000').moveDown(0.8);
      doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor('#dddddd').stroke();
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
