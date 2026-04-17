// models/Report.js
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    ngo_name: {
      type: String,
      required: [true, 'NGO name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    report_text: {
      type: String,
      required: [true, 'Report text is required'],
      trim: true,
    },
    people_affected: {
      type: Number,
      required: [true, 'People affected count is required'],
      min: [0, 'People affected cannot be negative'],
    },
    // Stores the full response returned by the ML /ai-agent endpoint
    ai_result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Disable the default __v field
    versionKey: false,
    // Use created_at as the single timestamp field (updatedAt disabled)
    timestamps: false,
  }
);

// Index for common query patterns
ReportSchema.index({ location: 1, created_at: -1 });

module.exports = mongoose.model('Report', ReportSchema);
