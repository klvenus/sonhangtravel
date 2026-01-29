'use client';

import Script from 'next/script';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { isZaloMiniApp, getZaloUserInfo } from '@/lib/zalo';

interface ZaloUser {
  id: string;
  name: string;
  avatar: string;
}

interface ZaloContextType {
  isMiniApp: boolean;
  user: ZaloUser | null;
  isLoading: boolean;
  oaId: string;
}

const ZaloContext = createContext<ZaloContextType>({
  isMiniApp: false,
  user: null,
  isLoading: true,
  oaId: '',
});

export function useZalo() {
  return useContext(ZaloContext);
}

interface ZaloProviderProps {
  children: ReactNode;
  oaId?: string; // Zalo Official Account ID
}

export function ZaloProvider({ children, oaId = '' }: ZaloProviderProps) {
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [user, setUser] = useState<ZaloUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if running in Zalo Mini App
    const checkZalo = async () => {
      const inMiniApp = isZaloMiniApp();
      setIsMiniApp(inMiniApp);
      
      if (inMiniApp) {
        console.log('[Zalo] Running in Mini App');
        // Try to get user info
        const userInfo = await getZaloUserInfo();
        if (userInfo) {
          setUser(userInfo);
        }
      }
      
      setIsLoading(false);
    };

    // Delay check to ensure SDK is loaded
    const timer = setTimeout(checkZalo, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ZaloContext.Provider value={{ isMiniApp, user, isLoading, oaId }}>
      {/* Zalo JS SDK - chỉ load khi cần */}
      {isMiniApp && (
        <Script 
          src="https://sp.zalo.me/plugins/sdk.js"
          strategy="afterInteractive"
        />
      )}
      {children}
    </ZaloContext.Provider>
  );
}
