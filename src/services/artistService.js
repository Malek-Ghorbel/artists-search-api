const axios = require('axios');
const fs = require('fs');
const csvWriterCreator = require('csv-writer').createObjectCsvWriter;
const constants = require('../utils/constants/constants');

require("dotenv").config();

/**
 * Fetch artist data from the Last.fm API.
 * @param {string} artistName - Name of the artist to search for.
 * @param {string} limit - Limit of results per page.
 * @param {string} page - Page number.
 * @returns {Promise<object>} - Artist data from the API.
 */
async function fetchArtistData(artistName, limit, page) {
    const params = {
        method: 'artist.search',
        artist: artistName,
        limit,
        page,
        api_key: process.env.API_KEY,
        format: 'json'
    };

    try {
        const { data } = await axios.get(constants.LAST_FM_API_URL, { params });
        return data;
    } catch (error) {
        throw new Error('Error fetching artist data: ' + error.message);
    }
}

/**
 * Search for an artist or returns a rondom one if the search result is empty.
 * @param {string} artistName - Name of the artist to search for.
 * @param {string} limit - Limit of results per page.
 * @param {string} page - Page number.
 * @returns {Promise<Array>} - Array of artist objects.
 */
async function searchArtistOrGetRandom(artistName, limit = '300', page = '1') {
    let data = await fetchArtistData(artistName, limit, page);

    // Repeat until we have gathered a list of artists.
    while (data.results.artistmatches.artist.length === 0) {
        const randomName = await getRandomArtist();
        data = await fetchArtistData(randomName, limit, page);
    }
    return data.results.artistmatches.artist;
}

/**
 * Get a random artist name from the locally stored file.
 * @returns {Promise<string>} - Random artist name.
 */
async function getRandomArtist() {
    // if the file does not exist create it
    if (!fs.existsSync(constants.ARTISTS_JSON)) {
        await createRandomArtistFile();
    }
    const artists = JSON.parse(fs.readFileSync(constants.ARTISTS_JSON, 'utf8'));
    return artists[Math.floor(Math.random() * artists.length)];
}

/**
 * Create a file with random artist names based on each alphabet letter.
 */
async function createRandomArtistFile() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let artistNames = new Set();

    while (artistNames.size === 0) {
        const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
        const { results } = await fetchArtistData(letter);
        results.artistmatches.artist.forEach(artist => artistNames.add(artist.name));
    }

    fs.writeFileSync(constants.ARTISTS_JSON, JSON.stringify([...artistNames]));
}

/**
 * Download artist data as a CSV file.
 * @param {Array} artists - Array of artist objects.
 * @param {string} filename - Name of the CSV file.
 * @returns {Promise<string>} - Filename of the downloaded CSV file.
 */
async function downloadArtistCSV(artists, filename) {
    try {
        const csvExtensionFileName = filename + (filename.endsWith(".csv") ? "" : ".csv");

        const records = artists.map((artist) => ({
            name: artist.name,
            mbid: artist.mbid,
            url: artist.url,
            image_small: artist.image.filter(img => img.size === "small").map(img => img["#text"]),
            image: artist.image.map(img => img["#text"]),
        }));

        const csvWriter = csvWriterCreator({
            path: csvExtensionFileName,
            header: [
                { id: 'name', title: 'Name' },
                { id: 'mbid', title: 'MBID' },
                { id: 'url', title: 'URL' },
                { id: 'image_small', title: 'Image_Small' },
                { id: 'image', title: 'Image' },
            ],
        });

        await csvWriter.writeRecords(records);
        return csvExtensionFileName;
    } catch (error) {
        throw new Error('Error writing to CSV: ' + error.message);
    }
}

module.exports = {
    searchArtistOrGetRandom,
    downloadArtistCSV
};
