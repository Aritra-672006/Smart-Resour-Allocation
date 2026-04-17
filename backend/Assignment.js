// models/Assignment.js
const mongoose = require('mongoose');

const URGENCY_LEVELS = ['low', 'medium', 'high', 'critical'];

const AssignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    urgency: {
      type: String,
      required: [true, 'Urgency level is required'],
      enum: {
        values: URGENCY_LEVELS,
        message: `Urgency must be one of: ${URGENCY_LEVELS.join(', ')}`,
      },
      lowercase: true,
    },
    // Source report reference (optional but useful for traceability)
    report_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
      default: null,
    },
    // Volunteers assigned by the ML agent (optional)
    assigned_volunteers: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    // Full decision trace from ML agent
    decision_trace: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Index for dashboard / priority queries
AssignmentSchema.index({ urgency: 1, created_at: -1 });

module.exports = mongoose.model('Assignment', AssignmentSchema);
