import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function getConfidenceBadgeProps(score: number) {
  const percentage = Math.round(score * 100);
  if (percentage >= 85) {
    return {
      label: `${percentage}%`,
      bgColor: "bg-green-900/40",
      textColor: "text-green-300",
      borderColor: "border-green-700",
      dotColor: "bg-green-500",
    };
  } else if (percentage >= 70) {
    return {
      label: `${percentage}%`,
      bgColor: "bg-lightblue-600/20",
      textColor: "text-lightblue-300",
      borderColor: "border-lightblue-400/40",
      dotColor: "bg-blue-400",
    };
  } else if (percentage >= 50) {
    return {
      label: `${percentage}% (Review)`,
      bgColor: "bg-yellow-600/20",
      textColor: "text-yellow-400",
      borderColor: "border-yellow-500/40",
      dotColor: "bg-yellow-400",
    };
  } else {
    return {
      label: `${percentage}% (Critical)`,
      bgColor: "bg-red-800/30",
      textColor: "text-red-500",
      borderColor: "border-red-700",
      dotColor: "bg-red-600",
    };
  }
}
