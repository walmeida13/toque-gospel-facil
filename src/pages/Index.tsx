import { useState } from "react";
import Header from "@/components/Header";
import AudioPlayer from "@/components/AudioPlayer";
import HomeButtons from "@/components/HomeButtons";
import ActivationWizard from "@/components/ActivationWizard";
import AdvancedMode from "@/components/AdvancedMode";
import { Scissors } from "lucide-react";

type View = "home" | "wizard" | "advanced";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("home");
  const [showPlayer, setShowPlayer] = useState(false);

  const handlePlayClick = () => {
    setShowPlayer(true);
  };

  const handleActivateClick = () => {
    setCurrentView("wizard");
  };

  const handleAdvancedClick = () => {
    setCurrentView("advanced");
  };

  const handleBack = () => {
    setCurrentView("home");
  };

  return (
    <div className="min-h-screen min-h-[100dvh] px-4 pb-8 safe-bottom">
      <div className="mx-auto max-w-md">
        <Header />

        {currentView === "home" && (
          <div className="animate-slide-up space-y-6">
            {/* Song title card */}
            <div className="card-elevated text-center">
              <h2 className="text-2xl font-extrabold text-gradient mb-1">
                Os Sete Livramentos
              </h2>
              <p className="text-sm text-muted-foreground">
                Toque oficial para seu celular
              </p>
            </div>

            {/* Audio player */}
            {showPlayer && <AudioPlayer />}

            {/* Main action buttons */}
            <HomeButtons
              onPlayClick={handlePlayClick}
              onActivateClick={handleActivateClick}
            />

            {/* Advanced mode link */}
            <div className="text-center pt-4">
              <button
                onClick={handleAdvancedClick}
                className="link-subtle inline-flex items-center gap-2"
              >
                <Scissors className="h-4 w-4" />
                Modo Avançado (recortar outra música)
              </button>
            </div>
          </div>
        )}

        {currentView === "wizard" && (
          <ActivationWizard onBack={handleBack} />
        )}

        {currentView === "advanced" && (
          <AdvancedMode onBack={handleBack} />
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-muted-foreground">
          <p>Toque Gospel © 2026</p>
          <p className="mt-1">Feito com ❤️ para a comunidade gospel</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
