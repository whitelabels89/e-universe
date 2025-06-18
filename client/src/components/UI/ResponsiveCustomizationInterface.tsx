import React, { useState, useEffect } from "react";
import { useIsMobile } from "../../hooks/use-is-mobile";
import { useAvatarCustomization } from "../../lib/stores/useAvatarCustomization";
import { MobileCustomizationDrawer } from "./MobileCustomizationDrawer";
import { AvatarCustomizationPanel } from "./AvatarCustomizationPanel";
import { PersonalizedAvatarWizard } from "./PersonalizedAvatarWizard";
import { Button } from "@/components/ui/button";
import { Palette, User, Monitor, Smartphone } from "lucide-react";

export function ResponsiveCustomizationInterface() {
  const isMobile = useIsMobile();
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  
  const {
    showCustomizationPanel,
    showWizard,
    toggleCustomizationPanel,
    startWizard,
    customization
  } = useAvatarCustomization();

  // Auto-hide quick access after user interaction
  useEffect(() => {
    if (showQuickAccess) {
      const timer = setTimeout(() => {
        setShowQuickAccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showQuickAccess]);

  // Handle touch start to show quick access
  useEffect(() => {
    if (isMobile) {
      const handleTouchStart = () => {
        setShowQuickAccess(true);
      };

      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
      };
    }
  }, [isMobile]);

  return (
    <>
      {/* Mobile Interface */}
      {isMobile && (
        <>
          {/* Quick Access Floating Button */}
          <div 
            className={`fixed bottom-4 right-4 z-40 transition-all duration-300 ${
              showQuickAccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <Button
              onClick={toggleCustomizationPanel}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
            >
              <Palette className="w-6 h-6 text-white" />
            </Button>
          </div>

          {/* Avatar Preview Widget */}
          <div 
            className={`fixed bottom-20 right-4 z-40 transition-all duration-300 ${
              showQuickAccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 border border-gray-600">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ 
                    backgroundColor: customization.bodyColor,
                    color: customization.eyeColor 
                  }}
                >
                  {customization.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{customization.name}</div>
                  <div className="text-gray-400 text-xs">{customization.personality}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Customization Drawer */}
          <MobileCustomizationDrawer />
        </>
      )}

      {/* Desktop Interface */}
      {!isMobile && (
        <>
          {/* Desktop Customization Panel */}
          <AvatarCustomizationPanel />
          
          {/* Desktop Wizard */}
          <PersonalizedAvatarWizard />
          

        </>
      )}




    </>
  );
}