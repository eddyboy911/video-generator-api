const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// API Route to Combine Image & Audio into Video
app.post("/api/progress", upload.fields([{ name: "image" }, { name: "audio" }]), async (req, res) => {
  if (!req.files.image || !req.files.audio) {
    return res.status(400).json({ error: "Image and audio files are required" });
  }

  const imageBuffer = req.files.image[0].buffer;
  const audioBuffer = req.files.audio[0].buffer;
  const imagePath = `temp/${Date.now()}_image.jpg`;
  const audioPath = `temp/${Date.now()}_audio.mp3`;
  const outputPath = `temp/output_${Date.now()}.mp4`;

  fs.writeFileSync(imagePath, imageBuffer);
  fs.writeFileSync(audioPath, audioBuffer);

  ffmpeg()
    .input(imagePath)
    .input(audioPath)
    .output(outputPath)
    .outputOptions("-loop 1")
    .outputOptions("-c:v libx264")
    .outputOptions("-tune stillimage")
    .outputOptions("-c:a aac")
    .outputOptions("-b:a 192k")
    .outputOptions("-pix_fmt yuv420p")
    .on("end", () => {
      res.json({ message: "Video created successfully!", video: outputPath });
    })
    .on("error", (err) => {
      res.status(500).json({ error: err.message });
    })
    .run();
});

// Start server
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
