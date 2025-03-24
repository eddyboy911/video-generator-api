const express = require("express");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 3000;

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

app.post("/api/progress", upload.fields([{ name: "image" }, { name: "audio" }]), (req, res) => {
    if (!req.files || !req.files["image"] || !req.files["audio"]) {
        return res.status(400).json({ error: "Image and audio files are required." });
    }
    res.json({ message: "Files received successfully!" });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
