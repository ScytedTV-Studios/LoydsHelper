require("dotenv").config();
const axios = require("axios");

const API_TOKEN = process.env.SCYTEDTV_API;
const HEADERS = {
  Authorization: `Bearer ${API_TOKEN}`,
  "Content-Type": "application/json",
};

const URLS = [
  "https://api.scyted.tv/v2/simplynetwork/scoreboards/gamemode",
  "https://api.scyted.tv/v2/simplynetwork/scoreboards/inventorySlot",
  "https://api.scyted.tv/v2/simplynetwork/scoreboards/level_xp_required",
  "https://api.scyted.tv/v2/simplynetwork/scoreboards/level_xp",
  "https://api.scyted.tv/v2/simplynetwork/scoreboards/level",
  "https://api.scyted.tv/v2/simplynetwork/scoreboards/parkour_checkpoints_1",
  "https://api.scyted.tv/v2/simplynetwork/scoreboards/parkour_checkpoints_2",
  "https://api.scyted.tv/v2/simplynetwork/scoreboards/parkour_checkpoints",
  "https://api.scyted.tv/v2/simplynetwork/scoreboards/parkour_level_xp_required",
  "https://api.scyted.tv/v2/simplynetwork/scoreboards/parkour_level_xp",
  "https://api.scyted.tv/v2/simplynetwork/scoreboards/parkour_level",
  "https://api.scyted.tv/v2/simplynetwork/scoreboards/parkour_restart_1",
  "https://api.scyted.tv/v2/simplynetwork/scoreboards/parkour_restart",
  "https://api.scyted.tv/v2/simplynetwork/scoreboards/party",
  "https://api.scyted.tv/v2/simplynetwork/scoreboards/total_players",
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
setInterval(processUrls, 60 * 1000);