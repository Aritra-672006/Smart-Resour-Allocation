// controllers/reportController.js
const Report = require('./Report');
const Volunteer = require('./Volunteer');
const Assignment = require('./Assignment');
const { callAIAgent } = require('./mlService');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Validates the required fields for a report submission.
 * Returns null if valid, or an error message string if invalid.
 */
const validateReportPayload = ({ ngo_name, location, report_text, people_affected }) => {
  if (!ngo_name || !ngo_name.toString().trim()) return 'ngo_name is required.';
  if (!location || !location.toString().trim()) return 'location is required.';
  if (!report_text || !report_text.toString().trim()) return 'report_text is required.';
  if (people_affected === undefined || people_affected === null)
    return 'people_affected is required.';
  if (isNaN(Number(people_affected)) || Number(people_affected) < 0)
    return 'people_affected must be a non-negative number.';
  return null;
};

/**
 * Derives Assignment documents from the ML ai_result payload.
 *
 * The ML agent is expected to return an object that may contain:
 *   - need_analysis : Array<{ need_type, location, urgency, ... }>
 *   - tasks         : Array<{ title, location, urgency, assigned_volunteers, ... }>
 *
 * We normalise whatever the ML returns into our Assignment schema.
 */
const buildAssignmentsFromAIResult = (aiResult, reportId, reportLocation) => {
  const assignments = [];

  // ── Path 1: ai_result.need_analysis ───────────────────────────────────────
  const needs = aiResult?.need_analysis;
  if (Array.isArray(needs) && needs.length > 0) {
    needs.forEach((need) => {
      const urgency = normaliseUrgency(need.urgency);
      assignments.push({
        title: `${need.need_type || 'General'} Support`,
        location: need.location || reportLocation,
        urgency,
        report_id: reportId,
        assigned_volunteers: need.assigned_volunteers || [],
        decision_trace: aiResult.decision_trace || null,
      });
    });
  }

  // ── Path 2: ai_result.tasks (some ML shapes expose a tasks array) ──────────
  const tasks = aiResult?.tasks;
  if (Array.isArray(tasks) && tasks.length > 0) {
    tasks.forEach((task) => {
      const urgency = normaliseUrgency(task.urgency);
      assignments.push({
        title: task.title || 'Support Task',
        location: task.location || reportLocation,
        urgency,
        report_id: reportId,
        assigned_volunteers: task.assigned_volunteers || [],
        decision_trace: aiResult.decision_trace || null,
      });
    });
  }

  // ── Fallback: create one generic assignment if ML gave nothing actionable ──
  if (assignments.length === 0) {
    assignments.push({
      title: 'General Support',
      location: reportLocation,
      urgency: 'medium',
      report_id: reportId,
      assigned_volunteers: [],
      decision_trace: aiResult?.decision_trace || null,
    });
  }

  return assignments;
};

/** Maps any urgency string from ML to a valid enum value. */
const normaliseUrgency = (raw) => {
  const valid = ['low', 'medium', 'high', 'critical'];
  const val = (raw || '').toLowerCase().trim();
  return valid.includes(val) ? val : 'medium';
};

/**
 * Sorts volunteers by their ML-assigned score (descending).
 * Non-numeric scores are treated as 0.
 */
const sortVolunteersByScore = (volunteers) =>
  [...volunteers].sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));

// ─── Controller ───────────────────────────────────────────────────────────────

/**
 * POST /upload-report
 *
 * Flow:
 *  1. Validate & save report
 *  2. Fetch volunteers
 *  3. Call ML /ai-agent
 *  4. Update report with ai_result
 *  5. Create Assignment documents
 *  6. Return response
 */
const uploadReport = async (req, res, next) => {
  try {
    const { ngo_name, location, report_text, people_affected } = req.body;

    // ── 1. Validate ────────────────────────────────────────────────────────────
    const validationError = validateReportPayload(req.body);
    if (validationError) {
      return res.status(400).json({
        error: 'validation_error',
        message: validationError,
      });
    }

    // ── 2. Persist report (before AI so we have an _id) ───────────────────────
    const report = await Report.create({
      ngo_name: ngo_name.trim(),
      location: location.trim(),
      report_text: report_text.trim(),
      people_affected: Number(people_affected),
      created_at: new Date(),
    });

    // ── 3. Fetch volunteers (lean for speed; used as ML payload) ───────────────
    const rawVolunteers = await Volunteer.find({}).lean();
    const sortedVolunteers = sortVolunteersByScore(rawVolunteers);

    // ── 4. Call ML microservice ────────────────────────────────────────────────
    let aiResult = null;
    try {
      aiResult = await callAIAgent({
        text: report_text.trim(),
        volunteers: sortedVolunteers,
      });
    } catch (mlError) {
      console.error('[reportController] ML service error:', mlError.message);
      // We do NOT abort the request — we store a degraded ai_result
      aiResult = {
        error: mlError.errorType || 'ml_error',
        message: mlError.message,
        need_analysis: [],
        tasks: [],
        decision_trace: null,
      };
    }

    // ── 5. Save AI result back to the report ──────────────────────────────────
    report.ai_result = aiResult;
    await report.save();

    // ── 6. Create assignments from AI result ──────────────────────────────────
    const assignmentDocs = buildAssignmentsFromAIResult(aiResult, report._id, location.trim());
    if (assignmentDocs.length > 0) {
      await Assignment.insertMany(assignmentDocs);
    }

    return res.status(200).json({
      message: 'Report processed successfully',
      report_id: report._id,
      ai_result: aiResult,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadReport };
