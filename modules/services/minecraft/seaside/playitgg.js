const { spawn } = require("child_process");
const path = require("path");

const PLAYITGG_EXE_PATH = "C:\\Program Files (x86)\\playit_gg\\bin\\playit.exe";
let playitggProcess;

async function startPlayItGG() {
    try {
        playitggProcess = spawn(PLAYITGG_EXE_PATH, { cwd: path.dirname(PLAYITGG_EXE_PATH) });

        console.log("Playit.gg has started successfully.");

        playitggProcess.stdout.on("data", (data) => {
            console.log(`Playit.gg Output: ${data}`);
        });

        playitggProcess.stderr.on("data", (data) => {
            console.error(`Playit.gg Error: ${data}`);
        });

        playitggProcess.on("exit", (code, signal) => {
            console.log(`Playit.gg exited with code ${code} and signal ${signal}`);
        });

        playitggProcess.on("error", (err) => {
            console.error("Failed to start Playit.gg:", err);
        });

    } catch (error) {
        console.error("Error launching Playit.gg:", error);
    }
}

startPlayItGG();