// require("dotenv").config();
// const { spawn } = require("child_process");
// const path = require("path");

// const BROADCAST_JAR_PATH = "C:\\Users\\cones\\Documents\\MINECRAFT\\Seaside\\broadcast\\MCXboxBroadcastStandalone.jar";
// const BROADCAST_LOG_CHANNEL_ID = "1324833841038495857";

// let broadcastProcess = null;

// function startBroadcastJar() {
//     const jarPath = BROADCAST_JAR_PATH;

//     if (broadcastProcess) {
//         broadcastProcess.kill("SIGTERM");
//         broadcastProcess = null;
//     }

//     broadcastProcess = spawn("java", ["-jar", path.basename(jarPath)], { cwd: path.dirname(jarPath) });

//     broadcastProcess.on("close", (code) => {
//         sendLogToChannel(BROADCAST_LOG_CHANNEL_ID, `Broadcast jar exited with code ${code}`);
//         broadcastProcess = null;
//     });

//     console.log("Broadcast jar has started on bot startup.");
// }

// function stopBroadcastJar() {
//     if (broadcastProcess) {
//         broadcastProcess.kill("SIGTERM");
//         broadcastProcess = null;
//     }
// }

// setInterval(() => {
//     stopBroadcastJar();
//     startBroadcastJar();
// }, 3600000);

// startBroadcastJar();