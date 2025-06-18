import React, { useState, useEffect } from "react";
import { useIsMobile } from "../../hooks/use-is-mobile";

interface AdaptiveLayoutManagerProps {
  children: React.ReactNode;
}

interface ViewportInfo {
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  touchSupport: boolean;
}

export function AdaptiveLayoutManager({ children }: AdaptiveLayoutManagerProps) {
  const isMobile = useIsMobile();
  const [viewportInfo, setViewportInfo] = useState<ViewportInfo>({
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    deviceType: 'desktop',
    touchSupport: 'ontouchstart' in window
  });

  useEffect(() => {
    const updateViewportInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = width > height ? 'landscape' : 'portrait';
      
      let deviceType: 'mobile' | 'tablet' | 'desktop';
      if (width <= 768) {
        deviceType = 'mobile';
      } else if (width <= 1024) {
        deviceType = 'tablet';
      } else {
        deviceType = 'desktop';
      }

      setViewportInfo({
        width,
        height,
        orientation,
        deviceType,
        touchSupport: 'ontouchstart' in window
      });
    };

    window.addEventListener('resize', updateViewportInfo);
    window.addEventListener('orientationchange', updateViewportInfo);
    
    // Initial update
    updateViewportInfo();

    return () => {
      window.removeEventListener('resize', updateViewportInfo);
      window.removeEventListener('orientationchange', updateViewportInfo);
    };
  }, []);

  // Add CSS custom properties for responsive design
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--viewport-width', `${viewportInfo.width}px`);
    root.style.setProperty('--viewport-height', `${viewportInfo.height}px`);
    root.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
    root.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
    root.style.setProperty('--safe-area-left', 'env(safe-area-inset-left)');
    root.style.setProperty('--safe-area-right', 'env(safe-area-inset-right)');
    
    // Add data attributes for CSS targeting
    document.body.setAttribute('data-device-type', viewportInfo.deviceType);
    document.body.setAttribute('data-orientation', viewportInfo.orientation);
    document.body.setAttribute('data-touch-support', viewportInfo.touchSupport.toString());
  }, [viewportInfo]);

  return (
    <div 
      className={`adaptive-layout ${viewportInfo.deviceType} ${viewportInfo.orientation} ${
        viewportInfo.touchSupport ? 'touch-enabled' : 'touch-disabled'
      }`}
      style={{
        '--current-device-type': viewportInfo.deviceType,
        '--current-orientation': viewportInfo.orientation,
      } as React.CSSProperties}
    >
      {children}
      
      {/* Responsive Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 z-50 bg-black/80 text-white text-xs p-2 rounded font-mono">
          <div>Device: {viewportInfo.deviceType}</div>
          <div>Size: {viewportInfo.width}x{viewportInfo.height}</div>
          <div>Orient: {viewportInfo.orientation}</div>
          <div>Touch: {viewportInfo.touchSupport ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
}