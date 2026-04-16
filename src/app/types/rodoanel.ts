// Types for Rodoanel monitoring system

export type VegetationLevel = 1 | 2 | 3 | 4 | 5;

export interface TrechoSegment {
  id: string;
  name: string;
  region: 'Norte' | 'Sul' | 'Leste' | 'Oeste';
  length: number; // km
  coordinates: {
    lat: number;
    lng: number;
  }[];
}

export interface NDVIData {
  value: number; // -1 to 1
  timestamp: string;
  coverage: number; // percentage
  healthyVegetation: number; // percentage
  sparseVegetation: number; // percentage
  bareGround: number; // percentage
}

export interface LLMClassification {
  level: VegetationLevel;
  confidence: number; // 0-100
  justification: string;
  technicalDetails: {
    ndviAverage: number;
    canopyCoverage: number;
    speciesIdentified: string[];
    healthIndicators: string[];
  };
  recommendations: string[];
  timestamp: string;
  model: 'GPT-4o' | 'Gemini-Vision';
}

export interface SatelliteImage {
  url: string;
  captureDate: string;
  source: 'Google Earth Engine' | 'Sentinel-2' | 'Landsat-8';
  resolution: number; // meters per pixel
  cloudCoverage: number; // percentage
}

export interface TrechoData {
  segment: TrechoSegment;
  currentClassification: LLMClassification;
  satelliteImage: SatelliteImage;
  ndviData: NDVIData;
  historicalData: {
    date: string;
    classification: LLMClassification;
    ndvi: NDVIData;
  }[];
}

export interface DashboardMetrics {
  totalLength: number; // km
  averageNDVI: number;
  criticalTrechos: number;
  lastUpdate: string;
  complianceRate: number; // percentage
  trendDirection: 'improving' | 'stable' | 'declining';
}
