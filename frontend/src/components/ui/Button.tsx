import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 
    | "primary" 
    | "secondary" 
    | "danger" 
    | "success" 
    | "purple" 
    | "outline" 
    | "ghost" 
    | "green" 
    | "blue" 
    | "orange" 
    | "pop" 
    | "pop-dark"
    | "pop-cream";
  size?: "sm" | "md" | "lg" | "pop";
  icon?: React.ReactNode;
  isLoading?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  isLoading = false,
  loading = false,
  className,
  disabled,
  ...props
}) => {
  const isButtonLoading = isLoading || loading;

  const variantStyles = {
    // Pop Cream / Rose Blush (Exact "GET STARTED" styling)
    primary: cn(
      "text-[#382b22] dark:text-[#382b22] bg-[#fff0f0] border-2 border-[#b18597]",
      "shadow-[0_8px_0_-2px_#f9c4d2,0_8px_0_0_#b18597,0_14px_8px_-3px_rgba(0,0,0,0.3)]",
      "hover:bg-[#ffe9e9] hover:translate-y-0.5 hover:shadow-[0_5px_0_-2px_#f9c4d2,0_5px_0_0_#b18597,0_10px_6px_-3px_rgba(0,0,0,0.3)]",
      "active:bg-[#ffe9e9] active:translate-y-2 active:shadow-[0_0px_0_0_#b18597]"
    ),
    pop: cn(
      "text-[#382b22] dark:text-[#382b22] bg-[#fff0f0] border-2 border-[#b18597]",
      "shadow-[0_12px_0_-2px_#f9c4d2,0_12px_0_0_#b18597,0_22px_0_0_#ffe3e2]",
      "dark:shadow-[0_12px_0_-2px_#f9c4d2,0_12px_0_0_#b18597,0_22px_15px_-5px_rgba(0,0,0,0.3)]",
      "hover:bg-[#ffe9e9] hover:translate-y-1 hover:shadow-[0_8px_0_-2px_#f9c4d2,0_8px_0_0_#b18597,0_16px_0_0_#ffe3e2]",
      "dark:hover:shadow-[0_8px_0_-2px_#f9c4d2,0_8px_0_0_#b18597,0_16px_10px_-5px_rgba(0,0,0,0.3)]",
      "active:bg-[#ffe9e9] active:translate-y-3 active:shadow-[0_0px_0_-2px_#f9c4d2,0_0px_0_0_#b18597,0_0px_0_0_#ffe3e2]",
      "dark:active:shadow-[0_0px_0_-2px_#f9c4d2,0_0px_0_0_#b18597,0_0px_0_0_rgba(0,0,0,0)]"
    ),
    "pop-cream": cn(
      "text-[#382b22] dark:text-[#382b22] bg-[#fff0f0] border-2 border-[#b18597]",
      "shadow-[0_8px_0_-2px_#f9c4d2,0_8px_0_0_#b18597,0_14px_8px_-3px_rgba(0,0,0,0.3)]",
      "hover:bg-[#ffe9e9] hover:translate-y-0.5 active:translate-y-2"
    ),
    // Pop Dark
    secondary: cn(
      "text-[#fde8f0] bg-[#1a1c23] border-2 border-[#b18597]/70",
      "shadow-[0_8px_0_-2px_#4c3a44,0_8px_0_0_#b18597,0_14px_8px_-3px_rgba(0,0,0,0.4)]",
      "hover:bg-[#262935] hover:translate-y-0.5 hover:shadow-[0_5px_0_-2px_#4c3a44,0_5px_0_0_#b18597,0_10px_6px_-3px_rgba(0,0,0,0.4)]",
      "active:bg-[#262935] active:translate-y-2 active:shadow-[0_0px_0_0_#b18597]"
    ),
    "pop-dark": cn(
      "text-white bg-[#1a1c23] border-2 border-[#4b5563]",
      "shadow-[0_12px_0_-2px_#374151,0_12px_0_0_#4b5563,0_22px_15px_-5px_rgba(0,0,0,0.5)]",
      "hover:bg-[#262935] hover:translate-y-1 hover:shadow-[0_8px_0_-2px_#374151,0_8px_0_0_#4b5563,0_16px_10px_-5px_rgba(0,0,0,0.5)]",
      "active:bg-[#262935] active:translate-y-3 active:shadow-[0_0px_0_-2px_#374151,0_0px_0_0_#4b5563,0_0px_0_0_rgba(0,0,0,0)]"
    ),
    // Pop Blue
    blue: cn(
      "text-[#1e1b4b] bg-[#e0e7ff] border-2 border-[#6366f1]",
      "shadow-[0_8px_0_-2px_#a5b4fc,0_8px_0_0_#6366f1,0_14px_8px_-3px_rgba(0,0,0,0.3)]",
      "hover:bg-[#c7d2fe] hover:translate-y-0.5 active:translate-y-2"
    ),
    // Pop Green
    green: cn(
      "text-[#064e3b] bg-[#ecfdf5] border-2 border-[#10b981]",
      "shadow-[0_8px_0_-2px_#6ee7b7,0_8px_0_0_#10b981,0_14px_8px_-3px_rgba(0,0,0,0.3)]",
      "hover:bg-[#d1fae5] hover:translate-y-0.5 active:translate-y-2"
    ),
    success: cn(
      "text-[#064e3b] bg-[#ecfdf5] border-2 border-[#10b981]",
      "shadow-[0_8px_0_-2px_#6ee7b7,0_8px_0_0_#10b981,0_14px_8px_-3px_rgba(0,0,0,0.3)]",
      "hover:bg-[#d1fae5] hover:translate-y-0.5 active:translate-y-2"
    ),
    // Pop Purple
    purple: cn(
      "text-[#4c1d95] bg-[#f5f3ff] border-2 border-[#8b5cf6]",
      "shadow-[0_8px_0_-2px_#c4b5fd,0_8px_0_0_#8b5cf6,0_14px_8px_-3px_rgba(0,0,0,0.3)]",
      "hover:bg-[#ede9fe] hover:translate-y-0.5 active:translate-y-2"
    ),
    // Pop Danger / Red
    danger: cn(
      "text-[#7f1d1d] bg-[#fee2e2] border-2 border-[#ef4444]",
      "shadow-[0_8px_0_-2px_#fca5a5,0_8px_0_0_#ef4444,0_14px_8px_-3px_rgba(0,0,0,0.3)]",
      "hover:bg-[#fecaca] hover:translate-y-0.5 active:translate-y-2"
    ),
    // Pop Orange
    orange: cn(
      "text-[#7c2d12] bg-[#ffedd5] border-2 border-[#f97316]",
      "shadow-[0_8px_0_-2px_#fdba74,0_8px_0_0_#f97316,0_14px_8px_-3px_rgba(0,0,0,0.3)]",
      "hover:bg-[#fed7aa] hover:translate-y-0.5 active:translate-y-2"
    ),
    // Pop Outline
    outline: cn(
      "text-[#f9c4d2] bg-[#1b1c24] border-2 border-[#b18597]",
      "shadow-[0_8px_0_-2px_#59424e,0_8px_0_0_#b18597,0_14px_8px_-3px_rgba(0,0,0,0.3)]",
      "hover:bg-[#252732] hover:translate-y-0.5 active:translate-y-2"
    ),
    // Pop Ghost
    ghost: cn(
      "text-[#f9c4d2] hover:bg-white/[0.08] border-2 border-transparent",
      "hover:border-[#b18597]/40 hover:shadow-[0_4px_0_0_#b18597/60]"
    ),
  };

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-[11px] rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-xs rounded-xl gap-2",
    lg: "px-7 py-3.5 text-sm rounded-xl gap-2.5",
    pop: "px-8 py-5 text-sm rounded-xl gap-3",
  };

  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center font-semibold uppercase tracking-wider select-none cursor-pointer",
        "transition-all duration-150 ease-[cubic-bezier(0,0,0.58,1)]",
        "focus:outline-none focus:ring-2 focus:ring-[#b18597] focus:ring-offset-2 focus:ring-offset-black",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
        variantStyles[variant] || variantStyles.primary,
        sizeStyles[size],
        className
      )}
      disabled={disabled || isButtonLoading}
      {...props}
    >
      {isButtonLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
