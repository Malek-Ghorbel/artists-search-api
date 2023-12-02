/**
 * Helper function to handle common error responses.
 * @param {object} res - Express response object.
 * @param {string} errorMessage - Error message to send in the response.
 * @param {number} statusCode - HTTP status code for the response.
 */
function sendErrorResponse(res, errorMessage, statusCode = 500) {
    res.status(statusCode).send({ error: errorMessage });
}

module.exports = {
    sendErrorResponse,
};