import { useState, useEffect } from 'react';
import { X, Camera, MousePointer2, Hand, RotateCcw, ZoomIn, Settings } from 'lucide-react';
import { Card, CardContent } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { useCampus } from '../../lib/stores/useCampus';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  position: { x: string; y: string };
  highlight?: string;
  action?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Camera Controls Tutorial',
    description: 'Learn how to navigate and control the camera in your 3D world. This tutorial will guide you through all the camera features.',
    icon: <Camera className="w-6 h-6" />,
    position: { x: '50%', y: '50%' }
  },
  {
    id: 'basic-movement',
    title: 'Basic Movement',
    description: 'Use W, A, S, D keys to move your character. The camera automatically follows your movement.',
    icon: <MousePointer2 className="w-6 h-6" />,
    position: { x: '50%', y: '60%' },
    action: 'Try moving with WASD keys'
  },
  {
    id: 'mouse-orbit',
    title: 'Mouse Camera Control',
    description: 'Right-click and drag to rotate the camera around your character. Great for exploring your surroundings!',
    icon: <RotateCcw className="w-6 h-6" />,
    position: { x: '70%', y: '40%' },
    action: 'Right-click and drag to rotate camera'
  },
  {
    id: 'trackpad-gestures',
    title: 'Trackpad Gestures',
    description: 'Use 2-finger gestures on trackpad: swipe left/right to rotate, pinch to zoom in/out.',
    icon: <Hand className="w-6 h-6" />,
    position: { x: '30%', y: '40%' },
    action: 'Try 2-finger gestures on trackpad'
  },
  {
    id: 'zoom-controls',
    title: 'Zoom Controls',
    description: 'Use mouse wheel or pinch gesture to zoom in and out. Perfect for getting detailed views or wide perspectives.',
    icon: <ZoomIn className="w-6 h-6" />,
    position: { x: '50%', y: '30%' },
    action: 'Try scrolling to zoom'
  },
  {
    id: 'camera-settings',
    title: 'Camera Settings Panel',
    description: 'Click the camera icon in the bottom-right to access advanced camera settings, presets, and modes.',
    icon: <Settings className="w-6 h-6" />,
    position: { x: '85%', y: '85%' },
    highlight: 'camera-controls-button',
    action: 'Click the camera icon to open settings'
  },
  {
    id: 'auto-follow',
    title: 'Auto-Follow Mode',
    description: 'The camera automatically returns to follow mode after 3 seconds of inactivity. This keeps you centered in the action.',
    icon: <Camera className="w-6 h-6" />,
    position: { x: '50%', y: '70%' }
  },
  {
    id: 'building-interior',
    title: 'Interior Navigation',
    description: 'When inside buildings, camera controls adapt automatically. Use ESC key to exit buildings.',
    icon: <MousePointer2 className="w-6 h-6" />,
    position: { x: '50%', y: '40%' }
  }
];

export function CameraTutorial() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  const { isInsideBuilding } = useCampus();

  // Check if user has seen tutorial before
  useEffect(() => {
    const seen = localStorage.getItem('camera-tutorial-seen');
    console.log('Tutorial seen status:', seen);
    if (!seen) {
      // Show tutorial after 3 seconds for new users
      const timer = setTimeout(() => {
        console.log('Showing tutorial for new user');
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setHasSeenTutorial(true);
    }
  }, []);

  // Filter steps based on context
  const getRelevantSteps = () => {
    if (isInsideBuilding) {
      return TUTORIAL_STEPS.filter(step => 
        ['welcome', 'mouse-orbit', 'trackpad-gestures', 'zoom-controls', 'building-interior'].includes(step.id)
      );
    }
    return TUTORIAL_STEPS;
  };

  const relevantSteps = getRelevantSteps();
  const currentStepData = relevantSteps[currentStep];

  const nextStep = () => {
    if (currentStep < relevantSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    completeTutorial();
  };

  const completeTutorial = () => {
    setIsVisible(false);
    localStorage.setItem('camera-tutorial-seen', 'true');
    setHasSeenTutorial(true);
  };

  const restartTutorial = () => {
    setCurrentStep(0);
    setIsVisible(true);
  };

  // Add highlight effect for specific elements
  useEffect(() => {
    if (currentStepData?.highlight) {
      const element = document.getElementById(currentStepData.highlight);
      if (element) {
        element.classList.add('tutorial-highlight');
        return () => element.classList.remove('tutorial-highlight');
      }
    }
  }, [currentStepData]);

  if (!isVisible) {
    return hasSeenTutorial ? (
      <Button
        onClick={restartTutorial}
        className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white"
        size="sm"
      >
        <Camera className="w-4 h-4 mr-2" />
        Camera Tutorial
      </Button>
    ) : null;
  }

  return (
    <>
      {/* Overlay backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Tutorial card */}
      <div
        className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: currentStepData.position.x,
          top: currentStepData.position.y,
        }}
      >
        <Card className="w-80 bg-gray-900 border-gray-700 text-white shadow-2xl">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  {currentStepData.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{currentStepData.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    Step {currentStep + 1} of {relevantSteps.length}
                  </Badge>
                </div>
              </div>
              <Button
                onClick={skipTutorial}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <p className="text-gray-300 mb-4 leading-relaxed">
              {currentStepData.description}
            </p>

            {/* Action hint */}
            {currentStepData.action && (
              <div className="mb-4 p-3 bg-blue-900 bg-opacity-50 rounded-lg border border-blue-700">
                <p className="text-blue-200 text-sm font-medium">
                  Try it: {currentStepData.action}
                </p>
              </div>
            )}

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Progress</span>
                <span>{Math.round(((currentStep + 1) / relevantSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / relevantSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                <Button
                  onClick={skipTutorial}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  Skip Tutorial
                </Button>
                <Button
                  onClick={nextStep}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {currentStep === relevantSteps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating hints for specific controls */}
      {currentStepData.id === 'camera-settings' && (
        <div className="fixed bottom-20 right-4 z-50">
          <div className="animate-bounce">
            <div className="bg-yellow-500 text-black px-3 py-2 rounded-lg font-medium text-sm shadow-lg">
              Click here! ↓
            </div>
          </div>
        </div>
      )}
    </>
  );
}