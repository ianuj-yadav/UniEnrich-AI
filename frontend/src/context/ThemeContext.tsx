"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeStyle = "vantage" | "swiss" | "linear" | "brutalist" | "apple";

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
  };
  buttonClass: string;
  cardClass: string;
  badgeClass: string;
  logoMode: "diamond" | "gyroscope" | "hologram" | "brutalist" | "liquid";
}

export const THEME_CONFIGS: Record<ThemeStyle, ThemeConfig> = {
  vantage: {
    id: "vantage",
    name: "Vantage Editorial",
    subtitle: "Warm Porcelain & Blush PopButton",
    tag: "Editorial SaaS",
    icon: "💎",
    badgeVariant: "pink",
    colors: {
      background: "#fdfbfb",
      surface: "#ffffff",
      surfaceHover: "#faf6f6",
      border: "#e8dede",
      borderHover: "#b18597",
      textPrimary: "#2b201a",
      textSecondary: "#5e4d46",
      textMuted: "#8c7770",
      accent: "#b18597",
      accentGlow: "rgba(177, 133, 151, 0.2)",
      shadow: "0 8px 32px rgba(177, 133, 151, 0.08)",
    },
    typography: {
      fontFamily: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
      headingStyle: "font-serif tracking-tight",
    },
    buttonClass: "bg-[#fff0f0] text-[#382b22] border-2 border-[#b18597] shadow-[0_8px_0_-2px_#f9c4d2,0_8px_0_0_#b18597,0_14px_8px_-3px_rgba(0,0,0,0.15)] hover:bg-[#ffe9e9] hover:translate-y-0.5 active:translate-y-2 active:shadow-[0_0px_0_0_#b18597]",
    cardClass: "bg-[#ffffff] border-2 border-[#e8dede] rounded-3xl shadow-[0_8px_32px_rgba(177,133,151,0.06)] hover:border-[#b18597]",
    badgeClass: "bg-[#fff0f0] text-[#703d52] border border-[#f9c4d2]",
    logoMode: "diamond",
  },
  swiss: {
    id: "swiss",
    name: "Swiss Precision",
    subtitle: "Bauhaus 16-Col Grid & DIN Monospace",
    tag: "German Engineering",
    icon: "📐",
    badgeVariant: "blue",
    colors: {
      background: "#f6f8fa",
      surface: "#ffffff",
      surfaceHover: "#f0f2f5",
      border: "#d0d7de",
      borderHover: "#0969da",
      textPrimary: "#0d1117",
      textSecondary: "#24292f",
      textMuted: "#57606a",
      accent: "#0969da",
      accentGlow: "rgba(9, 105, 218, 0.15)",
      shadow: "0 1px 3px rgba(0,0,0,0.08)",
    },
    typography: {
      fontFamily: "Inter, Helvetica, Arial, sans-serif",
      headingStyle: "font-mono font-bold uppercase tracking-wider",
    },
    buttonClass: "bg-[#0969da] text-[#ffffff] border-2 border-[#0969da] rounded-none shadow-none hover:bg-[#0757b3] active:bg-[#05438a] font-mono tracking-widest text-xs uppercase",
    cardClass: "bg-[#ffffff] border border-[#d0d7de] rounded-none shadow-none hover:border-[#0969da]",
    badgeClass: "bg-[#eff6ff] text-[#0969da] border border-[#0969da] rounded-none font-mono text-[10px]",
    logoMode: "gyroscope",
  },
  linear: {
    id: "linear",
    name: "Linear Titanium",
    subtitle: "Obsidian Acrylic Glass & Luminous Violet",
    tag: "High-Tech AI Pro",
    icon: "⚡",
    badgeVariant: "purple",
    colors: {
      background: "#08090a",
      surface: "#101214",
      surfaceHover: "#16181d",
      border: "rgba(255, 255, 255, 0.1)",
      borderHover: "#8b5cf6",
      textPrimary: "#f3f4f6",
      textSecondary: "#9ca3af",
      textMuted: "#6b7280",
      accent: "#8b5cf6",
      accentGlow: "rgba(139, 92, 246, 0.35)",
      shadow: "0 12px 40px rgba(0, 0, 0, 0.6)",
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      headingStyle: "font-sans font-bold tracking-tight bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent",
    },
    buttonClass: "bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-[#ffffff] border border-white/20 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.8)] hover:scale-[1.02] active:scale-[0.98]",
    cardClass: "bg-[#101214]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]",
    badgeClass: "bg-purple-950/60 text-purple-300 border border-purple-500/40 rounded-full",
    logoMode: "hologram",
  },
  brutalist: {
    id: "brutalist",
    name: "Neo-Brutalism",
    subtitle: "3px Black Strokes & Hard Offset Shadows",
    tag: "Tactical Arcade",
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
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      headingStyle: "font-black tracking-tight uppercase",
    },
    buttonClass: "bg-[#ffea00] text-[#000000] border-3 border-black rounded-lg shadow-[4px_4px_0px_#000000] hover:bg-[#ffdd00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none font-black text-xs uppercase",
    cardClass: "bg-[#ffffff] border-3 border-black rounded-2xl shadow-[6px_6px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#000000]",
    badgeClass: "bg-[#ffea00] text-black border-2 border-black rounded-md font-black shadow-[2px_2px_0px_#000000]",
    logoMode: "brutalist",
  },
  apple: {
    id: "apple",
    name: "Apple Spatial",
    subtitle: "Dynamic Pure Light & Translucent Squircles",
    tag: "Cupertino Spatial",
    icon: "🍎",
    badgeVariant: "green",
    colors: {
      background: "#fbfbfd",
      surface: "rgba(255, 255, 255, 0.8)",
      surfaceHover: "rgba(255, 255, 255, 0.95)",
      border: "rgba(0, 0, 0, 0.08)",
      borderHover: "#0071e3",
      textPrimary: "#1d1d1f",
      textSecondary: "#515154",
      textMuted: "#86868b",
      accent: "#0071e3",
      accentGlow: "rgba(0, 113, 227, 0.2)",
      shadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
    },
    typography: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif",
      headingStyle: "font-semibold tracking-tight",
    },
    buttonClass: "bg-[#0071e3] text-white border border-[#0071e3]/80 rounded-full shadow-[0_4px_14px_rgba(0,113,227,0.3)] hover:bg-[#0077ed] hover:shadow-[0_6px_20px_rgba(0,113,227,0.4)] active:scale-95 transition-all text-xs font-semibold normal-case tracking-normal",
    cardClass: "bg-white/70 backdrop-blur-2xl border border-black/[0.08] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-[#0071e3]/30 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]",
    badgeClass: "bg-[#e8f2fd] text-[#0071e3] border border-[#b8daff] rounded-full",
    logoMode: "liquid",
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
  const [theme, setThemeState] = useState<ThemeStyle>("vantage");

  useEffect(() => {
    // Load from localStorage or URL params
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

  const config = THEME_CONFIGS[theme] || THEME_CONFIGS.vantage;
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
