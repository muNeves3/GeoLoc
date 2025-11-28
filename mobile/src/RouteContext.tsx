import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Rota } from './types'; // Importando a interface Rota definida no seu types.ts

interface RouteContextType {
  currentRoute: Rota | undefined;
  setCurrentRoute: (route: Rota | undefined) => void;
}

const RouteContext = createContext<RouteContextType>({} as RouteContextType);

export const RouteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<Rota | undefined>(undefined);

  return (
    <RouteContext.Provider value={{ currentRoute, setCurrentRoute }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRouteContext = () => useContext(RouteContext);