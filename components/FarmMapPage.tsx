import React, { useState, useEffect, useRef } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useMap 
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  Navigation, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  Crosshair, 
  Sprout, 
  Droplets,
  CloudSun,
  Layers,
  Info,
  Maximize2
} from 'lucide-react';
import { ApiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { HealthStatus, GeoLocation } from '../types';

declare global {
  interface Window {
    google: any;
  }
}

// Ensure the Google Maps API Key is read correctly inside AI Studio Build
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Default center of the map (Ibadan, Nigeria, key hub for Cassava farming and International Institute of Tropical Agriculture)
const DEFAULT_CENTER = { lat: 7.3775, lng: 3.9470 };

interface FarmWithCoords {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number } | null;
  totalArea: number | null;
  image?: string;
  isSimulatedCoords?: boolean;
}

interface CropWithCoords {
  id: string;
  name: string;
  type: string;
  fieldId: string;
  healthScore: number;
  ndvi: number;
  status: HealthStatus;
  location: GeoLocation | null;
}

export const FarmMapPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { addNotification } = useNotifications();

  const [farms, setFarms] = useState<FarmWithCoords[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<FarmWithCoords | null>(null);
  const [crops, setCrops] = useState<CropWithCoords[]>([]);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  
  // Map settings
  const [mapType, setMapType] = useState<'hybrid' | 'roadmap' | 'terrain'>('hybrid');
  const [zoom, setZoom] = useState<number>(10);
  const [center, setCenter] = useState<{ lat: number; lng: number }>(DEFAULT_CENTER);

  // States for updating / adding farm locations
  const [isPinningCoordinate, setIsPinningCoordinate] = useState(false);
  const [pinningFarmId, setPinningFarmId] = useState<string | null>(null);
  const [customLat, setCustomLat] = useState<string>('');
  const [customLng, setCustomLng] = useState<string>('');
  const [editingFarmId, setEditingFarmId] = useState<string | null>(null);

  // Load farms and initial data
  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      const data = await ApiService.getFarms();
      
      // We will enhance farms that are missing coordinates with a fallback in Ibadan, Nigeria
      // so the user sees real pins immediately and can modify them dynamically!
      const enhancedFarms = data.map((farm, index) => {
        let coords = farm.coordinates;
        let isSimulated = false;
        
        // Handle coordinates if they are stored as JSON string on database raw responses
        if (typeof coords === 'string') {
          try {
            coords = JSON.parse(coords);
          } catch (e) {
            coords = null;
          }
        }

        // Support both "lng" and "lon" representation, fallback to each other
        if (coords && typeof coords === 'object') {
          if (typeof coords.lat === 'number') {
            const parsedLng = typeof coords.lng === 'number' ? coords.lng : (typeof coords.lon === 'number' ? coords.lon : undefined);
            if (typeof parsedLng === 'number') {
              coords = { lat: coords.lat, lng: parsedLng };
            } else {
              coords = null;
            }
          } else {
            coords = null;
          }
        } else {
          coords = null;
        }
        
        if (!coords) {
          // Semi-random deterministic coordinates near Ibadan, Nigeria
          const offsetLat = (index * 0.045) - 0.09;
          const offsetLng = (index * 0.052) - 0.08;
          coords = { 
            lat: DEFAULT_CENTER.lat + offsetLat, 
            lng: DEFAULT_CENTER.lng + offsetLng 
          };
          isSimulated = true;
        }

        return {
          id: farm.id,
          name: farm.name,
          location: farm.location,
          coordinates: coords,
          totalArea: farm.totalArea,
          image: farm.image,
          isSimulatedCoords: isSimulated
        };
      });

      setFarms(enhancedFarms);
      if (enhancedFarms.length > 0) {
        setSelectedFarm(enhancedFarms[0]);
        setCenter(enhancedFarms[0].coordinates || DEFAULT_CENTER);
        fetchCrops(enhancedFarms[0].id, enhancedFarms[0].coordinates);
      }
    } catch (e) {
      console.error('Error fetching farms for map:', e);
      addNotification({
        title: 'Error Loading Farms',
        message: 'Could not fetch your cassava farm locations.',
        type: 'CRITICAL'
      });
    }
  };

  const fetchCrops = async (farmId: string, farmCoords: { lat: number; lng: number } | null) => {
    try {
      const cropData = await ApiService.getCrops(farmId);
      
      // Let's place crop plants slightly around the parent farm if they lack precise coordinates
      const cropsWithLocations = cropData.map((crop, index) => {
        let loc: GeoLocation | null = crop.location || null;
        if (!loc && farmCoords) {
          // Micro-offset for each crop field to scatter around the farm center
          const angle = (index * 2 * Math.PI) / (cropData.length || 1);
          const radius = 0.006 + (index * 0.002); // scatter offset in degrees (~500 - 1000 meters)
          loc = {
            lat: farmCoords.lat + Math.sin(angle) * radius,
            lng: farmCoords.lng + Math.cos(angle) * radius
          };
        }
        return {
          id: crop.id,
          name: crop.name,
          type: crop.type,
          fieldId: crop.fieldId,
          healthScore: crop.healthScore,
          ndvi: crop.ndvi,
          status: crop.status,
          location: loc
        };
      });

      setCrops(cropsWithLocations);
    } catch (e) {
      console.error('Error fetching crops for map:', e);
    }
  };

  const handleSelectFarm = (farm: FarmWithCoords) => {
    setSelectedFarm(farm);
    setActiveMarkerId(`farm-${farm.id}`);
    if (farm.coordinates) {
      setCenter(farm.coordinates);
      setZoom(13);
      fetchCrops(farm.id, farm.coordinates);
    }
  };

  // Map click handler to pick coordinates
  const handleMapClick = (e: any) => {
    if (!isPinningCoordinate || !pinningFarmId) return;
    
    // Some events carry latLng as a coordinate class or direct properties
    const latLng = e.detail?.latLng || e.latLng;
    if (!latLng) return;

    const selectedLat = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
    const selectedLng = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;

    setCustomLat(selectedLat.toFixed(6));
    setCustomLng(selectedLng.toFixed(6));
    
    setIsPinningCoordinate(false);
    
    addNotification({
      title: 'Coordinate Pinned',
      message: `Selected latitude ${selectedLat.toFixed(4)}, longitude ${selectedLng.toFixed(4)}`,
      type: 'SUCCESS'
    });
  };

  // Update farm coordinate in database
  const saveFarmCoordinates = async (farmId: string) => {
    const latNum = parseFloat(customLat);
    const lngNum = parseFloat(customLng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      addNotification({
        title: 'Invalid Coordinates',
        message: 'Please enter valid numeric latitude and longitude coordinates.',
        type: 'WARNING'
      });
      return;
    }

    try {
      const updatedCoords = { lat: latNum, lng: lngNum };
      await ApiService.updateFarm(farmId, { coordinates: updatedCoords });
      
      // Update local state
      setFarms(prev => prev.map(f => {
        if (f.id === farmId) {
          return { ...f, coordinates: updatedCoords, isSimulatedCoords: false };
        }
        return f;
      }));

      addNotification({
        title: 'Coordinates Saved',
        message: 'Cassava farm location updated successfully.',
        type: 'SUCCESS'
      });

      setEditingFarmId(null);
      setPinningFarmId(null);
      
      // Refresh selected farm structure
      const current = farms.find(f => f.id === farmId);
      if (current) {
        const updatedFarm = { ...current, coordinates: updatedCoords, isSimulatedCoords: false };
        setSelectedFarmsWithUpdate(updatedFarm);
      }
    } catch (e) {
      console.error('Error saving farm coordinates:', e);
      addNotification({
        title: 'Error Saving Coordinates',
        message: 'Failed to update farm on server. Please try again.',
        type: 'CRITICAL'
      });
    }
  };

  const setSelectedFarmsWithUpdate = (farm: FarmWithCoords) => {
    setSelectedFarm(farm);
    fetchCrops(farm.id, farm.coordinates);
  };

  const startEditingCoordinates = (farm: FarmWithCoords) => {
    setEditingFarmId(farm.id);
    setPinningFarmId(farm.id);
    setCustomLat(farm.coordinates && typeof farm.coordinates.lat === 'number' ? farm.coordinates.lat.toString() : '');
    setCustomLng(farm.coordinates && typeof farm.coordinates.lng === 'number' ? farm.coordinates.lng.toString() : '');
  };

  const togglePinning = () => {
    setIsPinningCoordinate(!isPinningCoordinate);
  };

  if (!hasValidKey) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] font-sans p-4">
        <div className="text-center max-w-lg bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MapPin size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Google Maps API Key Required</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            Geospatial tracking requires a valid Google Maps Platform API key. Please configure this environment variable in your AI Studio secrets to activate the interactive tracker.
          </p>
          <div className="text-left bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3 mb-6">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Setup Instructions:</p>
            <ol className="list-decimal list-inside text-sm text-slate-700 dark:text-slate-300 space-y-2">
              <li className="leading-normal">
                <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 font-semibold underline hover:text-emerald-500">
                  Get a Google Maps API Key
                </a>
              </li>
              <li className="leading-normal">Open <strong>Settings</strong> (⚙️ gear icon, top-right of your workspace)</li>
              <li className="leading-normal">Select the <strong>Secrets</strong> panel</li>
              <li className="leading-normal">Create key <code>GOOGLE_MAPS_PLATFORM_KEY</code> and paste your API key value, then press Enter</li>
            </ol>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            The platform will automatically rebuild the application and render the map page once the key is saved.
          </p>
        </div>
      </div>
    );
  }

  // Count active stats for tracking dashboard
  const totalArea = farms.reduce((sum, f) => sum + (f.totalArea || 0), 0);
  const healthyCrops = crops.filter(c => c.status === HealthStatus.HEALTHY).length;
  const healthRatio = crops.length > 0 ? (healthyCrops / crops.length) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* Overview Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Cassava Farms</p>
            <p className="text-2xl font-bold text-slate-955">{farms.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <Sprout size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Hectares Monitored</p>
            <p className="text-2xl font-bold text-slate-955">{totalArea ? totalArea.toFixed(1) : '15'} Ha</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Tracked Crop Fields</p>
            <p className="text-2xl font-bold text-slate-955">{crops.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Droplets size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Vegetation Solvency</p>
            <p className="text-2xl font-bold text-slate-955">{healthRatio.toFixed(0)}% Healthy</p>
          </div>
        </div>
      </div>

      {/* Main Map Application Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl min-h-[660px]">
        
        {/* Sidebar Controls - 4 Columns */}
        <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full overflow-hidden">
          
          {/* Farm Directory Title */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Navigation className="text-emerald-600 dark:text-emerald-400" size={18} />
              Farm Locations Control
            </h3>
            <p className="text-xs text-slate-500 mt-1">Select a farm to pan map or update boundaries</p>
          </div>

          {/* Farms List */}
          <div className="flex-1 overflow-y-auto max-h-[400px] divide-y divide-slate-100 dark:divide-slate-700 px-3 py-2">
            {farms.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <p className="text-sm">No farms registered under your account yet.</p>
              </div>
            ) : (
              farms.map((farm) => {
                const isSelected = selectedFarm?.id === farm.id;
                return (
                  <div 
                    key={farm.id}
                    onClick={() => handleSelectFarm(farm)}
                    className={`p-4 rounded-xl cursor-pointer hover:bg-slate-55 dark:hover:bg-slate-700/50 transition-all ${
                      isSelected 
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30' 
                        : 'border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                          {farm.name}
                          {farm.isSimulatedCoords && (
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-550 dark:text-slate-300 px-1.5 py-0.5 rounded-full font-medium">
                              Estimated Pos
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">{farm.location}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingCoordinates(farm);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                          title="Edit Coordinates"
                        >
                          <Edit size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Coordinates Display */}
                    {farm.coordinates && typeof farm.coordinates.lat === 'number' && typeof farm.coordinates.lng === 'number' && (
                      <div className="mt-2 text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-2">
                        <span>Lat: {farm.coordinates.lat.toFixed(5)}</span>
                        <span>•</span>
                        <span>Lng: {farm.coordinates.lng.toFixed(5)}</span>
                      </div>
                    )}

                    {/* Farm Details expansion if selected */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 space-y-2 animate-fade-in text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex justify-between">
                          <span>Surface Area:</span>
                          <span className="font-semibold">{farm.totalArea ? `${farm.totalArea.toFixed(1)} Ha` : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monitored Crops:</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{crops.length} Fields</span>
                        </div>
                        {crops.length > 0 && (
                          <div className="space-y-1 pt-1">
                            <p className="text-[10px] text-slate-400 uppercase font-medium">Crop Health Indices:</p>
                            <div className="flex gap-1.5 flex-wrap">
                              {crops.map((crop) => (
                                <span 
                                  key={crop.id}
                                  className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                                    crop.status === HealthStatus.HEALTHY 
                                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/40' 
                                      : crop.status === HealthStatus.WARNING
                                      ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-amber-100 dark:border-amber-800/40'
                                      : 'bg-rose-50 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400 border-rose-100 dark:border-rose-800/40'
                                  }`}
                                >
                                  {crop.name} (NDVI: {crop.ndvi})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Coordinate Form / Pick Pin Panel */}
          {editingFarmId && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 animate-fade-in shrink-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                <span>Set Farm Boundary Coordinates</span>
                <span className="text-[9px] bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400 px-1.5 py-0.5 rounded-full font-semibold">
                  Active
                </span>
              </h4>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 font-medium">Latitude</label>
                  <input 
                    type="number" 
                    step="0.000001"
                    value={customLat}
                    onChange={e => setCustomLat(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. 7.3775"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 font-medium">Longitude</label>
                  <input 
                    type="number" 
                    step="0.000001"
                    value={customLng}
                    onChange={e => setCustomLng(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. 3.9470"
                  />
                </div>
              </div>

              {/* Click map pin picker feature */}
              <button 
                type="button" 
                onClick={togglePinning}
                className={`w-full mb-3 py-1.5 px-3 border border-dashed rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  isPinningCoordinate 
                    ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 animate-pulse' 
                    : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Crosshair size={14} />
                {isPinningCoordinate ? 'Click any point on interactive map...' : 'Set coordinates by clicking on map'}
              </button>

              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => {
                    setEditingFarmId(null);
                    setPinningFarmId(null);
                    setIsPinningCoordinate(false);
                  }}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-755 hover:bg-slate-300 hover:dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => saveFarmCoordinates(editingFarmId)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Check size={14} />
                  Save Coordinate
                </button>
              </div>
            </div>
          )}

          {/* Quick Informational Guide */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-900/10 shrink-0">
            <div className="flex gap-2">
              <Info size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <p>
                <strong>Geospatial Accuracy</strong>: For high accuracy, place your coordinates near real Cassava fields. You can toggle map layers such as **Satellite mode** (top-right overlay) for rich topographical detail.
              </p>
            </div>
          </div>

        </div>

        {/* Interactive Google Map Panel - 8 Columns */}
        <div className="lg:col-span-8 relative h-[500px] lg:h-auto flex flex-col">
          
          {/* Map Controls Header Overlay (Float overlay) */}
          <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-md flex items-center gap-2">
            <button 
              onClick={() => setMapType('hybrid')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold select-none cursor-pointer ${
                mapType === 'hybrid' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Satellite
            </button>
            <button 
              onClick={() => setMapType('roadmap')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold select-none cursor-pointer ${
                mapType === 'roadmap' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Standard Map
            </button>
            <button 
              onClick={() => setMapType('terrain')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold select-none cursor-pointer ${
                mapType === 'terrain' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Terrain
            </button>
          </div>

          {/* API Provider & Google Map canvas */}
          <div className="flex-1 w-full h-full min-h-[460px] relative overflow-hidden">
            <APIProvider apiKey={API_KEY} version="weekly">
              <Map
                center={center}
                zoom={zoom}
                mapTypeId={mapType}
                onClick={handleMapClick}
                onCameraChanged={(ev: any) => {
                  setCenter(ev.detail.center);
                  setZoom(ev.detail.zoom);
                }}
                gestureHandling="greedy"
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{ width: '100%', height: '100%' }}
                className="w-full h-full relative"
              >
                {/* Render Farm Markers */}
                {farms.map((farm) => {
                  if (!farm.coordinates) return null;
                  
                  const isSelected = selectedFarm?.id === farm.id;
                  
                  // Color based on active stats
                  let pinBg = "#10B981"; // Healthy Emerald (Default)
                  if (farm.isSimulatedCoords) pinBg = "#6B7280"; // Grey for estimated placeholder

                  return (
                    <React.Fragment key={farm.id}>
                      <AdvancedMarker
                        position={farm.coordinates}
                        onClick={() => {
                          handleSelectFarm(farm);
                          setActiveMarkerId(`farm-${farm.id}`);
                        }}
                      >
                        <div className="relative group">
                          {/* Colored circular pulse for selection */}
                          {isSelected && (
                            <span className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping" />
                          )}
                          
                          <Pin 
                            background={isSelected ? "#059669" : pinBg} 
                            glyphColor="#ffffff"
                            glyph={isSelected ? "★" : "🌾"}
                          />
                          
                          {/* Little float label */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 bg-slate-900/90 dark:bg-slate-950/90 text-white text-[9px] font-bold rounded shadow-xl whitespace-nowrap opacity-80 group-hover:opacity-100">
                            {farm.name}
                          </div>
                        </div>
                      </AdvancedMarker>

                      {/* Info Window if Selected */}
                      {activeMarkerId === `farm-${farm.id}` && (
                        <InfoWindow
                          position={farm.coordinates}
                          onCloseClick={() => setActiveMarkerId(null)}
                        >
                          <div className="p-2 max-w-[240px] font-sans text-slate-800 dark:text-slate-900">
                            <h4 className="font-bold text-sm text-emerald-700 flex items-center gap-1.5">
                              <Sprout size={14} className="text-emerald-600" />
                              {farm.name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">{farm.location}</p>
                            
                            <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-100 text-xs">
                              <div>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Area</p>
                                <p className="font-bold text-slate-700">{farm.totalArea ? `${farm.totalArea.toFixed(1)} Ha` : 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase">Fields count</p>
                                <p className="font-bold text-slate-700">{crops.length}</p>
                              </div>
                            </div>
                            
                            {farm.isSimulatedCoords && (
                              <div className="mt-3 bg-amber-50 rounded-lg p-2 border border-amber-100">
                                <p className="text-[10px] text-amber-800 leading-normal">
                                  ⚠️ Coordinates estimated dynamically. Click the editing tool in the sidebar to define its precise real placement.
                                </p>
                              </div>
                            )}
                          </div>
                        </InfoWindow>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Render Crop Sub-markers around selected farm center */}
                {selectedFarm && crops.map((crop) => {
                  if (!crop.location) return null;
                  
                  // Color code based on status
                  let cropBg = "#10B981"; // Healthy Emerald
                  if (crop.status === HealthStatus.WARNING) cropBg = "#F59E0B"; // Amber
                  if (crop.status === HealthStatus.CRITICAL) cropBg = "#EF4444"; // Rose

                  return (
                    <React.Fragment key={crop.id}>
                      <AdvancedMarker
                        position={crop.location}
                        onClick={() => {
                          setActiveMarkerId(`crop-${crop.id}`);
                        }}
                      >
                        <div className="relative cursor-pointer hover:scale-110 transition-transform">
                          {/* Smaller circle marker for crop scans within fields */}
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: cropBg }}
                          >
                            <span className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                        </div>
                      </AdvancedMarker>

                      {/* Crop info window */}
                      {activeMarkerId === `crop-${crop.id}` && (
                        <InfoWindow
                          position={crop.location}
                          onCloseClick={() => setActiveMarkerId(null)}
                        >
                          <div className="p-1.5 max-w-[200px] font-sans text-slate-800 dark:text-slate-900">
                            <h5 className="font-bold text-xs flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cropBg }} />
                              {crop.name}
                            </h5>
                            <p className="text-[10px] text-slate-400 mt-0.5">Field: {crop.fieldId}</p>
                            
                            <div className="mt-2 space-y-1 text-xs text-slate-600">
                              <div className="flex justify-between gap-4">
                                <span>NDVI Ratio:</span>
                                <span className="font-bold font-mono">{crop.ndvi}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>Health Score:</span>
                                <span className="font-bold text-emerald-600">{crop.healthScore}%</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>Status:</span>
                                <span className={`font-bold uppercase text-[10px] ${
                                  crop.status === HealthStatus.HEALTHY ? 'text-emerald-600' :
                                  crop.status === HealthStatus.WARNING ? 'text-amber-600' : 'text-rose-600'
                                }`}>
                                  {crop.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </InfoWindow>
                      )}
                    </React.Fragment>
                  );
                })}
              </Map>
            </APIProvider>
          </div>

          {/* Pin Coordinate Alert Status Box */}
          {isPinningCoordinate && (
            <div className="absolute top-20 left-4 right-4 z-15 bg-amber-500 text-white rounded-xl px-4 py-3 shadow-xl flex items-center lg:items-center justify-between gap-3 text-xs md:text-sm animate-fade-in font-medium">
              <div className="flex items-center gap-2">
                <Crosshair className="animate-spin flex-shrink-0" size={16} />
                <span>Boundary Selection Mode active. Click on map where you want to place the crop farm.</span>
              </div>
              <button 
                onClick={() => setIsPinningCoordinate(false)}
                className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-bold uppercase text-[10px]"
              >
                Cancel
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
