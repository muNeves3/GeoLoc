import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Rota, RotasRecentes } from './types';

interface RouteContextType {
  currentRoute: Rota | undefined;
  setCurrentRoute: (route: Rota | undefined) => void;
  rotasRecentes: RotasRecentes[];
  setRotasRecentes: (routes: RotasRecentes[]) => void;
}

const RouteContext = createContext<RouteContextType>({} as RouteContextType);

export const RouteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<Rota | undefined>(undefined);
  const [rotasRecentes, setRotasRecentes] = useState<RotasRecentes[]>([]);

  return (
    <RouteContext.Provider value={{ currentRoute, setCurrentRoute, rotasRecentes, setRotasRecentes }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRouteContext = () => useContext(RouteContext);