'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface AppContextType {
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [pageTitle, setPageTitle] = useState('Dashboard');
  
  const value = useMemo(() => ({ pageTitle, setPageTitle }), [pageTitle]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
