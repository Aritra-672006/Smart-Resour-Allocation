// routes/volunteerRoutes.js
const express = require('express');
const router = express.Router();
const { registerVolunteer } = require('../controllers/volunteerController');

/**
 * POST /register-volunteer
 * Body: { name, phone, skills, location, availability }
 */
router.post('/register-volunteer', registerVolunteer);

module.exports = router;
