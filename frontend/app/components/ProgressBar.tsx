import React from "react";

type ProgressBarProps = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = calculateProgress(current, total);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
        <div
          className="h-2 bg-teal-600 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-center mt-2 text-sm font-medium text-gray-700">
        {current} / {total} ({progress.toFixed(2)}%)
      </p>
    </div>
  );
}

export function calculateProgress(current: number, total: number): number {
  if (total === 0) return 0; // avoid division by zero
  const progress = (current / total) * 100;
  return Math.min(Math.max(progress, 0), 100); // clamp between 0 and 100
}
