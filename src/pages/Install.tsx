import { useState, useEffect } from "react";
import { Download, Share, MoreVertical, Plus, ChevronLeft, Smartphone, Check } from "lucide-react";
import { Link } from "react-router-dom";
import capaImage from "@/assets/capa-sete-livramentos.jpeg";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={capaImage} 
              alt="Os Sete Livramentos" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Instalar o App
          </h1>
          <p className="text-muted-foreground">
            Tenha acesso rápido ao toque oficial direto na sua tela inicial
          </p>
        </div>

        {/* Already installed */}
        {isInstalled && (
          <div className="card-elevated p-6 text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              App já instalado!
            </h2>
            <p className="text-muted-foreground">
              O app já está na sua tela inicial. Aproveite!
            </p>
          </div>
        )}

        {/* Native install button (Android Chrome) */}
        {deferredPrompt && !isInstalled && (
          <div className="mb-8">
            <button
              onClick={handleInstallClick}
              className="hero-button w-full flex items-center justify-center gap-3"
            >
              <Download className="w-6 h-6" />
              <span>Instalar Agora</span>
            </button>
            <p className="text-center text-sm text-muted-foreground mt-3">
              Instalação rápida e segura
            </p>
          </div>
        )}

        {/* Manual instructions */}
        {!isInstalled && (
          <div className="space-y-6">
            {/* iOS Instructions */}
            {isIOS && (
              <div className="card-elevated p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Instruções para iPhone
                  </h2>
                </div>

                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="step-number flex-shrink-0">1</span>
                    <div>
                      <p className="font-medium text-foreground">Toque no botão Compartilhar</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        É o ícone <Share className="w-4 h-4 inline" /> na barra do Safari
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="step-number flex-shrink-0">2</span>
                    <div>
                      <p className="font-medium text-foreground">Role para baixo e toque em</p>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> "Adicionar à Tela de Início"
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="step-number flex-shrink-0">3</span>
                    <div>
                      <p className="font-medium text-foreground">Toque em "Adicionar"</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        O app aparecerá na sua tela inicial
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            )}

            {/* Android Instructions */}
            {isAndroid && !deferredPrompt && (
              <div className="card-elevated p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Instruções para Android
                  </h2>
                </div>

                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="step-number flex-shrink-0">1</span>
                    <div>
                      <p className="font-medium text-foreground">Toque no menu do navegador</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        É o ícone <MoreVertical className="w-4 h-4 inline" /> no canto superior
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="step-number flex-shrink-0">2</span>
                    <div>
                      <p className="font-medium text-foreground">Toque em "Instalar app"</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ou "Adicionar à tela inicial"
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="step-number flex-shrink-0">3</span>
                    <div>
                      <p className="font-medium text-foreground">Confirme tocando em "Instalar"</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        O app aparecerá na sua tela inicial
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            )}

            {/* Generic Instructions (Desktop or unknown) */}
            {!isIOS && !isAndroid && !deferredPrompt && (
              <div className="card-elevated p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Como instalar
                  </h2>
                </div>

                <p className="text-muted-foreground mb-4">
                  Abra este site no navegador do seu celular para ver as instruções de instalação.
                </p>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-2">No Chrome (Android):</p>
                  <p className="text-sm text-muted-foreground">
                    Menu ⋮ → "Instalar app" ou "Adicionar à tela inicial"
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mt-3">
                  <p className="text-sm font-medium text-foreground mb-2">No Safari (iPhone):</p>
                  <p className="text-sm text-muted-foreground">
                    Compartilhar → "Adicionar à Tela de Início"
                  </p>
                </div>
              </div>
            )}

            {/* Benefits */}
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
              <h3 className="font-semibold text-foreground mb-3">
                ✨ Vantagens do app instalado:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Acesso rápido pela tela inicial
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Funciona mesmo offline
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Experiência de app nativo
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Não ocupa espaço (menos de 1MB)
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Back to home */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            ← Voltar para o início
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Install;
