import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Leaf, 
  Map, 
  Search, 
  Bot, 
  ChevronRight, 
  ArrowRight, 
  Globe, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  HelpCircle, 
  Droplet, 
  Smartphone,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Import the specific custom generated cassava images
import ndviImage from '../src/assets/images/cassava_ndvi_map_1781272296202.jpg';
import scanImage from '../src/assets/images/cassava_scanning_1781272316688.jpg';
import greenhouseImage from '../src/assets/images/greenhouse_climate_1781272331937.jpg';
import yieldImage from '../src/assets/images/yield_forecast_1781272347670.jpg';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // State for AI Advisor interactive demo
  const [demoTopic, setDemoTopic] = useState<'disease' | 'soil' | 'water'>('disease');
  const [demoLanguage, setDemoLanguage] = useState<'en' | 'yo' | 'ha' | 'ig'>('en');

  const navLanguages: { code: 'en' | 'yo' | 'ha' | 'ig'; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
    { code: 'yo', label: 'Yoruba', flag: '🇳🇬' },
    { code: 'ig', label: 'Igbo', flag: '🇳🇬' }
  ];

  // Simulated AI responses localized for smallholders
  const demoResponses = {
    en: {
      disease: "To protect your cassava crops from Cassava Mosaic Disease (CMD), always plant healthy, CMD-resistant stem cuttings (such as TMS 98/0505 or TMS 98/0581). Actively control whitefly vectors and immediately uproot/burn any plants showing leaf distortion, mosaic yellowing, or crinkling.",
      soil: "Cassava grows best in well-drained loamy or sandy soils. To maximize starch yield, implement deep tillage (30cm) to allow tuber expansion and apply potassium-rich fertilizer (NPK 15:15:15 combined with organic mulch) 8 weeks after planting.",
      water: "While drought-tolerant once established, cassava needs steady soil moisture during the first 3-4 months. Use drip irrigation during initial rooting, or thick grass mulching to retain rainfall and reduce water stress."
    },
    yo: {
      disease: "Lati dabobo gbingbin gbaaguda rẹ lọwọ Àrùn Mosaic Gbáàgúdá (CMD), gbin awọn igi rogo to ni lile ati aabo si arun (bii TMS 98/0505). Ge kuro ki o si sun eyikeyi eweko to ba fihan abawọn tabi kika mọra.",
      soil: "Gbáàgúdá n dagba daradara ni ilẹ ti o n fa omi mu laisi isun. Lati ni starch to pọ julọ, rọ ilẹ jinna (30cm) ki o lo ajile ti o lẹkun potassium (NPK 15:15:15) ni ọsẹ mẹjọ lẹhin gbingbin.",
      water: "Bi o tilẹ jẹ pe gbáàgúdá le gbe lẹhin idagbasoke, o nilo ọrinrin nigbagbogbo ni oṣu mẹta akọkọ. Lo mulching eweko lati mu omi ojo duro ati dinku gbigbẹ."
    },
    ha: {
      disease: "Domin kare amfanin gonar rogonka daga Cutar Rogo (CMD), koyaushe ka shuka rassan rogo masu juriya da cutar (kamar TMS 98/0505). Ka tumbuke sannan ka kona dukkan tsiro da ke nuna alamun lalacewar ganye.",
      soil: "Rogo yana girma da kyau a cikin ƙasa mai albarka da aka huda da kyau. Domin samun ingantaccen dankalin rogo, ka noma ƙasa mai zurfi (30cm) sannan kayi amfani da taki mai dauke da potassium (NPK 15:15:15) bayan makonni 8 da shuka.",
      water: "Kodayake rogo yana da juriya da fari kusa da girma, yana buƙatar danshi a cikin watanni 3 na farko. Yi amfani da mulching (ciyawa) domin riƙe ruwa a cikin ƙasa."
    },
    ig: {
      disease: "Iji chebe akpụ gị pụọ na Ọrịa Mosaic Akpụ (CMD), kụọ osisi akpụ ndị na-eguzogide CMD mgbe niile (dịka TMS 98/0505). Hichapụ ma gbaa ọkụ ihe ọkụkụ ọ bụla na-egosi akara ọrịa ugbua.",
      soil: "Akpụ na-eto nke ọma n'ala tụpụrụ mmiri nke ọma. Iji nweta ọtụtụ starch, kọọ ala miri emi (30cm) ma tinye fatịlaịza nwere potassium (NPK 15:15:15) izu 8 gachara ụbọchị ị kụrụ ya.",
      water: "Ọ bụ ezie na akpụ na-eguzogide ọkọchị, ọ chọrọ mmiri mmiri mgbe niile n'ime ọnwa 3 mbụ. Jiri ahịhịa kpuchie ala ka mmiri na-ezo ghara ịka nká ọsọ ọsọ."
    }
  };

  const currentResponse = demoResponses[demoLanguage][demoTopic];

  return (
    <div id="landing-container" className="min-h-screen bg-slate-900 text-slate-100 overflow-x-hidden font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Header/Navigation */}
      <header id="landing-header" className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="CassavaDoctor Logo" className="w-10 h-10 object-contain hover:scale-105 transition-transform duration-300" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              CassavaVision AI
            </span>
          </div>

          {/* Center navigation items for premium desktop display */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Core Features</a>
            <a href="#interactive-demo" className="hover:text-emerald-400 transition-colors">AI Advisor Demo</a>
            <a href="#statistics" className="hover:text-emerald-400 transition-colors">Platform Numbers</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">Resources & FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Native Language Select Portal */}
            <div className="relative group">
              <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors">
                <Globe size={14} className="text-emerald-500" />
                <span>{navLanguages.find(l => l.code === language)?.label}</span>
              </button>
              <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                {navLanguages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between hover:bg-slate-800 transition-colors ${language === lang.code ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300'}`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-[10px] opacity-75">{lang.flag}</span>
                  </button>
                ))}
              </div>
            </div>

            <Link 
              id="header-login-btn"
              to="/login"
              className="text-sm font-bold text-slate-300 hover:text-white px-4 py-2 transition-colors duration-200"
            >
              Sign In
            </Link>
            
            <Link 
              id="header-signup-btn"
              to="/register"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-4.5 py-2.5 rounded-xl shadow-lg border border-emerald-500/30 hover:shadow-emerald-500/20 hover:scale-[1.03] transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Panoramic Hero Section */}
      <section id="landing-hero" className="relative px-6 py-20 lg:py-32 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Soft background ambient glow vectors */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/35 px-4.5 py-1.5 rounded-full text-xs font-semibold text-emerald-400 mb-8 tracking-wide uppercase shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sovereign Command Console for Cassava Growers
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
            Empowering Cassava Agriculture <br />
            With <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">Precision AI Platforms</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            AgriVision AI powers the complete cultivation cycle. Leverage advanced satellite NDVI indices, smartphone holographic disease scanning, automated smart greenhouse triggers, and predictive yield analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 mb-16">
            <Link
              id="hero-cta-signup"
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-8 py-4.5 rounded-2xl shadow-xl shadow-emerald-950/40 hover:scale-[1.03] transition-all duration-300"
            >
              Configure Live Dashboard
              <ArrowRight size={20} />
            </Link>
            
            <Link
              id="hero-cta-login"
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/70 text-slate-300 hover:text-white font-bold px-8 py-4.5 rounded-2xl hover:scale-[1.03] transition-all duration-300"
            >
              Sign In to Console
            </Link>
          </div>
        </div>

        {/* Floating dashboard visual collage preview */}
        <div className="w-full max-w-5xl mx-auto px-4 mt-8 relative rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/40 p-4">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl shadow-slate-950/60 border border-slate-800/60">
            <img 
              src={ndviImage} 
              alt="Geospatial Mapping Visualization" 
              className="w-full h-full object-cover brightness-[0.8] hover:scale-105 transition-transform duration-[8000ms] ease-out" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
            
            {/* Live mockup details */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-left">
              <div className="bg-slate-900/90 backdrop-blur p-4 rounded-2xl border border-slate-800 text-xs shadow-xl flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <div className="font-bold text-slate-200">Interactive OpenWeatherMap Geospatial Overlay</div>
                  <div className="text-slate-400 mt-0.5">Automated sector tracking with continuous real-time multi-spectral scanning</div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="bg-slate-900/90 text-slate-400 px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-semibold tracking-wider uppercase font-mono">
                  Ibadan, Nigeria Fallback
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-[10px] font-bold tracking-wider uppercase font-mono">
                  Satelite Sync: Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Highlight Features Section */}
      <section id="features" className="px-6 py-24 bg-slate-950 border-y border-slate-800/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-3">Enterprise Capabilities</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Innovative Cassava Monitoring</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
              Unlock maximum harvest potential. AgriVision AI bridges traditional farming with computer vision, telemetry sensors, and high-fidelity agricultural modeling.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Feature 1: Crop Yield Forecasting */}
            <div id="feature-forecasting" className="group rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 hover:border-emerald-500/30 transition-all duration-300 flex flex-col gap-6">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                <img 
                  src={yieldImage} 
                  alt="Crop Yield Forecasting HUD" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-emerald-950/90 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold font-mono">
                  AI Yield Estimation
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100">{t('crop_yield_forecasting') || 'Crop Yield Forecasting'}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Plan harvests with complete clarity. Our AI multi-spectral systems forecast starch ratios, organic root development, biomass indexes, and predicted yield tons based on weather signals.
                </p>
                <div className="flex items-center gap-4 mt-6 text-xs text-amber-400/90 font-mono">
                  <span className="flex items-center gap-1"><CheckCircle size={12} /> Starch Yield Projections</span>
                  <span className="flex items-center gap-1"><CheckCircle size={12} /> Biomass Mapping</span>
                </div>
              </div>
            </div>

            {/* Feature 2: Field Surveillance & NDVI mapping */}
            <div id="feature-ndvi" className="group rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 hover:border-emerald-500/30 transition-all duration-300 flex flex-col gap-6">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                <img 
                  src={ndviImage} 
                  alt="High-fidelity NDVI imagery representation" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-emerald-950/90 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold font-mono">
                  Geospatial Canopy Analysis
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Map size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100">{t('field_surveillance_ndvi') || 'Field Surveillance & NDVI'}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Monitor water stresses and canopy cover seamlessly. Visualize NDVI overlays and plant vigor states to pin-point water shortage zones across agricultural plots early.
                </p>
                <div className="flex items-center gap-4 mt-6 text-xs text-emerald-400/90 font-mono">
                  <span className="flex items-center gap-1"><CheckCircle size={12} /> Moisture Deficiency Overlay</span>
                  <span className="flex items-center gap-1"><CheckCircle size={12} /> Live Satellite Tracking</span>
                </div>
              </div>
            </div>

            {/* Feature 3: Cassava Leaf Disease Scanning */}
            <div id="feature-scanning" className="group rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 hover:border-emerald-500/30 transition-all duration-300 flex flex-col gap-6">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                <img 
                  src={scanImage} 
                  alt="Digital leaf diagnostics model" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-rose-950/90 border border-rose-500/30 text-rose-400 px-3 py-1 rounded-full text-xs font-bold font-mono">
                  Holographic Scanning Target
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                    <Smartphone size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100">{t('cassava_disease_scanning') || 'Cassava Disease Scanning'}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Stop infections before they spread. Use the AI Leaf Doctor to diagnose Mosaic Disease (CMD), Leaf Spot, and Bacterial Blight directly from any mobile camera link.
                </p>
                <div className="flex items-center gap-4 mt-6 text-xs text-rose-400/90 font-mono">
                  <span className="flex items-center gap-1"><CheckCircle size={12} /> 98.4% Diagnostic Confidence</span>
                  <span className="flex items-center gap-1"><CheckCircle size={12} /> Real-time Leaf Recognition</span>
                </div>
              </div>
            </div>

            {/* Feature 4: Greenhouse Climate Control */}
            <div id="feature-greenhouse" className="group rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 hover:border-emerald-500/30 transition-all duration-300 flex flex-col gap-6">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                <img 
                  src={greenhouseImage} 
                  alt="Precision greenhouse sensors visual representation" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-teal-950/90 border border-teal-500/30 text-teal-400 px-3 py-1 rounded-full text-xs font-bold font-mono">
                  Smart Mist Enclosures
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                    <Droplet size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100">{t('greenhouse_climate_control') || 'Greenhouse Climate Control'}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Create the ultimate environment for stem nursery cutting trials. Track air humilities, automated mist hydration, and heat offsets from integrated telemetry dashboard alerts.
                </p>
                <div className="flex items-center gap-4 mt-6 text-xs text-teal-400/90 font-mono">
                  <span className="flex items-center gap-1"><CheckCircle size={12} /> Automated Mist Hydration</span>
                  <span className="flex items-center gap-1"><CheckCircle size={12} /> 24/7 Sensor Telemetry Grid</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. AI Advisor Multilingual Interactive Demonstration */}
      <section id="interactive-demo" className="px-6 py-24 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800/45">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-3">Multilingual Capabilities</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Interactive AI Advisor Sandbox</h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Cassava Doctor supports localized multi-dialect interfaces. Test how the AI Advisor assists you in English, Yoruba, Hausa, or Igbo native tongues.
            </p>
          </div>

          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Control Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Sandbox Language</span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {navLanguages.map(item => (
                    <button
                      key={item.code}
                      onClick={() => setDemoLanguage(item.code)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-xs font-bold transition-all ${demoLanguage === item.code ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                      <span>{item.flag}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Choose Advisor Advice Topic</span>
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={() => setDemoTopic('disease')}
                    className={`text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${demoTopic === 'disease' ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    <span>Disease Prevention & Antidote</span>
                    <ChevronRight size={14} />
                  </button>
                  <button
                    onClick={() => setDemoTopic('soil')}
                    className={`text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${demoTopic === 'soil' ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    <span>Optimal Soil Type & Nutrients</span>
                    <ChevronRight size={14} />
                  </button>
                  <button
                    onClick={() => setDemoTopic('water')}
                    className={`text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${demoTopic === 'water' ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    <span>Irrigation Schedules & Hydration</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Chat Interface Column */}
            <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold tracking-wider text-slate-400 uppercase font-mono">AI Advisor Interactive Sandbox</span>
                </div>
                <div className="bg-slate-800 px-2 py-1 rounded-md text-[10px] font-mono text-slate-500">
                  Model: GEMINI-PRO
                </div>
              </div>

              <div className="space-y-4 min-h-[190px] flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-3 text-left">
                    <div className="h-8 w-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 border border-slate-700">
                      <Search size={14} />
                    </div>
                    <div className="bg-slate-800/80 px-4 py-2.5 rounded-2xl rounded-tl-none border border-slate-700 text-xs font-semibold text-slate-300">
                      {demoTopic === 'disease' && "How do I diagnose and prevent Cassava Mosaic Disease?"}
                      {demoTopic === 'soil' && "Which soil properties provide the highest cassava root starch outputs?"}
                      {demoTopic === 'water' && "How should I structure irrigation frequencies during planting?"}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mt-4 text-left">
                    <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20">
                      <Bot size={14} />
                    </div>
                    <div className="bg-emerald-950/20 px-4 py-3 rounded-2xl rounded-tl-none border border-emerald-500/20 text-xs leading-relaxed text-slate-300">
                      {currentResponse}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between mt-6">
                  <span className="text-[11px] text-slate-500 font-mono">Interactive Demo Sandbox • Real console features expanded multi-turn dialogue.</span>
                  <Link 
                    to="/register" 
                    className="text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    Open Live Advisor
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Statistics Section */}
      <section id="statistics" className="px-6 py-20 bg-slate-900 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center text-center">
          <div className="p-4">
            <h4 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">98.4%</h4>
            <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest leading-none">Diagnostic Accuracy</span>
          </div>
          <div className="p-4">
            <h4 className="text-4xl sm:text-5xl font-extrabold text-emerald-400 mb-2">15,000+</h4>
            <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest leading-none">Registered Smallholders</span>
          </div>
          <div className="p-4">
            <h4 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">40%+</h4>
            <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest leading-none">Average Yield Expansion</span>
          </div>
          <div className="p-4">
            <h4 className="text-4xl sm:text-5xl font-extrabold text-teal-400 mb-2">Real-time</h4>
            <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest leading-none">NDVI Index Maps</span>
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion Section */}
      <section id="faq" className="px-6 py-24 bg-slate-950 border-t border-slate-800/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-3">Common Inquiries</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-sm">Have queries about deploying the agricultural platform? Here are clear responses.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does the AI disease scanner process cassava leaf files?",
                a: "Our system implements Computer Vision. Once you capture progress photos of affected cassava crops on your field, clicking Analyze Leaf Health matches leaves against localized visual models to flag Mosaic disease, bacterial streaks, or health deficits."
              },
              {
                q: "What regions or coordinates does the map support?",
                a: "The interactive geospatial section uses Google Maps infrastructure alongside fallback models. For test accounts, it places simulated highly accurate markers near major cassava fields in Ibadan, Nigeria, while supporting custom manual pins globally."
              },
              {
                q: "Are Hausa, Yoruba, and Igbo systems complete?",
                a: "Yes. AgriVision AI is designed specifically for Nigerian agricultural ecosystems. Every telemetry dashboard metric, alert popup, advisory answer, and settings field instantly translates across English and major native Nigerian languages in one click."
              },
              {
                q: "Can I use the console offline or in deep rural blocks?",
                a: "Our core platform has structured client-side sync persistence that keeps offline cache logs. Data updates automatically when you return from rural fields back to steady edge connectivity links."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition-colors hover:border-slate-700/60"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full flex items-center justify-between text-left font-semibold text-white text-sm sm:text-base"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle size={18} className="text-emerald-400 shrink-0" />
                    {faq.q}
                  </span>
                  <span className="text-slate-500 text-xl font-bold font-mono ml-4">
                    {activeFaq === index ? "−" : "+"}
                  </span>
                </button>
                {activeFaq === index && (
                  <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed pl-7 border-l border-emerald-500/20">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA Section */}
      <section id="bottom-cta" className="px-6 py-24 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-950 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <Leaf size={48} className="text-emerald-400 mx-auto mb-6 hover:rotate-12 transition-transform duration-300" />
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Boost Your Harvest Yields Today</h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Create an organic enterprise command profile and optimize nutrient dispersion across your plots in a unified platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              id="cta-bottom-signup"
              to="/register"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg border border-emerald-500/30 transition-all duration-200"
            >
              Sign Up For Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Elegant Footer */}
      <footer id="landing-footer" className="bg-slate-950 border-t border-slate-900 py-12 px-6 text-xs text-slate-550 text-slate-500 text-center sm:text-left">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-4">
              <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
              <span className="font-semibold text-white tracking-tight text-sm">CassavaVision AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-4">
              Pioneering deep learning solutions and multi-spectral telemetry for cassava smart farmlands across Nigeria.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-4 text-xs">Features</h5>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#features" className="hover:text-white transition-colors">NDVI Sentinel Imaging</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Computer Vision Diagnosis</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Mist-Humidity Regulations</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Starch Predictor Analytics</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-4 text-xs">Interactive Portals</h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/login" className="hover:text-white transition-colors">Grower Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">New Grower Registry</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Enterprise Sandbox Console</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-4 text-xs">Supported Dialects</h5>
            <ul className="space-y-2 text-slate-400">
              <li>English Language</li>
              <li>Yoruba Dialect (Èdè Yorùbá)</li>
              <li>Hausa Tongue (Harshen Hausa)</li>
              <li>Igbo Vernacular (Asụsụ Igbo)</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-550 text-slate-500">
          <p>© 2026 CassavaVision AI. Crafted for global smart agriculture. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Security Policy</a>
            <a href="#" className="hover:text-white transition-colors">SLA Agreements</a>
            <a href="#" className="hover:text-white transition-colors">GCP Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
