import { ChefHat, Volume2, VolumeX, Sun, Moon, BarChart3, UtensilsCrossed, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { useSound } from "@/hooks/useSound";

export function KDSHeader() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { soundOn, toggleSound } = useSound();
  const today = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <header className="flex items-center justify-between px-6 py-5">
      <div className="flex items-center gap-4">
        <div className="rounded-xl gradient-primary p-2.5 shadow-glow">
          <ChefHat className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Kitchen Display</h1>
          <p className="text-xs text-muted-foreground">Live order management</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground font-mono">{today}</span>
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-all"
        >
          {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {soundOn ? "Sound On" : "Sound Off"}
        </button>
        <button
          onClick={toggleTheme}
          className="rounded-xl bg-secondary p-2.5 text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-all"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          onClick={() => navigate("/menu")}
          className="flex items-center gap-1.5 rounded-xl gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all shadow-glow"
        >
          <UtensilsCrossed className="h-4 w-4" /> Menu
        </button>
        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-all"
        >
          <History className="h-4 w-4" /> History
        </button>
        <button
          onClick={() => navigate("/analytics")}
          className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-all"
        >
          <BarChart3 className="h-4 w-4" /> Analytics
        </button>
      </div>
    </header>
  );
}
