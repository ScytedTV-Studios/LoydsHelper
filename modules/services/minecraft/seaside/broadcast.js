require("dotenv").config();
const { spawn } = require("child_process");
const path = require("path");

const BROADCAST_JAR_PATH = "C:\\Users\\cones\\Documents\\MINECRAFT\\Seaside\\broadcast\\MCXboxBroadcastStandalone.jar";
const BROADCAST_LOG_CHANNEL_ID = "1324833841038495857";

let broadcastProcess = null;

function startBroadcastJar() {
    try {
        if (broadcastProcess) {
            stopBroadcastJar();
        }

        broadcastProcess = spawn("java", ["-jar", path.basename(BROADCAST_JAR_PATH)], { 
            cwd: path.dirname(BROADCAST_JAR_PATH),
            stdio: ["ignore", "pipe", "pipe"]
        });

        broadcastProcess.stdout.on("data", (data) => {
            console.log(`Broadcast Output: ${data.toString()}`);
        });

        broadcastProcess.stderr.on("data", (data) => {
            console.error(`Broadcast Error: ${data.toString()}`);
        });

        broadcastProcess.on("close", (code) => {
            sendLogToChannel(BROADCAST_LOG_CHANNEL_ID, `Broadcast jar exited with code ${code}`);
            broadcastProcess = null;
        });

        broadcastProcess.on("error", (err) => {
            console.error("Failed to start broadcast process:", err.message);
            sendLogToChannel(BROADCAST_LOG_CHANNEL_ID, `Failed to start broadcast process: ${err.message}`);
        });

        console.log("Broadcast jar has started on bot startup.");
    } catch (error) {
        console.error("Error starting broadcast jar:", error.message);
        sendLogToChannel(BROADCAST_LOG_CHANNEL_ID, `Error starting broadcast jar: ${error.message}`);
    }
}

function stopBroadcastJar() {
    try {
        if (broadcastProcess) {
            broadcastProcess.kill("SIGTERM");
            broadcastProcess = null;
        }
    } catch (error) {
        console.error("Error stopping broadcast jar:", error.message);
        sendLogToChannel(BROADCAST_LOG_CHANNEL_ID, `Error stopping broadcast jar: ${error.message}`);
    }
}

setInterval(() => {
    console.log("Restarting broadcast jar...");
    stopBroadcastJar();
    startBroadcastJar();
}, 3600000);

startBroadcastJar();