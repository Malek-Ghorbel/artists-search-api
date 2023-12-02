const express = require('express');
const artistController=require("../controllers/artistController");
const router = express.Router();

// Route to search for artists and return results in the response
router.get('/artist', artistController.searchArtist);

// Route to search for artists and download results as a CSV file
router.get('/artist/download', artistController.downloadArtistCSV);

// Default route to provide a welcome message and instructions
router.get('/', (req, res) => {
  res.status(200).json({ message: "Welcome to the app. Use the following endpoints: GET /artist and GET /artist/download" });
});

module.exports = router;
