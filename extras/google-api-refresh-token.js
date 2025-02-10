require("dotenv").config();
const { google } = require("googleapis");
const readline = require("readline-sync");

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:4000"
);

const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube"],
});

console.log("Authorize this app by visiting this URL:", authUrl);

const code = readline.question("Enter the code from that page here: ");

oauth2Client.getToken(code, (err, tokens) => {
    if (err) {
        console.error("Error retrieving access token:", err);
        return;
    }
    console.log("Your Refresh Token:", tokens.refresh_token);
});