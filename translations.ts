export type Language = 'en' | 'ha' | 'yo' | 'ig';

export interface TranslationKeys {
  app_name: string;
  welcome: string;
  updated: string;
  nav_overview: string;
  nav_dashboard: string;
  nav_crops: string;
  nav_advisor: string;
  nav_about: string;
  nav_blog: string;
  nav_settings: string;
  nav_map: string;
  farm_overview: string;
  weather_humidity: string;
  weather_wind: string;
  weather_rain: string;
  weather_soil_moisture: string;
  stat_yield: string;
  stat_alerts: string;
  stat_moisture: string;
  stat_cassava_scans: string;
  priority_alerts: string;
  view_all: string;
  crop_monitoring: string;
  crop_subtitle: string;
  export_csv: string;
  drone_map: string;
  ndvi_config: string;
  my_fields: string;
  ai_doctor: string;
  upload_instruction: string;
  analyze_btn: string;
  download_report: string;
  growth_trends: string;
  insights_title: string;
  insight_ndvi_ndre: string;
  insight_growth_stage: string;
  insight_water_stress: string;
  insight_pest_disease: string;
  insight_thermal_stress: string;
  insight_nutrients: string;
  insight_yield: string;
  insight_weed: string;
  insight_canopy: string;
  insight_historical: string;
  label_ndre: string;
  label_vari: string;
  label_nitrogen: string;
  label_phosphorus: string;
  label_potassium: string;
  label_pest_pressure: string;
  label_disease_risk: string;
  label_weed_density: string;
  label_canopy_cover: string;
  label_forecast: string;
  settings_theme: string;
  theme_light: string;
  theme_dark: string;
  theme_dark_blue: string;
  theme_dark_black: string;
  theme_dark_green: string;
  theme_system: string;
  healthy: string;
  warning: string;
  critical: string;
  confidence: string;
  unknown: string;
  dismiss: string;
  undo: string;
  history_reports: string;
  generate_field_report: string;
  no_reports: string;
  view_report: string;
  delete_report: string;
  report_type_analysis: string;
  report_type_field: string;
  
  // Login & Register Page keys
  login_welcome_back: string;
  login_subtitle: string;
  login_email: string;
  login_password: string;
  login_btn: string;
  login_no_account: string;
  login_register_now: string;
  register_title: string;
  register_subtitle: string;
  register_name: string;
  register_phone: string;
  register_confirm_password: string;
  register_role: string;
  register_role_farmer: string;
  register_role_admin: string;
  register_role_super_admin: string;
  register_btn: string;
  register_have_account: string;
  register_login_now: string;
  alert_water_stress: string;
  alert_mosaic: string;
  alert_drone_battery: string;
  dashboard_welcome_subtitle: string;
  tf_7d: string;
  tf_30d: string;
  tf_month: string;
  tf_year: string;
  stat_total_area: string;
  stat_active_drones: string;
  stat_crop_health: string;
  stat_team_members: string;
  field_surveillance_ndvi: string;
  view_map: string;
  optimal_health: string;
  action_required: string;
  field_ndvi_insight: string;
  cassava_disease_scanning: string;
  continuous_tracking_leaves: string;
  automated_drone_fleet: string;
  drone_active: string;
  drone_mapping_sector: string;
  greenhouse_climate_control: string;
  adjust_settings: string;
  greenhouse_insight_para: string;
  soil_moisture_dynamics: string;
  sensor_grid_alpha: string;
  ideal_moisture_retained: string;
  autonomous_harvesters: string;
  efficiency_label: string;
  harvester_fleet_coordination: string;
  crop_yield_forecasting: string;
  ai_driven_yield_forecast: string;
  weather_forecast_card: string;
  view_all_alerts: string;
  quick_actions: string;
  launch_drone_scan: string;
  generate_report_btn: string;
  resource_consumption: string;
  water_storage: string;
  solar_energy_grid: string;
  fertilizer_silos: string;
  restock_recommended: string;
  live_operations: string;
  in_progress_label: string;
  upcoming_label: string;
  scheduled_label: string;
  sector_4_irrigation: string;
  automated_drip_running: string;
  soil_sampling_drone: string;
  preflight_checks_completed: string;
  cassava_irrigation_action: string;
  automated_drip_sector_a: string;
  eco_efficiency_rating: string;
  eco_excellent: string;
  carbon_offset: string;
  water_recycled: string;
  active_dispatch_logs: string;
  outgoing_organic_cassava: string;
  fleet_en_route: string;
  incoming_bio_fertilizer: string;
  supplier_delivery_expected: string;
  view_logistics_map: string;
}

