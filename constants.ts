
import { AnimalData, CropData, HealthStatus, Farm } from "./types";

export const MOCK_FARMS: Farm[] = [
  {
    id: "f1",
    name: "Valley View Farm",
    location: "California, USA",
    coordinates: { lat: 36.7378, lng: -119.7871 },
    totalArea: 150,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "f2",
    name: "Green Plains Estate",
    location: "Saskatchewan, Canada",
    coordinates: { lat: 52.1332, lng: -106.6700 },
    totalArea: 500,
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "f3",
    name: "Highland Ranch",
    location: "New South Wales, Australia",
    coordinates: { lat: -33.8688, lng: 151.2093 },
    totalArea: 1200,
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80"
  }
];

export const MOCK_WEATHER = {
  location: "Simulated Farm",
  temp: 24,
  humidity: 65,
  condition: "Partly Cloudy",
  windSpeed: 12, // km/h
  rainfall: 2.5, // mm last 24h
  soilMoisture: 42 // %
};

export const MOCK_CROPS: CropData[] = [
  {
    id: "c1",
    name: "Field Alpha - Cassava (TME 419)",
    type: "Cassava",
    fieldId: "F-101",
    farmId: "f1",
    plantingDate: "2023-10-15",
    healthScore: 92,
    ndvi: 0.78,
    soilMoisture: 45,
    status: HealthStatus.HEALTHY,
    alerts: [],
    lastScanUrl: "https://picsum.photos/400/300?random=1",
    history: [
      { date: "2023-10-20", ndvi: 0.15 },
      { date: "2023-11-05", ndvi: 0.32 },
      { date: "2023-11-20", ndvi: 0.45 },
      { date: "2023-12-10", ndvi: 0.58 },
      { date: "2024-01-05", ndvi: 0.65 },
      { date: "2024-02-01", ndvi: 0.72 },
      { date: "2024-03-01", ndvi: 0.78 }
    ],
    insights: {
      ndre: 0.65,
      vari: 0.42,
      growthStage: "Tuber Bulking",
      waterStress: 15,
      thermalStress: 10,
      nutrientStatus: { nitrogen: 'Optimal', phosphorus: 'Optimal', potassium: 'Optimal' },
      yieldForecast: 18.5,
      weedDensity: 5,
      canopyCover: 85,
      pestPressure: 'Low',
      diseaseRisk: 'Low'
    },
    location: { lat: 36.7378 + 0.005, lng: -119.7871 + 0.005 }
  },
  {
    id: "c2",
    name: "Field Beta - Cassava (TMS 30572)",
    type: "Cassava",
    fieldId: "F-102",
    farmId: "f1",
    plantingDate: "2023-11-02",
    healthScore: 65,
    ndvi: 0.45,
    soilMoisture: 20,
    status: HealthStatus.WARNING,
    alerts: ["Water Stress Detected", "Possible Cassava Mosaic Disease"],
    lastScanUrl: "https://picsum.photos/400/300?random=2",
    history: [
      { date: "2023-11-05", ndvi: 0.10 },
      { date: "2023-11-25", ndvi: 0.28 },
      { date: "2023-12-15", ndvi: 0.55 },
      { date: "2024-01-10", ndvi: 0.62 },
      { date: "2024-02-05", ndvi: 0.58 },
      { date: "2024-02-25", ndvi: 0.52 },
      { date: "2024-03-01", ndvi: 0.45 }
    ],
    insights: {
      ndre: 0.38,
      vari: 0.25,
      growthStage: "Canopy Establishment",
      waterStress: 65,
      thermalStress: 40,
      nutrientStatus: { nitrogen: 'Low', phosphorus: 'Optimal', potassium: 'Low' },
      yieldForecast: 12.2,
      weedDensity: 15,
      canopyCover: 60,
      pestPressure: 'Moderate',
      diseaseRisk: 'High'
    },
    location: { lat: 36.7378 - 0.005, lng: -119.7871 - 0.005 }
  },
  {
    id: "c3",
    name: "Field Gamma - Cassava (NR 8082)",
    type: "Cassava",
    fieldId: "F-201",
    farmId: "f2",
    plantingDate: "2020-03-10",
    healthScore: 88,
    ndvi: 0.82,
    soilMoisture: 55,
    status: HealthStatus.HEALTHY,
    alerts: [],
    lastScanUrl: "https://picsum.photos/400/300?random=3",
    history: [
      { date: "2023-09-01", ndvi: 0.75 },
      { date: "2023-10-01", ndvi: 0.72 },
      { date: "2023-11-01", ndvi: 0.65 },
      { date: "2023-12-01", ndvi: 0.60 },
      { date: "2024-01-01", ndvi: 0.58 },
      { date: "2024-02-01", ndvi: 0.65 },
      { date: "2024-03-01", ndvi: 0.82 }
    ],
    insights: {
      ndre: 0.72,
      vari: 0.55,
      growthStage: "Tuber Maturity",
      waterStress: 10,
      thermalStress: 5,
      nutrientStatus: { nitrogen: 'Optimal', phosphorus: 'Optimal', potassium: 'Optimal' },
      yieldForecast: 22.0,
      weedDensity: 2,
      canopyCover: 92,
      pestPressure: 'Low',
      diseaseRisk: 'Low'
    },
    location: { lat: 52.1332 + 0.01, lng: -106.6700 + 0.01 }
  }
];

// Base coords for the farm simulation
const FARM_LAT = 36.7378;
const FARM_LNG = -119.7871;

export const MOCK_ANIMALS: AnimalData[] = [];
