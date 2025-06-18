import React from "react";
import { useAvatarCustomization } from "../../lib/stores/useAvatarCustomization";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, User, Palette, Shirt, Star, Target, CheckCircle } from "lucide-react";

const CUSTOMIZATION_OPTIONS = {
  grades: ["Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"],
  subjects: ["Math", "Science", "English", "History", "Art", "Music", "Coding", "Sports"],
  learningGoals: [
    "Master math and science",
    "Learn programming and technology", 
    "Improve reading and writing",
    "Explore art and creativity",
    "Develop leadership skills",
    "Understand the world better"
  ],
  skinTones: ["#FFCC80", "#DEB887", "#F4A460", "#CD853F", "#8B4513", "#654321"],
  hairColors: ["#8D6E63", "#5D4037", "#FFC107", "#FF9800", "#795548", "#000000", "#E91E63", "#9C27B0"],
  hairStyles: [
    { id: "short", name: "Short & Neat", emoji: "✂️" },
    { id: "medium", name: "Medium Length", emoji: "💇" },
    { id: "long", name: "Long & Flowing", emoji: "💁" },
    { id: "curly", name: "Curly & Fun", emoji: "🌀", unlocked: false },
    { id: "braids", name: "Stylish Braids", emoji: "🎀", unlocked: false }
  ],
  eyeColors: ["#333333", "#8B4513", "#228B22", "#4169E1", "#808080", "#000000"],
  eyeShapes: [
    { id: "round", name: "Round", emoji: "👁️" },
    { id: "almond", name: "Almond", emoji: "🥰" },
    { id: "wide", name: "Wide", emoji: "😊" }
  ],
  clothingColors: ["#4A90E2", "#50C878", "#FF6B6B", "#9B59B6", "#FF9800", "#34495E", "#E74C3C", "#F39C12"],
  clothingStyles: [
    { id: "casual", name: "Casual Wear", emoji: "👕", unlocked: true },
    { id: "formal", name: "Formal Attire", emoji: "👔", unlocked: true },
    { id: "sporty", name: "Sporty Look", emoji: "🏃", unlocked: false },
    { id: "artistic", name: "Creative Style", emoji: "🎨", unlocked: false }
  ],
  accessories: [
    { id: "none", name: "No Accessories", emoji: "😊", unlocked: true },
    { id: "glasses", name: "Cool Glasses", emoji: "🤓", unlocked: true },
    { id: "hat", name: "Stylish Hat", emoji: "🎩", unlocked: false },
    { id: "backpack", name: "Adventure Backpack", emoji: "🎒", unlocked: false }
  ],
  personalities: [
    { id: "curious", name: "Curious Explorer", emoji: "🔍", description: "Loves discovering new things" },
    { id: "creative", name: "Creative Artist", emoji: "🎨", description: "Express yourself through art" },
    { id: "logical", name: "Logical Thinker", emoji: "🧠", description: "Solves problems step by step" },
    { id: "social", name: "Social Butterfly", emoji: "🦋", description: "Enjoys working with others" },
    { id: "adventurous", name: "Brave Adventurer", emoji: "⚡", description: "Ready for any challenge" }
  ],
  activities: [
    { id: "reading", name: "Reading & Learning", emoji: "📚" },
    { id: "building", name: "Building & Creating", emoji: "🏗️" },
    { id: "exploring", name: "Exploring Worlds", emoji: "🌍" },
    { id: "solving", name: "Solving Puzzles", emoji: "🧩" },
    { id: "coding", name: "Coding & Programming", emoji: "💻" }
  ]
};

const WIZARD_STEPS = [
  { id: 0, title: "Personal Info", icon: User, description: "Tell us about yourself" },
  { id: 1, title: "Appearance", icon: Palette, description: "Choose your look" },
  { id: 2, title: "Style & Fashion", icon: Shirt, description: "Pick your style" },
  { id: 3, title: "Personality", icon: Star, description: "What makes you unique" },
  { id: 4, title: "Goals & Interests", icon: Target, description: "Your learning journey" },
  { id: 5, title: "Complete", icon: CheckCircle, description: "Review your avatar" }
];

