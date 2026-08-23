import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: 
    | "default" 
    | "success" 
    | "warning" 
    | "danger" 
    | "purple" 
    | "blue" 
    | "lime" 
    | "pink" 
    | "grey" 
    | "green" 
    | "lightblue" 
    | "orange" 
    | "yellow" 
    | "brown" 
    | "red";
  size?: "sm" | "md";
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className,
  dot = false,
}) => {
  const variantStyles = {
    default: "bg-[#f5eff1] text-[#382b22] border-[#e0d0d5]",
    pink: "bg-[#fff0f0] text-[#703d52] border-[#f9c4d2]",
    success: "bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]",
    green: "bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]",
    warning: "bg-[#fffbeb] text-[#92400e] border-[#fde68a]",
    yellow: "bg-[#fefce8] text-[#854d0e] border-[#fef08a]",
    danger: "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]",
    red: "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]",
    purple: "bg-[#f5f3ff] text-[#5b21b6] border-[#ddd6fe]",
    blue: "bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]",
    lightblue: "bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]",
    orange: "bg-[#fff7ed] text-[#9a3412] border-[#fed7aa]",
    lime: "bg-[#f7fee7] text-[#3f6212] border-[#d9f99d]",
    grey: "bg-[#f8fafc] text-[#334155] border-[#e2e8f0]",
    brown: "bg-[#faf5f0] text-[#7c2d12] border-[#fed7aa]",
  };

  const dotColors = {
    default: "bg-[#b18597]",
    pink: "bg-[#b18597]",
    success: "bg-[#10b981]",
    green: "bg-[#10b981]",
    warning: "bg-[#f59e0b]",
    yellow: "bg-[#eab308]",
    danger: "bg-[#ef4444]",
    red: "bg-[#ef4444]",
    purple: "bg-[#8b5cf6]",
    blue: "bg-[#3b82f6]",
    lightblue: "bg-[#0ea5e9]",
    orange: "bg-[#f97316]",
    lime: "bg-[#84cc16]",
    grey: "bg-[#64748b]",
    brown: "bg-[#a16207]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full border tracking-wide uppercase font-mono",
        variantStyles[variant] || variantStyles.default,
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            dotColors[variant] || dotColors.default
          )}
        />
      )}
      {children}
    </span>
  );
};
