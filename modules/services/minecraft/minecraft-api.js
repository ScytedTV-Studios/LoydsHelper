const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const PORT = 8000;
const BASE_DIR = "C:\\Users\\cones\\Documents\\API\\versions\\v2";

function ensureDirectoryExists(filePath) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

app.get("/restart", (req, res) => {
    res.status(500).send({ message: "Intentional server crash initiated." });
    process.nextTick(() => {
        throw new Error("Intentional crash triggered by /restart endpoint.");
    });
});

app.post("/simplynetwork/scoreboard/:name.json", (req, res) => {
    const filePath = path.join(BASE_DIR, "simplynetwork", "scoreboards", `${req.params.name}.json`);
    ensureDirectoryExists(filePath);

    let existingData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf-8")) : {};

    for (const newScore of req.body.scores) {
        existingData[newScore.name] = newScore.score;
    }

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    res.status(200).send({ message: "Scoreboard updated successfully!" });
});

app.post("/seaside/scoreboard/:name.json", (req, res) => {
    const filePath = path.join(BASE_DIR, "seaside", "scoreboards", `${req.params.name}.json`);
    ensureDirectoryExists(filePath);

    let existingData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf-8")) : {};

    for (const newScore of req.body.scores) {
        existingData[newScore.name] = newScore.score;
    }

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    res.status(200).send({ message: "Seaside Scoreboard updated successfully!" });
});

app.post("/data/tags.json", (req, res) => {
    const filePath = path.join(BASE_DIR, "data", "tags.json");
    ensureDirectoryExists(filePath);

    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.status(200).send({ message: "Tags data saved successfully!" });
});

app.get("*", (req, res) => {
    const filePath = path.join(BASE_DIR, req.path);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.sendFile(filePath);
    } else {
        res.status(404).send({ error: "File not found." });
    }
});

app.post("*", (req, res) => {
    const filePath = path.join(BASE_DIR, req.path);
    ensureDirectoryExists(filePath);

    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.status(201).send({ message: "File created successfully!", filePath });
});

app.put("*", (req, res) => {
    const filePath = path.join(BASE_DIR, req.path);
    ensureDirectoryExists(filePath);

    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.status(fs.existsSync(filePath) ? 200 : 201).send({ 
        message: fs.existsSync(filePath) ? "File updated successfully!" : "File created successfully!",
        filePath 
    });
});

function startServer() {
    try {
        const server = app.listen(PORT, () => {
            // console.log(`Server is running on http://localhost:${PORT}`);
        });

        server.on('error', (err) => {
            // console.error('Server error:', err.message);
            // console.log('Retrying in 5 seconds...');
            setTimeout(startServer, 5000);
        });
    } catch (err) {
        // console.error('Unexpected error:', err.message);
        // console.log('Retrying in 5 seconds...');
        setTimeout(startServer, 5000);
    }
}

// startServer();
setTimeout(startServer, 10000);