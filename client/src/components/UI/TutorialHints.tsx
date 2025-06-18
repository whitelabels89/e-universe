import { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';
import { Card, CardContent } from './card';
import { Button } from './button';
import { useCampus } from '../../lib/stores/useCampus';

interface Hint {
  id: string;
  message: string;
  trigger: 'building-enter' | 'first-movement' | 'camera-use';
  priority: number;
}

const CONTEXT_HINTS: Hint[] = [
  {
    id: 'building-esc',
    message: 'Press ESC to exit the building',
    trigger: 'building-enter',
    priority: 1
  },
  {
    id: 'camera-orbit',
    message: 'Right-click and drag to look around',
    trigger: 'first-movement',
    priority: 2
  },
  {
    id: 'trackpad-gesture',
    message: 'Use 2-finger gestures on trackpad to rotate camera',
    trigger: 'camera-use',
    priority: 3
  }
];

export function TutorialHints() {
  const [activeHints, setActiveHints] = useState<Hint[]>([]);
  const [dismissedHints, setDismissedHints] = useState<string[]>([]);
  const { isInsideBuilding } = useCampus();

  // Load dismissed hints from localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem('dismissed-hints');
    if (dismissed) {
      setDismissedHints(JSON.parse(dismissed));
    }
  }, []);

  // Show building hint when entering
  useEffect(() => {
    if (isInsideBuilding && !dismissedHints.includes('building-esc')) {
      const hint = CONTEXT_HINTS.find(h => h.id === 'building-esc');
      if (hint && !activeHints.find(h => h.id === hint.id)) {
        setActiveHints(prev => [...prev, hint]);
      }
    }
  }, [isInsideBuilding, dismissedHints, activeHints]);

  const dismissHint = (hintId: string) => {
    setActiveHints(prev => prev.filter(h => h.id !== hintId));
    const newDismissed = [...dismissedHints, hintId];
    setDismissedHints(newDismissed);
    localStorage.setItem('dismissed-hints', JSON.stringify(newDismissed));
  };

  if (activeHints.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-30 space-y-2">
      {activeHints
        .sort((a, b) => a.priority - b.priority)
        .slice(0, 2) // Show max 2 hints at once
        .map((hint) => (
          <Card key={hint.id} className="w-72 bg-blue-900/90 border-blue-700 text-white animate-slide-in-right">
            <CardContent className="p-3 flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-300 flex-shrink-0" />
              <p className="text-sm flex-1">{hint.message}</p>
              <Button
                onClick={() => dismissHint(hint.id)}
                variant="ghost"
                size="sm"
                className="text-blue-300 hover:text-white h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </CardContent>
          </Card>
        ))
      }
    </div>
  );
}