const enTranslations: TranslationKeys = {
    app_name: "CassavaVision AI",
    welcome: "Welcome back, {name}",
    updated: "Updated",
    
    // Navigation
    nav_overview: "Overview",
    nav_dashboard: "Dashboard",
    nav_crops: "Cassava Monitor",
    nav_advisor: "AI Advisor",
    nav_about: "About Us",
    nav_blog: "Blog",
    nav_settings: "Settings",
    nav_map: "Geospatial Tracker",

    // Overview
    farm_overview: "Farm Overview",
    weather_humidity: "Humidity",
    weather_wind: "Wind",
    weather_rain: "Rain",
    weather_soil_moisture: "Soil Moisture",
    stat_yield: "Total Yield Prediction",
    stat_alerts: "Active Alerts",
    stat_moisture: "Soil Moisture Avg",
    stat_cassava_scans: "Total Cassava Scans",
    priority_alerts: "Priority Alerts",
    view_all: "View All",

    // Crops
    crop_monitoring: "Cassava Monitoring",
    crop_subtitle: "Real-time surveillance & vegetation analytics",
    export_csv: "Export Data (CSV)",
    drone_map: "Drone Field Map Analysis",
    ndvi_config: "NDVI Configuration",
    my_fields: "My Fields",
    ai_doctor: "AI Cassava Doctor (Single Leaf)",
    upload_instruction: "Upload cassava leaf or field image",
    analyze_btn: "Analyze Leaf Health",
    download_report: "Download PDF Report",
    growth_trends: "NDVI Growth Trends",
    
    // Crop Insights
    insights_title: "Cassava Monitoring – Key Insights & Reports",
    insight_ndvi_ndre: "NDVI/NDRE/VARI Index Maps",
    insight_growth_stage: "Growth Stage Analysis",
    insight_water_stress: "Water Stress Detection",
    insight_pest_disease: "Disease & Pest Infestation",
    insight_thermal_stress: "Thermal Stress Mapping",
    insight_nutrients: "Nutrient Deficiency Analysis",
    insight_yield: "Yield Estimation & Forecasting",
    insight_weed: "Weed Mapping",
    insight_canopy: "Canopy Cover Analysis",
    insight_historical: "Historical Health Comparison",
    
    label_ndre: "NDRE",
    label_vari: "VARI",
    label_nitrogen: "Nitrogen",
    label_phosphorus: "Phosphorus",
    label_potassium: "Potassium",
    label_pest_pressure: "Pest Pressure",
    label_disease_risk: "Disease Risk",
    label_weed_density: "Weed Density",
    label_canopy_cover: "Canopy Cover",
    label_forecast: "Forecast",
    
    // Settings
    settings_theme: "App Theme",
    theme_light: "Light Mode",
    theme_dark: "Dark Mode",
    theme_dark_blue: "Dark Blue",
    theme_dark_black: "Dark Mode",
    theme_dark_green: "Dark Green",
    theme_system: "System Default",
    
    // Common
    healthy: "Healthy",
    warning: "Warning",
    critical: "Critical",
    confidence: "Conf.",
    unknown: "Unknown",
    dismiss: "Dismiss",
    undo: "Undo",
    history_reports: "Historical Reports & Comparison",
    generate_field_report: "Generate Full Field Report",
    no_reports: "No historical reports found.",
    view_report: "View",
    delete_report: "Delete",
    report_type_analysis: "AI Analysis",
    report_type_field: "Field Summary",

    // Login & Register
    login_welcome_back: "Welcome Back",
    login_subtitle: "Sign in to your Cassava Doctor command center.",
    login_email: "Email Address",
    login_password: "Password",
    login_btn: "Sign In",
    login_no_account: "Don't have an account?",
    login_register_now: "Register now",
    register_title: "Create Account",
    register_subtitle: "Join the Cassava Doctor farming community.",
    register_name: "Full Name",
    register_phone: "Phone Number",
    register_confirm_password: "Confirm Password",
    register_role: "Join As",
    register_role_farmer: "Farmer",
    register_role_admin: "Admin",
    register_role_super_admin: "Super Admin",
    register_btn: "Register",
    register_have_account: "Already have an account?",
    register_login_now: "Login here",
    alert_water_stress: "Water Stress Detected",
    alert_mosaic: "Cassava Mosaic Detected",
    alert_drone_battery: "Low Battery - Drone 04",
    dashboard_welcome_subtitle: "Welcome back to your agricultural command center.",
    tf_7d: "Last 7 Days",
    tf_30d: "Last 30 Days",
    tf_month: "This Month",
    tf_year: "This Year",
    stat_total_area: "Total Area",
    stat_active_drones: "Active Drones",
    stat_crop_health: "Crop Health",
    stat_team_members: "Team Members",
    field_surveillance_ndvi: "Field Surveillance & NDVI",
    view_map: "View Map",
    optimal_health: "Optimal Health",
    action_required: "Action Required",
    field_ndvi_insight: "Current NDVI analysis shows 85% of the cassava fields are in the optimal growth stage. Minor nitrogen deficiency detected in Sector B-4.",
    cassava_disease_scanning: "Cassava Disease Scanning",
    continuous_tracking_leaves: "Continuous tracking of leaf health and mosaic symptoms. 124 leaves analyzed.",
    automated_drone_fleet: "Automated Drone Fleet",
    drone_active: "Drone 04 Active",
    drone_mapping_sector: "Currently mapping topography and crop health in Sector C.",
    greenhouse_climate_control: "Greenhouse Climate Control",
    adjust_settings: "Adjust Settings",
    greenhouse_insight_para: "Micro-climate analysis shows ideal conditions for premium crops. Maintaining current parameters will accelerate the flowering phase by an estimated 2 days.",
    soil_moisture_dynamics: "Soil Moisture Dynamics",
    sensor_grid_alpha: "Sensor Grid Alpha",
    ideal_moisture_retained: "Ideal moisture retained in deep root zones.",
    autonomous_harvesters: "Autonomous Harvesters",
    efficiency_label: "Efficiency",
    harvester_fleet_coordination: "Fleet coordination active in northern cassava fields. Estimated completion in 3 hours.",
    crop_yield_forecasting: "Crop Yield Forecasting",
    ai_driven_yield_forecast: "AI-driven multi-spectral forecast predicting an overall yield increase based on optimal meteorological data and current soil health.",
    weather_forecast_card: "Weather Forecast",
    view_all_alerts: "View All Alerts",
    quick_actions: "Quick Actions",
    launch_drone_scan: "Launch Drone Scan",
    generate_report_btn: "Generate Report",
    resource_consumption: "Resource Consumption",
    water_storage: "Water Storage",
    solar_energy_grid: "Solar Energy Grid",
    fertilizer_silos: "Fertilizer Silos",
    restock_recommended: "Restock recommended in 4 days.",
    live_operations: "Live Operations",
    in_progress_label: "IN PROGRESS",
    upcoming_label: "UPCOMING",
    scheduled_label: "SCHEDULED",
    sector_4_irrigation: "Sector 4 Irrigation",
    automated_drip_running: "Automated drip system running for remaining 2 hours.",
    soil_sampling_drone: "Soil Sampling Drone",
    preflight_checks_completed: "Pre-flight checks completed. Awaiting schedule.",
    cassava_irrigation_action: "Cassava Irrigation",
    automated_drip_sector_a: "Automated drip system scheduling for Sector A.",
    eco_efficiency_rating: "Eco-Efficiency Rating",
    eco_excellent: "Excellent",
    carbon_offset: "Carbon Offset",
    water_recycled: "Water Recycled",
    active_dispatch_logs: "Active Dispatch Logs",
    outgoing_organic_cassava: "Outgoing: Organic Cassava",
    fleet_en_route: "Fleet 04 • En route to distribution center (ETA 45m)",
    incoming_bio_fertilizer: "Incoming: Bio-Fertilizer",
    supplier_delivery_expected: "Supplier delivery expected at 14:30 today.",
    view_logistics_map: "View Full Logistics Map"
};

