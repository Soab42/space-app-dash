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
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
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

//   // Handle min value change
//   const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = Math.min(Number(event.target.value), maxVal - step);
//     setMinVal(newValue);
//     onChange([newValue, maxVal]);
//   };

//   // Handle max value change
//   const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = Math.max(Number(event.target.value), minVal + step);
//     setMaxVal(newValue);
//     onChange([minVal, newValue]);
//   };

//   // Determine which thumb should respond to a click based on click position
//   const getClosestThumb = (clientX: number): 'min' | 'max' => {
//     if (!containerRef.current) return 'min';

//     const rect = containerRef.current.getBoundingClientRect();
//     const clickPercent = (clientX - rect.left) / rect.width;
//     const clickValue = min + (max - min) * clickPercent;

//     const distanceToMin = Math.abs(clickValue - minVal);
//     const distanceToMax = Math.abs(clickValue - maxVal);

//     return distanceToMin <= distanceToMax ? 'min' : 'max';
//   };

//   // Handle mouse down with proper thumb detection
//   const handleMouseDown = (event: React.MouseEvent, thumb?: 'min' | 'max') => {
//     event.preventDefault();
//     const targetThumb = thumb || getClosestThumb(event.clientX);
//     setIsDragging(targetThumb);

//     // Focus the correct input
//     if (targetThumb === 'min' && minValRef.current) {
//       minValRef.current.focus();
//     } else if (targetThumb === 'max' && maxValRef.current) {
//       maxValRef.current.focus();
//     }
//   };

//   // Handle touch start with proper thumb detection
//   const handleTouchStart = (event: React.TouchEvent, thumb?: 'min' | 'max') => {
//     const touch = event.touches[0];
//     const targetThumb = thumb || getClosestThumb(touch.clientX);
//     setIsDragging(targetThumb);
//   };

// 'use client';

// import React, { useState, useRef, useEffect, useCallback } from 'react';

// interface DualRangeSliderProps {
//   min: number;
//   max: number;
//   value: [number, number];
//   onChange: (value: [number, number]) => void;
//   step?: number;
//   label?: string;
//   formatValue?: (value: number) => string;
//   disabled?: boolean;
//   className?: string;
// }

// const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
//   min,
//   max,
//   value,
//   onChange,
//   step = 1,
//   label,
//   formatValue = (val) => val.toString(),
//   disabled = false,
//   className = '',
// }) => {
//   const [minVal, setMinVal] = useState(value[0]);
//   const [maxVal, setMaxVal] = useState(value[1]);
//   const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

//   const minValRef = useRef<HTMLInputElement>(null);
//   const maxValRef = useRef<HTMLInputElement>(null);
//   const range = useRef<HTMLDivElement>(null);

//   // Sync internal state with external value prop
//   useEffect(() => {
//     setMinVal(value[0]);
//     setMaxVal(value[1]);
//   }, [value]);

//   // Convert to percentage
//   const getPercent = useCallback(
//     (val: number) => {
//       if (max === min) return 0;
//       return Math.round(((val - min) / (max - min)) * 100);
//     },
//     [min, max]
//   );

//   // Update range bar position and width
//   useEffect(() => {
//     if (range.current) {
//       const minPercent = getPercent(minVal);
//       const maxPercent = getPercent(maxVal);

//       range.current.style.left = `${minPercent}%`;
//       range.current.style.width = `${maxPercent - minPercent}%`;
//     }
//   }, [minVal, maxVal, getPercent]);

//   // Handle min value change
//   const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = Math.min(Number(event.target.value), maxVal - step);
//     setMinVal(newValue);
//     onChange([newValue, maxVal]);
//   };

//   // Handle max value change
//   const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = Math.max(Number(event.target.value), minVal + step);
//     setMaxVal(newValue);
//     onChange([minVal, newValue]);
//   };

//   return (
//     <div className={`w-full ${className}`}>
//       {label && (
//         <div className="flex justify-between items-center mb-4">
//           <label className="text-sm font-medium text-slate-700">{label}</label>
//           <div className="text-sm text-slate-500">
//             {formatValue(minVal)} - {formatValue(maxVal)}
//           </div>
//         </div>
//       )}

