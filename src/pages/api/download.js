import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { data, selectedVariable, type } = req.query;
  let filename = '';

  if (data === 'MonsoonData') {
    filename = `${type}_MonsoonData.json`;
  } else if (data === 'ClimateRiskAdaptationData') {
    filename = `${selectedVariable}.json`;
  } else if (data === 'HydrometeorologicalData') {
    filename = `${selectedVariable}.json`;
  } else if (data === 'TemperatureVariability') {
    filename = `${type}_Temperature_variability.json`;
  }

  const filePath = path.join(process.cwd(), 'data', data, filename);

  try {
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.status(200).json(jsonData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read the data' });
  }
}
