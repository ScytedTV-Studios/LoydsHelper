require('dotenv').config();
const axios = require('axios');

const API_URL = "https://api.scyted.tv/v2/radio/current.json";
const CHECK_INTERVAL = 5000;
const MAX_UNCHANGED_TIME = 20 * 60 * 1000;

let lastData = null;
let unchangedSince = null;

async function checkAPI() {
    try {
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${process.env.SCYTEDTV_API}` }
        });

        const data = response.data;

        if (!lastData) {
            lastData = JSON.stringify(data);
            unchangedSince = Date.now();
        } else if (JSON.stringify(data) === lastData) {
            if (Date.now() - unchangedSince >= MAX_UNCHANGED_TIME) {
                // console.log("Data unchanged for 20 minutes. Sending POST request...");
                await sendOfflineWarning();
                unchangedSince = Date.now();
            }
        } else {
            lastData = JSON.stringify(data);
            unchangedSince = Date.now();
        }
    } catch (error) {
        console.error("Error fetching API:", error.response ? error.response.data : error.message);
    }
}

async function sendOfflineWarning() {
    try {
        const response = await axios.post(API_URL, { warning: "Radio Offline" }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.SCYTEDTV_API}`
            }
        });

        // console.log("Successfully sent offline warning:", response.data);
    } catch (error) {
        console.error("Error sending offline warning:", error.response ? error.response.data : error.message);
    }
}

setInterval(checkAPI, CHECK_INTERVAL);