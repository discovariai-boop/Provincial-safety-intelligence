export type ThreatType = 'crash' | 'heist' | 'mugging' | 'pothole';

export type HyperLocalAction = 'avoid' | 'slow' | 'report' | 'safe';

export interface ARObject {
  id: string;
  label: string;
  // Placeholder for AR visualization metadata (e.g. type, coordinates, color)
  type: 'safe-zone' | 'danger-zone' | 'caution' | 'responder' | 'poi';
}

export interface HyperLocalAlert {
  distance: number; // in meters, e.g. 847
  threatType: ThreatType;
  arOverlay: ARObject;
  trustScore: number; // 0–100
  policeEta: number; // in seconds, e.g. 218
  action: HyperLocalAction;
}

export interface AiSafetyCoPilot {
  voiceQuery: string;
  confidence: number; // 0–1
  recommendation: string;
  safetyGain: number; // e.g. +23 (% safer route)
}

