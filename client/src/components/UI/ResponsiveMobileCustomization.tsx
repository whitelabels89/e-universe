import React, { useState, useEffect } from "react";
import { useAvatarCustomization } from "../../lib/stores/useAvatarCustomization";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "../../hooks/use-is-mobile";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Palette, 
  User, 
  Shirt, 
  Star, 
  Target,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  Scissors
} from "lucide-react";

const MOBILE_CUSTOMIZATION_OPTIONS = {
  skinTones: [
    { color: "#FFCC80", name: "Light" },
    { color: "#DEB887", name: "Fair" },
    { color: "#F4A460", name: "Medium" },
    { color: "#CD853F", name: "Olive" },
    { color: "#8B4513", name: "Dark" },
    { color: "#654321", name: "Deep" }
  ],
  hairColors: [
    { color: "#8D6E63", name: "Brown" },
    { color: "#5D4037", name: "Dark Brown" },
    { color: "#FFC107", name: "Blonde" },
    { color: "#FF9800", name: "Auburn" },
    { color: "#795548", name: "Light Brown" },
    { color: "#000000", name: "Black" },
    { color: "#E91E63", name: "Pink" },
    { color: "#9C27B0", name: "Purple" }
  ],
  eyeColors: [
    { color: "#333333", name: "Brown" },
    { color: "#8B4513", name: "Hazel" },
    { color: "#228B22", name: "Green" },
    { color: "#4169E1", name: "Blue" },
    { color: "#808080", name: "Gray" },
    { color: "#000000", name: "Black" }
  ],
  clothingColors: [
    { color: "#4A90E2", name: "Blue" },
    { color: "#50C878", name: "Green" },
    { color: "#FF6B6B", name: "Red" },
    { color: "#9B59B6", name: "Purple" },
    { color: "#FF9800", name: "Orange" },
    { color: "#34495E", name: "Navy" },
    { color: "#E74C3C", name: "Crimson" },
    { color: "#F39C12", name: "Gold" }
  ]
};

const MOBILE_STEPS = [
  { id: "appearance", title: "Look", icon: User, description: "Your appearance" },
  { id: "style", title: "Style", icon: Shirt, description: "Clothing & accessories" },
  { id: "personality", title: "You", icon: Star, description: "Who you are" },
  { id: "complete", title: "Done", icon: CheckCircle, description: "All set!" }
];

