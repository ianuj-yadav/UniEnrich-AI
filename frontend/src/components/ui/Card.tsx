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
        "border border-[#e8dede] rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-200",
        "bg-[#ffffff] shadow-[0_4px_20px_rgba(177,133,151,0.06)] hover:border-[#b18597]/60 hover:shadow-[0_8px_24px_rgba(177,133,151,0.12)] text-[#2b201a]",
        className
      )}
      {...props}
    >
      {(title || headerAction) && (
        <div className="px-5 py-4 border-b border-[#e8dede] flex items-center justify-between bg-[#fdfafb]">
          <div className="flex items-center gap-3">
            {icon && <div className="text-[#b18597] p-1.5 bg-[#fff0f0] rounded-lg border border-[#e8dede]">{icon}</div>}
            <div>
              {title && <h3 className="text-sm font-bold text-[#2b201a] tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-[#5e4d46] mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};
