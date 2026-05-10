'use client';

import { ReactNode } from 'react';
import PWAInstallModal from './PWAInstallModal';

interface PWAInstallProviderProps {
  children: ReactNode;
}

export default function PWAInstallProvider({ children }: PWAInstallProviderProps) {
  return (
    <>
      {children}
      <PWAInstallModal />
    </>
  );
}
