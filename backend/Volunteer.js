// models/Volunteer.js
const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Volunteer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      unique: true, // Prevents duplicate registrations
      match: [/^\d{7,15}$/, 'Please enter a valid phone number (7–15 digits)'],
    },
    skills: {
      type: [String],
      default: [],
      // Normalise skills to lowercase for consistent matching
      set: (arr) => arr.map((s) => s.toLowerCase().trim()),
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    availability: {
        type: [String],   // ✅ FIX
        required: [true, 'Availability is required'],
        default: [],
    },

    // Optional score field populated after ML ranking
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

// Compound index for geo + skill queries
VolunteerSchema.index({ location: 1, skills: 1 });

module.exports = mongoose.model('Volunteer', VolunteerSchema);
