// controllers/volunteerController.js
const Volunteer = require('./Volunteer');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const validateVolunteerPayload = ({ name, phone, skills, location, availability }) => {
  if (!name || !name.toString().trim()) return 'name is required.';
  if (!phone || !phone.toString().trim()) return 'phone is required.';
  if (!/^\d{7,15}$/.test(phone.toString().trim()))
    return 'phone must contain only digits and be 7–15 characters long.';
  if (!location || !location.toString().trim()) return 'location is required.';
  if (!availability || !availability.toString().trim()) return 'availability is required.';
  if (skills !== undefined && !Array.isArray(skills))
    return 'skills must be an array of strings.';
  return null;
};

// ─── Controller ───────────────────────────────────────────────────────────────

/**
 * POST /register-volunteer
 *
 * Registers a new volunteer.
 * Returns 409 Conflict if a volunteer with the same phone already exists.
 */
const registerVolunteer = async (req, res, next) => {
  try {
    const { name, phone, skills, location, availability } = req.body;

    // ── 1. Validate ────────────────────────────────────────────────────────────
    const validationError = validateVolunteerPayload(req.body);
    if (validationError) {
      return res.status(400).json({
        error: 'validation_error',
        message: validationError,
      });
    }

    const sanitisedPhone = phone.toString().trim();

    // ── 2. Duplicate check ────────────────────────────────────────────────────
    const existing = await Volunteer.findOne({ phone: sanitisedPhone }).lean();
    if (existing) {
      return res.status(409).json({
        error: 'duplicate_volunteer',
        message: `A volunteer with phone number ${sanitisedPhone} is already registered.`,
      });
    }

    // ── 3. Create ─────────────────────────────────────────────────────────────
    await Volunteer.create({
      name: name.trim(),
      phone: sanitisedPhone,
      skills: Array.isArray(skills) ? skills : [],
      location: location.trim(),
      availability: Array.isArray(availability)
      ? availability
      : [availability.toString().trim()],
    });
 

    return res.status(201).json({
      message: 'Volunteer registered successfully',
    });
  } catch (err) {
    // Mongoose duplicate key error (E11000) as a safety net
    if (err.code === 11000) {
      return res.status(409).json({
        error: 'duplicate_volunteer',
        message: 'A volunteer with this phone number is already registered.',
      });
    }
    next(err);
  }
};

module.exports = { registerVolunteer };
