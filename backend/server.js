const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Schema & Model
const PresetSchema = new mongoose.Schema({
    name: String,
    earthOrbitSpeed: { type: Number, default: 0.5 },
    moonOrbitSpeed: { type: Number, default: 2.0 },
    earthSpinSpeed: { type: Number, default: 1.0 }
});
const Preset = mongoose.model('Preset', PresetSchema);

// API Routes
app.get('/api/presets', async (req, res) => {
    const presets = await Preset.find();
    res.json(presets);
});

app.post('/api/presets', async (req, res) => {
    const newPreset = new Preset(req.body);
    await newPreset.save();
    res.json(newPreset);
});

// --- NEW: Production Serving Logic ---

// 1. Serve the static files from the React app's dist folder
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 2. Catch-all route: For any request that isn't an API route, send back the React index.html file
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));