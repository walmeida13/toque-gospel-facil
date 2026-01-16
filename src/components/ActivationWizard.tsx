import { useState } from "react";
import { Download, FolderOpen, Settings, Check, ChevronDown, ChevronUp, ArrowLeft, Phone, User, Zap, Loader2, AlertCircle } from "lucide-react";
import { useRingtone } from "@/hooks/useRingtone";

interface ActivationWizardProps {
  onBack: () => void;
}

const BRANDS = [
  { id: "samsung", name: "Samsung", instructions: "Abra Arquivos → Downloads → Toque e segure o arquivo → Definir como → Toque de telefone" },
  { id: "motorola", name: "Motorola", instructions: "Abra Arquivos → Downloads → Toque no arquivo → Menu (3 pontos) → Definir como toque" },
  { id: "xiaomi", name: "Xiaomi", instructions: "Abra Gerenciador de Arquivos → Downloads → Toque e segure → Mais → Definir como toque" },
  { id: "outros", name: "Outros", instructions: "Abra seu app de Arquivos → Pasta Downloads → Toque no arquivo e escolha 'Definir como toque'" },
];

const ActivationWizard = ({ onBack }: ActivationWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showBrands, setShowBrands] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [showManualMode, setShowManualMode] = useState(false);
  
  const { 
    isNativeAndroid, 
    isLoading: isRingtoneLoading, 
    isSettingRingtone, 
    error: ringtoneError, 
    success: ringtoneSuccess,
    setRingtone 
  } = useRingtone();

  const handleAutoSetRingtone = async () => {
    const success = await setRingtone();
    if (success) {
      setCompletedSteps([1, 2, 3]);
      setCurrentStep(3);
    }
  };

  const handleDownload = () => {
    // Trigger download
    const link = document.createElement("a");
    link.href = "/sete-livramentos-toque-oficial.mp3";
    link.download = "sete-livramentos-toque.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Mark step as completed
    if (!completedSteps.includes(1)) {
      setCompletedSteps([...completedSteps, 1]);
    }
    setCurrentStep(2);
  };

  const handleStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    if (step < 3) {
      setCurrentStep(step + 1);
    }
  };

  const selectedBrandData = BRANDS.find(b => b.id === selectedBrand);

  // Show automatic mode for native Android
  if (isNativeAndroid && !showManualMode && !isRingtoneLoading) {
    return (
      <div className="animate-slide-up">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Voltar</span>
        </button>

        <h2 className="mb-6 text-xl font-bold text-foreground">
          Ativar Toque Automaticamente
        </h2>

        {ringtoneSuccess ? (
          <div className="rounded-2xl bg-success/10 border border-success/20 p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
              <Check className="h-8 w-8 text-success" />
            </div>
            <p className="text-xl font-bold text-success">
              🎉 Toque ativado com sucesso!
            </p>
            <p className="mt-2 text-muted-foreground">
              Agora você receberá chamadas com "Os Sete Livramentos"
            </p>
            <button
              onClick={onBack}
              className="btn-hero mt-6 w-full py-4"
            >
              Voltar ao início
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Modo Automático</h3>
                  <p className="text-sm text-muted-foreground">Um toque e pronto!</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4">
                Toque no botão abaixo para definir o toque automaticamente como toque de chamada do seu celular.
              </p>

              {ringtoneError && (
                <div className="mb-4 flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{ringtoneError}</span>
                </div>
              )}

              <button
                onClick={handleAutoSetRingtone}
                disabled={isSettingRingtone}
                className="btn-hero flex w-full items-center justify-center gap-2 py-4 text-lg disabled:opacity-50"
              >
                {isSettingRingtone ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Definindo toque...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-6 w-6" />
                    <span>Definir toque automaticamente</span>
                  </>
                )}
              </button>
            </div>

            <div className="tip-box">
              <p>💡 Se aparecer uma tela de permissão, toque em <strong>"Permitir"</strong> e volte ao app.</p>
            </div>

            <button
              onClick={() => setShowManualMode(true)}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Prefere fazer manualmente? Clique aqui
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Voltar</span>
      </button>

      <h2 className="mb-6 text-xl font-bold text-foreground">
        Ativar Toque em 3 Passos
      </h2>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className={`card-step ${currentStep === 1 ? "active" : ""} ${completedSteps.includes(1) ? "completed" : ""}`}>
          <div className="flex items-start gap-4">
            <div className={`step-number ${completedSteps.includes(1) ? "completed" : ""}`}>
              {completedSteps.includes(1) ? <Check className="h-5 w-5" /> : "1"}
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-bold text-foreground">Baixar o toque</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Salve o arquivo oficial no seu celular.
              </p>
              
              {currentStep === 1 && (
                <button
                  onClick={handleDownload}
                  className="btn-hero flex w-full items-center justify-center gap-2 py-4 text-lg"
                >
                  <Download className="h-6 w-6" />
                  <span>Baixar toque oficial</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className={`card-step ${currentStep === 2 ? "active" : ""} ${completedSteps.includes(2) ? "completed" : ""}`}>
          <div className="flex items-start gap-4">
            <div className={`step-number ${completedSteps.includes(2) ? "completed" : ""}`}>
              {completedSteps.includes(2) ? <Check className="h-5 w-5" /> : "2"}
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-bold text-foreground">Encontrar o arquivo</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                O arquivo foi salvo na pasta Downloads ou Ringtones.
              </p>

              {currentStep >= 2 && (
                <>
                  <button
                    onClick={() => setShowBrands(!showBrands)}
                    className="mb-3 flex w-full items-center justify-between rounded-xl border border-border bg-secondary/50 px-4 py-3 text-left font-medium transition-colors hover:bg-secondary"
                  >
                    <span className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-primary" />
                      Abrir instruções do meu celular
                    </span>
                    {showBrands ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>

                  {showBrands && (
                    <div className="animate-scale-in space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {BRANDS.map((brand) => (
                          <button
                            key={brand.id}
                            onClick={() => setSelectedBrand(brand.id)}
                            className={`brand-chip ${selectedBrand === brand.id ? "selected" : ""}`}
                          >
                            {brand.name}
                          </button>
                        ))}
                      </div>

                      {selectedBrandData && (
                        <div className="tip-box animate-scale-in">
                          <p className="font-medium text-foreground">{selectedBrandData.name}:</p>
                          <p className="mt-1 text-muted-foreground">{selectedBrandData.instructions}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {currentStep === 2 && (
                    <button
                      onClick={() => handleStepComplete(2)}
                      className="mt-4 w-full rounded-xl border-2 border-success bg-success/10 py-3 font-semibold text-success transition-colors hover:bg-success/20"
                    >
                      <Check className="mr-2 inline h-5 w-5" />
                      Encontrei o arquivo
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className={`card-step ${currentStep === 3 ? "active" : ""} ${completedSteps.includes(3) ? "completed" : ""}`}>
          <div className="flex items-start gap-4">
            <div className={`step-number ${completedSteps.includes(3) ? "completed" : ""}`}>
              {completedSteps.includes(3) ? <Check className="h-5 w-5" /> : "3"}
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-bold text-foreground">Definir como toque</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Siga o caminho nas configurações do seu celular.
              </p>

              {currentStep >= 3 && (
                <div className="space-y-3">
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Settings className="h-5 w-5 shrink-0 text-primary" />
                      <span className="font-medium">
                        Configurações → Som e vibração → Toque do telefone
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium transition-colors hover:bg-secondary">
                      <Phone className="h-4 w-4" />
                      Toque geral
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium transition-colors hover:bg-secondary">
                      <User className="h-4 w-4" />
                      Para contato
                    </button>
                  </div>

                  <div className="tip-box">
                    <p>💡 Se aparecer "Permitir", toque em <strong>Permitir</strong>.</p>
                  </div>

                  {currentStep === 3 && !completedSteps.includes(3) && (
                    <button
                      onClick={() => handleStepComplete(3)}
                      className="btn-hero mt-2 flex w-full items-center justify-center gap-2 py-4"
                    >
                      <Check className="h-5 w-5" />
                      <span>Pronto!</span>
                    </button>
                  )}

                  {completedSteps.includes(3) && (
                    <div className="mt-4 rounded-xl bg-success/10 p-4 text-center">
                      <p className="text-lg font-bold text-success">
                        🎉 Toque ativado com sucesso!
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Agora você receberá chamadas com "Os Sete Livramentos"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationWizard;
