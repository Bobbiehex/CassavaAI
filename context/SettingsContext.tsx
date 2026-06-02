import React, { createContext, useContext, useState, useEffect } from 'react';

type UnitPreference = 'metric' | 'imperial';

interface SettingsContextType {
  measurementUnit: UnitPreference;
  setMeasurementUnit: (unit: UnitPreference) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [measurementUnit, setMeasurementUnit] = useState<UnitPreference>('metric');

  useEffect(() => {
    const savedUnit = localStorage.getItem('settings_measurementUnit') as UnitPreference;
    if (savedUnit && (savedUnit === 'metric' || savedUnit === 'imperial')) {
      setMeasurementUnit(savedUnit);
    }
  }, []);

  const handleSetMeasurementUnit = (unit: UnitPreference) => {
    setMeasurementUnit(unit);
    localStorage.setItem('settings_measurementUnit', unit);
  };

  return (
    <SettingsContext.Provider value={{ measurementUnit, setMeasurementUnit: handleSetMeasurementUnit }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
