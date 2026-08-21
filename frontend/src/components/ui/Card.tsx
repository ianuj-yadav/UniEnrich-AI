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
        "bg-black-800 border border-black-600 rounded-lg shadow-sm overflow-hidden",
        className
      )}
      {...props}
    >
      {(title || headerAction) && (
        <div className="px-5 py-4 border-b border-black-600 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <div className="text-blue-400 p-1.5 bg-black-700 rounded-md border border-black-600">{icon}</div>}
            <div>
              {title && <h3 className="text-sm font-semibold text-white-100">{title}</h3>}
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
