import React from "react";
import { cn } from "@/lib/utils";

export interface PopButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "pop" | "pop-dark" | "pop-blue" | "pop-emerald";
}

export function PopButton({ className, children = "Learn More", variant = "pop", ...props }: PopButtonProps) {
  const variantStyles = {
    pop: cn(
      "text-[#382b22] dark:text-[#382b22] bg-[#fff0f0] border-2 border-[#b18597]",
      "shadow-[0_12px_0_-2px_#f9c4d2,0_12px_0_0_#b18597,0_22px_0_0_#ffe3e2]",
      "dark:shadow-[0_12px_0_-2px_#f9c4d2,0_12px_0_0_#b18597,0_22px_15px_-5px_rgba(0,0,0,0.3)]",
      "hover:bg-[#ffe9e9] hover:translate-y-1 hover:shadow-[0_8px_0_-2px_#f9c4d2,0_8px_0_0_#b18597,0_16px_0_0_#ffe3e2]",
      "dark:hover:shadow-[0_8px_0_-2px_#f9c4d2,0_8px_0_0_#b18597,0_16px_10px_-5px_rgba(0,0,0,0.3)]",
      "active:bg-[#ffe9e9] active:translate-y-3 active:shadow-[0_0px_0_-2px_#f9c4d2,0_0px_0_0_#b18597,0_0px_0_0_#ffe3e2]",
      "dark:active:shadow-[0_0px_0_-2px_#f9c4d2,0_0px_0_0_#b18597,0_0px_0_0_rgba(0,0,0,0)]"
    ),
    "pop-dark": cn(
      "text-white bg-[#1a1c23] border-2 border-[#4b5563]",
      "shadow-[0_12px_0_-2px_#374151,0_12px_0_0_#4b5563,0_22px_15px_-5px_rgba(0,0,0,0.5)]",
      "hover:bg-[#262935] hover:translate-y-1 hover:shadow-[0_8px_0_-2px_#374151,0_8px_0_0_#4b5563,0_16px_10px_-5px_rgba(0,0,0,0.5)]",
      "active:bg-[#262935] active:translate-y-3 active:shadow-[0_0px_0_-2px_#374151,0_0px_0_0_#4b5563,0_0px_0_0_rgba(0,0,0,0)]"
    ),
    "pop-blue": cn(
      "text-white bg-[#1e40af] border-2 border-[#60a5fa]",
      "shadow-[0_12px_0_-2px_#3b82f6,0_12px_0_0_#60a5fa,0_22px_15px_-5px_rgba(0,0,0,0.5)]",
      "hover:bg-[#1d4ed8] hover:translate-y-1 hover:shadow-[0_8px_0_-2px_#3b82f6,0_8px_0_0_#60a5fa,0_16px_10px_-5px_rgba(0,0,0,0.5)]",
      "active:bg-[#1d4ed8] active:translate-y-3 active:shadow-[0_0px_0_-2px_#3b82f6,0_0px_0_0_#60a5fa,0_0px_0_0_rgba(0,0,0,0)]"
    ),
    "pop-emerald": cn(
      "text-white bg-[#065f46] border-2 border-[#34d399]",
      "shadow-[0_12px_0_-2px_#10b981,0_12px_0_0_#34d399,0_22px_15px_-5px_rgba(0,0,0,0.5)]",
      "hover:bg-[#047857] hover:translate-y-1 hover:shadow-[0_8px_0_-2px_#10b981,0_8px_0_0_#34d399,0_16px_10px_-5px_rgba(0,0,0,0.5)]",
      "active:bg-[#047857] active:translate-y-3 active:shadow-[0_0px_0_-2px_#10b981,0_0px_0_0_#34d399,0_0px_0_0_rgba(0,0,0,0)]"
    ),
  };

  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center font-semibold uppercase",
        "px-8 py-5 rounded-xl cursor-pointer select-none",
        "transition-all duration-150 ease-[cubic-bezier(0,0,0.58,1)]",
        variantStyles[variant] || variantStyles.pop,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default PopButton;
