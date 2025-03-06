// require("dotenv").config();
// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");
// const dayjs = require("dayjs");
// const utc = require("dayjs/plugin/utc");
// const timezone = require("dayjs/plugin/timezone");
// dayjs.extend(utc);
// dayjs.extend(timezone);

// async function checkAndPostScheduled() {
//     const usernames = getUsernamesFromConfig();

//     for (const username of usernames) {
//         const usernameEnvKey = username.replace(/\./g, "_").toUpperCase();
//         const scheduleURL = `https://api.scyted.tv/v2/loydshelper/bluesky/${process.env[`${usernameEnvKey}_BSKY_USERNAME`]}/schedule.json`;

//         try {
//             const response = await axios.get(scheduleURL, {
//                 headers: { Authorization: `Bearer ${process.env.SCYTEDTV_API}` },
//             });

//             const schedule = response.data;
//             if (!Array.isArray(schedule)) continue;

//             const now = dayjs();
//             for (const post of schedule) {
//                 if (post.posted) continue;

//                 const offsetMatch = post.timeZone.match(/UTC([+-]\d+(:\d{2})?)/);
//                 if (!offsetMatch) {
//                     console.error(`Invalid time zone specified: ${post.timeZone}`);
//                     continue;
//                 }

//                 const offset = parseInt(offsetMatch[1]) * 60;
//                 const postTime = dayjs.utc(`${post.date} ${post.time}`, "MMMM D, YYYY h:mm A").utcOffset(offset);

//                 if (postTime.isBefore(now)) {
//                     console.log(`Posting to Bluesky: ${post.text}`);
//                     await postToBluesky(username, post.text, post.attachment);

//                     post.posted = true;
//                 }
//             }

//             await axios.post(scheduleURL, schedule, {
//                 headers: { Authorization: `Bearer ${process.env.SCYTEDTV_API}` },
//             });
//         } catch (error) {
//             console.error(`Error checking schedule for ${username}:`, error.response?.data || error.message);
//         }
//     }
// }

// async function postToBluesky(username, text, attachmentUrl) {
//     const usernameEnvKey = username.replace(/\./g, "_").toUpperCase();
//     const blueskyUsername = process.env[`${usernameEnvKey}_BSKY_USERNAME`];
//     const blueskyPassword = process.env[`${usernameEnvKey}_BSKY_PASSWORD`];
  
//     try {
//       const authResponse = await axios.post("https://bsky.social/xrpc/com.atproto.server.createSession", {
//         identifier: blueskyUsername,
//         password: blueskyPassword,
//       });
  
//       const accessJwt = authResponse.data.accessJwt;
//       const did = authResponse.data.did;

//       let embed = null;
//       if (attachmentUrl) {
//         const downloadedFilePath = await downloadFile(attachmentUrl);
//         const fileData = fs.readFileSync(downloadedFilePath);
//         const mimeType = getMimeType(downloadedFilePath);
  
//         const blobResponse = await axios.post(
//           "https://bsky.social/xrpc/com.atproto.repo.uploadBlob",
//           fileData,
//           {
//             headers: {
//               Authorization: `Bearer ${accessJwt}`,
//               "Content-Type": mimeType,
//             },
//           }
//         );
  
//         const blobRef = blobResponse.data.blob;

//         embed = {
//           $type: "app.bsky.embed.images",
//           images: [
//             {
//               image: blobRef,
//               alt: "Attached media",
//             },
//           ],
//         };
  
//         fs.unlinkSync(downloadedFilePath);
//       }
  
//       const postData = {
//         collection: "app.bsky.feed.post",
//         repo: did,
//         record: {
//           $type: "app.bsky.feed.post",
//           text: text,
//           createdAt: new Date().toISOString(),
//           embed: embed,
//         },
//       };
  
//       const postResponse = await axios.post("https://bsky.social/xrpc/com.atproto.repo.createRecord", postData, {
//         headers: {
//           Authorization: `Bearer ${accessJwt}`,
//           "Content-Type": "application/json",
//         },
//       });
  
//       console.log(`Post successful for ${username}:`, postResponse.data);
//     } catch (error) {
//       console.error(`Error posting to Bluesky for ${username}:`, error.response?.data || error.message);
//     }
//   }
  
//   function getMimeType(filePath) {
//     const ext = path.extname(filePath).toLowerCase();
//     const mimeTypes = {
//       ".jpg": "image/jpeg",
//       ".jpeg": "image/jpeg",
//       ".png": "image/png",
//       ".gif": "image/gif",
//       ".mp4": "video/mp4",
//       ".mov": "video/quicktime",
//     };
//     return mimeTypes[ext] || "application/octet-stream";
//   }
  
//   async function downloadFile(url) {
//     const fileName = path.basename(url);
//     const downloadsDir = path.join(process.cwd(), "downloads");
//     const filePath = path.join(downloadsDir, fileName);
  
//     if (!fs.existsSync(downloadsDir)) {
//       fs.mkdirSync(downloadsDir);
//     }
  
//     const response = await axios.get(url, { responseType: "arraybuffer" });
//     fs.writeFileSync(filePath, response.data);
//     return filePath;
//   }

// function getUsernamesFromConfig() {
//     const configPath = path.resolve("./config/bluesky-scheduled-posts.json");
//     const configData = fs.readFileSync(configPath, "utf8");
//     const config = JSON.parse(configData);
//     return config.usernames || [];
// }

// setInterval(checkAndPostScheduled, 10000);