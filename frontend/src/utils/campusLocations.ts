export interface CampusSpot {
  id: string;
  name: string;
  zone: string;
  lat: number;
  lng: number;
  description: string;
}

export const CAMPUS_SPOTS: CampusSpot[] = [
  {
    id: 'eng-lib',
    name: 'Engineering Library (2nd Floor)',
    zone: 'Academic North',
    lat: 12.9716,
    lng: 77.5946,
    description: 'Quiet study tables next to technical references & computer lab.'
  },
  {
    id: 'central-lib',
    name: 'Central Library Lounge',
    zone: 'Central Plaza',
    lat: 12.9720,
    lng: 77.5952,
    description: 'Ground floor lounge area, coffee counter and main student circulation desk.'
  },
  {
    id: 'sci-complex',
    name: 'Science Complex - Lab 402',
    zone: 'Science Wing',
    lat: 12.9712,
    lng: 77.5938,
    description: 'Chemistry & Biotech lab corridors, 4th floor lockers.'
  },
  {
    id: 'mech-workshop',
    name: 'Mechanical Workshop & CAD Center',
    zone: 'East Labs',
    lat: 12.9725,
    lng: 77.5960,
    description: 'Heavy machinery, 3D printers, and drawing tables.'
  },
  {
    id: 'student-center',
    name: 'Student Center & Tech Help Desk',
    zone: 'Student Hub',
    lat: 12.9718,
    lng: 77.5942,
    description: 'Main campus center, device charging lockers, cafeteria walkway.'
  },
  {
    id: 'hostel-4',
    name: 'Hostel 4 Common Room',
    zone: 'Residential South',
    lat: 12.9705,
    lng: 77.5930,
    description: 'Student lounge, indoor games, and package drop point.'
  },
  {
    id: 'robotics-lab',
    name: 'Robotics & Hardware Lab (Room 210)',
    zone: 'Electronics Wing',
    lat: 12.9722,
    lng: 77.5948,
    description: 'Microcontroller benches, soldering stations, embedded hardware.'
  }
];

export interface LiveLocationData {
  spotName: string;
  zone: string;
  lat: number;
  lng: number;
  updatedAt: string;
  isSharing: boolean;
}

export function getCurrentUserLiveLocation(): LiveLocationData {
  try {
    const raw = localStorage.getItem('cs_live_location');
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    spotName: CAMPUS_SPOTS[0].name,
    zone: CAMPUS_SPOTS[0].zone,
    lat: CAMPUS_SPOTS[0].lat,
    lng: CAMPUS_SPOTS[0].lng,
    updatedAt: new Date().toISOString(),
    isSharing: true
  };
}

export function setUserLiveLocation(spot: CampusSpot): LiveLocationData {
  const data: LiveLocationData = {
    spotName: spot.name,
    zone: spot.zone,
    lat: spot.lat,
    lng: spot.lng,
    updatedAt: new Date().toISOString(),
    isSharing: true
  };
  try {
    localStorage.setItem('cs_live_location', JSON.stringify(data));
  } catch {}
  return data;
}

// Calculate realistic campus distance in meters between two coordinates
export function calculateCampusDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = Math.round(R * c);
  // Guarantee a friendly campus walking distance range (50m - 400m) for simulation
  return Math.max(45, Math.min(d, 500));
}

export function calculateWalkMinutes(meters: number): number {
  // Average student walking speed: 80 meters per minute
  return Math.max(1, Math.ceil(meters / 75));
}
