require("dotenv").config();
const axios = require("axios");

const monitoredAccounts = ["loyd.scyted.tv", "ope.scyted.tv"];
const bskyAPI = "https://bsky.social/xrpc/";
const apiBaseURL = `https://api.scyted.tv/v2/loydshelper/bluesky/${process.env.TEAM_SCYTED_TV_BSKY_USERNAME}/reposted.json`;

const BSKY_USERNAME = process.env.TEAM_SCYTED_TV_BSKY_USERNAME;
const BSKY_PASSWORD = process.env.TEAM_SCYTED_TV_BSKY_PASSWORD;
const SCYTEDTV_API = process.env.SCYTEDTV_API;

let sessionToken;
let repostedPosts = new Set();

async function authenticate() {
  try {
    const response = await axios.post(`${bskyAPI}com.atproto.server.createSession`, {
      identifier: BSKY_USERNAME,
      password: BSKY_PASSWORD,
    });
    sessionToken = response.data.accessJwt;
    // console.log("Authenticated successfully!");
  } catch (error) {
    console.error("Authentication failed:", error.response?.data || error.message);
    process.exit(1);
  }
}

async function fetchRepostedFromAPI() {
  try {
    // console.log("Fetching reposted posts from external API...");
    const response = await axios.get(apiBaseURL, {
      headers: { Authorization: `Bearer ${SCYTEDTV_API}` },
    });
    const repostedData = response.data;

    if (Array.isArray(repostedData)) {
      repostedPosts = new Set(repostedData);
    //   console.log(`Loaded ${repostedPosts.size} reposted posts from the API.`);
    } else {
      console.warn("Unexpected data format from the API. Using an empty repost list.");
    }
  } catch (error) {
    console.error("Failed to fetch reposted posts from API:", error.response?.data || error.message);
  }
}

async function updateRepostedInAPI() {
  try {
    // console.log("Updating reposted posts in the external API...");
    await axios.post(
      apiBaseURL,
      Array.from(repostedPosts),
      {
        headers: { Authorization: `Bearer ${SCYTEDTV_API}` },
      }
    );
    // console.log("Reposted posts successfully updated in the API.");
  } catch (error) {
    console.error("Failed to update reposted posts in API:", error.response?.data || error.message);
  }
}

async function repost(uri, cid) {
  try {
    await axios.post(
      `${bskyAPI}com.atproto.repo.createRecord`,
      {
        repo: BSKY_USERNAME,
        collection: "app.bsky.feed.repost",
        record: {
          subject: { uri, cid },
          createdAt: new Date().toISOString(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );
    // console.log(`Reposted post with URI: ${uri}`);
    repostedPosts.add(uri);
  } catch (error) {
    console.error("Failed to repost:", error.response?.data || error.message);
  }
}

async function monitorAndRepost() {
  try {
    const response = await axios.get(`${bskyAPI}app.bsky.feed.getTimeline`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    const posts = response.data.feed;

    for (const post of posts) {
      const { author, uri, cid, record } = post.post;

      if (repostedPosts.has(uri)) continue;
      if (record.reply) continue;
      if (!monitoredAccounts.includes(author.handle)) continue;

    //   console.log(`Detected post from ${author.handle}: ${uri}`);
      await repost(uri, cid);
    }

    await updateRepostedInAPI();
  } catch (error) {
    console.error("Error while monitoring posts:", error.response?.data || error.message);
  }
}

(async function main() {
  await authenticate();
  await fetchRepostedFromAPI();
//   console.log("Starting to monitor posts...");
  setInterval(monitorAndRepost, 30000);
})();