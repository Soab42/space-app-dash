"use client";
import React, { useState, useRef, useCallback } from "react";

const DualRangeSlider = ({
  min = 0,
  max = 100,
  step = 1,
  initialMin = 0,
  initialMax = 100,
  label = "Range",
  formatValue = (value: number) => value,
  onChange = (minValue: number, maxValue: number) => {},
  isLabelVisible = false,
  isValueVisible = false,
}) => {
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPercentage = (value: number) => ((value - min) / (max - min)) * 100;

  const handleMouseDown = (type: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(type);
  };
  
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
      );
      const newValue = Math.round((percentage / 100) * (max - min) + min);

      if (isDragging === "min") {
        const clampedValue = Math.max(min, Math.min(newValue, maxValue - step));
        if (clampedValue !== minValue) {
          setMinValue(clampedValue);
          onChange(clampedValue, maxValue);
        }
      } else if (isDragging === "max") {
        const clampedValue = Math.min(max, Math.max(newValue, minValue + step));
        if (clampedValue !== maxValue) {
          setMaxValue(clampedValue);
          onChange(minValue, clampedValue);
        }
      }
    },
    [isDragging, min, max, step, minValue, maxValue, onChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove as any);
      document.addEventListener("mouseup", handleMouseUp as any);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove as any);
        document.removeEventListener("mouseup", handleMouseUp as any);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const minPercentage = getPercentage(minValue);
  const maxPercentage = getPercentage(maxValue);

  return (
    <div className="w-full mx-auto p-6">
      <div className="mb-6">
        {isLabelVisible && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="flex justify-between items-center mb-4">
          {isValueVisible && (
            <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
              <span className="text-sm font-medium text-black">
                Min: {formatValue(minValue)}
              </span>
            </div>
          )}
          {isValueVisible && (
            <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
              <span className="text-sm font-medium text-black">
                Max: {formatValue(maxValue)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        {/* Track */}
        <div
          ref={sliderRef}
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
        >
          {/* Active range */}
          <div
            className="absolute h-2 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full transition-all duration-150"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          />

          {/* Min handle */}
          <div
            className={`absolute w-5 h-5 bg-white border-2 border-slate-500 rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 top-1/2 transition-all duration-150 hover:scale-110 shadow-lg ${
              isDragging === "min" ? "scale-110 shadow-xl border-slate-600" : ""
            }`}
            style={{ left: `${minPercentage}%` }}
            onMouseDown={handleMouseDown("min")}
          >
            <div className="absolute inset-0 rounded-full bg-slate-500 opacity-20 transform scale-150" />
          </div>

          {/* Max handle */}
          <div
            className={`absolute w-5 h-5 bg-white border-2 border-slate-500 rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 top-1/2 transition-all duration-150 hover:scale-110 shadow-lg ${
              isDragging === "max" ? "scale-110 shadow-xl border-slate-600" : ""
            }`}
            style={{ left: `${maxPercentage}%` }}
            onMouseDown={handleMouseDown("max")}
          >
            <div className="absolute inset-0 rounded-full bg-slate-500 opacity-20 transform scale-150" />
          </div>
        </div>
        {/* Value tooltips */}
        <div
          className={`
            absolute px-2 py-1 text-xs font-medium text-white bg-slate-800 rounded-md shadow-lg
            transform -translate-x-1/2 -translate-y-full transition-all duration-150
            ${
              isDragging === "min" || !label
                ? "opacity-100 -top-4"
                : "opacity-0 -top-8 pointer-events-none"
            }
          `}
          style={{ left: `${minPercentage}%` }}
        >
          {formatValue(minValue)}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800" />
        </div>

        <div
          className={`
            absolute px-2 py-1 text-xs font-medium text-white bg-slate-800 rounded-md shadow-lg
            transform -translate-x-1/2 -translate-y-full transition-all duration-150
            ${
              isDragging === "max" || !label
                ? "opacity-100 -top-4"
                : "opacity-0 -top-8 pointer-events-none"
            }
          `}
          style={{ left: `${maxPercentage}%` }}
        >
          {formatValue(maxValue)}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800" />
        </div>

        {/* Min/Max labels on track */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    </div>
  );
};

export default DualRangeSlider;
