import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import AudioPlayer from "@/components/AudioPlayer";
import HomeButtons from "@/components/HomeButtons";
import ActivationWizard from "@/components/ActivationWizard";
import AdvancedMode from "@/components/AdvancedMode";
import ShareButton from "@/components/ShareButton";
import { Scissors, Download, Music } from "lucide-react";
import capaImage from "@/assets/capa-sete-livramentos.jpeg";

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
            {/* Cover image */}
            <div className="card-elevated overflow-hidden p-0">
              <img 
                src={capaImage} 
                alt="Os Sete Livramentos - Capa" 
                className="w-full h-auto rounded-2xl"
              />
            </div>

            {/* Song title card */}
            <div className="text-center">
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

            {/* YouTube Music links */}
            <div className="text-center space-y-3">
              <a
                href="https://music.youtube.com/playlist?list=PLQRCG5G25J8EXEw6S2V_qo70C3EC9eEwi&si=ny0XU8xvo0gYKokW"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-red-700 hover:text-red-600 transition-colors font-medium"
              >
                <Music className="w-4 h-4" />
                Ouvir música completa no YouTube Music
              </a>
              <div>
                <a
                  href="https://music.youtube.com/playlist?list=PLJcmnpA6dRhv7Ks484xBjYkLP0NfYzL6-&si=uOCwhGZMFP8DF_Og"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-secondary-foreground hover:text-secondary-foreground/80 transition-colors font-medium"
                >
                  <Music className="w-4 h-4" />
                  🎤 Músicas de Rafael de Lins
                </a>
              </div>
            </div>

            {/* Share button */}
            <div className="text-center">
              <ShareButton />
            </div>

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

        {/* Install link */}
        <div className="mt-6 text-center">
          <Link 
            to="/install" 
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <Download className="w-4 h-4" />
            Instalar app no celular
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center text-xs text-muted-foreground">
          <p>Toque Gospel © 2026</p>
          <p className="mt-1">Feito com ❤️ para a comunidade gospel</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
