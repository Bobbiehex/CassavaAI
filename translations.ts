
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
    report_type_field: "Field Summary"
};

export const translations: Record<Language, TranslationKeys> = {
  en: enTranslations,
  ha: { ...enTranslations, app_name: "CassavaVision AI (Hausa)", welcome: "Sannu da zuwa, {name}" },
  yo: { ...enTranslations, app_name: "CassavaVision AI (Yoruba)", welcome: "Kaabo, {name}" },
  ig: { ...enTranslations, app_name: "CassavaVision AI (Igbo)", welcome: "Nnoo, {name}" }
};