export function ResponsiveMobileCustomization() {
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(0);
  const [showMobileWizard, setShowMobileWizard] = useState(false);
  
  const { 
    customization, 
    showCustomizationPanel,
    updateBodyColor,
    updateHeadColor,
    updateHairColor,
    updateEyeColor,
    updateClothingColor,
    updatePersonality,
    updateName,
    toggleCustomizationPanel,
    saveToStorage
  } = useAvatarCustomization();

  // Auto-show mobile wizard on mobile devices
  useEffect(() => {
    if (isMobile && showCustomizationPanel) {
      setShowMobileWizard(true);
    } else {
      setShowMobileWizard(false);
    }
  }, [isMobile, showCustomizationPanel]);

  if (!isMobile || !showMobileWizard) return null;

  const handleColorSelect = (color: string, type: 'skin' | 'hair' | 'eye' | 'clothing') => {
    switch(type) {
      case 'skin':
        updateBodyColor(color);
        updateHeadColor(color);
        break;
      case 'hair':
        updateHairColor(color);
        break;
      case 'eye':
        updateEyeColor(color);
        break;
      case 'clothing':
        updateClothingColor(color);
        break;
    }
  };

  const nextStep = () => {
    if (currentStep < MOBILE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeMobileWizard = () => {
    setShowMobileWizard(false);
    setCurrentStep(0);
    toggleCustomizationPanel();
    saveToStorage();
  };

  const renderMobileStepContent = () => {
    const step = MOBILE_STEPS[currentStep];
    
    switch(step.id) {
      case "appearance":
        return (
          <div className="space-y-6">
            {/* Avatar Preview */}
            <div className="text-center mb-6">
              <div 
                className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl shadow-lg"
                style={{ 
                  backgroundColor: customization.bodyColor,
                  background: `linear-gradient(145deg, ${customization.bodyColor}, ${customization.clothingColor})`
                }}
              >
                👧
              </div>
              <input
                type="text"
                value={customization.name}
                onChange={(e) => updateName(e.target.value)}
                className="text-xl font-bold text-white bg-transparent border-b-2 border-white/30 text-center focus:border-blue-400 focus:outline-none"
                placeholder="Your name"
                maxLength={20}
              />
            </div>

            {/* Skin Tone */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-white" />
                <label className="text-white font-medium">Skin Tone</label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {MOBILE_CUSTOMIZATION_OPTIONS.skinTones.map((tone) => (
                  <button
                    key={tone.color}
                    onClick={() => handleColorSelect(tone.color, 'skin')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      customization.bodyColor === tone.color 
                        ? 'border-white ring-2 ring-blue-400 scale-105' 
                        : 'border-white/30'
                    }`}
                    style={{ backgroundColor: tone.color }}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 rounded-full mx-auto mb-1" style={{ backgroundColor: tone.color }}></div>
                      <span className="text-xs text-white font-medium">{tone.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Color */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Scissors className="w-5 h-5 text-white" />
                <label className="text-white font-medium">Hair Color</label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {MOBILE_CUSTOMIZATION_OPTIONS.hairColors.map((hair) => (
                  <button
                    key={hair.color}
                    onClick={() => handleColorSelect(hair.color, 'hair')}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      customization.hairColor === hair.color 
                        ? 'border-white ring-2 ring-blue-400' 
                        : 'border-white/30'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{ backgroundColor: hair.color }}></div>
                    <span className="text-xs text-white">{hair.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Eye Color */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-white" />
                <label className="text-white font-medium">Eye Color</label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {MOBILE_CUSTOMIZATION_OPTIONS.eyeColors.map((eye) => (
                  <button
                    key={eye.color}
                    onClick={() => handleColorSelect(eye.color, 'eye')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      customization.eyeColor === eye.color 
                        ? 'border-white ring-2 ring-blue-400' 
                        : 'border-white/30'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full mx-auto mb-1 border border-white/20" style={{ backgroundColor: eye.color }}></div>
                    <span className="text-xs text-white font-medium">{eye.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "style":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Choose Your Style</h3>
              <p className="text-gray-300 text-sm">Pick colors and accessories that express who you are</p>
            </div>

            {/* Clothing Colors */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shirt className="w-5 h-5 text-white" />
                <label className="text-white font-medium">Clothing Color</label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {MOBILE_CUSTOMIZATION_OPTIONS.clothingColors.map((clothing) => (
                  <button
                    key={clothing.color}
                    onClick={() => handleColorSelect(clothing.color, 'clothing')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      customization.clothingColor === clothing.color 
                        ? 'border-white ring-2 ring-blue-400' 
                        : 'border-white/30'
                    }`}
                  >
                    <div className="w-8 h-8 rounded mx-auto mb-1" style={{ backgroundColor: clothing.color }}></div>
                    <span className="text-xs text-white">{clothing.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Presets */}
            <div>
              <label className="text-white font-medium mb-3 block">Style Preset</label>
              <div className="space-y-2">
                {[
                  { id: "casual", name: "Casual & Comfy", emoji: "👕", desc: "Relaxed everyday look" },
                  { id: "formal", name: "Smart & Neat", emoji: "👔", desc: "Professional and tidy" },
                  { id: "creative", name: "Artistic & Fun", emoji: "🎨", desc: "Colorful and expressive" },
                  { id: "sporty", name: "Active & Ready", emoji: "🏃", desc: "Ready for action" }
                ].map((style) => (
                  <button
                    key={style.id}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      customization.clothingStyle === style.id
                        ? 'border-blue-400 bg-blue-600/20'
                        : 'border-white/30 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{style.emoji}</span>
                      <div>
                        <div className="text-white font-medium">{style.name}</div>
                        <div className="text-gray-300 text-xs">{style.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "personality":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">What Makes You Special?</h3>
              <p className="text-gray-300 text-sm">Choose a personality that represents who you are</p>
            </div>

            <div className="space-y-3">
              {[
                { id: "curious", name: "Curious Explorer", emoji: "🔍", desc: "Loves discovering new things" },
                { id: "creative", name: "Creative Artist", emoji: "🎨", desc: "Express yourself through art" },
                { id: "logical", name: "Smart Thinker", emoji: "🧠", desc: "Solves problems step by step" },
                { id: "social", name: "Team Player", emoji: "🤝", desc: "Enjoys working with others" },
                { id: "adventurous", name: "Brave Explorer", emoji: "⚡", desc: "Ready for any challenge" }
              ].map((personality) => (
                <button
                  key={personality.id}
                  onClick={() => updatePersonality(personality.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    customization.personality === personality.id
                      ? 'border-blue-400 bg-blue-600/20'
                      : 'border-white/30 bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{personality.emoji}</span>
                    <div>
                      <div className="text-white font-medium">{personality.name}</div>
                      <div className="text-gray-300 text-sm">{personality.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "complete":
        return (
          <div className="space-y-6 text-center">
            <div className="mb-6">
              <div className="w-28 h-28 mx-auto mb-4 rounded-full flex items-center justify-center text-5xl shadow-xl"
                   style={{ 
                     backgroundColor: customization.bodyColor,
                     background: `linear-gradient(145deg, ${customization.bodyColor}, ${customization.clothingColor})`
                   }}>
                👧
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">🎉 Avatar Complete!</h3>
              <h4 className="text-xl text-white mb-1">{customization.name}</h4>
              <p className="text-gray-300 text-sm">Ready to explore the Education Universe</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-300">Personality:</span>
                  <div className="text-white font-medium capitalize">{customization.personality}</div>
                </div>
                <div>
                  <span className="text-gray-300">Style:</span>
                  <div className="text-white font-medium capitalize">{customization.clothingStyle}</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600/20 rounded-xl p-4 border border-blue-400/30">
              <div className="text-blue-200 text-sm">
                Your personalized avatar is saved and ready! You can customize it again anytime from the profile menu.
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
      <div className="flex flex-col h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Mobile Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-white" />
            <h2 className="text-white text-lg font-bold">Customize Avatar</h2>
          </div>
          <button
            onClick={closeMobileWizard}
            className="p-2 rounded-lg bg-white/10 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress */}
        <div className="flex-shrink-0 p-4">
          <div className="flex items-center justify-between mb-2">
            {MOBILE_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < MOBILE_STEPS.length - 1 ? 'flex-1' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index === currentStep 
                    ? 'bg-blue-600 text-white' 
                    : index < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-white/20 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < MOBILE_STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    index < currentStep ? 'bg-green-600' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="text-white font-medium">{MOBILE_STEPS[currentStep].title}</h3>
            <p className="text-gray-300 text-sm">{MOBILE_STEPS[currentStep].description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderMobileStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex-shrink-0 p-4 border-t border-white/20">
          <div className="flex justify-between gap-3">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep < MOBILE_STEPS.length - 1 ? (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                size="lg"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={closeMobileWizard}
                className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                size="lg"
              >
                Complete
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}