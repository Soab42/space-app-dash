"use client";

import { useEffect, useRef } from 'react';

export function Chart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Placeholder for a chart
        ctx.fillStyle = 'rgba(75, 192, 192, 0.2)';
        ctx.strokeStyle = 'rgba(75, 192, 192, 1)';
        ctx.lineWidth = 1;

        const data = [65, 59, 80, 81, 56, 55, 40];
        const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

        ctx.beginPath();
        ctx.moveTo(0, data[0]);
        data.forEach((point, i) => {
          const x = (i / (data.length - 1)) * canvasRef.current!.width;
          const y = (point / 100) * canvasRef.current!.height;
          ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
    }
  }, []);

  return <canvas ref={canvasRef} className="w-full h-64 bg-gray-800 rounded-lg p-4" />;
}
