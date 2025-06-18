import { useState } from 'react';
import { useDayNightCycle } from '../../lib/stores/useDayNightCycle';
import { Button } from './button';
import { Slider } from './slider';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Play, Pause, RotateCcw, Sun, Moon, Clock } from 'lucide-react';

export function TimeControls() {
  const {
    currentTime,
    timeSpeed,
    isRunning,
    setTime,
    setTimeSpeed,
    toggleTimeRunning,
    resetToDefault,
    skyColor,
    sunIntensity
  } = useDayNightCycle();
  
  const [isVisible, setIsVisible] = useState(false);
  
  // Format time display
  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  // Get time of day label
  const getTimeLabel = (time: number) => {
    if (time >= 5 && time < 12) return 'Morning';
    if (time >= 12 && time < 17) return 'Afternoon';
    if (time >= 17 && time < 20) return 'Evening';
    return 'Night';
  };
  
  // Get appropriate icon
  const getTimeIcon = (time: number) => {
    if (time >= 6 && time < 18) {
      return <Sun className="w-4 h-4 text-yellow-500" />;
    }
    return <Moon className="w-4 h-4 text-blue-300" />;
  };
  
  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800/80 hover:bg-gray-700/80 text-white p-3 rounded-full z-50"
        size="sm"
      >
        <Clock className="w-5 h-5" />
      </Button>
    );
  }
  
  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-gray-900/90 text-white border-gray-600 z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getTimeIcon(currentTime)}
            Time Controls
          </CardTitle>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Time Display */}
        <div className="text-center">
          <div className="text-2xl font-mono" style={{ color: skyColor }}>
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-gray-400">
            {getTimeLabel(currentTime)}
          </div>
        </div>
        
        {/* Time Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Time of Day</label>
          <Slider
            value={[currentTime]}
            onValueChange={([value]) => setTime(value)}
            max={24}
            min={0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>00:00</span>
            <span>12:00</span>
            <span>24:00</span>
          </div>
        </div>
        
        {/* Speed Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Time Speed: {timeSpeed}x</label>
          <Slider
            value={[timeSpeed]}
            onValueChange={([value]) => setTimeSpeed(value)}
            max={10}
            min={0}
            step={0.1}
            className="w-full"
          />
        </div>
        
        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={toggleTimeRunning}
            variant={isRunning ? "default" : "outline"}
            size="sm"
            className="flex-1"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1" />
                Play
              </>
            )}
          </Button>
          
          <Button
            onClick={resetToDefault}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
        
        {/* Quick Time Presets */}
        <div className="grid grid-cols-4 gap-1">
          {[
            { label: 'Dawn', time: 6, icon: '🌅' },
            { label: 'Noon', time: 12, icon: '☀️' },
            { label: 'Dusk', time: 18, icon: '🌆' },
            { label: 'Night', time: 0, icon: '🌙' }
          ].map(preset => (
            <Button
              key={preset.label}
              onClick={() => setTime(preset.time)}
              variant="ghost"
              size="sm"
              className="text-xs p-1 h-auto flex flex-col items-center"
            >
              <span className="text-sm">{preset.icon}</span>
              <span>{preset.label}</span>
            </Button>
          ))}
        </div>
        
        {/* Light Info */}
        <div className="text-xs text-gray-400 space-y-1">
          <div>Sun Intensity: {(sunIntensity * 100).toFixed(0)}%</div>
          <div>Sky: {skyColor}</div>
        </div>
      </CardContent>
    </Card>
  );
}