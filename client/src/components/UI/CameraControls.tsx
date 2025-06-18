import { useState } from 'react';
import { useCameraSettings } from '../../lib/stores/useCameraSettings';
import { Button } from './button';
import { Slider } from './slider';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Switch } from './switch';
import { 
  Camera, 
  RotateCcw, 
  Eye, 
  Move3D, 
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function CameraControls() {
  const {
    offsetX,
    offsetY,
    offsetZ,
    pitch,
    yaw,
    followDistance,
    followHeight,
    followSpeed,
    mode,
    fov,
    smoothing,
    lookAtTarget,
    allowOrbitControls,
    setOffset,
    setPitch,
    setYaw,
    setFollowDistance,
    setFollowHeight,
    setFollowSpeed,
    setMode,
    setFOV,
    setSmoothing,
    setLookAtTarget,
    setAllowOrbitControls,
    resetToDefault,
    applyPreset
  } = useCameraSettings();
  
  const [isVisible, setIsVisible] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('position');
  
  const presets = [
    { id: 'default', name: 'Default', icon: '📷' },
    { id: 'top-down', name: 'Top-Down', icon: '🔝' },
    { id: 'close-follow', name: 'Close Follow', icon: '👥' },
    { id: 'cinematic', name: 'Cinematic', icon: '🎬' },
    { id: 'first-person', name: 'First Person', icon: '👁️' }
  ];
  
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-4 bg-blue-800/80 hover:bg-blue-700/80 text-white p-3 rounded-full z-50"
        size="sm"
      >
        <Camera className="w-5 h-5" />
      </Button>
    );
  }
  
  return (
    <Card className="fixed bottom-20 right-4 w-80 bg-gray-900/90 text-white border-gray-600 z-50 max-h-[70vh] overflow-y-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-400" />
            Camera Controls
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
        {/* Camera Mode */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Camera Mode</label>
          <div className="grid grid-cols-2 gap-1">
            {['follow', 'free', 'top-down', 'first-person'].map((modeOption) => (
              <Button
                key={modeOption}
                onClick={() => setMode(modeOption as any)}
                variant={mode === modeOption ? "default" : "outline"}
                size="sm"
                className="text-xs"
              >
                {modeOption.replace('-', ' ')}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quick Presets</label>
          <div className="grid grid-cols-2 gap-1">
            {presets.map(preset => (
              <Button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1"
              >
                <span>{preset.icon}</span>
                {preset.name}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Position Controls */}
        <div className="space-y-2">
          <Button
            onClick={() => toggleSection('position')}
            variant="ghost"
            className="w-full flex items-center justify-between p-2"
          >
            <span className="flex items-center gap-2">
              <Move3D className="w-4 h-4" />
              Position & Angles
            </span>
            {expandedSection === 'position' ? 
              <ChevronUp className="w-4 h-4" /> : 
              <ChevronDown className="w-4 h-4" />
            }
          </Button>
          
          {expandedSection === 'position' && (
            <div className="space-y-3 pl-4">
              {/* Offset Controls */}
              <div className="space-y-2">
                <label className="text-xs text-gray-400">X Offset: {offsetX.toFixed(1)}</label>
                <Slider
                  value={[offsetX]}
                  onValueChange={([value]) => setOffset(value, offsetY, offsetZ)}
                  min={-20}
                  max={20}
                  step={0.5}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Y Offset (Height): {offsetY.toFixed(1)}</label>
                <Slider
                  value={[offsetY]}
                  onValueChange={([value]) => setOffset(offsetX, value, offsetZ)}
                  min={1}
                  max={30}
                  step={0.5}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Z Offset (Distance): {offsetZ.toFixed(1)}</label>
                <Slider
                  value={[offsetZ]}
                  onValueChange={([value]) => setOffset(offsetX, offsetY, value)}
                  min={-20}
                  max={20}
                  step={0.5}
                />
              </div>
              
              {/* Angle Controls */}
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Pitch (Up/Down): {pitch.toFixed(0)}°</label>
                <Slider
                  value={[pitch]}
                  onValueChange={([value]) => setPitch(value)}
                  min={-90}
                  max={90}
                  step={1}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Yaw (Left/Right): {yaw.toFixed(0)}°</label>
                <Slider
                  value={[yaw]}
                  onValueChange={([value]) => setYaw(value)}
                  min={-180}
                  max={180}
                  step={1}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Behavior Controls */}
        <div className="space-y-2">
          <Button
            onClick={() => toggleSection('behavior')}
            variant="ghost"
            className="w-full flex items-center justify-between p-2"
          >
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Behavior
            </span>
            {expandedSection === 'behavior' ? 
              <ChevronUp className="w-4 h-4" /> : 
              <ChevronDown className="w-4 h-4" />
            }
          </Button>
          
          {expandedSection === 'behavior' && (
            <div className="space-y-3 pl-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Follow Speed: {followSpeed.toFixed(1)}</label>
                <Slider
                  value={[followSpeed]}
                  onValueChange={([value]) => setFollowSpeed(value)}
                  min={0.1}
                  max={20}
                  step={0.1}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Smoothing: {smoothing.toFixed(2)}</label>
                <Slider
                  value={[smoothing]}
                  onValueChange={([value]) => setSmoothing(value)}
                  min={0.01}
                  max={1}
                  step={0.01}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Field of View: {fov.toFixed(0)}°</label>
                <Slider
                  value={[fov]}
                  onValueChange={([value]) => setFOV(value)}
                  min={30}
                  max={120}
                  step={1}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">Look at Target</label>
                <Switch
                  checked={lookAtTarget}
                  onCheckedChange={setLookAtTarget}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">Manual Orbit (Right-click / 2-finger)</label>
                <Switch
                  checked={allowOrbitControls}
                  onCheckedChange={setAllowOrbitControls}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Reset Button */}
        <Button
          onClick={resetToDefault}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </Button>
        
        {/* Current Settings Info */}
        <div className="text-xs text-gray-400 space-y-1 border-t border-gray-600 pt-2">
          <div>Mode: {mode}</div>
          <div>Position: [{offsetX.toFixed(1)}, {offsetY.toFixed(1)}, {offsetZ.toFixed(1)}]</div>
          <div>Angles: {pitch.toFixed(0)}° / {yaw.toFixed(0)}°</div>
        </div>
      </CardContent>
    </Card>
  );
}