require("dotenv").config();
const axios = require("axios");

const API_TOKEN = process.env.SCYTEDTV_API;
const HEADERS = {
  Authorization: `Bearer ${API_TOKEN}`,
  "Content-Type": "application/json",
};

const URLS = [
  "https://api.scyted.tv/v2/seaside/scoreboards/events",
  "https://api.scyted.tv/v2/seaside/scoreboards/party"
];

async function processUrls() {
  for (const url of URLS) {
    try {
      const response = await axios.get(url, { headers: HEADERS });
      const data = response.data;

      if (typeof data === "object") {
        for (const [name, value] of Object.entries(data)) {
          await sendPostRequest(url, name, value);
        }
      } else {
        console.warn(`Unexpected response format from: ${url}`);
      }
    } catch (error) {
      console.error(`Error fetching ${url}:`, error.response?.data || error.message);
    }
  }
}

async function sendPostRequest(baseUrl, name, value) {
  const postUrl = `${baseUrl}/${encodeURIComponent(name)}`;
  const payload = { [name]: value };

  try {
    const response = await axios.post(postUrl, payload, { headers: HEADERS });
    // console.log(`POST ${postUrl} - Status: ${response.status}`);
  } catch (error) {
    console.error(`Error posting to ${postUrl}:`, error.response?.data || error.message);
  }
}

processUrls();
setInterval(processUrls, 20000);