const yoTranslations: TranslationKeys = {
    app_name: "CassavaVision AI",
    welcome: "Káàbọ̀ padà, {name}",
    updated: "Imudojuiwọn",
    
    // Navigation
    nav_overview: "Akopọ Gbogbogboo",
    nav_dashboard: "Atẹ Alaye (Dashboard)",
    nav_crops: "Abojuto Gbáàgúdá",
    nav_advisor: "OludaRanran AI",
    nav_about: "Nipa Wa",
    nav_blog: "Blog",
    nav_settings: "Ètò",
    nav_map: "Maapu Oko",

    // Overview
    farm_overview: "Atunwo Oko",
    weather_humidity: "Saturara Oju-ọjọ",
    weather_wind: "Afẹfẹ",
    weather_rain: "Òjò",
    weather_soil_moisture: "Ọrinrin Ilẹ-alẹ",
    stat_yield: "Asọtẹlẹ Gbogbo Ikore",
    stat_alerts: "Ikilo Ti O Nṣiṣẹ",
    stat_moisture: "Aropọ Ọrinrin Ilẹ",
    stat_cassava_scans: "Gbogbo Ṣíṣe ayẹwo Gbáàgúdá",
    priority_alerts: "Awọn Ikilo Pataki",
    view_all: "Wo Gbogbo rẹ̀",

    // Crops
    crop_monitoring: "Abojuto Gbingbin Gbáàgúdá",
    crop_subtitle: "Abojuto akoko-gidi fun ilera eweko",
    export_csv: "Firanṣẹ Data (CSV)",
    drone_map: "Ayẹwo Taswirar Oko Nipa Drone",
    ndvi_config: "Ètò NDVI",
    my_fields: "Awọn Oko Mi",
    ai_doctor: "AI Dokita Gbáàgúdá (Ewe Kan)",
    upload_instruction: "Gbe ewe gbáàgúdá tabi aworan oko soke",
    analyze_btn: "Ṣe Ayẹwo Ilera Ewe",
    download_report: "Gba Iroyin PDF",
    growth_trends: "Bi NDVI Ṣe N Dagba",
    
    // Crop Insights
    insights_title: "Abojuto Gbáàgúdá – Awọn Iroyin Pataki & Atupale",
    insight_ndvi_ndre: "Maapu Atọka NDVI/NDRE/VARI",
    insight_growth_stage: "Atupale Ipele Idagbasoke",
    insight_water_stress: "Wiwa Kò Tó Omi",
    insight_pest_disease: "Àrùn & Idalẹnu Kokoro",
    insight_thermal_stress: "Maapu Ipa Gbigbona",
    insight_nutrients: "Atupale Àìtó Oúnjẹ Ilẹ̀",
    insight_yield: "Asọtẹlẹ & Iṣiro Ikore",
    insight_weed: "Maapu Àwọn Egbò (Weeds)",
    insight_canopy: "Atupale Iboju Awọn Ewe",
    insight_historical: "Ife we ilera ti igba atijọ",
    
    label_ndre: "NDRE",
    label_vari: "VARI",
    label_nitrogen: "Kẹmika Nitrogen",
    label_phosphorus: "Kẹmika Phosphorus",
    label_potassium: "Kẹmika Potassium",
    label_pest_pressure: "Ipa Kokoro",
    label_disease_risk: "Èwu Àrùn",
    label_weed_density: "Yíya Àwọn Egbò",
    label_canopy_cover: "Iboju Awọn Ewe",
    label_forecast: "Asọtẹlẹ",
    
    // Settings
    settings_theme: "Àwọ̀ Manhaja",
    theme_light: "Ipo Imọlẹ",
    theme_dark: "Ipo Okunkun",
    theme_dark_blue: "Awo Buluu Duhu",
    theme_dark_black: "Ipo Okunkun Dudu",
    theme_dark_green: "Awo Alawọ-ewe Duhu",
    theme_system: "Ètò Kọmputa",
    
    // Common
    healthy: "Ni Ilera",
    warning: "Ikilo",
    critical: "Lekoko",
    confidence: "Igbekele",
    unknown: "Aimọ",
    dismiss: "Wagbọ",
    undo: "Mupadà",
    history_reports: "Iroyin Atijọ & Ofurufu Ifiwera",
    generate_field_report: "Ṣẹda Gbogbo Iroyin Oko",
    no_reports: "Kò sí iroyin àtijọ́ kankan.",
    view_report: "Wo Iroyin",
    delete_report: "Gba Parẹ",
    report_type_analysis: "Atupale AI",
    report_type_field: "Akopọ Oko",

    // Login & Register
    login_welcome_back: "Káàbọ̀ Padà",
    login_subtitle: "Wọlé si Cassava Doctor rẹ lati bẹrẹ.",
    login_email: "Adirẹsi Imeeli",
    login_password: "Ọrọigbaniwọle",
    login_btn: "Wọlé",
    login_no_account: "Ṣe o ko ni akọọlẹ?",
    login_register_now: "Forukọsilẹ bayi",
    register_title: "Ṣẹda Akọọlẹ Tuntun",
    register_subtitle: "Darapọ mọ agbegbe agbe Cassava Doctor.",
    register_name: "Orukọ Kikun",
    register_phone: "Nọmba Tẹlifoonu",
    register_confirm_password: "Fidi Ọrọigbaniwọle Mule",
    register_role: "Darapọ mọ Gẹgẹbi",
    register_role_farmer: "Agbe",
    register_role_admin: "Alabojuto (Admin)",
    register_role_super_admin: "Alabojuto Agba",
    register_btn: "Forukọsilẹ",
    register_have_account: "Ṣe o ti ni akọọlẹ tẹlẹ?",
    register_login_now: "Wọlé si ibi",
    alert_water_stress: "Kò Tó Omi Ti A Rí",
    alert_mosaic: "Àrùn Mosaic Gbáàgúdá Ti A Rí",
    alert_drone_battery: "Batiri Kù - Drone 04",
    dashboard_welcome_subtitle: "Káàbọ̀ padà sí ibùdó àṣẹ oko rẹ.",
    tf_7d: "Ọjọ́ 7 Sẹ́yìn",
    tf_30d: "Ọjọ́ 30 Sẹ́yìn",
    tf_month: "Oṣù Yìí",
    tf_year: "Ọdún Yìí",
    stat_total_area: "Gbogbo Ààyè Oko",
    stat_active_drones: "Awọn Drone Ti O Nṣiṣẹ",
    stat_crop_health: "Ilera Ohun Gbingbin",
    stat_team_members: "Awọn Ọmọ Ẹgbẹ",
    field_surveillance_ndvi: "Abojuto Oko & NDVI",
    view_map: "Wo Maapu",
    optimal_health: "Ilera To Dangajia",
    action_required: "Igbesẹ Nilo",
    field_ndvi_insight: "Atupale NDVI fihan pe 85% ti oko gbaaguda wa ni ipele idagbasoke to dara julọ. Aimọ kẹmika nitrogen diẹ ni Sector B-4.",
    cassava_disease_scanning: "Ṣíṣe ayẹwo Àrùn Gbáàgúdá",
    continuous_tracking_leaves: "Abojuto siwaju ti ilera ewe ati awọn ami àrùn mosaic. Awọn ewe 124 ni a ti rí.",
    automated_drone_fleet: "Ọkọ̀ Ofurufu Drone Aládàáṣiṣẹ́",
    drone_active: "Drone 04 Nṣiṣẹ",
    drone_mapping_sector: "O n ya maapu ati ilera ohun gbingbin ni Sector C lọwọlọwọ.",
    greenhouse_climate_control: "Iṣakoso Oju-ọjọ Ile-Gbingbin (Greenhouse)",
    adjust_settings: "Ṣatunṣe Ètò",
    greenhouse_insight_para: "Atupale oju-ọjọ kekere fihan awọn ipo to dara fun awọn irugbin pataki. Mimu awọn eto lọwọlọwọ yoo mu idagbasoke yara nipasẹ ọjọ meji.",
    soil_moisture_dynamics: "Yiyi Ọrinrin Ilẹ-alẹ",
    sensor_grid_alpha: "Ajọ Oluyẹwo Alpha",
    ideal_moisture_retained: "Ọrinrin to peye wa ni isalẹ gbongbo.",
    autonomous_harvesters: "Awọn Ẹrò Ikore Aládàáṣiṣẹ́",
    efficiency_label: "Agbejade",
    harvester_fleet_coordination: "Iṣọkan ọkọ ayọkẹlẹ nṣiṣẹ ni awọn oko gbaaguda ariwa. Ipari asọtẹlẹ ni awọn wakati 3.",
    crop_yield_forecasting: "Asọtẹlẹ Ikore Ohun Gbingbin",
    ai_driven_yield_forecast: "Asọtẹlẹ oniruuru nipa lilo AI ti n sọ asọtẹlẹ ilosoke ikore lapapọ lori oju-ọjọ ati ilera ilẹ lọwọlọwọ.",
    weather_forecast_card: "Sọtẹlẹ Oju-ọjọ",
    view_all_alerts: "Wo Gbogbo Ikilo",
    quick_actions: "Igbesẹ Kánkán",
    launch_drone_scan: "Bẹrẹ Ṣíṣe ayẹwo Ofurufu",
    generate_report_btn: "Ṣẹda Iroyin",
    resource_consumption: "Lilo Awọn Ohun Alonlo",
    water_storage: "Ibi-itọju Omi",
    solar_energy_grid: "Iná Oòrùn (Solar)",
    fertilizer_silos: "Ibi Ajílẹ̀ (Silos)",
    restock_recommended: "Gba niyanju lati ra diẹ sii ni ọjọ 4.",
    live_operations: "Awọn Iṣẹ Ṣíṣe Lọwọlọwọ",
    in_progress_label: "NṢIṢẸ LỌWỌ...",
    upcoming_label: "TO N BỌ̀",
    scheduled_label: "TI A ṢE ÈTÒ",
    sector_4_irrigation: "Sector 4 Irigeson",
    automated_drip_running: "Eto omi aladaaṣiṣẹ nṣiṣẹ fun wakati 2 ti o ku.",
    soil_sampling_drone: "Drone Oluyẹwo Ilẹ",
    preflight_checks_completed: "Ayẹwo ṣaaju ofurufu ti pari. N duro de akoko.",
    cassava_irrigation_action: "Irigeson Gbáàgúdá",
    automated_drip_sector_a: "Ètò omi aladaaṣiṣẹ fun Sector A.",
    eco_efficiency_rating: "Ipele Iṣẹ-ṣiṣe Ore-Oorun",
    eco_excellent: "Dara Julọ",
    carbon_offset: "Dídín Carbon Kù",
    water_recycled: "Omi Lilo Padà",
    active_dispatch_logs: "Àkọsílẹ Gbigbe Ohun-èlo Lọwọlọwọ",
    outgoing_organic_cassava: "Outgoing: Gbáàgúdá Alágbára",
    fleet_en_route: "Fleet 04 • Gba opopo lọ si ibudo pinpin (iṣẹju 45)",
    incoming_bio_fertilizer: "Incoming: Ajílẹ̀ Alágbára",
    supplier_delivery_expected: "Awọn ti o n mu nkan wa ni a n reti ni 14:30 loni.",
    view_logistics_map: "Wo Gbogbo Maapu Gbigbe Ohun-èlo"
};

