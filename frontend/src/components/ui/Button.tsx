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
      "text-[#382b22] bg-[#fff0f0] border-2 border-[#b18597]",
      "shadow-[0_8px_0_-2px_#f9c4d2,0_8px_0_0_#b18597,0_14px_8px_-3px_rgba(0,0,0,0.15)]",
      "hover:bg-[#ffe9e9] hover:translate-y-0.5 hover:shadow-[0_5px_0_-2px_#f9c4d2,0_5px_0_0_#b18597,0_10px_6px_-3px_rgba(0,0,0,0.15)]",
      "active:bg-[#ffe9e9] active:translate-y-2 active:shadow-[0_0px_0_0_#b18597]"
    ),
    pop: cn(
      "text-[#382b22] bg-[#fff0f0] border-2 border-[#b18597]",
      "shadow-[0_12px_0_-2px_#f9c4d2,0_12px_0_0_#b18597,0_22px_0_0_#ffe3e2]",
      "hover:bg-[#ffe9e9] hover:translate-y-1 hover:shadow-[0_8px_0_-2px_#f9c4d2,0_8px_0_0_#b18597,0_16px_0_0_#ffe3e2]",
      "active:bg-[#ffe9e9] active:translate-y-3 active:shadow-[0_0px_0_-2px_#f9c4d2,0_0px_0_0_#b18597,0_0px_0_0_#ffe3e2]"
    ),
    "pop-cream": cn(
      "text-[#382b22] bg-[#fff0f0] border-2 border-[#b18597]",
      "shadow-[0_8px_0_-2px_#f9c4d2,0_8px_0_0_#b18597,0_14px_8px_-3px_rgba(0,0,0,0.15)]",
      "hover:bg-[#ffe9e9] hover:translate-y-0.5 active:translate-y-2"
    ),
    // Light Porcelain Secondary
    secondary: cn(
      "text-[#2b201a] bg-[#faf6f6] border-2 border-[#e8dede]",
      "shadow-[0_4px_0_0_#e8dede]",
      "hover:bg-[#ffffff] hover:border-[#b18597] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#b18597]",
      "active:bg-[#ffffff] active:translate-y-1 active:shadow-[0_0px_0_0_#b18597]"
    ),
    "pop-dark": cn(
      "text-[#2b201a] bg-[#f5eeee] border-2 border-[#b18597]",
      "shadow-[0_8px_0_-2px_#e8dede,0_8px_0_0_#b18597]",
      "hover:bg-[#faf6f6] hover:translate-y-0.5"
    ),
    // Pop Blue
    blue: cn(
      "text-[#1e40af] bg-[#eff6ff] border-2 border-[#93c5fd]",
      "shadow-[0_6px_0_0_#93c5fd]",
      "hover:bg-[#dbeafe] hover:translate-y-0.5 active:translate-y-1"
    ),
    // Pop Green
    green: cn(
      "text-[#065f46] bg-[#ecfdf5] border-2 border-[#a7f3d0]",
      "shadow-[0_6px_0_0_#a7f3d0]",
      "hover:bg-[#d1fae5] hover:translate-y-0.5 active:translate-y-1"
    ),
    success: cn(
      "text-[#065f46] bg-[#ecfdf5] border-2 border-[#a7f3d0]",
      "shadow-[0_6px_0_0_#a7f3d0]",
      "hover:bg-[#d1fae5] hover:translate-y-0.5 active:translate-y-1"
    ),
    // Pop Purple
    purple: cn(
      "text-[#5b21b6] bg-[#f5f3ff] border-2 border-[#ddd6fe]",
      "shadow-[0_6px_0_0_#ddd6fe]",
      "hover:bg-[#ede9fe] hover:translate-y-0.5 active:translate-y-1"
    ),
    // Pop Danger / Red
    danger: cn(
      "text-[#991b1b] bg-[#fef2f2] border-2 border-[#fecaca]",
      "shadow-[0_6px_0_0_#fecaca]",
      "hover:bg-[#fee2e2] hover:translate-y-0.5 active:translate-y-1"
    ),
    // Pop Orange
    orange: cn(
      "text-[#9a3412] bg-[#fff7ed] border-2 border-[#fed7aa]",
      "shadow-[0_6px_0_0_#fed7aa]",
      "hover:bg-[#ffedd5] hover:translate-y-0.5 active:translate-y-1"
    ),
    // Pop Outline
    outline: cn(
      "text-[#2b201a] bg-[#ffffff] border-2 border-[#e8dede]",
      "shadow-[0_4px_0_0_#e8dede]",
      "hover:border-[#b18597] hover:bg-[#fff0f0] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#b18597]",
      "active:translate-y-1"
    ),
    // Pop Ghost
    ghost: cn(
      "text-[#5e4d46] hover:text-[#2b201a] hover:bg-[#fff0f0] border-2 border-transparent",
      "hover:border-[#b18597]/40"
    ),
  };

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-[11px] rounded-xl gap-1.5",
    md: "px-5 py-2.5 text-xs rounded-2xl gap-2",
    lg: "px-7 py-3.5 text-sm rounded-2xl gap-2.5",
    pop: "px-8 py-4 text-xs font-bold rounded-2xl gap-3",
  };

  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center font-bold uppercase tracking-wider select-none cursor-pointer",
        "transition-all duration-150 ease-[cubic-bezier(0,0,0.58,1)]",
        "focus:outline-none focus:ring-2 focus:ring-[#b18597] focus:ring-offset-2",
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
