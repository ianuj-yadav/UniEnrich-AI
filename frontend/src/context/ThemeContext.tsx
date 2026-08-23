"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeStyle = 
  | "brutalist" 
  | "matrix" 
  | "japandi" 
  | "fintech" 
  | "luxury" 
  | "riso";

export interface ThemeConfig {
  id: ThemeStyle;
  name: string;
  subtitle: string;
  tag: string;
  icon: string;
  badgeVariant: "pink" | "blue" | "purple" | "warning" | "green";
  colors: {
    background: string;
    surface: string;
    surfaceHover: string;
    border: string;
    borderHover: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    accentGlow: string;
    shadow: string;
  };
  typography: {
    fontFamily: string;
    headingStyle: string;
    tagline: string;
  };
  buttonClass: string;
  cardClass: string;
  badgeClass: string;
  logoMode: "brutalist" | "matrix" | "japandi" | "fintech" | "luxury" | "riso";
}

export const THEME_CONFIGS: Record<ThemeStyle, ThemeConfig> = {
  // 1. Neo-Brutalism (User Favorite preserved & enhanced)
  brutalist: {
    id: "brutalist",
    name: "Neo-Brutalism",
    subtitle: "3px Pitch-Black Strokes & Solid 4px Shadows",
    tag: "Tactical Pop Arcade",
    icon: "💥",
    badgeVariant: "warning",
    colors: {
      background: "#fefae0",
      surface: "#ffffff",
      surfaceHover: "#fff3b0",
      border: "#000000",
      borderHover: "#000000",
      textPrimary: "#000000",
      textSecondary: "#1f1f1f",
      textMuted: "#4b4b4b",
      accent: "#ffea00",
      accentGlow: "rgba(255, 234, 0, 0.4)",
      shadow: "4px 4px 0px #000000",
    },
    typography: {
      fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      headingStyle: "font-black tracking-tight uppercase",
      tagline: "BOLD HIGH-CONTRAST DATA STANDARDIZATION",
    },
    buttonClass: "bg-[#ffea00] text-[#000000] border-3 border-black rounded-xl shadow-[4px_4px_0px_#000000] hover:bg-[#ffdd00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none font-black text-xs uppercase transition-all select-none cursor-pointer",
    cardClass: "bg-[#ffffff] border-3 border-black rounded-2xl shadow-[6px_6px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#000000]",
    badgeClass: "bg-[#ffea00] text-black border-2 border-black rounded-md font-black shadow-[2px_2px_0px_#000000]",
    logoMode: "brutalist",
  },

  // 2. Cyberpunk Matrix HUD (Sci-Fi Void & Neon Cyan/Green)
  matrix: {
    id: "matrix",
    name: "Cyberpunk Matrix HUD",
    subtitle: "Deep Void Dark & Neon Green Telemetry",
    tag: "Sci-Fi Cyber HUD",
    icon: "🌌",
    badgeVariant: "green",
    colors: {
      background: "#05080c",
      surface: "#0b1017",
      surfaceHover: "#111923",
      border: "rgba(0, 255, 102, 0.25)",
      borderHover: "#00ff66",
      textPrimary: "#e6f8ee",
      textSecondary: "#85b79d",
      textMuted: "#4a735e",
      accent: "#00ff66",
      accentGlow: "rgba(0, 255, 102, 0.4)",
      shadow: "0 0 25px rgba(0, 255, 102, 0.15)",
    },
    typography: {
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      headingStyle: "font-mono font-bold tracking-wider uppercase text-[#00ff66] drop-shadow-[0_0_12px_rgba(0,255,102,0.4)]",
      tagline: "QUANTUM HIERARCHICAL CATALOG AUDIT PROTOCOL",
    },
    buttonClass: "bg-[#00ff66]/10 text-[#00ff66] border-2 border-[#00ff66] rounded-md shadow-[0_0_15px_rgba(0,255,102,0.3)] hover:bg-[#00ff66] hover:text-[#05080c] hover:shadow-[0_0_25px_rgba(0,255,102,0.8)] active:scale-95 font-mono text-xs font-bold uppercase transition-all select-none cursor-pointer",
    cardClass: "bg-[#0b1017]/90 backdrop-blur-xl border border-[#00ff66]/30 rounded-xl shadow-[0_0_30px_rgba(0,255,102,0.08)] hover:border-[#00ff66] hover:shadow-[0_0_30px_rgba(0,255,102,0.25)]",
    badgeClass: "bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/60 rounded font-mono text-[10px] font-bold",
    logoMode: "matrix",
  },

  // 3. Nordic Japandi Ceramic (Warm Linen & Terrazzo Wabi-Sabi)
  japandi: {
    id: "japandi",
    name: "Nordic Japandi Ceramic",
    subtitle: "Warm Linen Canvas & Terrazzo Earth Tones",
    tag: "Organic Wabi-Sabi",
    icon: "🏛️",
    badgeVariant: "green",
    colors: {
      background: "#f7f4ee",
      surface: "#ffffff",
      surfaceHover: "#f0ece1",
      border: "#ded7c8",
      borderHover: "#4a5848",
      textPrimary: "#2c2824",
      textSecondary: "#5a534c",
      textMuted: "#8c8277",
      accent: "#4a5848",
      accentGlow: "rgba(74, 88, 72, 0.18)",
      shadow: "0 10px 30px rgba(44, 40, 36, 0.05)",
    },
    typography: {
      fontFamily: "Georgia, 'Times New Roman', serif",
      headingStyle: "font-serif font-normal italic tracking-normal text-[#2c2824]",
      tagline: "Serene, Craft-Focused Catalog Normalization",
    },
    buttonClass: "bg-[#4a5848] text-[#f7f4ee] border-2 border-[#4a5848] rounded-full shadow-[0_6px_16px_rgba(74,88,72,0.2)] hover:bg-[#3b4739] hover:shadow-[0_8px_20px_rgba(74,88,72,0.3)] active:scale-98 font-sans font-medium text-xs normal-case tracking-wider transition-all select-none cursor-pointer",
    cardClass: "bg-[#ffffff] border border-[#ded7c8] rounded-3xl shadow-[0_8px_30px_rgba(44,40,36,0.04)] hover:border-[#4a5848] hover:shadow-[0_12px_40px_rgba(44,40,36,0.08)]",
    badgeClass: "bg-[#ece7db] text-[#4a5848] border border-[#ded7c8] rounded-full font-serif text-[11px]",
    logoMode: "japandi",
  },

  // 4. Digits Fintech Hyper-Grid (High-Density Monochrome + Emerald)
  fintech: {
    id: "fintech",
    name: "Digits Fintech Grid",
    subtitle: "High-Density Modern Financial Terminal",
    tag: "Fintech Precision",
    icon: "⚡",
    badgeVariant: "green",
    colors: {
      background: "#ffffff",
      surface: "#f8fafc",
      surfaceHover: "#f1f5f9",
      border: "#e2e8f0",
      borderHover: "#10b981",
      textPrimary: "#0f172a",
      textSecondary: "#334155",
      textMuted: "#64748b",
      accent: "#10b981",
      accentGlow: "rgba(16, 185, 129, 0.2)",
      shadow: "0 1px 3px rgba(0,0,0,0.05)",
    },
    typography: {
      fontFamily: "'Inter', -apple-system, sans-serif",
      headingStyle: "font-sans font-extrabold tracking-tight text-[#0f172a]",
      tagline: "HIGH-THROUGHPUT INDUSTRIAL CATALOG TELEMETRY",
    },
    buttonClass: "bg-[#0f172a] text-[#ffffff] border border-[#0f172a] rounded-lg shadow-sm hover:bg-[#1e293b] active:bg-[#334155] font-sans font-bold text-xs uppercase tracking-wider transition-all select-none cursor-pointer",
    cardClass: "bg-[#ffffff] border border-[#e2e8f0] rounded-xl shadow-sm hover:border-[#10b981] hover:shadow-md",
    badgeClass: "bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] rounded font-mono text-[10px] font-bold",
    logoMode: "fintech",
  },

  // 5. Luxury Titanium & Champagne Gold (Onyx & Brushed Gold)
  luxury: {
    id: "luxury",
    name: "Luxury Titanium & Gold",
    subtitle: "Brushed Onyx & Champagne Gold Accents",
    tag: "Executive Luxury",
    icon: "🍸",
    badgeVariant: "warning",
    colors: {
      background: "#0c0d10",
      surface: "#14161b",
      surfaceHover: "#1c1f26",
      border: "rgba(212, 175, 55, 0.25)",
      borderHover: "#d4af37",
      textPrimary: "#f8f5ee",
      textSecondary: "#bfae8a",
      textMuted: "#7a6e54",
      accent: "#d4af37",
      accentGlow: "rgba(212, 175, 55, 0.35)",
      shadow: "0 16px 48px rgba(0, 0, 0, 0.7)",
    },
    typography: {
      fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
      headingStyle: "font-serif font-bold tracking-wider text-[#d4af37] uppercase",
      tagline: "THE SOVEREIGN LEDGER FOR INDUSTRIAL STANDARDS",
    },
    buttonClass: "bg-gradient-to-r from-[#d4af37] to-[#b8972e] text-[#0c0d10] border border-[#f3e5ab] rounded-sm shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-98 font-serif font-bold text-xs uppercase tracking-widest transition-all select-none cursor-pointer",
    cardClass: "bg-[#14161b]/95 border border-[#d4af37]/30 rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:border-[#d4af37] hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]",
    badgeClass: "bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/50 rounded-sm font-serif text-[10px] tracking-widest",
    logoMode: "luxury",
  },

  // 6. Riso Print & Vintage Editorial (Dual Ink Tangerine & Cobalt)
  riso: {
    id: "riso",
    name: "Riso Print & Ink",
    subtitle: "Two-Color Risograph Cobalt & Tangerine",
    tag: "Artistic Print House",
    icon: "🎨",
    badgeVariant: "pink",
    colors: {
      background: "#faf8f3",
      surface: "#ffffff",
      surfaceHover: "#f3ede2",
      border: "#1e293b",
      borderHover: "#f95738",
      textPrimary: "#1e293b",
      textSecondary: "#475569",
      textMuted: "#64748b",
      accent: "#f95738",
      accentGlow: "rgba(249, 87, 56, 0.25)",
      shadow: "4px 4px 0px #1e293b",
    },
    typography: {
      fontFamily: "'Courier Prime', 'Space Mono', monospace",
      headingStyle: "font-mono font-black tracking-tight text-[#1e293b] uppercase",
      tagline: "ANALOG-INSPIRED DUAL-INK DATA SYNTHESIS",
    },
    buttonClass: "bg-[#f95738] text-[#faf8f3] border-2 border-[#1e293b] rounded-none shadow-[3px_3px_0px_#1e293b] hover:bg-[#e04527] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#1e293b] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none font-mono font-bold text-xs uppercase tracking-wider transition-all select-none cursor-pointer",
    cardClass: "bg-[#ffffff] border-2 border-[#1e293b] rounded-none shadow-[4px_4px_0px_#1e293b] hover:border-[#f95738]",
    badgeClass: "bg-[#f95738]/15 text-[#f95738] border border-[#f95738] rounded-none font-mono text-[10px] font-bold",
    logoMode: "riso",
  },
};

interface ThemeContextType {
  theme: ThemeStyle;
  setTheme: (theme: ThemeStyle) => void;
  config: ThemeConfig;
  allThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeStyle>("brutalist");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const themeFromUrl = urlParams.get("theme") as ThemeStyle;
    const stored = localStorage.getItem("unienrich_active_theme") as ThemeStyle;

    if (themeFromUrl && THEME_CONFIGS[themeFromUrl]) {
      setThemeState(themeFromUrl);
    } else if (stored && THEME_CONFIGS[stored]) {
      setThemeState(stored);
    }
  }, []);

  const setTheme = (newTheme: ThemeStyle) => {
    if (!THEME_CONFIGS[newTheme]) return;
    setThemeState(newTheme);
    localStorage.setItem("unienrich_active_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const config = THEME_CONFIGS[theme] || THEME_CONFIGS.brutalist;
  const allThemes = Object.values(THEME_CONFIGS);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, config, allThemes }}>
      <div 
        className="min-h-screen transition-colors duration-300"
        style={{
          backgroundColor: config.colors.background,
          color: config.colors.textPrimary,
          fontFamily: config.typography.fontFamily,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
};