const haTranslations: TranslationKeys = {
    app_name: "CassavaVision AI",
    welcome: "Sannu da dawowa, {name}",
    updated: "An sabunta",
    
    // Navigation
    nav_overview: "Bayanin Gabaɗaya",
    nav_dashboard: "Dashboard",
    nav_crops: "Kula da Rogo",
    nav_advisor: "AI Advisor (Mai Ba da Shawara)",
    nav_about: "Game da Mu",
    nav_blog: "Bulog",
    nav_settings: "Saituna",
    nav_map: "Taswirar Gona",

    // Overview
    farm_overview: "Bayanin Gona",
    weather_humidity: "Danshin Ruwa",
    weather_wind: "Iska",
    weather_rain: "Ruwan Sama",
    weather_soil_moisture: "Danshin Ƙasa",
    stat_yield: "Hasashen Jimillar Amfanin Gona",
    stat_alerts: "Faɗakarwa Masu Aiki",
    stat_moisture: "Matsakaicin Danshin Ƙasa",
    stat_cassava_scans: "Jimillar Hotunan Rogo",
    priority_alerts: "Gargaɗi Masu Muhimmanci",
    view_all: "Duba duka",

    // Crops
    crop_monitoring: "Kula da Shuka Rogo",
    crop_subtitle: "Sanya idanu na lokaci-da-lokaci & nazarin tsiro",
    export_csv: "Fitar da Bayanai (CSV)",
    drone_map: "Taswirar Gona da Drone",
    ndvi_config: "Saitin NDVI",
    my_fields: "Gonata",
    ai_doctor: "AI Likitan Rogo (Ganye Guda)",
    upload_instruction: "Tura hoton ganyen rogo ko na gona",
    analyze_btn: "Bincika Lafiyar Ganye",
    download_report: "Sauƙar da Rahoton PDF",
    growth_trends: "Yanayin Girman NDVI",
    
    // Crop Insights
    insights_title: "Kula da Rogo – Muhimman Bayanai & Rahotanni",
    insight_ndvi_ndre: "Taswirar Alamomin NDVI/NDRE/VARI",
    insight_growth_stage: "Nazarin Matakin Girma",
    insight_water_stress: "Gano Rashin Ruwa na Ruwa",
    insight_pest_disease: "Maddarar Cututtuka & Kwaro",
    insight_thermal_stress: "Taswirar Matsalar Zafi",
    insight_nutrients: "Nazarin Karancin Abinci a Ƙasa",
    insight_yield: "Kiyasin Amfanin Gona & Hasashe",
    insight_weed: "Taswirar Ciyawa",
    insight_canopy: "Nazarin Rufin Ganyayyaki",
    insight_historical: "Kwatancen Lafiyar Gona ta Baya",
    
    label_ndre: "NDRE",
    label_vari: "VARI",
    label_nitrogen: "Nitrogen",
    label_phosphorus: "Phosphorus",
    label_potassium: "Potassium",
    label_pest_pressure: "Matsalar Kwari",
    label_disease_risk: "Haɗarin Cuta",
    label_weed_density: "Yawan Ciyawa",
    label_canopy_cover: "Rufin Ganye",
    label_forecast: "Hasashe",
    
    // Settings
    settings_theme: "Jigon Manhaja",
    theme_light: "Yanayin Fari",
    theme_dark: "Yanayin Duhu",
    theme_dark_blue: "Shuɗi Mai Duhu",
    theme_dark_black: "Baki Mai Duhu",
    theme_dark_green: "Kore Mai Duhu",
    theme_system: "Saitin Na'ura",
    
    // Common
    healthy: "Lafiya",
    warning: "Gargaɗi",
    critical: "Mai Tsanani",
    confidence: "Amincewa",
    unknown: "Ba a sani ba",
    dismiss: "Kore",
    undo: "Soke",
    history_reports: "Tsoffin Rahotanni & Kwatantawa",
    generate_field_report: "Samar da Cikakken Rahoton Gona",
    no_reports: "Ba a sami tsoffin rahotanni ba.",
    view_report: "Duba rahoton",
    delete_report: "Goge",
    report_type_analysis: "Nazarin AI",
    report_type_field: "Bayanin Gona",

    // Login & Register
    login_welcome_back: "Sannu da Dawowa",
    login_subtitle: "Shiga cikin cibiyar sarrafa Cassava Doctor ɗin ku.",
    login_email: "Adireshin Imel",
    login_password: "Kalmar Sirri",
    login_btn: "Shiga",
    login_no_account: "Ba ku da asusu?",
    login_register_now: "Rijista yanzu",
    register_title: "Ƙirƙiri Asusun",
    register_subtitle: "Kasance cikin ƙungiyar manoman Cassava Doctor.",
    register_name: "Cikakken Suna",
    register_phone: "Lambar Waya",
    register_confirm_password: "Tabbatar da Kalmar Sirri",
    register_role: "Haɗu A Matsayin",
    register_role_farmer: "Manomi",
    register_role_admin: "Mai Gudanarwa",
    register_role_super_admin: "Babban Mai Gudanarwa",
    register_btn: "Rijista",
    register_have_account: "Kuna da asusu riga?",
    register_login_now: "Shiga nan",
    alert_water_stress: "An Gano Karancin Ruwa",
    alert_mosaic: "An Gano Cutar Rogo",
    alert_drone_battery: "Rage Cajin Baturi - Drone 04",
    dashboard_welcome_subtitle: "Barka da dawowa zuwa cibiyar sarrafa gona.",
    tf_7d: "Kwanaki 7 Da Suka Gabata",
    tf_30d: "Kwanaki 30 Da Suka Gabata",
    tf_month: "Wannan Watan",
    tf_year: "Wannan Shekarar",
    stat_total_area: "Jimillar Fili",
    stat_active_drones: "Drones Masu Aiki",
    stat_crop_health: "Lafiyar Amfanin Gona",
    stat_team_members: "Mambobin Ƙungiyar",
    field_surveillance_ndvi: "Kula da Gona & NDVI",
    view_map: "Duba Taswira",
    optimal_health: "Kyakkyawan Lafiya",
    action_required: "Ana Bukatar Aiki",
    field_ndvi_insight: "Nazarin NDVI na yanzu ya nuna kashi 85% na gonakin rogo suna cikin mafi kyawun girma. An gano ƙarancin nitrogen a Sector B-4.",
    cassava_disease_scanning: "Binciken Cutar Rogo",
    continuous_tracking_leaves: "Ci gaba da lura da lafiyar ganye da alamun cutar mosaic. An bincika ganyayyaki 124.",
    automated_drone_fleet: "Jiragen Drone Masu Sarrafa Kansu",
    drone_active: "Drone 04 Yana Aiki",
    drone_mapping_sector: "A halin yanzu yana yin taswirar ƙasa da lafiyar amfanin gona a Sector C.",
    greenhouse_climate_control: "Sarrafa Yanayin Greenhouse",
    adjust_settings: "Saita Saituna",
    greenhouse_insight_para: "Nazarin yanayi ya nuna kyakkyawan yanayi don amfanin gona mai inganci. Ci gaba da wannan zai hanzarta fure da kimanin kwanaki 2.",
    soil_moisture_dynamics: "Yanayin Danshin Ƙasa",
    sensor_grid_alpha: "Na'urar Sensor Alpha",
    ideal_moisture_retained: "An kiyaye danshi mai kyau a cikin tushen ƙasa.",
    autonomous_harvesters: "Inshunan Girbi Masu Sarrafa Kansu",
    efficiency_label: "Inganci",
    harvester_fleet_coordination: "Tsarin aikin girbi yana aiki a gonakin rogo na arewa. Ana sa ran kammalawa cikin sa'o'i 3.",
    crop_yield_forecasting: "Hasashen Amfanin Gona",
    ai_driven_yield_forecast: "Hasashen AI naasoranta karuwar amfanin gona gabaɗaya dangane da kyawun yanayi da lafiyar ƙasa.",
    weather_forecast_card: "Hasashen Yanayi",
    view_all_alerts: "Duba Duk Gargaɗi",
    quick_actions: "Hanyoyi Masu Sauri",
    launch_drone_scan: "Fara Binciken Drone",
    generate_report_btn: "Samar da Rahoto",
    resource_consumption: "Amfani da Albarkatu",
    water_storage: "Wurin Ajiye Ruwa",
    solar_energy_grid: "Inutar Rana (Solar)",
    fertilizer_silos: "Wurin Taki (Silo)",
    restock_recommended: "Ana ba da shawarar sake cika gaba cikin kwanaki 4.",
    live_operations: "Ayyukan Kai-tsaye",
    in_progress_label: "YANA TAFIYA",
    upcoming_label: "MAI ZUWA",
    scheduled_label: "WANDA AKA TSARA",
    sector_4_irrigation: "Sector 4 Ban Ruwa",
    automated_drip_running: "Tsarin drip na atomatik yana aiki har tsawon sa'o'i 2 masu zuwa.",
    soil_sampling_drone: "Drone Duba Ƙasa",
    preflight_checks_completed: "An gama binciken kafin tashi. Ana jiran lokaci.",
    cassava_irrigation_action: "Ban Ruwan Rogo",
    automated_drip_sector_a: "Tsarin danyen drip don Sector A.",
    eco_efficiency_rating: "Kimar Amfani da Muhalli",
    eco_excellent: "Madalla",
    carbon_offset: "Rage Carbon",
    water_recycled: "Sake Amfani da Ruwa",
    active_dispatch_logs: "Rikodin Ayyukan Sufuri",
    outgoing_organic_cassava: "Outgoing: Amfanin Rogo",
    fleet_en_route: "Fleet 04 • Akan hanyar rarraba kaya (iṣẹju 45)",
    incoming_bio_fertilizer: "Incoming: Taki Bio",
    supplier_delivery_expected: "Ana jiran isar da kaya da karfe 14:30 na yau.",
    view_logistics_map: "Duba Cikakken Taswirar Sufuri"
};

