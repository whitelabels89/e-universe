import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { Menu, X, ChevronUp, ChevronDown } from 'lucide-react';

interface ResponsiveUIProps {
  children: ReactNode;
}

interface UILayout {
  orientation: 'portrait' | 'landscape';
  screenSize: 'small' | 'medium' | 'large';
  safeArea: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export function ResponsiveUI({ children }: ResponsiveUIProps) {
  const isMobile = useIsMobile();
  const [layout, setLayout] = useState<UILayout>({
    orientation: 'portrait',
    screenSize: 'medium',
    safeArea: { top: 0, bottom: 0, left: 0, right: 0 }
  });
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Detect device capabilities and layout
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Determine orientation
      const orientation = width > height ? 'landscape' : 'portrait';
      
      // Determine screen size
      let screenSize: 'small' | 'medium' | 'large' = 'medium';
      if (width < 375) screenSize = 'small';
      else if (width > 768) screenSize = 'large';
      
      // Get safe area (for devices with notches, etc.)
      const safeArea = {
        top: parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--sat') || '0'),
        bottom: parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--sab') || '0'),
        left: parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--sal') || '0'),
        right: parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--sar') || '0')
      };

      setLayout({ orientation, screenSize, safeArea });
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    window.addEventListener('orientationchange', updateLayout);

    return () => {
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('orientationchange', updateLayout);
    };
  }, []);

  // Detect virtual keyboard
  useEffect(() => {
    if (isMobile) {
      const initialHeight = window.innerHeight;
      
      const handleResize = () => {
        const currentHeight = window.innerHeight;
        const diff = initialHeight - currentHeight;
        setKeyboardVisible(diff > 150); // Threshold for keyboard
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isMobile]);

  // Auto-collapse menu in landscape mode
  useEffect(() => {
    if (isMobile && layout.orientation === 'landscape') {
      setMenuCollapsed(true);
    }
  }, [isMobile, layout.orientation]);

  if (!isMobile) {
    return <>{children}</>;
  }

  const getContainerStyles = () => {
    const base = `
      relative w-full h-full
      ${layout.orientation === 'landscape' ? 'landscape-layout' : 'portrait-layout'}
      ${layout.screenSize === 'small' ? 'compact-ui' : ''}
    `;

    return base;
  };

  const getSafeAreaStyles = () => ({
    paddingTop: `${layout.safeArea.top}px`,
    paddingBottom: `${layout.safeArea.bottom}px`,
    paddingLeft: `${layout.safeArea.left}px`,
    paddingRight: `${layout.safeArea.right}px`
  });

  return (
    <div className={getContainerStyles()} style={getSafeAreaStyles()}>
      {/* Main Content Area */}
      <div 
        className={`
          absolute inset-0 
          ${keyboardVisible ? 'keyboard-active' : ''}
          ${layout.orientation === 'landscape' ? 'landscape-content' : 'portrait-content'}
        `}
      >
        {children}
      </div>

      {/* Adaptive UI Container */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {/* Top Status Bar */}
        <motion.div
          className={`
            absolute top-0 left-0 right-0 h-12 bg-black bg-opacity-30 
            backdrop-blur-sm flex items-center justify-between px-4 pointer-events-auto
            ${layout.orientation === 'landscape' ? 'landscape-statusbar' : ''}
          `}
          style={{ paddingTop: `${layout.safeArea.top}px` }}
          initial={{ y: -48 }}
          animate={{ y: 0 }}
        >
          <div className="flex items-center space-x-2">
            <div className="text-white text-sm font-medium">
              3D Creative Engine
            </div>
            {layout.orientation === 'landscape' && (
              <div className="text-white text-xs opacity-70">
                Landscape Mode
              </div>
            )}
          </div>
          
          <button
            onClick={() => setMenuCollapsed(!menuCollapsed)}
            className="text-white p-1 rounded"
          >
            {menuCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </motion.div>

        {/* Collapsible Menu Panel */}
        <AnimatePresence>
          {!menuCollapsed && (
            <motion.div
              className={`
                absolute top-12 right-0 bg-black bg-opacity-80 backdrop-blur-sm
                text-white p-4 rounded-bl-lg pointer-events-auto
                ${layout.orientation === 'landscape' ? 'max-w-xs' : 'w-full max-w-sm'}
              `}
              style={{ 
                top: `${48 + layout.safeArea.top}px`,
                maxHeight: layout.orientation === 'landscape' ? '60vh' : '40vh',
                overflowY: 'auto'
              }}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
            >
              <div className="space-y-3">
                <div className="text-sm font-medium border-b border-white border-opacity-20 pb-2">
                  Quick Actions
                </div>
                
                <button className="w-full text-left p-2 hover:bg-white hover:bg-opacity-10 rounded">
                  Open Python Editor
                </button>
                
                <button className="w-full text-left p-2 hover:bg-white hover:bg-opacity-10 rounded">
                  Camera Controls
                </button>
                
                <button className="w-full text-left p-2 hover:bg-white hover:bg-opacity-10 rounded">
                  Settings
                </button>
                
                {layout.orientation === 'landscape' && (
                  <div className="text-xs text-white text-opacity-60 pt-2 border-t border-white border-opacity-20">
                    Tip: Rotate to portrait for full interface
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom UI Panel */}
        <motion.div
          className={`
            absolute bottom-0 left-0 right-0 pointer-events-auto
            ${layout.orientation === 'landscape' ? 'landscape-bottom' : 'portrait-bottom'}
            ${keyboardVisible ? 'hidden' : 'block'}
          `}
          style={{ paddingBottom: `${layout.safeArea.bottom}px` }}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
        >
          {layout.orientation === 'portrait' && (
            <div className="bg-black bg-opacity-30 backdrop-blur-sm p-3">
              <div className="flex justify-center space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  Code
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                  Build
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                  Create
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Keyboard Adaptation Indicator */}
        <AnimatePresence>
          {keyboardVisible && (
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg pointer-events-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="text-center">
                <ChevronUp className="w-5 h-5 mx-auto mb-1" />
                <div className="text-sm">UI adapted for keyboard</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Performance Indicator */}
        <div className="absolute bottom-4 left-4 pointer-events-auto">
          <PerformanceIndicator layout={layout} />
        </div>
      </div>
    </div>
  );
}

function PerformanceIndicator({ layout }: { layout: UILayout }) {
  const [fps, setFps] = useState(60);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    measureFPS();
  }, []);

  const getPerformanceColor = () => {
    if (fps >= 45) return 'bg-green-600';
    if (fps >= 25) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <motion.div
      className={`text-white text-xs rounded-lg p-2 cursor-pointer ${getPerformanceColor()}`}
      onClick={() => setShowDetails(!showDetails)}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>{fps} FPS</span>
      </div>
      
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="absolute bottom-full mb-2 left-0 bg-black bg-opacity-90 p-2 rounded text-xs whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div>Orientation: {layout.orientation}</div>
            <div>Screen: {layout.screenSize}</div>
            <div>Performance: {fps >= 45 ? 'Good' : fps >= 25 ? 'Fair' : 'Poor'}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}