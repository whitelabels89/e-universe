import React, { useEffect } from "react";
import { useAvatarCustomization } from "../../lib/stores/useAvatarCustomization";

const COLOR_PRESETS = {
  skinTones: ["#FFCC80", "#DEB887", "#F4A460", "#CD853F", "#8B4513", "#654321"],
  hairColors: ["#8D6E63", "#5D4037", "#FFC107", "#FF9800", "#795548", "#000000"],
  clothingColors: ["#4A90E2", "#50C878", "#FF6B6B", "#9B59B6", "#FF9800", "#34495E"],
  eyeColors: ["#333333", "#8B4513", "#228B22", "#4169E1", "#808080", "#000000"]
};

export function AvatarCustomizationPanel() {
  const { 
    customization, 
    showCustomizationPanel, 
    updateBodyColor,
    updateHeadColor,
    updateClothingColor,
    updateHairColor,
    updateEyeColor,
    updateName,
    toggleCustomizationPanel,
    resetToDefault,
    loadFromStorage
  } = useAvatarCustomization();

  if (!showCustomizationPanel) return null;

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-xl border border-white/20 p-6 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-bold">Customize Avatar</h2>
          <button
            onClick={toggleCustomizationPanel}
            className="text-white/70 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Name Input */}
        <div className="mb-6">
          <label className="text-white/90 text-sm font-medium mb-2 block">Name</label>
          <input
            type="text"
            value={customization.name}
            onChange={(e) => updateName(e.target.value)}
            className="w-full p-2 bg-white/10 border border-white/20 rounded text-white/90 text-sm"
            placeholder="Enter avatar name"
            maxLength={20}
          />
        </div>

        {/* Skin Color */}
        <div className="mb-6">
          <label className="text-white/90 text-sm font-medium mb-2 block">Skin Tone</label>
          <div className="grid grid-cols-6 gap-2">
            {COLOR_PRESETS.skinTones.map((color) => (
              <button
                key={color}
                onClick={() => {
                  updateBodyColor(color);
                  updateHeadColor(color);
                }}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  customization.bodyColor === color ? 'border-white' : 'border-white/30'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Hair Color */}
        <div className="mb-6">
          <label className="text-white/90 text-sm font-medium mb-2 block">Hair Color</label>
          <div className="grid grid-cols-6 gap-2">
            {COLOR_PRESETS.hairColors.map((color) => (
              <button
                key={color}
                onClick={() => updateHairColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  customization.hairColor === color ? 'border-white' : 'border-white/30'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Clothing Color */}
        <div className="mb-6">
          <label className="text-white/90 text-sm font-medium mb-2 block">Clothing Color</label>
          <div className="grid grid-cols-6 gap-2">
            {COLOR_PRESETS.clothingColors.map((color) => (
              <button
                key={color}
                onClick={() => updateClothingColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  customization.clothingColor === color ? 'border-white' : 'border-white/30'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Eye Color */}
        <div className="mb-6">
          <label className="text-white/90 text-sm font-medium mb-2 block">Eye Color</label>
          <div className="grid grid-cols-6 gap-2">
            {COLOR_PRESETS.eyeColors.map((color) => (
              <button
                key={color}
                onClick={() => updateEyeColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  customization.eyeColor === color ? 'border-white' : 'border-white/30'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={resetToDefault}
            className="flex-1 px-4 py-2 bg-gray-600/80 hover:bg-gray-600 text-white rounded text-sm transition-colors"
          >
            Reset Default
          </button>
          <button
            onClick={toggleCustomizationPanel}
            className="flex-1 px-4 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded text-sm transition-colors"
          >
            Done
          </button>
        </div>

        {/* Preview Info */}
        <div className="mt-4 p-3 bg-white/10 rounded-lg">
          <div className="text-white/70 text-xs text-center">
            Changes are saved automatically. Move around to see your customized avatar!
          </div>
        </div>
      </div>
    </div>
  );
}