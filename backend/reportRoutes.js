// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { uploadReport } = require('./reportController');

/**
 * POST /upload-report
 * Body: { ngo_name, location, report_text, people_affected }
 */
router.post('/upload-report', uploadReport);

module.exports = router;
