// controllers/dashboardController.js
const Report = require('./Report');
const Assignment = require('./Assignment');

// ─── Geo helpers ──────────────────────────────────────────────────────────────

/**
 * A small lookup table for common locations → approximate [lat, lng].
 * Falls back to 0, 0 for unknown locations.
 */
const GEO_LOOKUP = {
  kolkata: { lat: 22.5726, lng: 88.3639 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  delhi: { lat: 28.7041, lng: 77.1025 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  pune: { lat: 18.5204, lng: 73.8567 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  'west bengal': { lat: 22.9868, lng: 87.855 },
  assam: { lat: 26.2006, lng: 92.9376 },
  odisha: { lat: 20.9517, lng: 85.0985 },
  kerala: { lat: 10.8505, lng: 76.2711 },
};

const getCoordinates = (locationStr) => {
  if (!locationStr) return { lat: 0, lng: 0 };
  const key = locationStr.toLowerCase().trim();
  // Try direct match first, then partial match
  if (GEO_LOOKUP[key]) return GEO_LOOKUP[key];
  const partialKey = Object.keys(GEO_LOOKUP).find((k) => key.includes(k));
  return partialKey ? GEO_LOOKUP[partialKey] : { lat: 0, lng: 0 };
};

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * GET /community-needs
 *
 * Aggregates need_analysis entries from all stored reports that have
 * an ai_result. Attaches lat/lng coordinates for map rendering.
 */
const getCommunityNeeds = async (req, res, next) => {
  try {
    // Fetch only reports that have been processed by the ML agent
    const reports = await Report.find(
      { 'ai_result.need_analysis': { $exists: true, $ne: null } },
      { 'ai_result.need_analysis': 1, location: 1, people_affected: 1, _id: 0 }
    ).lean();

    const needs = [];

    reports.forEach((report) => {
      const needAnalysis = report.ai_result?.need_analysis;
      if (!Array.isArray(needAnalysis)) return;

      needAnalysis.forEach((need) => {
        const location = need.location || report.location || 'Unknown';
        const coords = getCoordinates(location);

        needs.push({
          need_type: need.need_type || 'General',
          location,
          urgency: (need.urgency || 'medium').toLowerCase(),
          people_affected: need.people_affected ?? report.people_affected ?? 0,
          lat: need.lat ?? coords.lat,
          lng: need.lng ?? coords.lng,
        });
      });
    });

    return res.status(200).json(needs);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /assignments
 *
 * Returns all assignments sorted by urgency priority (critical > high > medium > low)
 * and then by creation date descending.
 */
const getAssignments = async (req, res, next) => {
  try {
    const URGENCY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

    const assignments = await Assignment.find(
      {},
      { title: 1, location: 1, urgency: 1, _id: 0 }
    ).lean();

    // Sort by urgency priority, then latest first
    assignments.sort((a, b) => {
      const urgencyDiff =
        (URGENCY_ORDER[a.urgency] ?? 99) - (URGENCY_ORDER[b.urgency] ?? 99);
      return urgencyDiff !== 0
        ? urgencyDiff
        : new Date(b.created_at) - new Date(a.created_at);
    });

    return res.status(200).json(assignments);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCommunityNeeds, getAssignments };
