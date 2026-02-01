'use client';

import { createContext, useContext, ReactNode } from 'react';

// Zalo Official Account ID của Sơn Hằng Travel
const ZALO_OA_ID = '1217282493152188985';

interface ZaloContextType {
  oaId: string;
}

const ZaloContext = createContext<ZaloContextType>({
  oaId: ZALO_OA_ID,
});

export function useZalo() {
  return useContext(ZaloContext);
}

interface ZaloProviderProps {
  children: ReactNode;
  oaId?: string;
}

export function ZaloProvider({ children, oaId }: ZaloProviderProps) {
  const finalOaId = oaId || ZALO_OA_ID;

  return (
    <ZaloContext.Provider value={{ oaId: finalOaId }}>
      {children}
    </ZaloContext.Provider>
  );
}