//       <div className="relative h-12 flex items-center px-3">
//         {/* Max range input - placed first so it's below min input */}
//         <input
//           type="range"
//           min={min}
//           max={max}
//           step={step}
//           value={maxVal}
//           ref={maxValRef}
//           onChange={handleMaxChange}
//           onMouseDown={() => setIsDragging('max')}
//           onMouseUp={() => setIsDragging(null)}
//           onTouchStart={() => setIsDragging('max')}
//           onTouchEnd={() => setIsDragging(null)}
//           disabled={disabled}
//           className={`
//             absolute w-full h-full appearance-none bg-transparent cursor-pointer outline-none
//             [&::-webkit-slider-thumb]:appearance-none
//             [&::-webkit-slider-thumb]:h-5
//             [&::-webkit-slider-thumb]:w-5
//             [&::-webkit-slider-thumb]:rounded-full
//             [&::-webkit-slider-thumb]:bg-white
//             [&::-webkit-slider-thumb]:border-2
//             [&::-webkit-slider-thumb]:border-slate-400
//             [&::-webkit-slider-thumb]:shadow-lg
//             [&::-webkit-slider-thumb]:cursor-pointer
//             [&::-webkit-slider-thumb]:transition-all
//             [&::-webkit-slider-thumb]:duration-150
//             hover:[&::-webkit-slider-thumb]:border-slate-600
//             hover:[&::-webkit-slider-thumb]:shadow-xl
//             focus:[&::-webkit-slider-thumb]:ring-2
//             focus:[&::-webkit-slider-thumb]:ring-slate-400/50
//             focus:[&::-webkit-slider-thumb]:ring-offset-2
//             disabled:[&::-webkit-slider-thumb]:bg-slate-200
//             disabled:[&::-webkit-slider-thumb]:border-slate-300
//             disabled:[&::-webkit-slider-thumb]:cursor-not-allowed
//             [&::-moz-range-thumb]:h-5
//             [&::-moz-range-thumb]:w-5
//             [&::-moz-range-thumb]:rounded-full
//             [&::-moz-range-thumb]:bg-white
//             [&::-moz-range-thumb]:border-2
//             [&::-moz-range-thumb]:border-slate-400
//             [&::-moz-range-thumb]:shadow-lg
//             [&::-moz-range-thumb]:cursor-pointer
//             [&::-moz-range-thumb]:transition-all
//             [&::-moz-range-thumb]:duration-150
//             hover:[&::-moz-range-thumb]:border-slate-600
//             hover:[&::-moz-range-thumb]:shadow-xl
//             ${disabled ? 'cursor-not-allowed opacity-50' : ''}
//           `}
//           style={{
//             zIndex: isDragging === 'max' ? 30 : (minVal > max - (max - min) * 0.05 ? 20 : 10)
//           }}
//         />

//         {/* Min range input - placed second so it's above max input by default */}
//         <input
//           type="range"
//           min={min}
//           max={max}
//           step={step}
//           value={minVal}
//           ref={minValRef}
//           onChange={handleMinChange}
//           onMouseDown={() => setIsDragging('min')}
//           onMouseUp={() => setIsDragging(null)}
//           onTouchStart={() => setIsDragging('min')}
//           onTouchEnd={() => setIsDragging(null)}
//           disabled={disabled}
//           className={`
//             absolute w-full h-full appearance-none bg-transparent cursor-pointer outline-none
//             [&::-webkit-slider-thumb]:appearance-none
//             [&::-webkit-slider-thumb]:h-5
//             [&::-webkit-slider-thumb]:w-5
//             [&::-webkit-slider-thumb]:rounded-full
//             [&::-webkit-slider-thumb]:bg-white
//             [&::-webkit-slider-thumb]:border-2
//             [&::-webkit-slider-thumb]:border-slate-400
//             [&::-webkit-slider-thumb]:shadow-lg
//             [&::-webkit-slider-thumb]:cursor-pointer
//             [&::-webkit-slider-thumb]:transition-all
//             [&::-webkit-slider-thumb]:duration-150
//             hover:[&::-webkit-slider-thumb]:border-slate-600
//             hover:[&::-webkit-slider-thumb]:shadow-xl
//             focus:[&::-webkit-slider-thumb]:ring-2
//             focus:[&::-webkit-slider-thumb]:ring-slate-400/50
//             focus:[&::-webkit-slider-thumb]:ring-offset-2
//             disabled:[&::-webkit-slider-thumb]:bg-slate-200
//             disabled:[&::-webkit-slider-thumb]:border-slate-300
//             disabled:[&::-webkit-slider-thumb]:cursor-not-allowed
//             [&::-moz-range-thumb]:h-5
//             [&::-moz-range-thumb]:w-5
//             [&::-moz-range-thumb]:rounded-full
//             [&::-moz-range-thumb]:bg-white
//             [&::-moz-range-thumb]:border-2
//             [&::-moz-range-thumb]:border-slate-400
//             [&::-moz-range-thumb]:shadow-lg
//             [&::-moz-range-thumb]:cursor-pointer
//             [&::-moz-range-thumb]:transition-all
//             [&::-moz-range-thumb]:duration-150
//             hover:[&::-moz-range-thumb]:border-slate-600
//             hover:[&::-moz-range-thumb]:shadow-xl
//             ${disabled ? 'cursor-not-allowed opacity-50' : ''}
//           `}
//           style={{
//             zIndex: isDragging === 'min' ? 30 : 15
//           }}
//         />

//         {/* Track background */}
//         <div className="absolute w-full h-2 rounded-full bg-slate-200" />

//         {/* Active range */}
//         <div
//           ref={range}
//           className={`
//             absolute h-2 rounded-full transition-all duration-150
//             ${disabled ? 'bg-slate-300' : 'bg-slate-700'}
//           `}
//         />

//         {/* Value tooltips */}
//         <div
//           className={`
//             absolute px-2 py-1 text-xs font-medium text-white bg-slate-800 rounded-md shadow-lg
//             transform -translate-x-1/2 -translate-y-full transition-all duration-150
//             ${isDragging === 'min' || !label ? 'opacity-100 -top-12' : 'opacity-0 -top-8 pointer-events-none'}
//           `}
//           style={{ left: `${getPercent(minVal)}%` }}
//         >
//           {formatValue(minVal)}
//           <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800" />
//         </div>

//         <div
//           className={`
//             absolute px-2 py-1 text-xs font-medium text-white bg-slate-800 rounded-md shadow-lg
//             transform -translate-x-1/2 -translate-y-full transition-all duration-150
//             ${isDragging === 'max' || !label ? 'opacity-100 -top-12' : 'opacity-0 -top-8 pointer-events-none'}
//           `}
//           style={{ left: `${getPercent(maxVal)}%` }}
//         >
//           {formatValue(maxVal)}
//           <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DualRangeSlider;
