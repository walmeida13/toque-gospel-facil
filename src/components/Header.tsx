import { Music } from "lucide-react";

const Header = () => {
  return (
    <header className="py-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Music className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">
          Toque Gospel
        </h1>
      </div>
      <p className="text-sm text-muted-foreground font-medium">
        Toque oficial e recortes em 1 toque
      </p>
    </header>
  );
};

export default Header;