const igTranslations: TranslationKeys = {
    app_name: "CassavaVision AI",
    welcome: "Nnọọ nlaghachi, {name}",
    updated: "Emegharịrị",
    
    // Navigation
    nav_overview: "Nchịkọta Gbogbo",
    nav_dashboard: "Ebe Ọrụ (Dashboard)",
    nav_crops: "Nlekọta Akpụ",
    nav_advisor: "Onye Ndụmọdụ AI",
    nav_about: "Maka Anyị",
    nav_blog: "Blọgụ",
    nav_settings: "Nhazi",
    nav_map: "Ihe Ọgụgụ Map Ugbo",

    // Overview
    farm_overview: "Nchịkọta Ugbo",
    weather_humidity: "Ihu igwe dị Osimiri",
    weather_wind: "Ikuku",
    weather_rain: "Mmiri ozuzo",
    weather_soil_moisture: "Mmiri dị n'ala",
    stat_yield: "Amụma mkpụrụ osisi zuru oke",
    stat_alerts: "Mgbasa ozi na-arụ ọrụ",
    stat_moisture: "Nkezi mmiri dị n'ala",
    stat_cassava_scans: "Nleba anya akpụ niile",
    priority_alerts: "Mgbasa ozi kacha mkpa",
    view_all: "Lee Ha Niile",

    // Crops
    crop_monitoring: "Nlekọta Ịkụ Akpụ",
    crop_subtitle: "Nlekọta oge-gidi & nyocha ahịhịa",
    export_csv: "Kupu data (CSV)",
    drone_map: "Nyocha map ugbo site na Drone",
    ndvi_config: "Nhazi NDVI",
    my_fields: "Ugbo Alị M",
    ai_doctor: "Dọkịta Akpụ AI (Otu Akwụkwọ)",
    upload_instruction: "Bulite akwụkwọ akpụ ma ọ bụ foto ugbo",
    analyze_btn: "Nyochaa ahụike akwụkwọ",
    download_report: "Budata akụkọ PDF",
    growth_trends: "Usoro uto NDVI",
    
    // Crop Insights
    insights_title: "Nlekọta Akpụ – Akụkọ na nghọta ndị bụ isi",
    insight_ndvi_ndre: "Map Ndepụta NDVI/NDRE/VARI",
    insight_growth_stage: "Nyocha Ọkwa Uto",
    insight_water_stress: "Nchọpụta ụkọ mmiri",
    insight_pest_disease: "Ntiwapụ ọrịa & ahụhụ",
    insight_thermal_stress: "Nhazi ebe okpomọkụ dị",
    insight_nutrients: "Nyocha ụkọ nri n'ala",
    insight_yield: "Atụmatụ & amụma mkpụrụ",
    insight_weed: "Nhazi ahịhịa na-abaghị uru",
    insight_canopy: "Nyocha mkpuchi akwụkwọ",
    insight_historical: "Ntụle ahụike ihe mere eme",
    
    label_ndre: "NDRE",
    label_vari: "VARI",
    label_nitrogen: "Naijrogen",
    label_phosphorus: "Fọsforọs",
    label_potassium: "Potasịum",
    label_pest_pressure: "Nchegbu ahụhụ",
    label_disease_risk: "Ihe ize ndụ nke ọrịa",
    label_weed_density: "Ogo ahịhịa na-abaghị uru",
    label_canopy_cover: "Mkpuchi akwụkwọ",
    label_forecast: "Amụma",
    
    // Settings
    settings_theme: "Isiokwu Ngwa",
    theme_light: "Ụdị Onwa",
    theme_dark: "Ụdị Ochichiri",
    theme_dark_blue: "Polu Ochichiri",
    theme_dark_black: "Ochichiri bọọ",
    theme_dark_green: "Ntsu Ochichiri",
    theme_system: "Nhazi Kọmputa",
    
    // Common
    healthy: "Dị mma",
    warning: "Ịdọ aka ná ntị",
    critical: "Dị nro",
    confidence: "Nkwenye",
    unknown: "Amaghị",
    dismiss: "Hapụ",
    undo: "Megharia",
    history_reports: "Akụkọ Ihe Mere Eme & Ntụle",
    generate_field_report: "Mepụta Akụkọ Ugbo Niile",
    no_reports: "Enweghị akụkọ ihe mere eme a hụrụ.",
    view_report: "Lee",
    delete_report: "Hichapụ",
    report_type_analysis: "Nyocha AI",
    report_type_field: "Nchịkọta Ugbo",

    // Login & Register
    login_welcome_back: "Nnọọ nlaghachi",
    login_subtitle: "Banye n'ime ebe nchịkwa Cassava Doctor gị.",
    login_email: "Adreesị ozi-e",
    login_password: "Okwu nzuzo",
    login_btn: "Banye",
    login_no_account: "Ị nweghị akaụntụ?",
    login_register_now: "Debanye aha ugbu a",
    register_title: "Mepụta Akaụntụ",
    register_subtitle: "Soro ndị otu ugbo Cassava Doctor.",
    register_name: "Aha zuru oke",
    register_phone: "Nọmba ekwentị",
    register_confirm_password: "Tabbatar agbakwunyere okwu nzuzo",
    register_role: "Soro Dị Ka",
    register_role_farmer: "Onye Ọrụ Ugbo",
    register_role_admin: "Onye Nchịkwa (Admin)",
    register_role_super_admin: "Onye Nchịkwa Ukwu",
    register_btn: "Debanye aha",
    register_have_account: "Ị nwere akaụntụ ugbua?",
    register_login_now: "Banye ebe a",
    alert_water_stress: "Achọpụtara Ụkọ Mmiri",
    alert_mosaic: "Achọpụtara Mosaic Akpụ",
    alert_drone_battery: "Batrị Dị Ala - Drone 04",
    dashboard_welcome_subtitle: "Nnọọ nlaghachi na ebe nchịkwa ọrụ ugbo gị.",
    tf_7d: "Ụbọchị 7 Gara Aga",
    tf_30d: "Ụbọchị 30 Gara Aga",
    tf_month: "Ọnwa A",
    tf_year: "Afọ A",
    stat_total_area: "Mpaghara Ebe Niile",
    stat_active_drones: "Drones Na-arụ Ọrụ",
    stat_crop_health: "Ahụike Ihe Ọkụkụ",
    stat_team_members: "Ndị Otu Ọrụ",
    field_surveillance_ndvi: "Nlekọta Ubi & NDVI",
    view_map: "Lee Map",
    optimal_health: "Ahụike Kachasị Mma",
    action_required: "Akwụkwọ Akụkọ Dị Mkpa",
    field_ndvi_insight: "Nyocha NDVI ugbu a na-egosi na 85% nke ubi akpụ dị na ọkwa uto kachasị mma. Achọpụtara obere ụkọ nitrogen na Sector B-4.",
    cassava_disease_scanning: "Nyocha Ọrịa Akpụ",
    continuous_tracking_leaves: "Nlekọta na-aga n'ihu nke ahụike akwụkwọ na mgbaàmà mosaic. Yochaa akwụkwọ 124.",
    automated_drone_fleet: "Drones Na-arụ Ọrụ Onwe Ha",
    drone_active: "Drone 04 Na-arụ Ọrụ",
    drone_mapping_sector: "Ugbu a na-ese map na ahụike ihe ọkụkụ na Sector C.",
    greenhouse_climate_control: "Nchịkwa Ihu Igwe Greenhouse",
    adjust_settings: "Nhazi Nhọrọ",
    greenhouse_insight_para: "Nyocha micro-climate na-egosi ọnọdụ dị mma maka ihe ọkụkụ dị elu. Idokwa parameetara ugbu a ga-eme ka oge okooko osisi mee ngwa ngwa site na ụbọchị 2.",
    soil_moisture_dynamics: "Usoro Mmiri Dị N'ala",
    sensor_grid_alpha: "Ihe Nyocha Alpha",
    ideal_moisture_retained: "Idokwa mmiri dị mma n'ime mpaghara mgbọrọgwụ miri emi.",
    autonomous_harvesters: "Ndị Na-ajị Ihe Ọkụkụ Na-arụ Onwe Ha",
    efficiency_label: "Arụmọrụ",
    harvester_fleet_coordination: "Nchikota ụgbọ na-arụ ọrụ na ubi akpụ dị n'ebe ugwu. Atụmatụ mmecha n'ime awa 3.",
    crop_yield_forecasting: "Amụma Mkpụrụ Ihe Ọkụkụ",
    ai_driven_yield_forecast: "Amụma sọftụwia AI na-ebu amụma mmụba mkpụrụ osisi zuru oke dabere na data ihu igwe dị mma na ahụike ala ugbu a.",
    weather_forecast_card: "Amụma Ihu Igwe",
    view_all_alerts: "Lee Mgbasa Ozi Niile",
    quick_actions: "Omume Ndị Dị Mkpa",
    launch_drone_scan: "Malite Nyocha Drone",
    generate_report_btn: "Mepụta Akụkọ",
    resource_consumption: "Ebe E Si Enweta Ihe",
    water_storage: "Ebe Nchekwa Mmiri",
    solar_energy_grid: "Injin Ike Anyanwụ",
    fertilizer_silos: "Ebe Nchekwa Fatịlaịza",
    restock_recommended: "A tụrụ aro ka e weghachi ihe n'ime ụbọchị 4.",
    live_operations: "Ọrụ Na-aga N'ihu",
    in_progress_label: "O NA-AGA N'IHU",
    upcoming_label: "NKE NA-ABỊA NUGBU A",
    scheduled_label: "AHAZIRI YA",
    sector_4_irrigation: "Sector 4 Ndị Mmiri",
    automated_drip_running: "Sistemụ mmiri na-arụ ọrụ maka awa 2 fọdụrụnụ.",
    soil_sampling_drone: "Drone Na-atụle Ala",
    preflight_checks_completed: "Nleba anya tupu ụgbọ elu ezuola. Na-eche nhazi.",
    cassava_irrigation_action: "Ịgba Mmiri Akpụ",
    automated_drip_sector_a: "Nhazi usoro mmiri maka Sector A.",
    eco_efficiency_rating: "Ogo Nchekwa Gburugburu Ala",
    eco_excellent: "Kachasị Mma",
    carbon_offset: "Nchekwa Carbon",
    water_recycled: "Mmiri A Na-emegharị",
    active_dispatch_logs: "Ndekọ Mbupu Anyị",
    outgoing_organic_cassava: "Outgoing: Akpụ Organic",
    fleet_en_route: "Fleet 04 • Na-aga n'ebe nkesa ihe (ETA 45m)",
    incoming_bio_fertilizer: "Incoming: Fatịlaịza Bio",
    supplier_delivery_expected: "A na-atụ anya mbupu onye na-ebubata ihe na mba 14:30 taa.",
    view_logistics_map: "Lee Map Maka Mbupu Niile"
};

export const translations: Record<Language, TranslationKeys> = {
  en: enTranslations,
  yo: yoTranslations,
  ha: haTranslations,
  ig: igTranslations
};
