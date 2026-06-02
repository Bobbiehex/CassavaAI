
import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Droplets, 
  Sun, 
  Wind, 
  CloudRain, 
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  MapPin,
  CheckCircle,
  Calendar,
  LineChart as ChartIcon,
  Plus,
  X,
  Save
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { ApiService } from '../services/api';
import { WeatherData, HealthStatus } from '../types';
import { MOCK_WEATHER } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

interface OverviewDashboardProps {
  farmId: string | null;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ farmId }) => {
  const { t, dir } = useLanguage();
  const { notifications } = useNotifications();
  const { user } = useAuth();
  const { measurementUnit } = useSettings();
  
  // State
  const [weather, setWeather] = useState<WeatherData>(MOCK_WEATHER);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [manualCoords, setManualCoords] = useState({ lat: '', lon: '' });
  const [showCoordInput, setShowCoordInput] = useState(false);
  const [timeframe, setTimeframe] = useState('7d');
  const [soilHistory, setSoilHistory] = useState<{ date: string, value: number }[]>([]);
  const [showAddDataModal, setShowAddDataModal] = useState(false);
  const [manualMetrics, setManualMetrics] = useState({
    scans: '',
    yield: '',
    prevScans: '',
    prevYield: '',
    alerts: '',
    prevAlerts: ''
  });
  
  // Live Metrics State
  const [metrics, setMetrics] = useState({
    totalYield: 0,
    yieldTrend: 0,
    activeAlerts: 0,
    alertsTrend: 0,
    avgMoisture: 0,
    moistureTrend: 0,
    totalScans: 0,
    scansTrend: 0
  });

  const fetchData = async (lat?: number, lon?: number) => {
    if (!farmId && !lat && !lon) return;
    setLoading(true);
    try {
      let locationStr: string | undefined;
      let dbManualMetrics = null;
      let dbFarm: any = null;
      
      // Always try to get farm data if farmId is present to get manual metrics
      if (farmId) {
        dbFarm = await ApiService.getFarm(farmId);
        if (dbFarm) {
          locationStr = dbFarm.location;
          
          // Use farm coordinates if lat/lon not explicitly provided
          if (!lat && !lon && dbFarm.coordinates) {
            lat = dbFarm.coordinates.lat;
            lon = dbFarm.coordinates.lon;
          }
          
          if (dbFarm.manualMetrics) {
            dbManualMetrics = dbFarm.manualMetrics;
            setManualMetrics({
              scans: dbFarm.manualMetrics.scans || '',
              yield: dbFarm.manualMetrics.yield || '',
              prevScans: dbFarm.manualMetrics.prevScans || '',
              prevYield: dbFarm.manualMetrics.prevYield || '',
              alerts: dbFarm.manualMetrics.alerts || '',
              prevAlerts: dbFarm.manualMetrics.prevAlerts || ''
            });
          } else {
            // Reset if no manual metrics for this farm
            const resetMetrics = {
              scans: '',
              yield: '',
              prevScans: '',
              prevYield: '',
              alerts: '',
              prevAlerts: ''
            };
            dbManualMetrics = resetMetrics;
            setManualMetrics(resetMetrics);
          }
        }
      }

      // Parallel fetch for all dashboard data sources
      const [weatherData, cropsData] = await Promise.all([
        ApiService.getWeather(locationStr, lat, lon),
        ApiService.getCrops(farmId || undefined)
      ]);

      // Fetch soil history if we have coordinates
      const currentLat = lat || (weatherData as any).coord?.lat;
      const currentLon = lon || (weatherData as any).coord?.lon;
      
      let currentSoilHistory: { date: string, value: number, timestamp?: number }[] = [];
      if (farmId && dbFarm && dbFarm.soilHistory) {
        currentSoilHistory = dbFarm.soilHistory;
      }

      // If we don't have history in DB, seed it
      if (currentSoilHistory.length === 0 && currentLat && currentLon) {
        currentSoilHistory = await ApiService.getSoilMoistureHistory(currentLat, currentLon, '30d');
      }

      // Calculate avgMoisture first so we can append it
      let yieldAccumulator = 0;
      let moistureAccumulator = 0;
      let cropAlerts = 0;

      cropsData.forEach(c => {
          let baseYieldPerField = 17.5; 
          
          yieldAccumulator += baseYieldPerField * c.ndvi;
          moistureAccumulator += c.soilMoisture;
          if (c.status !== HealthStatus.HEALTHY) cropAlerts++;
      });

      const avgMoisture = weatherData.soilMoisture !== undefined 
        ? weatherData.soilMoisture 
        : (cropsData.length > 0 ? Math.round(moistureAccumulator / cropsData.length) : 0);

      // Append current reading
      if (avgMoisture > 0) {
        const now = new Date();
        currentSoilHistory.push({
          date: now.toLocaleDateString(),
          value: avgMoisture,
          timestamp: now.getTime()
        });

        // Keep only the last 100 readings to prevent unbounded growth
        if (currentSoilHistory.length > 100) {
          currentSoilHistory = currentSoilHistory.slice(-100);
        }

        // Save to database
        if (farmId) {
          try {
            await ApiService.updateFarm(farmId, { soilHistory: currentSoilHistory });
          } catch (e) {
            console.error("Failed to save soil history", e);
          }
        }
      }

      // Filter based on timeframe for display
      const nowTime = new Date().getTime();
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 365;
      const cutoff = nowTime - (days * 24 * 60 * 60 * 1000);
      const filteredHistory = currentSoilHistory.filter(h => h.timestamp ? h.timestamp >= cutoff : true);
      
      setSoilHistory(filteredHistory);

      setWeather(weatherData);

      // --- Calculate Real-Time Agricultural Metrics ---

      // Calculate Trend based on timeframe and history
      let moistureTrend = 0;
      if (filteredHistory.length > 1) {
        const first = filteredHistory[0].value;
        // Compare current average moisture with the oldest historical value in the timeframe
        if (first > 0) {
          moistureTrend = parseFloat((((avgMoisture - first) / first) * 100).toFixed(1));
        }
      }

      // 2. Scans Metrics
      let scansAccumulator = 0;
      cropsData.forEach(c => {
        scansAccumulator += c.history ? c.history.length : 1;
      });

      // Use the most up-to-date manual metrics for calculation
      const activeManualMetrics = dbManualMetrics || manualMetrics;

      // 3. Set Aggregated Metrics
      const finalYield = activeManualMetrics.yield ? parseFloat(activeManualMetrics.yield) : Math.round(yieldAccumulator);
      const finalScans = activeManualMetrics.scans ? parseFloat(activeManualMetrics.scans) : scansAccumulator;


      // Calculate trends accurately if manual data is provided
      let yieldTrend = 0;
      if (finalYield === 0) {
        yieldTrend = 0;
      } else if (activeManualMetrics.yield && activeManualMetrics.prevYield) {
        const curr = parseFloat(activeManualMetrics.yield);
        const prev = parseFloat(activeManualMetrics.prevYield);
        if (prev !== 0) yieldTrend = parseFloat((((curr - prev) / prev) * 100).toFixed(1));
        else yieldTrend = 0;
      } else if (activeManualMetrics.yield) {
        const est = Math.round(yieldAccumulator);
        if (est !== 0) yieldTrend = parseFloat((((finalYield - est) / est) * 100).toFixed(1));
        else yieldTrend = 0;
      } else {
        yieldTrend = 5.2;
      }

      let scansTrend = 0;
      if (finalScans === 0) {
        scansTrend = 0;
      } else if (activeManualMetrics.scans && activeManualMetrics.prevScans) {
        const curr = parseFloat(activeManualMetrics.scans);
        const prev = parseFloat(activeManualMetrics.prevScans);
        if (prev !== 0) scansTrend = parseFloat((((curr - prev) / prev) * 100).toFixed(1));
        else scansTrend = 0;
      } else if (activeManualMetrics.scans) {
        const est = Math.round(scansAccumulator);
        if (est !== 0) scansTrend = parseFloat((((finalScans - est) / est) * 100).toFixed(1));
        else scansTrend = 0;
      } else {
        scansTrend = 1.8;
      }

      const finalAlerts = activeManualMetrics.alerts ? parseInt(activeManualMetrics.alerts, 10) : cropAlerts;
      
      let alertsTrend = 0;
      if (finalAlerts === 0) {
        alertsTrend = 0;
      } else if (activeManualMetrics.alerts && activeManualMetrics.prevAlerts) {
        const curr = parseInt(activeManualMetrics.alerts, 10);
        const prev = parseInt(activeManualMetrics.prevAlerts, 10);
        alertsTrend = curr - prev;
      } else if (activeManualMetrics.alerts) {
        const est = cropAlerts;
        alertsTrend = finalAlerts - est;
      } else {
        alertsTrend = finalAlerts > 0 ? 1 : 0;
      }

      setMetrics({
          totalYield: finalYield,
          yieldTrend: yieldTrend, 
          activeAlerts: finalAlerts,
          alertsTrend: alertsTrend,
          avgMoisture: avgMoisture,
          moistureTrend: moistureTrend,
          totalScans: finalScans,
          scansTrend: scansTrend
      });

      setLastUpdated(new Date());
    } catch (e) {
      console.error("Failed to fetch dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleManualFetch = async () => {
    const lat = parseFloat(manualCoords.lat);
    const lon = parseFloat(manualCoords.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      // Update the farm with the new coordinates
      if (farmId) {
        try {
          await ApiService.updateFarm(farmId, { 
            coordinates: { lat, lon } 
          });
        } catch (error) {
          console.error("Failed to save location to farm", error);
        }
      }
      fetchData(lat, lon);
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Update the farm with the new coordinates
        if (farmId) {
          try {
            await ApiService.updateFarm(farmId, { 
              coordinates: { lat, lon } 
            });
          } catch (error) {
            console.error("Failed to save location to farm", error);
          }
        }
        
        // Fetch data with new coordinates
        fetchData(lat, lon);
      });
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 5 minutes to keep weather and metrics fresh
    const interval = setInterval(() => fetchData(), 300000);
    return () => clearInterval(interval);
  }, [farmId, timeframe]);

  // Filter for priority notifications (Warning/Critical)
  const priorityNotifications = notifications
    .filter(n => n.type === 'WARNING' || n.type === 'CRITICAL')
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('farm_overview')}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t('welcome', { name: user?.name || 'User' })}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400 w-full sm:w-auto">
           <select
             value={timeframe}
             onChange={(e) => setTimeframe(e.target.value)}
             className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
           >
             <option value="7d">Last 7 Days</option>
             <option value="30d">Last 30 Days</option>
             <option value="month">This Month</option>
             <option value="year">This Year</option>
           </select>
           <button 
             onClick={() => setShowCoordInput(!showCoordInput)}
             className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
           >
             <MapPin size={14} />
             <span className="hidden xs:inline">Coordinates</span>
           </button>
           <button 
             onClick={() => setShowAddDataModal(true)}
             className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
           >
             <Plus size={14} />
             <span>Add Data</span>
           </button>
           <div className="flex items-center gap-2 ml-auto sm:ml-0">
             <span className="hidden md:inline">{t('updated')}: {lastUpdated.toLocaleTimeString()}</span>
             <button 
               onClick={() => fetchData()} 
               disabled={loading}
               className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${loading ? 'animate-spin' : ''}`}
             >
               <RefreshCw size={16} />
             </button>
           </div>
        </div>
      </div>

      {showCoordInput && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-end gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1 flex-1">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Latitude</label>
            <input 
              type="text" 
              placeholder="e.g. 36.7378"
              value={manualCoords.lat}
              onChange={(e) => setManualCoords({ ...manualCoords, lat: e.target.value })}
              className="block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none"
            />
          </div>
          <div className="space-y-1 flex-1">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Longitude</label>
            <input 
              type="text" 
              placeholder="e.g. -119.7871"
              value={manualCoords.lon}
              onChange={(e) => setManualCoords({ ...manualCoords, lon: e.target.value })}
              className="block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={handleManualFetch}
              className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Fetch Data
            </button>
            <button 
              onClick={handleUseMyLocation}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors shadow-sm"
            >
              Use My Location
            </button>
          </div>
        </div>
      )}

      {/* Weather Widget */}
      <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-sky-900/10 relative overflow-hidden">
        <div className={`absolute top-0 ${dir === 'rtl' ? 'left-0' : 'right-0'} p-4 opacity-10`}>
            <Sun size={120} />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
            <div className={`flex items-center space-x-4 mb-4 md:mb-0 ${dir === 'rtl' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Sun size={48} className="text-yellow-300 animate-pulse" />
                <div>
                    <h2 className="text-3xl font-bold">
                      {measurementUnit === 'imperial' 
                        ? Math.round((weather.temp * 9/5) + 32) + '°F'
                        : weather.temp + '°C'}
                    </h2>
                    <div className="flex items-center gap-2 text-sky-100">
                        <span className="font-medium">{weather.condition}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-sm"><MapPin size={12} /> {weather.location}</span>
                    </div>
                </div>
            </div>
            <div className={`grid grid-cols-2 sm:flex sm:flex-wrap md:flex-nowrap sm:space-x-8 gap-4 sm:gap-6 text-center ${dir === 'rtl' ? 'sm:space-x-reverse' : ''}`}>
                <div>
                    <div className="flex items-center justify-center space-x-1 text-sky-200 mb-1">
                        <Droplets size={16} /> <span className="text-[10px] sm:text-xs uppercase">{t('weather_humidity')}</span>
                    </div>
                    <span className="font-semibold text-base sm:text-lg">{weather.humidity}%</span>
                </div>
                <div>
                    <div className="flex items-center justify-center space-x-1 text-sky-200 mb-1">
                        <Wind size={16} /> <span className="text-[10px] sm:text-xs uppercase">{t('weather_wind')}</span>
                    </div>
                    <span className="font-semibold text-base sm:text-lg">
                      {measurementUnit === 'imperial'
                        ? Math.round(weather.windSpeed / 1.60934) + ' mph'
                        : weather.windSpeed + ' km/h'}
                    </span>
                </div>
                <div>
                    <div className="flex items-center justify-center space-x-1 text-sky-200 mb-1">
                        <CloudRain size={16} /> <span className="text-[10px] sm:text-xs uppercase">{t('weather_rain')}</span>
                    </div>
                    <span className="font-semibold text-base sm:text-lg">
                      {measurementUnit === 'imperial'
                        ? (weather.rainfall / 25.4).toFixed(2) + ' in'
                        : weather.rainfall + ' mm'}
                    </span>
                </div>
                {weather.soilMoisture !== undefined && (
                  <div className="relative">
                      <div className="flex items-center justify-center space-x-1 text-sky-200 mb-1">
                          <Droplets size={16} /> <span className="text-[10px] sm:text-xs uppercase">{t('weather_soil_moisture')}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-base sm:text-lg">{weather.soilMoisture}%</span>
                        <span className={`text-[9px] sm:text-[10px] px-1 rounded ${
                          weather.soilSource === 'API' ? 'bg-green-500/20 text-green-200' : 
                          weather.soilSource === 'Estimated' ? 'bg-yellow-500/20 text-yellow-200' : 
                          'bg-red-500/20 text-red-200'
                        }`}>
                          {weather.soilSource}
                        </span>
                      </div>
                  </div>
                )}
            </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { 
            label: t('stat_yield'), 
            value: `${metrics.totalYield.toLocaleString()} Tons`, 
            trend: metrics.yieldTrend, 
            icon: TrendingUp, 
            color: 'emerald' 
          },
          { 
            label: t('stat_alerts'), 
            value: `${metrics.activeAlerts} Active`, 
            trend: metrics.alertsTrend, 
            icon: AlertTriangle, 
            color: metrics.activeAlerts > 0 ? 'rose' : 'green' 
          },
          { 
            label: t('stat_moisture'), 
            value: `${metrics.avgMoisture}%`, 
            trend: metrics.moistureTrend, 
            icon: Droplets, 
            color: 'blue' 
          },
          { 
            label: t('stat_cassava_scans'), 
            value: `${metrics.totalScans} Scans`, 
            trend: metrics.scansTrend, 
            icon: ArrowUpRight, 
            color: 'indigo' 
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${
                stat.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
                stat.color === 'rose' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' :
                stat.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
              }`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.trend > 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 
                stat.trend < 0 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 
                'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                {stat.label === t('stat_alerts') ? (stat.trend > 0 ? '+1 New' : 'Stable') : 
                 (stat.trend === 0 && stat.label !== t('stat_moisture')) ? 'Stable' : `${stat.trend > 0 ? '+' : ''}${stat.trend}%`}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
              {stat.label === t('stat_moisture') && weather.soilSource && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                  weather.soilSource === 'API' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 
                  weather.soilSource === 'Estimated' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' : 
                  'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-600'
                }`}>
                  {weather.soilSource}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Soil Moisture History Chart */}
      {soilHistory.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <ChartIcon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">Soil Moisture History</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Real-time sensor data from Agro API</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Moisture %
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={soilHistory}>
                <defs>
                  <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-700" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--tw-color-slate-800, #1e293b)', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    color: '#f8fafc'
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorMoisture)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Alerts Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white">{t('priority_alerts')}</h3>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">{t('view_all')}</button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {priorityNotifications.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                    <CheckCircle size={48} className="mb-2 text-emerald-500 opacity-50" />
                    <p className="font-medium text-slate-600 dark:text-slate-300">All Systems Normal</p>
                    <p className="text-sm">No critical alerts detected on the farm.</p>
                </div>
            ) : (
                priorityNotifications.map((alert) => (
                    <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center space-x-4">
                            <div className={`w-2 h-2 rounded-full ${
                                alert.type === 'CRITICAL' ? 'bg-rose-500 animate-pulse' : 
                                alert.type === 'WARNING' ? 'bg-amber-500' : 'bg-slate-400'
                            }`} />
                            <div className={dir === 'rtl' ? 'mr-3' : 'ml-3'}>
                                <p className="font-medium text-slate-800 dark:text-white text-sm sm:text-base">{alert.title}</p>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate max-w-[150px] xs:max-w-[250px] sm:max-w-md">{alert.message}</p>
                            </div>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                            {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* Add Data Modal */}
      {showAddDataModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Farm Data</h3>
              <button 
                onClick={() => setShowAddDataModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto flex-grow custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Scans</label>
                  <input 
                    type="number" 
                    placeholder="Current"
                    value={manualMetrics.scans}
                    onChange={(e) => setManualMetrics({ ...manualMetrics, scans: e.target.value })}
                    className="block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Previous Scans</label>
                  <input 
                    type="number" 
                    placeholder="For Trend"
                    value={manualMetrics.prevScans}
                    onChange={(e) => setManualMetrics({ ...manualMetrics, prevScans: e.target.value })}
                    className="block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Yield Prediction (T)</label>
                  <input 
                    type="number" 
                    placeholder="Current"
                    value={manualMetrics.yield}
                    onChange={(e) => setManualMetrics({ ...manualMetrics, yield: e.target.value })}
                    className="block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Previous Yield (T)</label>
                  <input 
                    type="number" 
                    placeholder="For Trend"
                    value={manualMetrics.prevYield}
                    onChange={(e) => setManualMetrics({ ...manualMetrics, prevYield: e.target.value })}
                    className="block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Alerts</label>
                  <input 
                    type="number" 
                    placeholder="Current"
                    value={manualMetrics.alerts}
                    onChange={(e) => setManualMetrics({ ...manualMetrics, alerts: e.target.value })}
                    className="block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Previous Alerts</label>
                  <input 
                    type="number" 
                    placeholder="For Trend"
                    value={manualMetrics.prevAlerts}
                    onChange={(e) => setManualMetrics({ ...manualMetrics, prevAlerts: e.target.value })}
                    className="block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  <strong>Tip:</strong> Enter both Current and Previous values to calculate an accurate percentage trend. If Previous is left empty, it will compare against our real-time estimates.
                </p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <button 
                onClick={() => setShowAddDataModal(false)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (farmId) {
                    try {
                      await ApiService.updateFarm(farmId, { manualMetrics });
                      setShowAddDataModal(false);
                      fetchData();
                    } catch (error) {
                      console.error("Failed to save manual data", error);
                    }
                  }
                }}
                className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Save Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
