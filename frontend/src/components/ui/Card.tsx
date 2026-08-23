import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  subtitle,
  icon,
  headerAction,
  ...props
}) => {
  return (
    <div
      className={cn(
        "border border-white/10 rounded-xl overflow-hidden backdrop-blur-md transition-all duration-200",
        "bg-[linear-gradient(145deg,rgba(24,22,20,0.80),rgba(5,12,14,0.86))] shadow-[0_4px_20px_rgba(0,0,0,0.4)]",
        className
      )}
      {...props}
    >
      {(title || headerAction) && (
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            {icon && <div className="text-blue-400 p-1.5 bg-white/[0.04] rounded-md border border-white/10">{icon}</div>}
            <div>
              {title && <h3 className="text-sm font-semibold text-white tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-grey-300 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};
