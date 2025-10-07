import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  improvement: {
    type: String,
    required: true
  },
  challenge: {
    type: String,
    required: true
  },
  gratitude: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'okay', 'struggling', 'difficult']
  }
}, {
  timestamps: true
});

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

export default JournalEntry;

