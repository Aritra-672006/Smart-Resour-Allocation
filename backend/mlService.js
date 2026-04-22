// services/mlService.js
const axios = require('axios');

const ML_BASE_URL = process.env.ML_BASE_URL || 'https://smart-resour-allocation.onrender.com/';
const ML_TIMEOUT_MS = parseInt(process.env.ML_TIMEOUT_MS, 10) || 30000;

/**
 * Creates a pre-configured Axios instance for the ML microservice.
 * Centralising this makes it easy to add auth headers, retries, etc. later.
 */
const mlClient = axios.create({
  baseURL: ML_BASE_URL,
  timeout: ML_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Response/Error interceptors ─────────────────────────────────────────────

mlClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enrich the error before propagating so controllers get a clean message
    if (error.code === 'ECONNABORTED') {
      error.message = `ML service timed out after ${ML_TIMEOUT_MS / 1000}s`;
      error.errorType = 'ml_timeout';
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      error.message = `ML service is unreachable at ${ML_BASE_URL}`;
      error.errorType = 'ml_unreachable';
    } else if (error.response) {
      // ML service returned a non-2xx status
      error.message =
        error.response.data?.message ||
        `ML service returned status ${error.response.status}`;
      error.errorType = 'ml_error';
    } else {
      error.errorType = 'ml_unknown_error';
    }
    return Promise.reject(error);
  }
);

/**
 * callAIAgent
 * -----------
 * Sends a report's text and the current volunteer roster to the ML agent
 * and returns the full structured response.
 *
 * @param {{ text: string, volunteers: Array }} data
 * @returns {Promise<Object>} Full AI agent response payload
 */
const callAIAgent = async (data) => {
  const { text, volunteers } = data;

  if (!text || typeof text !== 'string') {
    const err = new Error('callAIAgent: `text` field is required and must be a string.');
    err.errorType = 'ml_invalid_input';
    throw err;
  }

  console.log(
    `[mlService] Calling /ai-agent | text length: ${text.length} | volunteers: ${volunteers?.length ?? 0}`
  );

  const response = await mlClient.post('/ai-agent', {
    text,
    volunteers: volunteers || [],
  });

  console.log('[mlService] /ai-agent responded with status:', response.status);

  return response.data;
};

module.exports = { callAIAgent };
