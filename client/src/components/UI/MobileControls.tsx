import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, Settings, Eye, EyeOff } from 'lucide-react';

enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  jump = 'jump',
  run = 'run'
}

export function MobileControls() {
  const isMobile = useIsMobile();
  const [activeButtons, setActiveButtons] = useState<Set<Controls>>(new Set());
  const [controlsVisible, setControlsVisible] = useState(true);
  const [controlsOpacity, setControlsOpacity] = useState(0.8);
  const [joystickSize, setJoystickSize] = useState('normal');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const intervalRefs = useRef<Map<Controls, NodeJS.Timeout>>(new Map());
  const lastTouchTime = useRef(0);

  // Performance optimization: throttle touch events
  const throttleTouch = useCallback((callback: () => void) => {
    const now = Date.now();
    if (now - lastTouchTime.current > 16) { // ~60fps
      lastTouchTime.current = now;
      callback();
    }
  }, []);

  // Always call useEffect (maintain hook order)
  useEffect(() => {
    return () => {
      intervalRefs.current.forEach(interval => clearInterval(interval));
    };
  }, []);

  // Load mobile preferences from localStorage
  useEffect(() => {
    if (isMobile) {
      const saved = localStorage.getItem('mobile-controls-settings');
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          setControlsOpacity(settings.opacity || 0.8);
          setJoystickSize(settings.size || 'normal');
          setControlsVisible(settings.visible !== false);
        } catch (e) {
          console.warn('Failed to load mobile control settings');
        }
      }
    }
  }, [isMobile]);

  // Save settings to localStorage
  const saveSettings = useCallback(() => {
    if (isMobile) {
      localStorage.setItem('mobile-controls-settings', JSON.stringify({
        opacity: controlsOpacity,
        size: joystickSize,
        visible: controlsVisible
      }));
    }
  }, [isMobile, controlsOpacity, joystickSize, controlsVisible]);

  useEffect(() => {
    saveSettings();
  }, [saveSettings]);

  // Return early AFTER all hooks are called
  if (!isMobile) {
    return null;
  }

  const simulateKeyPress = useCallback((control: Controls, pressed: boolean) => {
    throttleTouch(() => {
      if (pressed) {
        // Start continuous key press
        setActiveButtons(prev => new Set(prev).add(control));
        
        // Clear any existing interval
        const existingInterval = intervalRefs.current.get(control);
        if (existingInterval) {
          clearInterval(existingInterval);
        }
        
        // Create new interval for continuous press
        const interval = setInterval(() => {
          // Trigger keyboard event
          const event = new KeyboardEvent('keydown', {
            key: getKeyForControl(control),
            code: getCodeForControl(control),
            bubbles: true
          });
          window.dispatchEvent(event);
        }, 16); // ~60fps
        
        intervalRefs.current.set(control, interval);
        
        // Haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      } else {
        // Stop key press
        setActiveButtons(prev => {
          const newSet = new Set(prev);
          newSet.delete(control);
          return newSet;
        });
        
        const interval = intervalRefs.current.get(control);
        if (interval) {
          clearInterval(interval);
          intervalRefs.current.delete(control);
          
          // Trigger key up event
          const event = new KeyboardEvent('keyup', {
            key: getKeyForControl(control),
            code: getCodeForControl(control),
            bubbles: true
          });
          window.dispatchEvent(event);
        }
      }
    });
  }, [throttleTouch]);

  const getKeyForControl = (control: Controls): string => {
    switch (control) {
      case Controls.forward: return 'w';
      case Controls.backward: return 's';
      case Controls.leftward: return 'a';
      case Controls.rightward: return 'd';
      case Controls.jump: return ' ';
      case Controls.run: return 'Shift';
      default: return '';
    }
  };

  const getCodeForControl = (control: Controls): string => {
    switch (control) {
      case Controls.forward: return 'KeyW';
      case Controls.backward: return 'KeyS';
      case Controls.leftward: return 'KeyA';
      case Controls.rightward: return 'KeyD';
      case Controls.jump: return 'Space';
      case Controls.run: return 'ShiftLeft';
      default: return '';
    }
  };



  const getButtonSize = () => {
    switch (joystickSize) {
      case 'small': return 'w-12 h-12 p-2';
      case 'large': return 'w-20 h-20 p-5';
      default: return 'w-16 h-16 p-4';
    }
  };

  const getIconSize = () => {
    switch (joystickSize) {
      case 'small': return 'w-4 h-4';
      case 'large': return 'w-8 h-8';
      default: return 'w-6 h-6';
    }
  };

  const ControlButton = ({ 
    control, 
    icon, 
    className = "" 
  }: { 
    control: Controls; 
    icon: React.ReactNode; 
    className?: string;
  }) => {
    const isActive = activeButtons.has(control);

    return (
      <motion.button
        className={`
          bg-white backdrop-blur-sm border border-white border-opacity-30
          text-white rounded-lg shadow-lg select-none transition-all duration-150
          ${isActive ? 'scale-95 shadow-inner' : 'hover:bg-opacity-30 active:scale-90'}
          ${getButtonSize()} ${className}
        `}
        style={{ 
          backgroundColor: `rgba(255, 255, 255, ${isActive ? controlsOpacity * 0.6 : controlsOpacity * 0.2})`,
          borderColor: `rgba(255, 255, 255, ${controlsOpacity * 0.5})`
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          simulateKeyPress(control, true);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          simulateKeyPress(control, false);
        }}
        onTouchCancel={(e) => {
          e.preventDefault();
          simulateKeyPress(control, false);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          simulateKeyPress(control, true);
        }}
        onMouseUp={(e) => {
          e.preventDefault();
          simulateKeyPress(control, false);
        }}
        onMouseLeave={(e) => {
          e.preventDefault();
          simulateKeyPress(control, false);
        }}
        whileTap={{ scale: 0.85 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
      >
        <div className={getIconSize()}>
          {icon}
        </div>
      </motion.button>
    );
  };

  const getSpacing = () => {
    switch (joystickSize) {
      case 'small': return { distance: '-12', gap: 'gap-2' };
      case 'large': return { distance: '-20', gap: 'gap-4' };
      default: return { distance: '-16', gap: 'gap-3' };
    }
  };

  const spacing = getSpacing();

  return (
    <AnimatePresence>
      {controlsVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-30"
          style={{ 
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
        >
          {/* Movement Controls - Left Side */}
          <div className="absolute left-4 bottom-4 pointer-events-auto">
            <div className="relative">
              {/* Forward */}
              <ControlButton
                control={Controls.forward}
                icon={<ArrowUp className={getIconSize()} />}
                className={`absolute -top-${spacing.distance.replace('-', '')} left-1/2 transform -translate-x-1/2`}
              />
              
              {/* Left */}
              <ControlButton
                control={Controls.leftward}
                icon={<ArrowLeft className={getIconSize()} />}
                className={`absolute -left-${spacing.distance.replace('-', '')} top-1/2 transform -translate-y-1/2`}
              />
              
              {/* Center (base position) */}
              <div 
                className={`${getButtonSize()} bg-white rounded-lg`}
                style={{ backgroundColor: `rgba(255, 255, 255, ${controlsOpacity * 0.1})` }}
              ></div>
              
              {/* Right */}
              <ControlButton
                control={Controls.rightward}
                icon={<ArrowRight className={getIconSize()} />}
                className={`absolute -right-${spacing.distance.replace('-', '')} top-1/2 transform -translate-y-1/2`}
              />
              
              {/* Backward */}
              <ControlButton
                control={Controls.backward}
                icon={<ArrowDown className={getIconSize()} />}
                className={`absolute -bottom-${spacing.distance.replace('-', '')} left-1/2 transform -translate-x-1/2`}
              />
            </div>
          </div>

          {/* Action Controls - Right Side */}
          <div className={`absolute right-4 bottom-4 pointer-events-auto flex flex-col ${spacing.gap}`}>
            {/* Jump Button */}
            <ControlButton
              control={Controls.jump}
              icon={<Zap className={getIconSize()} />}
              className="rounded-full"
            />
            
            {/* Run Button */}
            <ControlButton
              control={Controls.run}
              icon={<span className={`${joystickSize === 'small' ? 'text-xs' : joystickSize === 'large' ? 'text-base' : 'text-sm'} font-bold`}>RUN</span>}
              className="h-12"
            />
          </div>

          {/* Settings Button */}
          <div className="absolute top-4 right-4 pointer-events-auto">
            <motion.button
              className="bg-black bg-opacity-50 text-white p-2 rounded-lg"
              style={{ opacity: controlsOpacity }}
              onClick={() => setSettingsOpen(!settingsOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Visibility Toggle */}
          <div className="absolute top-4 right-16 pointer-events-auto">
            <motion.button
              className="bg-black bg-opacity-50 text-white p-2 rounded-lg"
              style={{ opacity: controlsOpacity }}
              onClick={() => setControlsVisible(false)}
              whileTap={{ scale: 0.9 }}
            >
              <EyeOff className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {settingsOpen && (
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className="absolute top-16 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg pointer-events-auto min-w-48"
              >
                <h3 className="text-lg font-bold mb-3">Mobile Controls</h3>
                
                {/* Opacity Slider */}
                <div className="mb-3">
                  <label className="block text-sm mb-1">Opacity</label>
                  <input
                    type="range"
                    min="0.3"
                    max="1"
                    step="0.1"
                    value={controlsOpacity}
                    onChange={(e) => setControlsOpacity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Size Selector */}
                <div className="mb-3">
                  <label className="block text-sm mb-1">Size</label>
                  <select
                    value={joystickSize}
                    onChange={(e) => setJoystickSize(e.target.value)}
                    className="w-full bg-gray-700 text-white p-1 rounded"
                  >
                    <option value="small">Small</option>
                    <option value="normal">Normal</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <button
                  onClick={() => setSettingsOpen(false)}
                  className="w-full bg-blue-600 text-white p-2 rounded mt-2 hover:bg-blue-700"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
      
      {/* Show Controls Button (when hidden) */}
      {!controlsVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto z-30"
        >
          <motion.button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
            onClick={() => setControlsVisible(true)}
            whileTap={{ scale: 0.9 }}
          >
            <Eye className="w-5 h-5 inline mr-2" />
            Show Controls
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}