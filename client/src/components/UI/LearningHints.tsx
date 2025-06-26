import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Lightbulb, Code, Zap, Target } from 'lucide-react';

interface Hint {
  id: string;
  title: string;
  description: string;
  code?: string;
  trigger: 'python_editor' | 'first_spawn' | 'avatar_move' | 'creative_mode';
  icon: React.ReactNode;
  position: { x: string; y: string };
}

const LEARNING_HINTS: Hint[] = [
  {
    id: 'python_basics',
    title: 'Python Dasar',
    description: 'Gunakan define_shape() untuk membuat bentuk custom, lalu spawn_custom() untuk memunculkannya di dunia 3D!',
    code: 'define_shape("rumah", {\n  "vertices": [[0,0], [2,0], [2,2], [0,2]],\n  "color": "blue"\n})\nspawn_custom("rumah")',
    trigger: 'python_editor',
    icon: <Code className="w-4 h-4" />,
    position: { x: '70%', y: '20%' }
  },
  {
    id: 'auto_positioning',
    title: 'Auto Positioning',
    description: 'Tidak perlu koordinat! Semua spawn functions otomatis muncul di depan karaktermu.',
    code: 'spawn_npc("robot_helper")  # Otomatis di depan!\nspawn_custom("star")       # Mudah!',
    trigger: 'first_spawn',
    icon: <Target className="w-4 h-4" />,
    position: { x: '20%', y: '30%' }
  },
  {
    id: 'movement_tips',
    title: 'Kontrol Gerakan',
    description: 'Gunakan WASD atau arrow keys untuk bergerak. Spasi untuk melompat!',
    trigger: 'avatar_move',
    icon: <Zap className="w-4 h-4" />,
    position: { x: '10%', y: '70%' }
  },
  {
    id: 'creative_features',
    title: 'Mode Kreatif',
    description: 'Buat NPC dengan pesan custom! define_npc() lalu spawn_npc() untuk karakter interaktif.',
    code: 'define_npc("guru", {\n  "message": "Selamat datang di dunia coding!",\n  "scale": [1.5, 1.5, 1.5]\n})',
    trigger: 'creative_mode',
    icon: <Lightbulb className="w-4 h-4" />,
    position: { x: '50%', y: '10%' }
  }
];

export function LearningHints() {
  const [activeHints, setActiveHints] = useState<string[]>([]);
  const [dismissedHints, setDismissedHints] = useState<string[]>([]);
  const [selectedHint, setSelectedHint] = useState<Hint | null>(null);

  useEffect(() => {
    // Show initial hint
    setTimeout(() => {
      triggerHint('python_editor');
    }, 2000);

    // Listen for custom events to trigger hints
    const handlePythonExecution = () => triggerHint('first_spawn');
    const handleAvatarMove = () => triggerHint('avatar_move');
    const handleCreativeMode = () => triggerHint('creative_mode');

    window.addEventListener('python_executed', handlePythonExecution);
    window.addEventListener('avatar_moved', handleAvatarMove);
    window.addEventListener('creative_mode_active', handleCreativeMode);

    return () => {
      window.removeEventListener('python_executed', handlePythonExecution);
      window.removeEventListener('avatar_moved', handleAvatarMove);
      window.removeEventListener('creative_mode_active', handleCreativeMode);
    };
  }, []);

  const triggerHint = (trigger: Hint['trigger']) => {
    const hint = LEARNING_HINTS.find(h => h.trigger === trigger);
    if (hint && !dismissedHints.includes(hint.id) && !activeHints.includes(hint.id)) {
      setActiveHints(prev => [...prev, hint.id]);
      
      // Auto-dismiss after 10 seconds
      setTimeout(() => {
        dismissHint(hint.id);
      }, 10000);
    }
  };

  const dismissHint = (hintId: string) => {
    setActiveHints(prev => prev.filter(id => id !== hintId));
    setDismissedHints(prev => [...prev, hintId]);
    if (selectedHint?.id === hintId) {
      setSelectedHint(null);
    }
  };

  const showHintDetails = (hint: Hint) => {
    setSelectedHint(hint);
  };

  return (
    <>
      {/* Floating Hint Indicators */}
      <AnimatePresence>
        {activeHints.map(hintId => {
          const hint = LEARNING_HINTS.find(h => h.id === hintId);
          if (!hint) return null;

          return (
            <motion.div
              key={hint.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="fixed z-50 cursor-pointer"
              style={{ left: hint.position.x, top: hint.position.y }}
              onClick={() => showHintDetails(hint)}
            >
              <motion.div
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(59, 130, 246, 0.7)',
                    '0 0 0 10px rgba(59, 130, 246, 0)',
                    '0 0 0 0 rgba(59, 130, 246, 0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
              >
                {hint.icon}
              </motion.div>
              
              {/* Quick preview tooltip */}
              <div className="absolute left-12 top-0 bg-black text-white text-sm px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                {hint.title}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Detailed Hint Modal */}
      <AnimatePresence>
        {selectedHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setSelectedHint(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  {selectedHint.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{selectedHint.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-4">{selectedHint.description}</p>
              
              {selectedHint.code && (
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg mb-4 text-sm font-mono overflow-x-auto">
                  <pre>{selectedHint.code}</pre>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => dismissHint(selectedHint.id)}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Mengerti!
                </button>
                <button
                  onClick={() => setSelectedHint(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint Toggle Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          onClick={() => {
            // Show a random hint that hasn't been dismissed
            const availableHints = LEARNING_HINTS.filter(h => !dismissedHints.includes(h.id));
            if (availableHints.length > 0) {
              const randomHint = availableHints[Math.floor(Math.random() * availableHints.length)];
              showHintDetails(randomHint);
            }
          }}
        >
          <Info className="w-5 h-5" />
        </motion.button>
      </div>
    </>
  );
}