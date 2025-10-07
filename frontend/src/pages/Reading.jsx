import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Trash2, TrendingUp, CheckCircle2, BookMarked } from 'lucide-react';
import { getBooks, getCurrentBooks, createBook, updateBook, deleteBook, logReading, addBookNote, getReadingStats } from '../utils/api';
import { format } from 'date-fns';

const Reading = () => {
  const [books, setBooks] = useState([]);
  const [currentBooks, setCurrentBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    totalPages: '',
    currentPage: 0
  });
  
  const [readingForm, setReadingForm] = useState({
    pagesRead: '',
    duration: '',
    notes: ''
  });
  
  const [noteForm, setNoteForm] = useState({
    page: '',
    content: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, currentRes, statsRes] = await Promise.all([
        getBooks(),
        getCurrentBooks(),
        getReadingStats()
      ]);
      
      setBooks(booksRes.data);
      setCurrentBooks(currentRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await createBook(bookForm);
      setShowAddModal(false);
      setBookForm({ title: '', author: '', totalPages: '', currentPage: 0 });
      fetchData();
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  const handleLogReading = async (e) => {
    e.preventDefault();
    try {
      await logReading(selectedBook._id, readingForm);
      setShowReadingModal(false);
      setReadingForm({ pagesRead: '', duration: '', notes: '' });
      fetchData();
    } catch (error) {
      console.error('Failed to log reading:', error);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await addBookNote(selectedBook._id, noteForm);
      setShowNotesModal(false);
      setNoteForm({ page: '', content: '' });
      fetchData();
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Delete this book?')) {
      try {
        await deleteBook(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete book:', error);
      }
    }
  };

  const handleMarkComplete = async (book) => {
    try {
      await updateBook(book._id, {
        status: 'completed',
        currentPage: book.totalPages,
        completionDate: new Date()
      });
      fetchData();
    } catch (error) {
      console.error('Failed to mark complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-700">📚 Reading Tracker</h1>
          <p className="text-dark-400 mt-1">Track your reading journey</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Book
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <BookOpen className="text-primary-500 w-8 h-8 mb-2" />
            <p className="text-2xl font-bold text-dark-700">{stats.totalBooks}</p>
            <p className="text-sm text-dark-400">Total Books</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <TrendingUp className="text-green-500 w-8 h-8 mb-2" />
            <p className="text-2xl font-bold text-dark-700">{stats.reading}</p>
            <p className="text-sm text-dark-400">Currently Reading</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <CheckCircle2 className="text-green-500 w-8 h-8 mb-2" />
            <p className="text-2xl font-bold text-dark-700">{stats.completed}</p>
            <p className="text-sm text-dark-400">Completed</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <BookMarked className="text-orange-500 w-8 h-8 mb-2" />
            <p className="text-2xl font-bold text-dark-700">{stats.totalPagesRead}</p>
            <p className="text-sm text-dark-400">Total Pages Read</p>
          </motion.div>
        </div>
      )}

      {/* Currently Reading */}
      {currentBooks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-dark-700 mb-4">📖 Currently Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentBooks.map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="glass-card p-6 hover:shadow-glow-sm transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-dark-700">{book.title}</h3>
                    <p className="text-sm text-dark-400">{book.author}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkComplete(book)}
                      className="text-green-400 hover:text-green-500 transition-colors"
                      title="Mark as Complete"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book._id)}
                      className="text-red-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-dark-400">Progress</span>
                    <span className="text-primary-500 font-semibold">
                      {book.currentPage} / {book.totalPages} pages ({Math.round((book.currentPage / book.totalPages) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-dark-200 rounded-full h-3">
                    <div
                      className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all"
                      style={{ width: `${(book.currentPage / book.totalPages) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedBook(book);
                      setShowReadingModal(true);
                    }}
                    className="btn-primary flex-1 text-sm py-2"
                  >
                    Log Progress
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBook(book);
                      setShowNotesModal(true);
                    }}
                    className="btn-secondary flex-1 text-sm py-2"
                  >
                    Add Note
                  </button>
                </div>

                {/* Notes Preview */}
                {book.notes && book.notes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-dark-200">
                    <p className="text-xs text-dark-400 mb-2">Recent Notes:</p>
                    <div className="space-y-2">
                      {book.notes.slice(-2).map((note, idx) => (
                        <div key={idx} className="text-sm text-dark-600 bg-dark-100 p-2 rounded">
                          <span className="text-primary-500 font-semibold">p.{note.page}:</span> {note.content}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Books */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-bold text-dark-700 mb-4">📚 All Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.map((book, index) => (
            <motion.div
              key={book._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              className={`glass-card p-4 ${
                book.status === 'completed' ? 'border-2 border-green-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-dark-700">{book.title}</h4>
                  <p className="text-xs text-dark-400">{book.author}</p>
                </div>
                {book.status === 'completed' && (
                  <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                    ✓ Done
                  </span>
                )}
              </div>
              <div className="flex justify-between text-xs text-dark-400 mt-2">
                <span>{book.currentPage}/{book.totalPages} pages</span>
                <span>{Math.round((book.currentPage / book.totalPages) * 100)}%</span>
              </div>
            </motion.div>
          ))}

          {books.length === 0 && (
            <div className="col-span-3 glass-card p-12 text-center">
              <BookOpen className="w-16 h-16 text-dark-300 mx-auto mb-4" />
              <p className="text-dark-400">No books yet. Start adding books to track your reading!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Add Book Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-dark-700 mb-4">Add New Book</h2>
              
              <form onSubmit={handleAddBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.title}
                    onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                    className="input-field"
                    placeholder="Psychology of Money"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Author</label>
                  <input
                    type="text"
                    value={bookForm.author}
                    onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                    className="input-field"
                    placeholder="Morgan Housel"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-600 mb-2">Total Pages *</label>
                    <input
                      type="number"
                      required
                      value={bookForm.totalPages}
                      onChange={(e) => setBookForm({...bookForm, totalPages: e.target.value})}
                      className="input-field"
                      placeholder="256"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-600 mb-2">Current Page</label>
                    <input
                      type="number"
                      value={bookForm.currentPage}
                      onChange={(e) => setBookForm({...bookForm, currentPage: e.target.value})}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="btn-primary flex-1">Add Book</button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Log Reading Modal */}
      <AnimatePresence>
        {showReadingModal && selectedBook && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-dark-700 mb-4">Log Reading Progress</h2>
              <p className="text-sm text-dark-400 mb-4">{selectedBook.title}</p>
              
              <form onSubmit={handleLogReading} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Pages Read *</label>
                  <input
                    type="number"
                    required
                    value={readingForm.pagesRead}
                    onChange={(e) => setReadingForm({...readingForm, pagesRead: e.target.value})}
                    className="input-field"
                    placeholder="20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={readingForm.duration}
                    onChange={(e) => setReadingForm({...readingForm, duration: e.target.value})}
                    className="input-field"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Notes</label>
                  <textarea
                    value={readingForm.notes}
                    onChange={(e) => setReadingForm({...readingForm, notes: e.target.value})}
                    className="input-field"
                    rows="3"
                    placeholder="Key insights from today's reading..."
                  />
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="btn-primary flex-1">Save Progress</button>
                  <button type="button" onClick={() => setShowReadingModal(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Note Modal */}
      <AnimatePresence>
        {showNotesModal && selectedBook && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-dark-700 mb-4">Add Note/Highlight</h2>
              <p className="text-sm text-dark-400 mb-4">{selectedBook.title}</p>
              
              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Page Number *</label>
                  <input
                    type="number"
                    required
                    value={noteForm.page}
                    onChange={(e) => setNoteForm({...noteForm, page: e.target.value})}
                    className="input-field"
                    placeholder="42"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Note/Highlight *</label>
                  <textarea
                    required
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                    className="input-field"
                    rows="4"
                    placeholder="Write your note or paste the highlight..."
                  />
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="btn-primary flex-1">Save Note</button>
                  <button type="button" onClick={() => setShowNotesModal(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reading;



