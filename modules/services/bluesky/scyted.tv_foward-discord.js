// require("dotenv").config();
// const axios = require("axios");
// const { WebhookClient } = require("discord.js");

// const monitoredAccounts = ["scyted.tv", "team.scyted.tv", "phrasing.scyted.tv", "creators.scyted.tv", "news.scyted.tv", "milo.scyted.tv", "tindalos.scyted.tv", "cr.scyted.tv"];
// const bskyAPI = "https://bsky.social/xrpc/";
// const apiURL = `https://api.scyted.tv/v2/loydshelper/bluesky/${process.env.SCYTED_TV_BSKY_USERNAME}/posted-to-discord.json`;

// const BSKY_USERNAME = process.env.SCYTED_TV_BSKY_USERNAME;
// const BSKY_PASSWORD = process.env.SCYTED_TV_BSKY_PASSWORD;
// const SCYTEDTV_API = process.env.SCYTEDTV_API;

// const webhookNames = Object.keys(process.env).filter((key) =>
//   key.startsWith("SCYTED_TV_BLUESKY_FORWARD_WEBHOOK_")
// );
// const webhooks = webhookNames.map((name) => process.env[name]);

// let sessionToken;
// let postedPosts = new Set();

// async function authenticate() {
//   try {
//     const response = await axios.post(`${bskyAPI}com.atproto.server.createSession`, {
//       identifier: BSKY_USERNAME,
//       password: BSKY_PASSWORD,
//     });
//     sessionToken = response.data.accessJwt;
//     // console.log("Reauthenticated with Bluesky.");
//   } catch (error) {
//     console.error("Failed to authenticate with Bluesky:", error.response?.data || error.message);
//   }
// }

// async function fetchPostedFromAPI() {
//   try {
//     const response = await axios.get(apiURL, {
//       headers: { Authorization: `Bearer ${SCYTEDTV_API}` },
//     });
//     const postedData = response.data;
//     if (Array.isArray(postedData)) {
//       postedPosts = new Set(postedData);
//     } else {
//       console.warn("Unexpected data format from the API. Starting with an empty cache.");
//     }
//   } catch (error) {
//     console.error("Failed to fetch posted posts from API:", error.response?.data || error.message);
//   }
// }

// async function updatePostedInAPI() {
//   try {
//     await axios.post(apiURL, Array.from(postedPosts), {
//       headers: { Authorization: `Bearer ${SCYTEDTV_API}` },
//     });
//   } catch (error) {
//     console.error("Failed to update posted posts in API:", error.response?.data || error.message);
//   }
// }

// async function monitorAndPostToDiscord() {
//   if (!sessionToken) {
//     console.warn("Skipping monitoring due to missing session token.");
//     return;
//   }

//   try {
//     const response = await axios.get(`${bskyAPI}app.bsky.feed.getTimeline`, {
//       headers: { Authorization: `Bearer ${sessionToken}` },
//     });

//     const posts = response.data.feed;

//     for (const post of posts) {
//       const { author, uri } = post.post;

//       if (postedPosts.has(uri) || !monitoredAccounts.includes(author.handle)) continue;

//       const postURL = `https://bsky.app/profile/${author.handle}/post/${uri.split("/").pop()}`;

//       for (const webhookURL of webhooks) {
//         const webhook = new WebhookClient({ url: webhookURL });
//         try {
//           await webhook.send({
//             content: postURL,
//             username: author.displayName || author.handle,
//             avatarURL: author.avatar || "https://via.placeholder.com/150",
//           });
//         } catch (err) {
//           console.error("Failed to post to webhook:", err.message);
//         }
//       }

//       postedPosts.add(uri);
//       await updatePostedInAPI();
//     }
//   } catch (error) {
//     console.error("Error monitoring Bluesky posts:", error.response?.data || error.message);
//   }
// }

// (async function main() {
//   await authenticate();
//   await fetchPostedFromAPI();

//   setInterval(monitorAndPostToDiscord, 20000);
//   setInterval(authenticate, 3600000);
// })();