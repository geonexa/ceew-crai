// pages/api/monsoonData.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filename = `District_Temperature_variability.json`;


    // Construct the file path and read the data
    const filePath = path.join(process.cwd(), 'data', 'TemperatureVariability', filename);


    try {
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));



        res.status(200).json(jsonData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read the data' });
    }
}

