
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {

    const { type, selectedVariable } = req.query;
    const filename = `${type}_MonsoonData.json`;

    // Construct the file path and read the data
    const filePath = path.join(process.cwd(), 'data', 'MonsoonData', filename);

    try {
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        // const filteredData = jsonData.map(item => ({
        //     ID: item.ID,
        //     [selectedVariable]: item[selectedVariable] 
        // }));
        res.status(200).json(jsonData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read the data' });
    }
}

