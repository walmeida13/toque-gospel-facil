import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

// Placeholder audio - replace with official file
const AUDIO_SRC = "/sete-livramentos-toque-oficial.mp3";

interface AudioPlayerProps {
  onPlay?: () => void;
}

const AudioPlayer = ({ onPlay }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setHasError(false);
    };

    const handleEnded = () => {
      // Com loop ativo, apenas reseta o progresso visual
      setProgress(0);
    };

    const handleError = () => {
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
        onPlay?.();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setHasError(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="card-elevated">
      <audio ref={audioRef} src={AUDIO_SRC} preload="metadata" loop />
      
      {hasError && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
          ⚠️ Substituir pelo arquivo oficial: sete-livramentos-toque-oficial.mp3
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-button transition-transform hover:scale-105 active:scale-95"
          aria-label={isPlaying ? "Pausar" : "Reproduzir"}
        >
          {isPlaying ? (
            <Pause className="h-7 w-7" fill="currentColor" />
          ) : (
            <Play className="h-7 w-7 ml-1" fill="currentColor" />
          )}
        </button>

        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              Os Sete Livramentos
            </span>
          </div>
          
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{formatTime((progress / 100) * duration)}</span>
            <span>{duration ? formatTime(duration) : "--:--"}</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Trecho oficial para toque de celular (~25 segundos)
      </p>
    </div>
  );
};

export default AudioPlayer;
