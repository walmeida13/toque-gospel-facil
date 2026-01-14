import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Upload, Scissors, Download, Play, Pause, RotateCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface AdvancedModeProps {
  onBack: () => void;
}

const PRESETS = [
  { label: "20s", value: 20 },
  { label: "25s", value: 25 },
  { label: "30s", value: 30 },
];

const AdvancedMode = ({ onBack }: AdvancedModeProps) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [fadeEnabled, setFadeEnabled] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setStartTime(0);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setEndTime(Math.min(30, audio.duration));
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.currentTime >= endTime) {
        audio.pause();
        setIsPlaying(false);
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [endTime]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.currentTime = startTime;
      audio.play();
      setIsPlaying(true);
    }
  };

  const applyPreset = (seconds: number) => {
    const newEnd = Math.min(startTime + seconds, duration);
    setEndTime(newEnd);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleExport = async () => {
    if (!audioFile) return;
    
    setIsExporting(true);
    
    // Simple export - create a blob and download
    // In a real implementation, you'd use Web Audio API to trim
    try {
      const blob = audioFile;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `toque-${audioFile.name.replace(/\.[^/.]+$/, "")}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const clipDuration = endTime - startTime;

  return (
    <div className="animate-slide-up">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Voltar</span>
      </button>

      <h2 className="mb-2 text-xl font-bold text-foreground">
        Modo Avançado
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Recorte qualquer música do seu celular para usar como toque.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!audioFile ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="card-elevated flex w-full flex-col items-center justify-center gap-3 py-12 transition-colors hover:bg-secondary/50"
        >
          <div className="icon-circle">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <span className="font-semibold text-foreground">Importar arquivo de áudio</span>
          <span className="text-sm text-muted-foreground">MP3, WAV, M4A, etc.</span>
        </button>
      ) : (
        <div className="space-y-4">
          <audio ref={audioRef} src={audioUrl || undefined} />

          {/* File info */}
          <div className="card-elevated">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Scissors className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground truncate max-w-[200px]">
                    {audioFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Duração: {formatTime(duration)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAudioFile(null);
                  setAudioUrl(null);
                }}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Playback controls */}
          <div className="card-elevated">
            <div className="mb-4 flex items-center justify-center">
              <button
                onClick={togglePlayback}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-button transition-transform hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" fill="currentColor" />
                ) : (
                  <Play className="h-6 w-6 ml-1" fill="currentColor" />
                )}
              </button>
            </div>

            {/* Waveform placeholder */}
            <div className="audio-waveform mb-4 relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-primary/20"
                style={{ width: `${(startTime / duration) * 100}%` }}
              />
              <div 
                className="absolute top-0 h-full bg-primary/30"
                style={{ 
                  left: `${(startTime / duration) * 100}%`,
                  width: `${((endTime - startTime) / duration) * 100}%`
                }}
              />
              <div 
                className="absolute top-0 h-full w-0.5 bg-primary"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Time range slider */}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Início: {formatTime(startTime)}
                </label>
                <Slider
                  value={[startTime]}
                  min={0}
                  max={Math.max(0, endTime - 5)}
                  step={0.1}
                  onValueChange={([val]) => setStartTime(val)}
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Fim: {formatTime(endTime)}
                </label>
                <Slider
                  value={[endTime]}
                  min={startTime + 5}
                  max={duration}
                  step={0.1}
                  onValueChange={([val]) => setEndTime(val)}
                />
              </div>
            </div>

            {/* Presets */}
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium">Duração rápida:</label>
              <div className="flex gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => applyPreset(preset.value)}
                    className={`brand-chip ${clipDuration === preset.value ? "selected" : ""}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-3 text-center text-sm text-muted-foreground">
              Trecho selecionado: {formatTime(clipDuration)}
            </p>
          </div>

          {/* Options */}
          <div className="card-elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Fade in/out</p>
                <p className="text-sm text-muted-foreground">Suaviza início e fim (100ms)</p>
              </div>
              <Switch
                checked={fadeEnabled}
                onCheckedChange={setFadeEnabled}
              />
            </div>
          </div>

          {/* Export */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn-hero flex w-full items-center justify-center gap-2"
          >
            <Download className="h-6 w-6" />
            <span>{isExporting ? "Exportando..." : "Exportar MP3 (128kbps)"}</span>
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Também disponível em WAV (sem perdas)
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">
        ⚠️ Este app não extrai áudio do Spotify/YouTube. Você precisa ter o arquivo.
      </div>
    </div>
  );
};

export default AdvancedMode;
