const mongoose = require('mongoose');

const VJudgeDataSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  data: {
    type: Array,
    required: true
  },
  totalProblemsFound: {
    type: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VJudgeData', VJudgeDataSchema); 