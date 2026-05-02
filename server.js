const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const storePath = path.join(__dirname, "progress-data.json");

app.use(cors());
app.use(express.json());

function readStore() {
  if (!fs.existsSync(storePath)) {
    return { progress: null };
  }

  try {
    return JSON.parse(fs.readFileSync(storePath, "utf8"));
  } catch {
    return { progress: null };
  }
}

function writeStore(data) {
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2), "utf8");
}

app.get("/progress", (req, res) => {
  const store = readStore();
  if (!store.progress) {
    return res.status(404).json({ error: "No saved progress" });
  }
  return res.json(store.progress);
});

app.post("/progress", (req, res) => {
  const progress = req.body;

  if (!progress || typeof progress !== "object") {
    return res.status(400).json({ error: "Invalid progress payload" });
  }

  writeStore({ progress, savedAt: new Date().toISOString() });
  return res.json({ success: true, savedAt: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
