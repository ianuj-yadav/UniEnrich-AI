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
    default: "bg-black-700 text-white-200 border-black-600",
    success: "bg-green-900/50 text-green-300 border-green-700",
    green: "bg-green-900/50 text-green-300 border-green-700",
    warning: "bg-yellow-600/20 text-yellow-400 border-yellow-500/40",
    yellow: "bg-yellow-600/20 text-yellow-400 border-yellow-500/40",
    danger: "bg-red-800/30 text-red-500 border-red-700",
    red: "bg-red-800/30 text-red-500 border-red-700",
    purple: "bg-purple-800/30 text-purple-300 border-purple-600",
    blue: "bg-blue-600/20 text-blue-400 border-blue-500/40",
    lightblue: "bg-lightblue-600/20 text-lightblue-300 border-lightblue-400/40",
    orange: "bg-orange-600/20 text-orange-400 border-orange-500/40",
    lime: "bg-lime-700/20 text-lime-300 border-lime-500/40",
    pink: "bg-pink-600/20 text-pink-300 border-pink-500/40",
    grey: "bg-grey-600/20 text-grey-200 border-grey-400/40",
    brown: "bg-brown-600/20 text-brown-200 border-brown-400/40",
  };

  const dotColors = {
    default: "bg-grey-300",
    success: "bg-green-500",
    green: "bg-green-500",
    warning: "bg-yellow-400",
    yellow: "bg-yellow-400",
    danger: "bg-red-600",
    red: "bg-red-600",
    purple: "bg-purple-500",
    blue: "bg-blue-400",
    lightblue: "bg-lightblue-300",
    orange: "bg-orange-400",
    lime: "bg-lime-300",
    pink: "bg-pink-500",
    grey: "bg-grey-300",
    brown: "bg-brown-200",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-md border",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])} />}
      {children}
    </span>
  );
};
