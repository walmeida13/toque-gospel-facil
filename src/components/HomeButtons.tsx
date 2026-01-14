import { Play, Smartphone } from "lucide-react";

interface HomeButtonsProps {
  onPlayClick: () => void;
  onActivateClick: () => void;
}

const HomeButtons = ({ onPlayClick, onActivateClick }: HomeButtonsProps) => {
  return (
    <div className="space-y-4">
      <button
        onClick={onPlayClick}
        className="btn-hero flex w-full items-center justify-center gap-3"
      >
        <Play className="h-7 w-7" fill="currentColor" />
        <span>OUVIR AGORA</span>
      </button>

      <button
        onClick={onActivateClick}
        className="btn-secondary-hero flex w-full items-center justify-center gap-3"
      >
        <Smartphone className="h-7 w-7" />
        <span>ATIVAR TOQUE</span>
      </button>
    </div>
  );
};

export default HomeButtons;
