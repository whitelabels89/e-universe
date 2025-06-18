import React, { useState, useEffect } from "react";
import { useIsMobile } from "../../hooks/use-is-mobile";
import { Button } from "./button";
import { 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
  Zap, RotateCcw, Eye, Hand, Settings, X
} from "lucide-react";

interface TouchOptimizedControlsProps {
  onMove?: (direction: string, active: boolean) => void;
  onRun?: (active: boolean) => void;
  onJump?: () => void;
  onInteract?: () => void;
  onCameraToggle?: () => void;
}

export function TouchOptimizedControls({
  onMove,
  onRun,
  onJump,
  onInteract,
  onCameraToggle
}: TouchOptimizedControlsProps) {
  const isMobile = useIsMobile();
  const [showControls, setShowControls] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeDirections, setActiveDirections] = useState<Set<string>>(new Set());
  const [touchStartTime, setTouchStartTime] = useState<number>(0);

  // Auto-hide controls after inactivity
  useEffect(() => {
    if (showControls) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showControls]);

  // Show controls on any touch
  useEffect(() => {
    if (isMobile) {
      const handleTouchStart = () => {
        setShowControls(true);
      };

      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
      };
    }
  }, [isMobile]);

  const handleDirectionPress = (direction: string) => {
    setActiveDirections(prev => new Set(prev).add(direction));
    onMove?.(direction, true);
    setTouchStartTime(Date.now());
  };

  const handleDirectionRelease = (direction: string) => {
    setActiveDirections(prev => {
      const newSet = new Set(prev);
      newSet.delete(direction);
      return newSet;
    });
    onMove?.(direction, false);
    
    // If held for more than 100ms, consider it movement
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration < 100) {
      // Quick tap - maybe a different action
    }
  };

  const handleRunToggle = () => {
    const newRunState = !isRunning;
    setIsRunning(newRunState);
    onRun?.(newRunState);
  };

  if (!isMobile) return null;

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-30 transition-all duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Movement D-Pad */}
      <div className="absolute bottom-20 left-4 pointer-events-auto">
        <div className="relative w-32 h-32">
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-800/80 rounded-full border border-gray-600" />
          
          {/* Up */}
          <button
            onTouchStart={() => handleDirectionPress('forward')}
            onTouchEnd={() => handleDirectionRelease('forward')}
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full transition-all ${
              activeDirections.has('forward') 
                ? 'bg-blue-600 scale-110' 
                : 'bg-gray-800/80 hover:bg-gray-700/80'
            } border border-gray-600 flex items-center justify-center`}
          >
            <ArrowUp className="w-6 h-6 text-white" />
          </button>
          
          {/* Down */}
          <button
            onTouchStart={() => handleDirectionPress('backward')}
            onTouchEnd={() => handleDirectionRelease('backward')}
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full transition-all ${
              activeDirections.has('backward') 
                ? 'bg-blue-600 scale-110' 
                : 'bg-gray-800/80 hover:bg-gray-700/80'
            } border border-gray-600 flex items-center justify-center`}
          >
            <ArrowDown className="w-6 h-6 text-white" />
          </button>
          
          {/* Left */}
          <button
            onTouchStart={() => handleDirectionPress('leftward')}
            onTouchEnd={() => handleDirectionRelease('leftward')}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full transition-all ${
              activeDirections.has('leftward') 
                ? 'bg-blue-600 scale-110' 
                : 'bg-gray-800/80 hover:bg-gray-700/80'
            } border border-gray-600 flex items-center justify-center`}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          
          {/* Right */}
          <button
            onTouchStart={() => handleDirectionPress('rightward')}
            onTouchEnd={() => handleDirectionRelease('rightward')}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full transition-all ${
              activeDirections.has('rightward') 
                ? 'bg-blue-600 scale-110' 
                : 'bg-gray-800/80 hover:bg-gray-700/80'
            } border border-gray-600 flex items-center justify-center`}
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-20 right-4 pointer-events-auto">
        <div className="flex flex-col gap-3">
          {/* Jump Button */}
          <button
            onTouchStart={onJump}
            className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 border border-green-500 flex items-center justify-center transition-all active:scale-95"
          >
            <ArrowUp className="w-6 h-6 text-white" />
          </button>
          
          {/* Run Toggle */}
          <button
            onTouchStart={handleRunToggle}
            className={`w-14 h-14 rounded-full border transition-all active:scale-95 flex items-center justify-center ${
              isRunning 
                ? 'bg-orange-600 border-orange-500 hover:bg-orange-700' 
                : 'bg-gray-800/80 border-gray-600 hover:bg-gray-700/80'
            }`}
          >
            <Zap className="w-6 h-6 text-white" />
          </button>
          
          {/* Interact Button */}
          <button
            onTouchStart={onInteract}
            className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 border border-purple-500 flex items-center justify-center transition-all active:scale-95"
          >
            <Hand className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Top Action Bar */}
      <div className="absolute top-16 left-4 right-4 pointer-events-auto">
        <div className="flex justify-between items-start">
          {/* Camera Controls */}
          <button
            onTouchStart={onCameraToggle}
            className="w-12 h-12 rounded-full bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600 flex items-center justify-center transition-all active:scale-95"
          >
            <Eye className="w-5 h-5 text-white" />
          </button>
          
          {/* Settings & Close */}
          <div className="flex gap-2">
            <button
              onTouchStart={() => {
                // Open settings or controls menu
                console.log("Settings tapped");
              }}
              className="w-12 h-12 rounded-full bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600 flex items-center justify-center transition-all active:scale-95"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            
            <button
              onTouchStart={() => setShowControls(false)}
              className="w-12 h-12 rounded-full bg-red-600/80 hover:bg-red-700/80 border border-red-500 flex items-center justify-center transition-all active:scale-95"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Control Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-600">
          <div className="text-white text-xs text-center">
            Touch screen to show controls • Tap to hide
          </div>
        </div>
      </div>
    </div>
  );
}