export function PersonalizedAvatarWizard() {
  const { 
    customization, 
    showCustomizationPanel,
    isWizardMode,
    wizardStep,
    updateName,
    updateNickname,
    updateGrade,
    updateFavoriteSubject,
    updateLearningGoal,
    updateBodyColor,
    updateHeadColor,
    updateHairColor,
    updateHairStyle,
    updateEyeColor,
    updateEyeShape,
    updateClothingColor,
    updateClothingStyle,
    updateAccessoryType,
    updatePersonality,
    updateFavoriteActivity,
    nextWizardStep,
    prevWizardStep,
    completeWizard,
    toggleCustomizationPanel
  } = useAvatarCustomization();

  // Don't show desktop wizard on mobile
  const isMobile = window.innerWidth <= 768;
  if (!showCustomizationPanel || !isWizardMode || isMobile) return null;

  const currentStep = WIZARD_STEPS[wizardStep];

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

  const renderStepContent = () => {
    switch(wizardStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Welcome to Your Avatar Journey!</h3>
              <p className="text-gray-300 text-sm">Let's create a personalized avatar that represents you in the Education Universe</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white font-medium mb-2 block">What's your name?</label>
                <input
                  type="text"
                  value={customization.name}
                  onChange={(e) => updateName(e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="Enter your first name"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Nickname (optional)</label>
                <input
                  type="text"
                  value={customization.nickname}
                  onChange={(e) => updateNickname(e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="What do friends call you?"
                  maxLength={15}
                />
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Grade Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {CUSTOMIZATION_OPTIONS.grades.map((grade) => (
                    <Button
                      key={grade}
                      onClick={() => updateGrade(grade)}
                      variant={customization.grade === grade ? "default" : "outline"}
                      className={`${
                        customization.grade === grade 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      }`}
                    >
                      {grade}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Design Your Appearance</h3>
              <p className="text-gray-300 text-sm">Choose features that make your avatar uniquely you</p>
            </div>

            {/* Skin Tone */}
            <div>
              <label className="text-white font-medium mb-3 block">Skin Tone</label>
              <div className="grid grid-cols-6 gap-3">
                {CUSTOMIZATION_OPTIONS.skinTones.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color, 'skin')}
                    className={`w-10 h-10 rounded-full border-3 transition-all hover:scale-110 ${
                      customization.bodyColor === color ? 'border-white ring-2 ring-blue-400' : 'border-white/30'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Hair Color */}
            <div>
              <label className="text-white font-medium mb-3 block">Hair Color</label>
              <div className="grid grid-cols-8 gap-3">
                {CUSTOMIZATION_OPTIONS.hairColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color, 'hair')}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      customization.hairColor === color ? 'border-white ring-2 ring-blue-400' : 'border-white/30'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Hair Style */}
            <div>
              <label className="text-white font-medium mb-3 block">Hair Style</label>
              <div className="grid grid-cols-2 gap-2">
                {CUSTOMIZATION_OPTIONS.hairStyles.map((style) => (
                  <Button
                    key={style.id}
                    onClick={() => updateHairStyle(style.id)}
                    disabled={style.unlocked === false}
                    className={`p-3 h-auto flex flex-col items-center gap-1 text-xs ${
                      customization.hairStyle === style.id
                        ? "bg-blue-600 text-white"
                        : style.unlocked === false
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }`}
                  >
                    <span className="text-lg">{style.emoji}</span>
                    <span className="text-xs text-center">{style.name}</span>
                    {style.unlocked === false && (
                      <span className="text-xs text-yellow-400">🔒</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Eye Color */}
            <div>
              <label className="text-white font-medium mb-3 block">Eye Color</label>
              <div className="grid grid-cols-6 gap-3">
                {CUSTOMIZATION_OPTIONS.eyeColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color, 'eye')}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      customization.eyeColor === color ? 'border-white ring-2 ring-blue-400' : 'border-white/30'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Express Your Style</h3>
              <p className="text-gray-300 text-sm">Pick clothing and accessories that show your personality</p>
            </div>

            {/* Clothing Color */}
            <div>
              <label className="text-white font-medium mb-3 block">Clothing Color</label>
              <div className="grid grid-cols-8 gap-3">
                {CUSTOMIZATION_OPTIONS.clothingColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color, 'clothing')}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      customization.clothingColor === color ? 'border-white ring-2 ring-blue-400' : 'border-white/30'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Clothing Style */}
            <div>
              <label className="text-white font-medium mb-3 block">Clothing Style</label>
              <div className="grid grid-cols-2 gap-3">
                {CUSTOMIZATION_OPTIONS.clothingStyles.map((style) => (
                  <Button
                    key={style.id}
                    onClick={() => updateClothingStyle(style.id)}
                    disabled={!style.unlocked}
                    className={`p-4 h-auto flex flex-col items-center gap-2 ${
                      customization.clothingStyle === style.id
                        ? "bg-blue-600 text-white"
                        : !style.unlocked
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }`}
                  >
                    <span className="text-2xl">{style.emoji}</span>
                    <span className="text-sm">{style.name}</span>
                    {!style.unlocked && (
                      <span className="text-xs text-yellow-400">🔒 Unlock later</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Accessories */}
            <div>
              <label className="text-white font-medium mb-3 block">Accessories</label>
              <div className="grid grid-cols-2 gap-3">
                {CUSTOMIZATION_OPTIONS.accessories.map((accessory) => (
                  <Button
                    key={accessory.id}
                    onClick={() => updateAccessoryType(accessory.id)}
                    disabled={!accessory.unlocked}
                    className={`p-4 h-auto flex flex-col items-center gap-2 ${
                      customization.accessoryType === accessory.id
                        ? "bg-blue-600 text-white"
                        : !accessory.unlocked
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }`}
                  >
                    <span className="text-2xl">{accessory.emoji}</span>
                    <span className="text-sm">{accessory.name}</span>
                    {!accessory.unlocked && (
                      <span className="text-xs text-yellow-400">🔒 Unlock later</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">What Makes You Special?</h3>
              <p className="text-gray-300 text-sm">Choose a personality that represents who you are</p>
            </div>

            <div className="space-y-3">
              {CUSTOMIZATION_OPTIONS.personalities.map((personality) => (
                <Button
                  key={personality.id}
                  onClick={() => updatePersonality(personality.id)}
                  className={`w-full p-4 h-auto flex items-start gap-4 text-left ${
                    customization.personality === personality.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  }`}
                >
                  <span className="text-3xl">{personality.emoji}</span>
                  <div>
                    <div className="font-medium">{personality.name}</div>
                    <div className="text-sm opacity-80">{personality.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Your Learning Journey</h3>
              <p className="text-gray-300 text-sm">Tell us what you love to learn and explore</p>
            </div>

            <div>
              <label className="text-white font-medium mb-3 block">Favorite Subject</label>
              <div className="grid grid-cols-4 gap-2">
                {CUSTOMIZATION_OPTIONS.subjects.map((subject) => (
                  <Button
                    key={subject}
                    onClick={() => updateFavoriteSubject(subject)}
                    className={`text-sm ${
                      customization.favoriteSubject === subject
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }`}
                  >
                    {subject}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-white font-medium mb-3 block">Learning Goal</label>
              <div className="space-y-2">
                {CUSTOMIZATION_OPTIONS.learningGoals.map((goal) => (
                  <Button
                    key={goal}
                    onClick={() => updateLearningGoal(goal)}
                    className={`w-full text-left p-3 ${
                      customization.learningGoal === goal
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }`}
                  >
                    {goal}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-white font-medium mb-3 block">Favorite Activity</label>
              <div className="grid grid-cols-1 gap-2">
                {CUSTOMIZATION_OPTIONS.activities.map((activity) => (
                  <Button
                    key={activity.id}
                    onClick={() => updateFavoriteActivity(activity.id)}
                    className={`flex items-center gap-3 p-3 ${
                      customization.favoriteActivity === activity.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }`}
                  >
                    <span className="text-xl">{activity.emoji}</span>
                    <span>{activity.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">🎉 Your Avatar is Ready!</h3>
              <p className="text-gray-300 text-sm">Review your personalized avatar and start your learning adventure</p>
            </div>

            <div className="bg-white/10 rounded-lg p-6 space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-b rounded-full flex items-center justify-center text-4xl"
                     style={{ 
                       backgroundColor: customization.bodyColor,
                       background: `linear-gradient(to bottom, ${customization.bodyColor}, ${customization.clothingColor})`
                     }}>
                  👧
                </div>
                <h4 className="text-white text-lg font-bold">
                  {customization.name}
                  {customization.nickname && ` "${customization.nickname}"`}
                </h4>
                <p className="text-gray-300 text-sm">{customization.grade} Student</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-300">Favorite Subject:</span>
                  <div className="text-white font-medium">{customization.favoriteSubject}</div>
                </div>
                <div>
                  <span className="text-gray-300">Personality:</span>
                  <div className="text-white font-medium capitalize">{customization.personality}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-300">Learning Goal:</span>
                  <div className="text-white font-medium">{customization.learningGoal}</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-400/30">
              <div className="text-blue-200 text-sm text-center">
                🌟 As you progress through the Education Universe, you'll unlock new hairstyles, clothing, and accessories to further customize your avatar!
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-xl border border-white/20 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-2xl font-bold">Avatar Customization Wizard</h2>
            <button
              onClick={toggleCustomizationPanel}
              className="text-white/70 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {WIZARD_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  index === wizardStep 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : index < wizardStep
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'border-gray-500 text-gray-400'
                }`}>
                  {index < wizardStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                {index < WIZARD_STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${
                    index < wizardStep ? 'bg-green-600' : 'bg-gray-500'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-3">
            <h3 className="text-white font-medium">{currentStep.title}</h3>
            <p className="text-gray-400 text-sm">{currentStep.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t border-white/10 flex justify-between">
          <Button
            onClick={prevWizardStep}
            disabled={wizardStep === 0}
            className="bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            size="sm"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {wizardStep < 5 ? (
            <Button
              onClick={nextWizardStep}
              className="bg-blue-600 text-white hover:bg-blue-700"
              size="sm"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={completeWizard}
              className="bg-green-600 text-white hover:bg-green-700"
              size="sm"
            >
              Complete Avatar
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}