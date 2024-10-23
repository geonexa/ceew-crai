
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {

    const { Sector, State } = req.query;

    // Correctly format the filename using template literals
    const filename = `${Sector}.json`;

    const filePath = path.join(process.cwd(), 'data', 'ClimateRiskAdaptationData', filename);

    try {
        // Read and parse the JSON data file
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const filteredData = State ? jsonData.filter(item => item.STATE === State) : jsonData;


        res.status(200).json(filteredData);
    } catch (error) {
        console.error('Failed to read the data:', error);
        res.status(500).json({ error: 'Failed to read the data' });
    }
}
