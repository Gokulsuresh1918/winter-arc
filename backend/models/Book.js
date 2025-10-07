import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: String,
  totalPages: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['reading', 'completed', 'paused'],
    default: 'reading'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completionDate: Date,
  notes: [{
    page: Number,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  dailyReadings: [{
    date: Date,
    pagesRead: Number,
    duration: Number, // in minutes
    notes: String
  }]
}, {
  timestamps: true
});

// Virtual for completion percentage
bookSchema.virtual('completionPercentage').get(function() {
  return Math.round((this.currentPage / this.totalPages) * 100);
});

const Book = mongoose.model('Book', bookSchema);

export default Book;


