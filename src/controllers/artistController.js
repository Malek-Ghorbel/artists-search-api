const artistService = require("../services/artistService");
const { sendErrorResponse } = require("../helpers/controllerHelpers");
const fs = require('fs');

/**
 * Controller function to search for artists and handle the response.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {boolean} download - Flag indicating whether to download as CSV.
 */
async function handleArtistSearch(req, res, download = false) {
  try {
    const { artist, limit, page, filename } = req.query;

    // Validate required data
    if (!artist) {
      sendErrorResponse(res, "Artist name is required", 400);
      return;
    }

    // Fetch artist data from the service
    let artistData;
    try {
      artistData = await artistService.artistSearchFallback(artist, limit, page);
    } catch (error) {
      sendErrorResponse(res, `Error occurred while fetching artist data: ${error.message}`);
      return;
    }

    if (download) {
      const file_name = filename || "artists.csv";
      const response = await artistService.downloadArtistCSV(artistData, file_name);

      // Set headers for the CSV response
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${response}"`);

      // Send the CSV file as a response
      res.sendFile(response, { root: '.' }, (err) => {
        if (err) {
          console.error('Error sending file:', err);
        } else {
          // Delete the file after sending it
          fs.unlink(response, unlinkErr => {
            if (unlinkErr) console.error('Error deleting file:', unlinkErr);
          });
        }
      });
    } else {
      // No download just return the data in the response body
      res.status(200).json({ artistData });
    }

  } catch (error) {
    sendErrorResponse(res, `Error occurred in the controller: ${error.message}`);
  }
}

/**
 * Controller function to search for artists and return the results in the response.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.searchArtist = async function (req, res) {
  await handleArtistSearch(req, res, false);
};

/**
 * Controller function to search for artists and download the results as a CSV file.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
exports.downloadArtistCSV = async function (req, res) {
  await handleArtistSearch(req, res, true);
};
