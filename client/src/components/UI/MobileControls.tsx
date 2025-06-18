import React, { useState, useEffect } from 'react';
import { useKeyboardControls } from '@react-three/drei';
import { useIsMobile } from '../../hooks/use-is-mobile';

interface MobileControlsProps {
  onMove?: (direction: string, active: boolean) => void;
  onRun?: (active: boolean) => void;
  onJump?: () => void;
}

export function MobileControls({ onMove, onRun, onJump }: MobileControlsProps) {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [activeControls, setActiveControls] = useState<Set<string>>(new Set());
  const [, get] = useKeyboardControls();

  // Auto-hide controls after inactivity
  useEffect(() => {
    if (!isVisible) return;
    
    const timeout = setTimeout(() => {
      if (activeControls.size === 0) {
        setIsVisible(false);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isVisible, activeControls]);

  // Show controls on first touch
  const handleFirstTouch = () => {
    if (!isVisible) {
      setIsVisible(true);
    }
  };

  const handleTouchStart = (direction: string) => {
    setActiveControls(prev => new Set(prev).add(direction));
    onMove?.(direction, true);
  };

  const handleTouchEnd = (direction: string) => {
    setActiveControls(prev => {
      const newSet = new Set(prev);
      newSet.delete(direction);
      return newSet;
    });
    onMove?.(direction, false);
  };

  const handleRunToggle = (active: boolean) => {
    onRun?.(active);
  };

  const handleJump = () => {
    onJump?.();
  };

  if (!isMobile) return null;

  return (
    <>
      {/* Touch detector to show controls */}
      {!isVisible && (
        <div 
          className="fixed inset-0 z-40 pointer-events-auto"
          onTouchStart={handleFirstTouch}
          style={{ background: 'transparent' }}
        />
      )}

      {/* Mobile Controls */}
      {isVisible && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Left side - Movement controls */}
          <div className="absolute bottom-20 left-6 pointer-events-auto">
            <div className="relative w-32 h-32">
              {/* Forward */}
              <button
                className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full 
                  ${activeControls.has('forward') ? 'bg-blue-500' : 'bg-gray-700/80'} 
                  text-white font-bold text-lg shadow-lg backdrop-blur-sm
                  active:scale-95 transition-all duration-150`}
                onTouchStart={() => handleTouchStart('forward')}
                onTouchEnd={() => handleTouchEnd('forward')}
                onTouchCancel={() => handleTouchEnd('forward')}
              >
                ↑
              </button>

              {/* Left */}
              <button
                className={`absolute top-1/2 left-0 transform -translate-y-1/2 w-12 h-12 rounded-full 
                  ${activeControls.has('left') ? 'bg-blue-500' : 'bg-gray-700/80'} 
                  text-white font-bold text-lg shadow-lg backdrop-blur-sm
                  active:scale-95 transition-all duration-150`}
                onTouchStart={() => handleTouchStart('left')}
                onTouchEnd={() => handleTouchEnd('left')}
                onTouchCancel={() => handleTouchEnd('left')}
              >
                ←
              </button>

              {/* Right */}
              <button
                className={`absolute top-1/2 right-0 transform -translate-y-1/2 w-12 h-12 rounded-full 
                  ${activeControls.has('right') ? 'bg-blue-500' : 'bg-gray-700/80'} 
                  text-white font-bold text-lg shadow-lg backdrop-blur-sm
                  active:scale-95 transition-all duration-150`}
                onTouchStart={() => handleTouchStart('right')}
                onTouchEnd={() => handleTouchEnd('right')}
                onTouchCancel={() => handleTouchEnd('right')}
              >
                →
              </button>

              {/* Backward */}
              <button
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full 
                  ${activeControls.has('backward') ? 'bg-blue-500' : 'bg-gray-700/80'} 
                  text-white font-bold text-lg shadow-lg backdrop-blur-sm
                  active:scale-95 transition-all duration-150`}
                onTouchStart={() => handleTouchStart('backward')}
                onTouchEnd={() => handleTouchEnd('backward')}
                onTouchCancel={() => handleTouchEnd('backward')}
              >
                ↓
              </button>
            </div>
          </div>

          {/* Right side - Action controls */}
          <div className="absolute bottom-20 right-6 pointer-events-auto">
            <div className="flex flex-col gap-4">
              {/* Jump Button */}
              <button
                className="w-16 h-16 rounded-full bg-green-600/80 text-white font-bold text-sm shadow-lg backdrop-blur-sm
                  active:scale-95 transition-all duration-150 flex items-center justify-center"
                onTouchStart={handleJump}
              >
                JUMP
              </button>

              {/* Run Toggle */}
              <button
                className={`w-16 h-16 rounded-full text-white font-bold text-sm shadow-lg backdrop-blur-sm
                  active:scale-95 transition-all duration-150 flex items-center justify-center
                  ${activeControls.has('run') ? 'bg-orange-500' : 'bg-orange-600/80'}`}
                onTouchStart={() => {
                  const isRunning = activeControls.has('run');
                  if (isRunning) {
                    setActiveControls(prev => {
                      const newSet = new Set(prev);
                      newSet.delete('run');
                      return newSet;
                    });
                    handleRunToggle(false);
                  } else {
                    setActiveControls(prev => new Set(prev).add('run'));
                    handleRunToggle(true);
                  }
                }}
              >
                RUN
              </button>
            </div>
          </div>

          {/* Hide controls button */}
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-700/80 text-white 
              backdrop-blur-sm shadow-lg pointer-events-auto active:scale-95 transition-all duration-150
              flex items-center justify-center"
            onTouchStart={() => setIsVisible(false)}
          >
            ✕
          </button>

          {/* Control info */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 pointer-events-auto">
            <div className="bg-gray-900/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              Tap to hide controls
            </div>
          </div>
        </div>
      )}
    </>
  );
}