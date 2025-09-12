const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// अपनी YouTube API Key यहाँ डालें
const YOUTUBE_API_KEY = "AIzaSyAe1y4ElWZM-Db9kHIDQhrUD9dsMPBztLE";

app.use(cors());

// ✅ Root route पर index.html serve करो
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ robots.txt serve करो
app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *
Disallow:

Sitemap: https://youtube-title-generator-production.up.railway.app/sitemap.xml
`);
});

// ✅ sitemap.xml serve करो
app.get("/sitemap.xml", (req, res) => {
    res.type("application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://youtube-title-generator-production.up.railway.app/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://youtube-title-generator-production.up.railway.app/get-tags</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`);
});

// API endpoint
app.get("/get-tags", async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: "No query provided" });
    }

    try {
        // Step 1: Search YouTube videos
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;
        const searchResponse = await axios.get(searchUrl);

        const videoIds = searchResponse.data.items.map(item => item.id.videoId);

        let tags = [];

        // Step 2: Get tags from those videos
        for (const vid of videoIds) {
            const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${vid}&key=${YOUTUBE_API_KEY}`;
            const videoResponse = await axios.get(videoUrl);

            if (
                videoResponse.data.items.length > 0 &&
                videoResponse.data.items[0].snippet.tags
            ) {
                tags = tags.concat(videoResponse.data.items[0].snippet.tags);
            }
        }

        // Unique tags only
        const uniqueTags = [...new Set(tags)];
        res.json({ tags: uniqueTags });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch tags" });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running at https://youtube-title-generator-production.up.railway.app:${PORT}`);
});














/*const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// अपनी YouTube API Key यहाँ डालें
const YOUTUBE_API_KEY = "AIzaSyAe1y4ElWZM-Db9kHIDQhrUD9dsMPBztLE";

app.use(cors());

// ✅ Public folder को static serve करो
//app.use(express.static(path.join(__dirname, "public")));

// ✅ Root route पर index.html serve करो
//app.get("/", (req, res) => {
//    res.sendFile(path.join(__dirname, "public", "index.html"));
//});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// API endpoint
app.get("/get-tags", async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: "No query provided" });
    }

    try {
        // Step 1: Search YouTube videos
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;
        const searchResponse = await axios.get(searchUrl);

        const videoIds = searchResponse.data.items.map(item => item.id.videoId);

        let tags = [];

        // Step 2: Get tags from those videos
        for (const vid of videoIds) {
            const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${vid}&key=${YOUTUBE_API_KEY}`;
            const videoResponse = await axios.get(videoUrl);

            if (
                videoResponse.data.items.length > 0 &&
                videoResponse.data.items[0].snippet.tags
            ) {
                tags = tags.concat(videoResponse.data.items[0].snippet.tags);
            }
        }

        // Unique tags only
        const uniqueTags = [...new Set(tags)];
        res.json({ tags: uniqueTags });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch tags" });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running at https://youtube-title-generator-production.up.railway.app:${PORT}`);
});
/*





