import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface SoundContextType {
  soundOn: boolean;
  toggleSound: () => void;
  playNewOrder: () => void;
  playClick: () => void;
}

const SoundContext = createContext<SoundContextType>({
  soundOn: true,
  toggleSound: () => {},
  playNewOrder: () => {},
  playClick: () => {},
});

function beep(freq: number, duration: number, volume = 0.3, type: OscillatorType = "sine") {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundOn, setSoundOn] = useState(() => {
    const stored = localStorage.getItem("kds-sound");
    return stored ? stored === "on" : true;
  });

  const toggleSound = () => {
    setSoundOn(prev => {
      const next = !prev;
      localStorage.setItem("kds-sound", next ? "on" : "off");
      return next;
    });
  };

  const playNewOrder = useCallback(() => {
    if (!soundOn) return;
    // Two-tone chime for new orders
    beep(880, 0.15, 0.4, "sine");
    setTimeout(() => beep(1100, 0.2, 0.35, "sine"), 160);
  }, [soundOn]);

  const playClick = useCallback(() => {
    if (!soundOn) return;
    beep(600, 0.08, 0.2, "square");
  }, [soundOn]);

  return (
    <SoundContext.Provider value={{ soundOn, toggleSound, playNewOrder, playClick }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);
