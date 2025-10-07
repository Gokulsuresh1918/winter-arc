import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// @route   GET /api/quotes/daily
// @desc    Get daily motivational quote
// @access  Public
router.get('/daily', (req, res) => {
  try {
    const quotesPath = path.join(__dirname, '../data/quotes.json');
    const quotes = JSON.parse(fs.readFileSync(quotesPath, 'utf-8'));
    
    // Get a deterministic quote based on the current date
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const quoteIndex = dayOfYear % quotes.length;
    
    res.json({ quote: quotes[quoteIndex] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/quotes/random
// @desc    Get random motivational quote
// @access  Public
router.get('/random', (req, res) => {
  try {
    const quotesPath = path.join(__dirname, '../data/quotes.json');
    const quotes = JSON.parse(fs.readFileSync(quotesPath, 'utf-8'));
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    
    res.json({ quote: quotes[randomIndex] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

