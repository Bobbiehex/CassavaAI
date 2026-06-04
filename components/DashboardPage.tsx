
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { ApiService } from '../services/api';
import { dbService } from '../services/db';
import { WeatherData } from '../types';
import { MOCK_WEATHER } from '../constants';
import { 
  TrendingUp, 
  Users, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Map as MapIcon,
  Activity
} from 'lucide-react';

import image from '../src/assets/image.png';
import image1 from '../src/assets/image1.png';
import image2 from '../src/assets/image2.png';
import image3 from '../src/assets/image3.png';
import image4 from '../src/assets/image4.png';
import image5 from '../src/assets/image5.png';
import image6 from '../src/assets/image6.png';

export const DashboardPage: React.FC<{ farmId?: string | null, onNavigate?: (page: string, params?: any) => void }> = ({ farmId, onNavigate }) => {
  const { t, dir } = useLanguage();
  const { measurementUnit } = useSettings();

  const [weather, setWeather] = useState<WeatherData>(MOCK_WEATHER);
  const [timeframe, setTimeframe] = useState('30d');
  const [teamStats, setTeamStats] = useState({ value: '...', change: '0%' });
  const [droneStats, setDroneStats] = useState({ value: '...', change: '0%' });
  
  const [rawTotalArea, setRawTotalArea] = useState<number | null>(null);
  const [isEditingArea, setIsEditingArea] = useState(false);
  const [editAreaValue, setEditAreaValue] = useState('');

  const displayArea = rawTotalArea !== null 
    ? (measurementUnit === 'imperial' 
        ? `${(rawTotalArea * 2.47105).toFixed(2)} Ac` 
        : `${rawTotalArea} Ha`)
    : 'Not Set';

  const handleSaveArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId) return;
    try {
      let floatVal = parseFloat(editAreaValue);
      if (isNaN(floatVal)) return;
      
      // If user is in imperial mode, the input is in Acres, so convert back to Ha for storage
      if (measurementUnit === 'imperial') {
        floatVal = floatVal / 2.47105;
      }

      await ApiService.updateFarm(farmId, { totalArea: floatVal });
      setRawTotalArea(floatVal);
      setIsEditingArea(false);
    } catch (err) {
      console.error("Failed to save area:", err);
    }
  };

  // Helper to format change
  const formatChange = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return 'Stable';
    if (num > 0) return `+${num}%`;
    if (num < 0) return `${num}%`;
    return 'Stable';
  };

  useEffect(() => {
    let mounted = true;
    const fetchWeather = async () => {
      try {
        let locationStr = undefined;
        if (farmId) {
          const farms = await ApiService.getFarms();
          const farm = farms.find((f: any) => f.id === farmId);
          if (farm && farm.location) {
            locationStr = farm.location;
          }
        }
        const data = await ApiService.getWeather(locationStr);
        if (mounted) {
          setWeather(data);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard weather", e);
      }
    };
    
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // 5 minutes
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [farmId]);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        // Fetch Admin Counts
        const tStats = await ApiService.getDashboardStats(timeframe);
        
        // Fetch Active Drones from Backend (Hybrid)
        const animals = await ApiService.getAnimals(farmId || undefined);
        const crops = await ApiService.getCrops(farmId || undefined);

        // Filter out fake fallback data by checking if id is a timestamp (length > 5)
        const isReal = (item: any) => item.id && (item.id.length > 5 || !isNaN(Number(item.id)));
        
        const realCameras = animals.filter((a: any) => (a.isConfigured || a.deviceId) && isReal(a));
        const realCrops = crops.filter((c: any) => c.history && c.history.length > 0 && isReal(c));

        const currentDronesCount = realCameras.length + realCrops.length;

        // Calculate Drone Change based on time
        const getStartDate = (tf: string) => {
          const now = new Date();
          switch (tf) {
            case '7d': return new Date(now.setDate(now.getDate() - 7)).getTime();
            case '30d': return new Date(now.setDate(now.getDate() - 30)).getTime();
            case 'month': return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
            case 'year': return new Date(now.getFullYear(), 0, 1).getTime();
            default: return new Date(now.setDate(now.getDate() - 30)).getTime();
          }
        };
        const startMillis = getStartDate(timeframe);

        // Calculate how many drones existed BEFORE the timeframe start
        // Using the ID as timestamp, since new slots are created with Date.now().toString()
        const previousDrones = 
          realCameras.filter((a: any) => Number(a.id) < startMillis).length + 
          realCrops.filter((c: any) => Number(c.id) < startMillis).length;

        let dronesChange = 0;
        if (previousDrones > 0) {
          dronesChange = ((currentDronesCount - previousDrones) / previousDrones) * 100;
        } else if (currentDronesCount > 0) {
          dronesChange = 100;
        }

        if (mounted) {
          setTeamStats({
            value: tStats.teamMembers?.toString() || '0',
            change: formatChange(tStats.teamMembersChange)
          });
          setDroneStats({
            value: currentDronesCount.toString(),
            change: formatChange(dronesChange.toFixed(1))
          });
          
          if (farmId) {
            const farms = await ApiService.getFarms();
            const farm = farms.find((f: any) => f.id === farmId);
            if (farm) {
               setRawTotalArea(farm.totalArea || null);
               setEditAreaValue(farm.totalArea ? 
                 (measurementUnit === 'imperial' ? (farm.totalArea * 2.47105).toFixed(2) : farm.totalArea.toString()) 
                 : '');
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch dashboard stats", e);
      }
    };

    fetchStats();
  }, [timeframe, farmId]);

  const stats = [
    { labelId: 'stat_total_area', label: t('stat_total_area'), value: displayArea, change: '+2.5%', icon: MapIcon, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { labelId: 'stat_active_drones', label: t('stat_active_drones'), value: droneStats.value, change: droneStats.change, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100' },
    { labelId: 'stat_crop_health', label: t('stat_crop_health'), value: '94%', change: '+1.2%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { labelId: 'stat_team_members', label: t('stat_team_members'), value: teamStats.value, change: teamStats.change, icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t('nav_dashboard')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t('dashboard_welcome_subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="7d">{t('tf_7d')}</option>
            <option value="30d">{t('tf_30d')}</option>
            <option value="month">{t('tf_month')}</option>
            <option value="year">{t('tf_year')}</option>
          </select>
          <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
            <Calendar size={18} className="text-slate-400" />
            <span className="text-sm font-medium">
              {new Intl.DateTimeFormat(navigator.language, { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              }).format(new Date())}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-slate-500'}`}>
                {stat.change.startsWith('+') ? <ArrowUpRight size={14} /> : null}
                {stat.change}
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
            {stat.labelId === 'stat_total_area' ? (
                isEditingArea ? (
                  <form onSubmit={handleSaveArea} className="mt-1 flex gap-2">
                    <input autoFocus type="number" step="0.01" value={editAreaValue} onChange={e => setEditAreaValue(e.target.value)} className="w-20 px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm outline-none" placeholder="Ha" />
                    <button type="submit" className="text-xs font-bold text-white bg-emerald-600 px-2 rounded hover:bg-emerald-500">Save</button>
                    <button type="button" onClick={() => setIsEditingArea(false)} className="text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                    <button onClick={() => setIsEditingArea(true)} className="text-xs text-emerald-600 hover:underline bg-emerald-50 dark:bg-emerald-900 px-2 py-0.5 rounded-md">Edit</button>
                  </div>
                )
            ) : (
               <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stat.value}</h3>
            )}
          </div>
        ))}
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Visual Insights */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold">{t('field_surveillance_ndvi')}</h2>
              <button 
                onClick={() => onNavigate && onNavigate('crops')}
                className="text-sm text-emerald-600 font-semibold hover:underline"
              >
                {t('view_map')}
              </button>
            </div>
            <div className="aspect-video relative bg-slate-100 dark:bg-slate-900">
              {/* This is where the user's images should go */}
              <img 
                src={image} 
                alt="Field Map" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800 backdrop-blur p-3 rounded-xl shadow-lg border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{t('optimal_health')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{t('action_required')}</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('field_ndvi_insight')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-bold">{t('cassava_disease_scanning')}</h3>
              </div>
              <div className="aspect-[4/3] relative bg-slate-100 dark:bg-slate-900">
                <img 
                  src={image1} 
                  alt="Cassava Scanning" 
                  className="w-full h-full object-cover relative z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                  <p className="text-xs font-medium text-emerald-300 mb-1">● {t('ai_doctor')}</p>
                  <p className="text-sm font-bold leading-tight">{t('continuous_tracking_leaves')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-bold">{t('automated_drone_fleet')}</h3>
              </div>
              <div className="aspect-[4/3] relative bg-slate-100 dark:bg-slate-900">
                <img 
                  src={image2} 
                  alt="Drone Path" 
                  className="w-full h-full object-cover relative z-0"
                />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                   <div className="w-16 h-16 bg-emerald-500/30 rounded-full animate-ping"></div>
                   <div className="w-4 h-4 bg-emerald-500 rounded-full absolute"></div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-800 backdrop-blur-sm p-3 rounded-xl z-20 border border-white/20 shadow-lg">
                  <p className="text-xs font-bold text-slate-800 dark:text-white">{t('drone_active')}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('drone_mapping_sector')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Greenhouse Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold">{t('greenhouse_climate_control')}</h2>
              <button 
                onClick={() => onNavigate && onNavigate('settings')} 
                className="text-sm text-emerald-600 font-semibold hover:underline"
              >
                {t('adjust_settings')}
              </button>
            </div>
            <div className="relative bg-slate-100 dark:bg-slate-900 group">
              <img 
                src={image4} 
                alt="Greenhouse" 
                className="w-full h-auto object-contain block"
              />
              <div className="absolute top-4 left-4 flex gap-2 z-20">
                <span className="bg-emerald-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur shadow-sm">24°C</span>
                <span className="bg-blue-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur shadow-sm">65% {t('weather_humidity')}</span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-800 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 xl:opacity-100 xl:group-hover:opacity-100">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('greenhouse_insight_para')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-bold">{t('soil_moisture_dynamics')}</h3>
              </div>
              <div className="aspect-[4/3] relative bg-slate-100 dark:bg-slate-900">
                <img 
                  src={image3} 
                  alt="Soil Moisture" 
                  className="w-full h-full object-cover relative z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-black/20 to-transparent z-10"></div>
                <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs font-medium text-blue-300 mb-1">{t('sensor_grid_alpha')}</p>
                      <p className="text-sm font-bold leading-tight">{t('ideal_moisture_retained')}</p>
                    </div>
                    <div className="bg-blue-500/80 backdrop-blur px-2 py-1 rounded-lg">
                      <p className="text-xs font-bold">42%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col group">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold">{t('autonomous_harvesters')}</h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="aspect-[4/3] relative bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <img 
                  src={image5} 
                  alt="Harvester" 
                  className="w-full h-full object-cover relative z-0 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl z-20 text-white border border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-bold text-emerald-400">Harvester 02</p>
                    <p className="text-[10px] font-medium bg-white/20 px-1.5 py-0.5 rounded">94% {t('efficiency_label')}</p>
                  </div>
                  <p className="text-xs text-slate-300">{t('harvester_fleet_coordination')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col md:col-span-2">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-bold">{t('crop_yield_forecasting')}</h3>
              </div>
              <div className="aspect-[21/9] md:aspect-[3/1] relative bg-slate-100 dark:bg-slate-900">
                <img 
                  src={image6} 
                  alt="Yield Forecast" 
                  className="w-full h-full object-cover relative z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/90 via-indigo-900/40 to-transparent z-10"></div>
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <h4 className="text-4xl md:text-5xl font-bold text-white mb-2">+12%</h4>
                  <p className="text-sm md:text-base font-medium text-indigo-100 max-w-lg">{t('ai_driven_yield_forecast')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Weather & Alerts */}
        <div className="space-y-8">
          {/* Weather Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-emerald-100 font-medium">{t('weather_forecast_card')}</p>
                <h3 className="text-4xl font-bold mt-1">
                  {measurementUnit === 'imperial' 
                    ? Math.round((weather.temp * 9/5) + 32) + '°F'
                    : weather.temp + '°C'}
                </h3>
                <div className="flex items-center gap-2 text-emerald-100 text-sm mt-2 opacity-90">
                    <span className="font-medium">{weather.condition}</span>
                    <span>•</span>
                    <span>{weather.location}</span>
                </div>
              </div>
              <CloudRain size={48} className="text-white opacity-80" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur p-3 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-100 mb-1">
                  <Droplets size={14} />
                  <span className="text-xs font-medium">{t('weather_humidity')}</span>
                </div>
                <p className="font-bold">{weather.humidity}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur p-3 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-100 mb-1">
                  <Wind size={14} />
                  <span className="text-xs font-medium">{t('weather_wind')}</span>
                </div>
                <p className="font-bold">
                  {measurementUnit === 'imperial'
                    ? Math.round(weather.windSpeed / 1.60934) + ' mph'
                    : weather.windSpeed + ' km/h'}
                </p>
              </div>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold">{t('priority_alerts')}</h3>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-700">
              {[
                { title: t('alert_water_stress'), sector: 'Sector C-2', time: '10m ago', type: 'critical' },
                { title: t('alert_mosaic'), sector: 'Field Alpha', time: '25m ago', type: 'warning' },
                { title: t('alert_drone_battery'), sector: 'Hangar', time: '1h ago', type: 'info' },
              ].map((alert, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                     <div className={`w-2 h-2 rounded-full ${
                       alert.type === 'critical' ? 'bg-rose-500' : 
                       alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                     }`}></div>
                     <div className="flex-1">
                       <p className="text-sm font-bold">{alert.title}</p>
                       <p className="text-xs text-slate-500">{alert.sector} • {alert.time}</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full p-4 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border-t border-slate-100 dark:border-slate-700">
              {t('view_all_alerts')}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="font-bold mb-4">{t('quick_actions')}</h3>
            <div className="space-y-3">
              <button className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-sm transition-colors flex items-center justify-between group">
                {t('launch_drone_scan')}
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-sm transition-colors flex items-center justify-between group">
                {t('generate_report_btn')}
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Resource Status */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="font-bold mb-6 text-slate-900 dark:text-white">{t('resource_consumption')}</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-500 dark:text-slate-400">{t('water_storage')}</span>
                  <span className="text-emerald-600 font-bold">78%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden flex">
                  <div className="bg-emerald-500 h-2.5 rounded-full w-[78%] relative overflow-hidden">
                    <div className="absolute inset-0 w-full h-full bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-500 dark:text-slate-400">{t('solar_energy_grid')}</span>
                  <span className="text-amber-500 font-bold">92%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden flex">
                  <div className="bg-amber-500 h-2.5 rounded-full w-[92%] relative overflow-hidden">
                    <div className="absolute inset-0 w-full h-full bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-500 dark:text-slate-400">{t('fertilizer_silos')}</span>
                  <span className="text-blue-500 font-bold">45%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden flex">
                  <div className="bg-blue-500 h-2.5 rounded-full w-[45%]"></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">{t('restock_recommended')}</p>
              </div>
            </div>
          </div>
          
          {/* Active Operations Timeline */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="font-bold mb-6 text-slate-900 dark:text-white">{t('live_operations')}</h3>
            <div className="relative border-l-2 border-slate-100 dark:border-slate-700 ml-3 space-y-6">
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-800"></span>
                <p className="text-xs font-bold text-emerald-600 mb-1">{t('in_progress_label')}</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{t('sector_4_irrigation')}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t('automated_drip_running')}</p>
              </div>
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-white dark:ring-slate-800"></span>
                <p className="text-xs font-bold text-amber-600 mb-1">{t('upcoming_label')} (14:00)</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{t('soil_sampling_drone')}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t('preflight_checks_completed')}</p>
              </div>
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-800"></span>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{t('scheduled_label')} (16:30)</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{t('cassava_irrigation_action')}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t('automated_drip_sector_a')}</p>
              </div>
            </div>
          </div>

          {/* AI Sustainability Score */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-indigo-100 font-medium text-sm">{t('eco_efficiency_rating')}</p>
                  <h3 className="text-2xl font-bold mt-1">{t('eco_excellent')}</h3>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-2">
                  <TrendingUp size={20} className="text-white" />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="3"
                      strokeDasharray="94, 100"
                      className="animate-[dash_1.5s_ease-out_forwards]"
                    />
                  </svg>
                  <div className="absolute text-2xl font-bold">94</div>
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <div className="flex justify-between text-[10px] text-indigo-100 mb-1">
                      <span>{t('carbon_offset')}</span>
                      <span>+12%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5">
                      <div className="bg-emerald-400 h-1.5 rounded-full w-4/5"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-indigo-100 mb-1">
                      <span>{t('water_recycled')}</span>
                      <span>88%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5">
                      <div className="bg-blue-400 h-1.5 rounded-full w-[88%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supply Chain Logistics */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="font-bold mb-4 text-slate-900 dark:text-white">{t('active_dispatch_logs')}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-600">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
                  <ArrowUpRight size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('outgoing_organic_cassava')}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t('fleet_en_route')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-600">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                  <ArrowDownRight size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('incoming_bio_fertilizer')}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t('supplier_delivery_expected')}</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 p-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700">
              {t('view_logistics_map')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
