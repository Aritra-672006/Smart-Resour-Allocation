// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const {
  getCommunityNeeds,
  getAssignments,
} = require('../controllers/dashboardController');

/**
 * GET /community-needs
 * Returns aggregated need analysis from all processed reports.
 */
router.get('/community-needs', getCommunityNeeds);

/**
 * GET /assignments
 * Returns all task assignments, sorted by urgency.
 */
router.get('/assignments', getAssignments);

module.exports = router;
