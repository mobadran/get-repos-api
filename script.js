// server.js
const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio'); // Import cheerio to parse HTML
var fs = require('fs');


// Use dynamic import inside an async function
(async () => {
    const fetch = (await import('node-fetch')).default; // Dynamic import inside async function
    // const response = await fetch('https://github.com/mobadran?tab=repositories');
    // const html = await response.text();
    // fs.writeFile('result.txt', html, function (err) {
    //     if (err) throw err;
    //     console.log('Saved!');
    // });

    const app = express();
    const PORT = 3000;

    // Enable CORS for all routes
    app.use(cors());

    app.get('/fetch-repos', async (req, res) => {
        try {
            const response = await fetch('https://github.com/mobadran?tab=repositories');
            const html = await response.text(); // Get the HTML content of the page

            // Load the HTML into cheerio
            const $ = cheerio.load(html);

            // Select all <span> elements with the class "repo"
            const repos = [];
            $('a[itemprop="name codeRepository"]').each((i, element) => {
                const repoContent = $(element).text().trim(); // Extract the text and remove extra whitespace
                repos.push(repoContent); // Add to the array
            });

            // Return the array of repo names (or other content)
            res.json(repos);
        } catch (error) {
            res.status(500).send('Error fetching the HTML');
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})();
