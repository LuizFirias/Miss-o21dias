import { useState, useEffect } from 'react';

export interface PWAInstallInfo {
  isSupported: boolean;
  isMobile: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  deferredPrompt: any;
  canPromptInstall: boolean;
}

export function useInstallPWA(): PWAInstallInfo {
  const [installInfo, setInstallInfo] = useState<PWAInstallInfo>({
    isSupported: false,
    isMobile: false,
    isInstalled: false,
    isIOS: false,
    isAndroid: false,
    deferredPrompt: null,
    canPromptInstall: false,
  });

  useEffect(() => {
    // Detectar se é mobile
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isMobile = isIOS || isAndroid;

    // Detectar se PWA já está instalado
    const isInstalled =
      (window.navigator as any).standalone === true || // iOS
      window.matchMedia('(display-mode: standalone)').matches || // Android/PWA
      document.referrer.includes('android-app://');

    // Android: event beforeinstallprompt
    let deferredPrompt: any = null;
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    setInstallInfo({
      isSupported: true,
      isMobile,
      isInstalled,
      isIOS,
      isAndroid,
      deferredPrompt,
      canPromptInstall: !isInstalled && (isMobile || !!deferredPrompt),
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return installInfo;
}
