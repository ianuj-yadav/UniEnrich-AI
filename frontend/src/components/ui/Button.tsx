import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "purple" | "outline" | "ghost" | "green" | "blue" | "orange";
  size?: "sm" | "md" | "lg";
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
    primary: "bg-blue-500 hover:bg-blue-400 text-white-50 border border-blue-600 shadow-sm",
    blue: "bg-blue-500 hover:bg-blue-400 text-white-50 border border-blue-600 shadow-sm",
    secondary: "bg-black-700 hover:bg-black-600 text-white-100 border border-black-600",
    danger: "bg-red-700 hover:bg-red-600 text-white-50 border border-red-800",
    success: "bg-green-700 hover:bg-green-500 text-white-50 border border-green-900",
    green: "bg-green-700 hover:bg-green-500 text-white-50 border border-green-900",
    purple: "bg-purple-600 hover:bg-purple-500 text-white-50 border border-purple-800",
    orange: "bg-orange-600 hover:bg-orange-500 text-white-50 border border-orange-800",
    outline: "bg-transparent hover:bg-black-700 text-white-200 border border-grey-400/40",
    ghost: "bg-transparent hover:bg-black-700 text-grey-200 hover:text-white-50 border-none",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1.5 text-xs rounded-md gap-1.5",
    md: "px-4 py-2 text-sm rounded-md gap-2",
    lg: "px-5 py-2.5 text-base rounded-md gap-2.5",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black-900 disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
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
