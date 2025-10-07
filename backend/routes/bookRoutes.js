import express from 'express';
import Book from '../models/Book.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/books
// @desc    Get all books for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/books/current
// @desc    Get currently reading books
// @access  Private
router.get('/current', protect, async (req, res) => {
  try {
    const books = await Book.find({ 
      userId: req.user._id,
      status: 'reading'
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/books
// @desc    Create new book
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const book = await Book.create({
      userId: req.user._id,
      ...req.body
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (book) {
      Object.assign(book, req.body);
      
      // Mark as completed if current page >= total pages
      if (book.currentPage >= book.totalPages && book.status !== 'completed') {
        book.status = 'completed';
        book.completionDate = new Date();
      }
      
      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/books/:id/reading
// @desc    Log daily reading progress
// @access  Private
router.post('/:id/reading', protect, async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (book) {
      const { pagesRead, duration, notes } = req.body;
      
      book.dailyReadings.push({
        date: new Date(),
        pagesRead,
        duration,
        notes
      });
      
      book.currentPage += pagesRead;
      
      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/books/:id/notes
// @desc    Add note/highlight to book
// @access  Private
router.post('/:id/notes', protect, async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (book) {
      book.notes.push({
        page: req.body.page,
        content: req.body.content
      });
      
      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/books/stats
// @desc    Get reading stats
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user._id });
    
    const stats = {
      totalBooks: books.length,
      completed: books.filter(b => b.status === 'completed').length,
      reading: books.filter(b => b.status === 'reading').length,
      totalPagesRead: books.reduce((sum, book) => sum + book.currentPage, 0),
      averageCompletion: books.length > 0 
        ? Math.round(books.reduce((sum, book) => sum + book.completionPercentage, 0) / books.length)
        : 0
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (book) {
      await book.deleteOne();
      res.json({ message: 'Book deleted' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


