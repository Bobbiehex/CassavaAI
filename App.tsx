
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { OverviewDashboard } from './components/OverviewDashboard';
import { CropDashboard } from './components/CropDashboard';
import { AIAssistant } from './components/AIAssistant';
import { DashboardPage } from './components/DashboardPage';
import { SupportCenterPage } from './components/SupportCenterPage';
import { BlogPage } from './components/BlogPage';
import { SettingsPage } from './components/SettingsPage';
import { AdminPage } from './components/AdminPage';
import { ProfilePage } from './components/ProfilePage';
import { FarmSelector } from './components/FarmSelector';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { NotificationProvider } from './context/NotificationContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { useAuth } from './context/AuthContext';
import { dbService } from './services/db';
import { ApiService } from './services/api';

import { NoFarmPrompt } from './components/NoFarmPrompt';
import { FarmMapPage } from './components/FarmMapPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('agrivision_current_page') || 'dashboard';
  });
  const [navParams, setNavParams] = useState<any>(() => {
    const saved = localStorage.getItem('agrivision_nav_params');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(() => {
    return localStorage.getItem('agrivision_selected_farm') || null;
  });
  
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const initFarm = async () => {
      if (!user) return;
      try {
        const farms = await ApiService.getFarms();
        if (farms.length > 0 && !selectedFarmId) {
          const savedFarmId = localStorage.getItem('agrivision_selected_farm');
          if (savedFarmId && farms.some(f => f.id === savedFarmId)) {
            setSelectedFarmId(savedFarmId);
          } else {
            setSelectedFarmId(farms[0].id);
            localStorage.setItem('agrivision_selected_farm', farms[0].id);
          }
        } else if (farms.length === 0) {
          setSelectedFarmId(null);
          localStorage.removeItem('agrivision_selected_farm');
        }
      } catch (e) {
        console.error("Failed to fetch farms", e);
      }
    };
    initFarm();
  }, [selectedFarmId, user]);

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    localStorage.setItem('agrivision_current_page', page);
    setNavParams(params || null);
    if (params) {
      localStorage.setItem('agrivision_nav_params', JSON.stringify(params));
    } else {
      localStorage.removeItem('agrivision_nav_params');
    }
  };

  const handleSelectFarm = (id: string | null) => {
    setSelectedFarmId(id);
    if (id) {
      localStorage.setItem('agrivision_selected_farm', id);
    } else {
      localStorage.removeItem('agrivision_selected_farm');
    }
  };

  const renderPage = () => {
    const needsFarm = ['dashboard', 'overview', 'crops', 'map', 'ai-advisor'].includes(currentPage);
    
    if (needsFarm && !selectedFarmId) {
      return <NoFarmPrompt />;
    }

    switch (currentPage) {
      case 'dashboard': return <DashboardPage farmId={selectedFarmId} onNavigate={handleNavigate} />;
      case 'overview': return <OverviewDashboard farmId={selectedFarmId} />;
      case 'crops': return <CropDashboard initialCropId={navParams?.id} farmId={selectedFarmId} />;
      case 'map': return <FarmMapPage />;
      case 'ai-advisor': return <AIAssistant farmId={selectedFarmId} />;
      case 'support': return <SupportCenterPage />;
      case 'blog': return <BlogPage />;
      case 'settings': return <SettingsPage />;
      case 'admin': return <AdminPage />;
      case 'profile': return <ProfilePage />;
      default: return <DashboardPage farmId={selectedFarmId} onNavigate={handleNavigate} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen grid flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  const ProtectedApp = (
    <Layout 
      currentPage={currentPage} 
      onNavigate={handleNavigate}
      headerExtra={<FarmSelector selectedFarmId={selectedFarmId} onSelectFarm={handleSelectFarm} />}
    >
      {renderPage()}
    </Layout>
  );

  return (
    <ThemeProvider>
        <SettingsProvider>
        <LanguageProvider>
        <NotificationProvider>
            <Routes>
              <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
              <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
              <Route path="/*" element={user ? ProtectedApp : <Navigate to="/login" />} />
            </Routes>
        </NotificationProvider>
        </LanguageProvider>
        </SettingsProvider>
    </ThemeProvider>
  );
};

export default App;
