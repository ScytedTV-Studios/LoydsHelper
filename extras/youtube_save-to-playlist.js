require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const { google } = require("googleapis");

const CONFIG_FILE = "./config/save-to-playlist.json";
const SAVED_VIDEOS_URL = "https://api.scyted.tv/v2/loydshelper/youtube/save-playlist.json";
const API_KEY = process.env.YOUTUBE_API_KEY;
const SCYTEDTV_API = process.env.SCYTEDTV_API;
const CHECK_INTERVAL = 10 * 60 * 1000; 

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const youtube = google.youtube({ version: "v3", auth: oauth2Client });

async function loadConfig() {
    try {
        return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    } catch (error) {
        console.error("Failed to load config file:", error.message);
        return { targetPlaylist: "", sources: [] };
    }
}

async function loadSavedVideos() {
    try {
        const response = await axios.get(SAVED_VIDEOS_URL, {
            headers: { Authorization: `Bearer ${SCYTEDTV_API}` },
        });
        return response.data.videos || [];
    } catch (error) {
        console.error("Failed to load saved videos:", error.response ? error.response.data : error.message);
        return [];
    }
}

async function saveNewVideos(newVideos) {
    try {
        await axios.post(SAVED_VIDEOS_URL, { videos: newVideos }, {
            headers: { Authorization: `Bearer ${SCYTEDTV_API}` },
        });
        console.log("Successfully saved new videos.");
    } catch (error) {
        console.error("Failed to save new videos:", error.response ? error.response.data : error.message);
    }
}

async function fetchVideosFromChannel(channelId) {
    try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=id&order=date&type=video&maxResults=10`;
        const response = await axios.get(url);
        return response.data.items ? response.data.items.map(item => item.id.videoId) : [];
    } catch (error) {
        console.error(`Failed to fetch videos from channel ${channelId}:`, error.message);
        return [];
    }
}

async function fetchVideosFromPlaylist(playlistId) {
    try {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${playlistId}&part=contentDetails&maxResults=10`;
        const response = await axios.get(url);
        return response.data.items ? response.data.items.map(item => item.contentDetails.videoId) : [];
    } catch (error) {
        console.error(`Failed to fetch videos from playlist ${playlistId}:`, error.message);
        return [];
    }
}

async function addVideoToPlaylist(videoId, playlistId) {
    try {
        await youtube.playlistItems.insert({
            part: "snippet",
            requestBody: {
                snippet: {
                    playlistId: playlistId,
                    resourceId: { kind: "youtube#video", videoId: videoId },
                },
            },
        });
        console.log(`Added video ${videoId} to playlist ${playlistId}`);
    } catch (error) {
        console.error(`Failed to add video ${videoId}:`, error.message);
    }
}

async function checkForNewVideos() {
    console.log("Checking for new videos...");
    const config = await loadConfig();
    if (!config.targetPlaylist || config.sources.length === 0) {
        console.warn("Config is missing required values. Skipping check.");
        return;
    }

    const savedVideos = new Set(await loadSavedVideos());
    const newVideos = [];

    for (const source of config.sources) {
        let videos = [];
        if (source.type === "channel") {
            videos = await fetchVideosFromChannel(source.id);
        } else if (source.type === "playlist") {
            videos = await fetchVideosFromPlaylist(source.id);
        }

        for (const videoId of videos) {
            if (!savedVideos.has(videoId)) {
                await addVideoToPlaylist(videoId, config.targetPlaylist);
                newVideos.push(videoId);
                savedVideos.add(videoId);
            }
        }
    }

    if (newVideos.length > 0) {
        await saveNewVideos([...savedVideos]);
    } else {
        console.log("No new videos found.");
    }
}

setInterval(checkForNewVideos, CHECK_INTERVAL);

checkForNewVideos();