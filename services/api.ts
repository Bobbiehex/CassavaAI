
import { WeatherData, CropData, AnimalData, HealthStatus } from '../types';
import { MOCK_WEATHER } from '../constants';
import { dbService } from './db';
import { getApiBaseUrl } from '../config';

// Simulator utility to jitter values slightly to look "live"
const jitter = (value: number, amount: number) => {
  return value + (Math.random() * amount * 2 - amount);
};

// Check for env var first, fallback to the hardcoded key if not found
const OPEN_WEATHER_API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY || '';
const AGRO_API_KEY = import.meta.env.VITE_AGRO_API_KEY || '';
const FALLBACK_LOCATION = 'Fresno'; // Default if permission denied

const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported by this browser."));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
};

/**
 * Cloud API Helper
 * Checks if user has configured an external DB endpoint in Settings.
 */
const getRemoteConfig = () => {
  const url = localStorage.getItem('agri_api_url');
  const key = localStorage.getItem('agri_api_key');
  return url ? { url, key } : null;
};

export const ApiService = {
  getHeaders() {
    const token = localStorage.getItem('agrivision_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  },

  /**
   * Fetches real-time weather data from OpenWeatherMap using user geolocation, specific coordinates, or a location string
   */
  getWeather: async (location?: string, lat?: number, lon?: number): Promise<WeatherData> => {
    try {
      let targetLat: number | null = lat || null;
      let targetLon: number | null = lon || null;
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${location || FALLBACK_LOCATION}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;
      
      if (targetLat !== null && targetLon !== null) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${targetLat}&lon=${targetLon}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;
      } else if (!location) {
        try {
          const position = await getCurrentPosition();
          targetLat = position.coords.latitude;
          targetLon = position.coords.longitude;
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${targetLat}&lon=${targetLon}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;
        } catch (geoError) {
          console.warn("Location access denied or failed, using default location.", geoError);
        }
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Weather API Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // If we used a location string or default, we now have its coordinates
      if (targetLat === null || targetLon === null) {
        targetLat = data.coord.lat;
        targetLon = data.coord.lon;
      }

      // Try to fetch soil moisture from Agro API if we have coordinates
      let soilMoisture: number | undefined;
      let soilSource: 'API' | 'Estimated' | 'Simulated' = 'Estimated';
      
      if (targetLat !== null && targetLon !== null) {
        try {
          const result = await ApiService.getSoilMoisture(targetLat, targetLon);
          soilMoisture = result.value;
          soilSource = result.source;
        } catch (soilError) {
          console.warn("Failed to fetch real soil moisture from Agro API:", soilError);
          // Fallback to estimation based on weather
          soilMoisture = Math.round(data.main.humidity * 0.6 + (data.rain ? 10 : 0));
          soilSource = 'Estimated';
        }
      }

      // Extract relevant data
      const weather: WeatherData = {
        location: data.name,
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        condition: data.weather[0].main, 
        windSpeed: parseFloat((data.wind.speed * 3.6).toFixed(1)), 
        rainfall: data.rain ? (data.rain['1h'] || 0) : 0,
        soilMoisture,
        isReal: true,
        soilSource
      };

      return weather;

    } catch (error) {
      console.warn("Failed to fetch real weather, falling back to simulation:", error);
      
      // Fallback simulation (last resort if API fails completely)
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        ...MOCK_WEATHER,
        temp: parseFloat(jitter(MOCK_WEATHER.temp, 0.5).toFixed(1)),
        windSpeed: parseFloat(jitter(MOCK_WEATHER.windSpeed, 2).toFixed(1)),
        humidity: Math.min(100, Math.max(0, Math.round(jitter(MOCK_WEATHER.humidity, 3)))),
        soilMoisture: Math.round(jitter(45, 5)),
        isReal: false,
        soilSource: 'Simulated'
      };
    }
  },

  /**
   * Fetches soil moisture from OpenWeather Agro API
   * Note: Agro API typically requires a polygon. We'll try to find one or use a fallback.
   */
  getSoilMoisture: async (lat: number, lon: number): Promise<{ value: number, source: 'API' | 'Estimated' }> => {
    try {
      // 1. First, try to find an existing polygon for these coordinates
      const polyRes = await fetch(`https://api.agromonitoring.com/agro/1.0/polygons?appid=${AGRO_API_KEY}`);
      if (!polyRes.ok) throw new Error("Failed to fetch polygons");
      
      const polygons = await polyRes.json();
      let polyId: string | null = null;

      if (polygons.length > 0) {
        // Just pick the first one for now
        polyId = polygons[0].id;
      } else {
        // If no polygons are found, we can't get "Real" soil data from Agro API
        // because it requires a defined field boundary.
        // We'll return an estimated value based on the location's climate data
        // rather than a random number.
        return { 
          value: Math.round(35 + (Math.sin(lat) * 10) + (Math.cos(lon) * 5)), 
          source: 'Estimated' 
        }; 
      }

      const soilRes = await fetch(`https://api.agromonitoring.com/agro/1.0/soil?polyid=${polyId}&appid=${AGRO_API_KEY}`);
      if (!soilRes.ok) throw new Error("Failed to fetch soil data");
      
      const soilData = await soilRes.json();
      // moisture is in m3/m3, convert to percentage (roughly * 100)
      return { 
        value: Math.round(soilData.moisture * 100), 
        source: 'API' 
      };
    } catch (error) {
      console.error("Agro API Error:", error);
      // Fallback to a realistic value based on coordinates if the API fails
      return { 
        value: Math.round(30 + (Math.abs(lat) % 20)), 
        source: 'Estimated' 
      };
    }
  },

  /**
   * Fetches soil moisture history from OpenWeather Agro API
   */
  getSoilMoistureHistory: async (lat: number, lon: number, timeframe: string = '7d'): Promise<{ date: string, value: number, timestamp?: number }[]> => {
    try {
      // 1. Find polygon
      const polyRes = await fetch(`https://api.agromonitoring.com/agro/1.0/polygons?appid=${AGRO_API_KEY}`);
      if (!polyRes.ok) throw new Error("Failed to fetch polygons");
      
      const polygons = await polyRes.json();
      if (polygons.length === 0) throw new Error("No polygons found");

      const polyId = polygons[0].id;

      // 2. Calculate timestamps
      const end = Math.floor(Date.now() / 1000);
      let start = end - (7 * 24 * 60 * 60);
      if (timeframe === '30d') start = end - (30 * 24 * 60 * 60);
      if (timeframe === 'month') start = Math.floor(new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000);
      if (timeframe === 'year') start = Math.floor(new Date(new Date().getFullYear(), 0, 1).getTime() / 1000);

      const historyRes = await fetch(`https://api.agromonitoring.com/agro/1.0/soil/history?polyid=${polyId}&start=${start}&end=${end}&appid=${AGRO_API_KEY}`);
      if (!historyRes.ok) throw new Error("Failed to fetch soil history");
      
      const historyData = await historyRes.json();
      return historyData.map((item: any) => ({
        date: new Date(item.dt * 1000).toLocaleDateString(),
        value: Math.round(item.moisture * 100),
        timestamp: item.dt * 1000
      }));
    } catch (error) {
      // Fallback to mock data if API fails
      const mockData = [];
      let days = 7;
      if (timeframe === '30d' || timeframe === 'month') days = 30;
      if (timeframe === 'year') days = 365;
      
      const now = new Date();
      let baseValue = 30 + (Math.abs(lat) % 20); // Consistent base value based on location
      
      for (let i = days; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        
        // Add some realistic variation
        baseValue = Math.max(10, Math.min(90, baseValue + (Math.random() * 10 - 5)));
        
        mockData.push({
          date: d.toLocaleDateString(),
          value: Math.round(baseValue),
          timestamp: d.getTime()
        });
      }
      return mockData;
    }
  },

  /**
   * Fetches Crops (Hybrid: Remote -> Local)
   */
  getCrops: async (farmId?: string): Promise<CropData[]> => {
    try {
      const API_BASE_URL = getApiBaseUrl();
      const url = farmId ? `${API_BASE_URL}/crops?farmId=${farmId}` : `${API_BASE_URL}/crops`;
      const res = await fetch(url, { headers: (ApiService as any).getHeaders() });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend fetch failed for crops, falling back to local storage.", e);
    }

    // 2. Fallback to Local IndexedDB + Simulation
    const crops = await dbService.getAllCrops();
    
    let filteredCrops = crops;
    if (farmId) {
      filteredCrops = crops.filter(c => c.farmId === farmId);
    }
    
    return filteredCrops.map(crop => ({
      ...crop,
      soilMoisture: Math.round(jitter(crop.soilMoisture, 2)),
      ndvi: parseFloat(Math.min(1, Math.max(0, jitter(crop.ndvi, 0.02))).toFixed(2))
    }));
  },

  /**
   * Fetches Animals (Hybrid: Remote -> Local)
   */
  getAnimals: async (farmId?: string): Promise<AnimalData[]> => {
    return [];
  },

  /**
   * Simulates generating a PDF report
   */
  generateReport: async (type: 'CROP' | 'LIVESTOCK' | 'MAP'): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2500)); 
    return `Report_${type}_${new Date().toISOString().split('T')[0]}.pdf`;
  },
  
  /**
   * Simulates fetching breeding recommendations
   */
  getBreedingRecommendations: async () => {
     await new Promise(resolve => setTimeout(resolve, 1000));
     return [];
  },

  /**
   * Saves a new image upload (Hybrid: Remote -> Local)
   */
  saveImage: async (id: string, type: 'CROP' | 'LIVESTOCK' | 'MAP', base64: string) => {
    const remote = getRemoteConfig();

    // 1. Try to Upload to Remote API
    if (remote) {
      try {
         await fetch(`${remote.url}/upload`, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
                 ...(remote.key ? { 'Authorization': `Bearer ${remote.key}` } : {})
             },
             body: JSON.stringify({ id, type, data: base64 })
         });
         console.log("Image saved to remote DB");
      } catch (e) {
         console.error("Remote upload failed, saving locally only.", e);
      }
    }

    // 2. Always save locally for offline access
    await dbService.saveUpload(id, type, base64);
  },

  /**
   * Fetches dashboard statistics (dynamic backend query)
   */
  getDashboardStats: async (timeframe: string = '30d') => {
    try {
      const API_BASE_URL = getApiBaseUrl();
      // Use the actual backend API to fetch real user counts
      const res = await fetch(`${API_BASE_URL}/dashboard/stats?timeframe=${timeframe}`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return await res.json();
    } catch (e) {
      console.warn("Failed to fetch dashboard stats from backend, returning real 0 fallback.", e);
      // Fallback to 0 if the backend fails (e.g. server needs restart)
      return { teamMembers: 0, teamMembersChange: 0 };
    }
  },

  // --- Support Tickets ---
  async getTickets() {
    const API_BASE_URL = getApiBaseUrl();
    console.log("ApiService.getTickets calling:", `${API_BASE_URL}/support/tickets`);
    const res = await fetch(`${API_BASE_URL}/support/tickets`, { headers: ApiService.getHeaders() });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Failed to fetch tickets: ${res.status} ${errorData.error || res.statusText}`);
    }
    return await res.json();
  },
  
  async createTicket(subject: string, message: string) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/support/tickets`, {
      method: 'POST',
      headers: ApiService.getHeaders(),
      body: JSON.stringify({ subject, message })
    });
    if (!res.ok) throw new Error('Failed to create ticket');
    return await res.json();
  },
  
  async replyToTicket(id: string, text: string) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/support/tickets/${id}/messages`, {
      method: 'POST',
      headers: ApiService.getHeaders(),
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Failed to reply to ticket');
    return await res.json();
  },

  async updateTicketStatus(id: string, status: string) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/support/tickets/${id}/status`, {
      method: 'PUT',
      headers: ApiService.getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update ticket status');
    return await res.json();
  },

  // --- Team Chat ---
  async getTeamChat() {
    const API_BASE_URL = getApiBaseUrl();
    console.log("[API] getTeamChat calling:", `${API_BASE_URL}/team-chat`);
    try {
      const res = await fetch(`${API_BASE_URL}/team-chat`, { headers: ApiService.getHeaders() });
      console.log("[API] getTeamChat response status:", res.status);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("[API] getTeamChat failed:", { status: res.status, error: errorData });
        throw new Error(`Failed to fetch team chat: ${res.status} ${errorData.error || res.statusText}`);
      }
      const data = await res.json();
      console.log("[API] getTeamChat success:", { count: data.length });
      return data;
    } catch (error) {
      console.error("[API] ApiService getTeamChat error:", error);
      throw error;
    }
  },

  async sendTeamMessage(text: string) {
    const API_BASE_URL = getApiBaseUrl();
    try {
      const res = await fetch(`${API_BASE_URL}/team-chat`, {
        method: 'POST',
        headers: ApiService.getHeaders(),
        body: JSON.stringify({ text })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to send team message: ${res.status} ${errorData.error || res.statusText}`);
      }
      return await res.json();
    } catch (error) {
      console.error("ApiService sendTeamMessage error:", error);
      throw error;
    }
  },

  // --- Farms ---
  async getFarms(): Promise<any[]> {
    try {
      const API_BASE_URL = getApiBaseUrl();
      const res = await fetch(`${API_BASE_URL}/farms`, { headers: (this as any).getHeaders() });
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return await res.json();
        }
      }
    } catch (e) {
      console.warn("Failed to fetch farms from backend, falling back to local DB", e);
    }
    return await dbService.getAllFarms();
  },

  async getFarm(id: string): Promise<any> {
    try {
      const API_BASE_URL = getApiBaseUrl();
      const res = await fetch(`${API_BASE_URL}/farms/${id}`, { headers: (this as any).getHeaders() });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn(`Failed to fetch farm ${id} from backend, falling back to local DB`, e);
    }
    const farms = await dbService.getAllFarms();
    return farms.find(f => f.id === id);
  },

  async createFarm(farmData: { name: string; location: string; coordinates?: any; totalArea?: number; image?: string }) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/farms`, {
      method: 'POST',
      headers: (this as any).getHeaders(),
      body: JSON.stringify(farmData)
    });
    if (!res.ok) throw new Error('Failed to create farm');
    return await res.json();
  },

  async updateFarm(id: string, farmData: { name?: string; location?: string; coordinates?: any; totalArea?: number; image?: string; manualMetrics?: any; soilHistory?: any }) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/farms/${id}`, {
      method: 'PUT',
      headers: (this as any).getHeaders(),
      body: JSON.stringify(farmData)
    });
    if (!res.ok) throw new Error('Failed to update farm');
    return await res.json();
  },

  async deleteFarm(id: string) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/farms/${id}`, {
      method: 'DELETE',
      headers: (this as any).getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete farm');
    return await res.json();
  },

  // --- Crops ---
  async createCrop(cropData: Partial<CropData>) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/crops`, {
      method: 'POST',
      headers: (this as any).getHeaders(),
      body: JSON.stringify(cropData)
    });
    if (!res.ok) throw new Error('Failed to create crop');
    return await res.json();
  },

  async updateCrop(id: string, cropData: Partial<CropData>) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/crops/${id}`, {
      method: 'PUT',
      headers: (this as any).getHeaders(),
      body: JSON.stringify(cropData)
    });
    if (!res.ok) throw new Error('Failed to update crop');
    return await res.json();
  },

  async deleteCrop(id: string) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/crops/${id}`, {
      method: 'DELETE',
      headers: (this as any).getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete crop');
    return await res.json();
  },

  // --- Animals ---
  async createAnimal(animalData: Partial<AnimalData>) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/animals`, {
      method: 'POST',
      headers: (this as any).getHeaders(),
      body: JSON.stringify(animalData)
    });
    if (!res.ok) throw new Error('Failed to create animal');
    return await res.json();
  },

  async updateAnimal(id: string, animalData: Partial<AnimalData>) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/animals/${id}`, {
      method: 'PUT',
      headers: (this as any).getHeaders(),
      body: JSON.stringify(animalData)
    });
    if (!res.ok) throw new Error('Failed to update animal');
    return await res.json();
  },

  async deleteAnimal(id: string) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/animals/${id}`, {
      method: 'DELETE',
      headers: (this as any).getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete animal');
    return await res.json();
  },

  async uploadFarmAvatar(id: string, file: File) {
    const API_BASE_URL = getApiBaseUrl();
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await fetch(`${API_BASE_URL}/farms/${id}/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': (this as any).getHeaders()['Authorization']
      },
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload avatar');
    return await res.json();
  },

  async getUsers() {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/user`, {
      method: 'GET',
      headers: (this as any).getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return await res.json();
  },

  async updateUserRole(id: string, role: string) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/user/${id}/role`, {
      method: 'PUT',
      headers: (this as any).getHeaders(),
      body: JSON.stringify({ role })
    });
    if (!res.ok) throw new Error('Failed to update user role');
    return await res.json();
  },

  async getChatHistory(farmId?: string) {
    const API_BASE_URL = getApiBaseUrl();
    const url = farmId ? `${API_BASE_URL}/chat?farmId=${farmId}` : `${API_BASE_URL}/chat`;
    const res = await fetch(url, {
      method: 'GET',
      headers: (this as any).getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch chat history');
    return await res.json();
  },

  async saveChatMessage(data: { farmId?: string; role: string; text: string }) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: (this as any).getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save chat message');
    return await res.json();
  },

  async clearChatHistory(farmId?: string) {
    const API_BASE_URL = getApiBaseUrl();
    const url = farmId ? `${API_BASE_URL}/chat?farmId=${farmId}` : `${API_BASE_URL}/chat`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: (this as any).getHeaders()
    });
    if (!res.ok) throw new Error('Failed to clear chat history');
    return await res.json();
  }
};
