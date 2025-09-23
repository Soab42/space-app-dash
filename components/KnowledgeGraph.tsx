"use client";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

/**
 * Pure React + Canvas Force Graph (no external libraries)
 * - Drop-in component for Next.js / React Server Components (client component)
 * - Uses HTML5 Canvas for performance
 * - Simple force simulation (repulsion + spring edges + velocity damping)
 * - Pan / Zoom, Node Drag, Hover tooltips
 * - Arrowheads for directed edges
 * - Tailwind classes for UI chrome (optional)
 *
 * Usage:
 * <ForceGraph data={{ nodes: [...], edges: [...] }} height={600} />
 */

// Types
export type NodeDatum = {
  id: string;
  type?: string; // category/type
};
export type EdgeDatum = {
  source: string;
  target: string;
  relation?: string;
};
export type GraphData = { nodes: NodeDatum[]; edges: EdgeDatum[] };

// Internal sim state per node
type SimNode = NodeDatum & {
  x: number; y: number; vx: number; vy: number; fixed?: boolean;
};

// Color palette by type (extend as needed)
const TYPE_COLORS: Record<string, string> = {
  "Stem Cell": "#2563eb",
  "Tissue": "#16a34a",
  "Disease": "#dc2626",
  "Stress Factor": "#a16207",
  "Growth Factor": "#0891b2",
  "Process": "#7c3aed",
  "Concept": "#0ea5e9",
  "Cell Pool": "#22c55e",
  "Phenomenon": "#06b6d4",
  "Gene Expression": "#059669",
  "Property": "#d946ef",
  "Stem Cell Subtype": "#3b82f6",
  "Marker": "#ef4444",
  "Culture Method": "#f97316",
  "State": "#64748b",
  "Environment": "#0ea5e9",
  "Culture System": "#84cc16",
  "Particle": "#65a30d",
  "Culture Technique": "#14b8a6",
  default: "#334155",
};

function colorForType(type?: string) {
  if (!type) return TYPE_COLORS.default;
  return TYPE_COLORS[type] || TYPE_COLORS.default;
}

// Utility: fit graph into view
function computeBounds(nodes: SimNode[]) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodes) {
    if (n.x < minX) minX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.x > maxX) maxX = n.x;
    if (n.y > maxY) maxY = n.y;
  }
  return { minX, minY, maxX, maxY };
}

export default function ForceGraph({ data, width = 0, height = 600, nodeRadius = 7 }: { data: GraphData; width?: number; height?: number; nodeRadius?: number; }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dpr, setDpr] = useState(1);

  // Pan/zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Hover + selection
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Build simulation nodes map
  const { nodes, nodeMap, edges } = useMemo(() => {
    const map = new Map<string, SimNode>();
    const ns: SimNode[] = data.nodes.map((n, i) => ({
      ...n,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      vx: 0, vy: 0,
    }));
    ns.forEach(n => map.set(n.id, n));
    const es = data.edges.filter(e => map.has(e.source) && map.has(e.target));
    return { nodes: ns, nodeMap: map, edges: es };
  }, [data]);

  // Canvas resize for DPR + parent width
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const observer = new ResizeObserver(() => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      const nextWidth = width || rect?.width || 800;
      const nextHeight = height;
      const dprNow = Math.min(2, window.devicePixelRatio || 1);
      setDpr(dprNow);
      canvas.width = Math.floor(nextWidth * dprNow);
      canvas.height = Math.floor(nextHeight * dprNow);
      canvas.style.width = `${nextWidth}px`;
      canvas.style.height = `${nextHeight}px`;
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [width, height]);

  // Simple force simulation (runs in RAF)
  useEffect(() => {
    const SPRING = 0.03; // Hooke's spring constant
    const LINK_LEN = 110; // desired spring length
    const REPULSION = 1200; // Coulomb-like constant
    const DAMPING = 0.85; // velocity decay per frame
    const MAX_SPEED = 3; // clamp per axis

    let anim = 0;

    const step = () => {
      // Repulsion O(N^2) — fine for a few hundred nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          let dx = a.x - b.x, dy = a.y - b.y;
          let dist2 = dx * dx + dy * dy + 0.01;
          const force = REPULSION / dist2;
          const invDist = 1 / Math.sqrt(dist2);
          dx *= invDist; dy *= invDist; // unit vector
          a.vx += dx * force; a.vy += dy * force;
          b.vx -= dx * force; b.vy -= dy * force;
        }
      }

      // Springs along edges
      for (const e of edges) {
        const a = nodeMap.get(e.source)!;
        const b = nodeMap.get(e.target)!;
        let dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        const diff = dist - LINK_LEN;
        const force = SPRING * diff;
        const ux = dx / dist, uy = dy / dist;
        // Pull equally on both
        a.vx += ux * force; a.vy += uy * force;
        b.vx -= ux * force; b.vy -= uy * force;
      }

      // Integrate velocities, apply damping
      for (const n of nodes) {
        if (n.fixed) continue;
        n.vx *= DAMPING; n.vy *= DAMPING;
        // clamp
        n.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, n.vx));
        n.vy = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, n.vy));
        n.x += n.vx; n.y += n.vy;
      }

      draw();
      anim = requestAnimationFrame(step);
    };

    const draw = () => {
      const canvas = canvasRef.current; if (!canvas) return;
      const ctx = canvas.getContext("2d"); if (!ctx) return;

      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // World -> screen transform
      ctx.save();
      ctx.translate(w / 2 + pan.x * dpr, h / 2 + pan.y * dpr);
      ctx.scale(zoom * dpr, zoom * dpr);

      // Draw edges first
      ctx.lineWidth = 1 / zoom;
      ctx.strokeStyle = "#cbd5e1"; // slate-300
      ctx.fillStyle = "white"; // slate-400 for arrowheads

      for (const e of edges) {
        const a = nodeMap.get(e.source)!;
        const b = nodeMap.get(e.target)!;
        // line
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        // arrowhead
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        const ah = 8; // arrow size
        const tx = b.x - Math.cos(ang) * (nodeRadius + 2);
        const ty = b.y - Math.sin(ang) * (nodeRadius + 2);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx - Math.cos(ang - 0.35) * ah, ty - Math.sin(ang - 0.35) * ah);
        ctx.lineTo(tx - Math.cos(ang + 0.35) * ah, ty - Math.sin(ang + 0.35) * ah);
        ctx.closePath();
        ctx.fill();
      }

      // Draw nodes
      for (const n of nodes) {
        const r = nodeRadius;
        ctx.beginPath();
        ctx.fillStyle = colorForType(n.type);
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
        // outline for hover/selection
        if (n.id === hoverId || n.id === selectedId) {
          ctx.lineWidth = 2 / zoom;
          ctx.strokeStyle = n.id === selectedId ? "#111827" : "#1f2937"; // darker
          ctx.stroke();
        }
      }

      // Labels (draw on top)
      ctx.font = `${12 / zoom}px ui-sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      for (const n of nodes) {
        ctx.fillStyle = "white"; // slate-900
        ctx.fillText(n.id, n.x, n.y + nodeRadius + 2);
      }

      ctx.restore();

      // Tooltip overlay after restore (screen space)
      if (hoverId) {
        const n = nodeMap.get(hoverId)!;
        const { x: sx, y: sy } = worldToScreen(n.x, n.y);
        drawTooltip(ctx!, sx, sy, `${n.id}${n.type ? `\n${n.type}` : ""}`);
      }
    };

    const worldToScreen = (wx: number, wy: number) => {
      const canvas = canvasRef.current!;
      const cx = canvas.width / 2 + pan.x * dpr;
      const cy = canvas.height / 2 + pan.y * dpr;
      const sx = (wx * zoom * dpr) + cx;
      const sy = (wy * zoom * dpr) + cy;
      return { x: sx, y: sy };
    };

    const drawTooltip = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string) => {
      const lines = text.split("\n");
      ctx.save();
      ctx.font = "12px ui-sans-serif";
      const pad = 16; const lh = 16;
      const w = Math.max(...lines.map(t => ctx.measureText(t).width)) + pad * 2;
      const h = lh * lines.length + pad * 2;
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)"; // slate-900
      ctx.strokeStyle = "#e2e8f0"; // slate-200
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x + 10, y + 10, w, h, 6);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#e2e8f0";
      lines.forEach((t, i) => ctx.fillText(t, x + 10 + pad, y + 10 + pad + i * lh));
      ctx.restore();
    };

    anim = requestAnimationFrame(step);
    return () => cancelAnimationFrame(anim);
  }, [nodes, edges, nodeMap, pan.x, pan.y, zoom, dpr, nodeRadius, hoverId, selectedId]);

  // Interaction: node drag, background pan, wheel zoom, picking
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    let draggingNode: SimNode | null = null;
    let last = { x: 0, y: 0 };

    const screenToWorld = (sx: number, sy: number) => {
      const cx = canvas.width / 2 + pan.x * dpr;
      const cy = canvas.height / 2 + pan.y * dpr;
      const wx = (sx - cx) / (zoom * dpr);
      const wy = (sy - cy) / (zoom * dpr);
      return { x: wx, y: wy };
    };

    const pickNode = (sx: number, sy: number) => {
      const { x, y } = screenToWorld(sx, sy);
      let hit: SimNode | null = null;
      for (const n of nodes) {
        const dx = n.x - x, dy = n.y - y;
        if (dx * dx + dy * dy <= (nodeRadius + 2) ** 2) { hit = n; break; }
      }
      return hit;
    };

    const onMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const sx = (e.clientX - rect.left) * dpr;
      const sy = (e.clientY - rect.top) * dpr;
      last = { x: sx, y: sy };
      const hit = pickNode(sx, sy);
      if (hit) {
        draggingNode = hit; draggingNode.fixed = true; setSelectedId(hit.id);
      } else {
        draggingNode = null;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const sx = (e.clientX - rect.left) * dpr;
      const sy = (e.clientY - rect.top) * dpr;

      // hover detect
      const hit = pickNode(sx, sy);
      setHoverId(hit ? hit.id : null);

      if (e.buttons === 1) {
        if (draggingNode) {
          const { x, y } = screenToWorld(sx, sy);
          draggingNode.x = x; draggingNode.y = y;
          draggingNode.vx = 0; draggingNode.vy = 0;
        } else {
          // pan background
          setPan(p => ({ x: p.x + (sx - last.x) / dpr, y: p.y + (sy - last.y) / dpr }));
          last = { x: sx, y: sy };
        }
      }
    };

    const onMouseUp = () => { if (draggingNode) draggingNode.fixed = false; draggingNode = null; };
    const onLeave = () => { setHoverId(null); if (draggingNode) draggingNode.fixed = false; draggingNode = null; };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY; // zoom in on positive
      const factor = Math.exp(delta * 0.001);
      // zoom to mouse position (world-centric zoom)
      const rect = canvas.getBoundingClientRect();
      const sx = (e.clientX - rect.left) * dpr;
      const sy = (e.clientY - rect.top) * dpr;
      const cx = canvas.width / 2 + pan.x * dpr;
      const cy = canvas.height / 2 + pan.y * dpr;
      const wx = (sx - cx) / (zoom * dpr);
      const wy = (sy - cy) / (zoom * dpr);

      const newZoom = Math.min(4, Math.max(0.2, zoom * factor));
      // Adjust pan so point under cursor stays put
      const nx = sx - (wx * newZoom * dpr) - canvas.width / 2;
      const ny = sy - (wy * newZoom * dpr) - canvas.height / 2;
      setPan({ x: nx / dpr, y: ny / dpr });
      setZoom(newZoom);
    };

    canvas.addEventListener("mousedown", onMouseDown as any);
    window.addEventListener("mousemove", onMouseMove as any);
    window.addEventListener("mouseup", onMouseUp as any);
    canvas.addEventListener("mouseleave", onLeave as any);
    canvas.addEventListener("wheel", onWheel as any, { passive: false });
    return () => {
      canvas.removeEventListener("mousedown", onMouseDown as any);
      window.removeEventListener("mousemove", onMouseMove as any);
      window.removeEventListener("mouseup", onMouseUp as any);
      canvas.removeEventListener("mouseleave", onLeave as any);
      canvas.removeEventListener("wheel", onWheel as any);
    };
  }, [nodes, dpr, zoom, pan.x, pan.y, nodeRadius]);

  const fitView = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const { minX, minY, maxX, maxY } = computeBounds(nodes);
    const gw = maxX - minX || 1; const gh = maxY - minY || 1;
    const pad = 60;
    const parentW = canvas.parentElement?.getBoundingClientRect().width || canvas.width / dpr;
    const parentH = canvas.height / dpr;
    const zx = (parentW - pad) / gw; const zy = (parentH - pad) / gh;
    const nz = Math.min(3, Math.max(0.2, Math.min(zx, zy)));
    setZoom(nz);
    const cx = (minX + maxX) / 2; const cy = (minY + maxY) / 2;
    setPan({ x: -cx, y: -cy });
  }, [nodes, dpr]);

  // Initial fit
  useEffect(() => { fitView(); }, [fitView]);

  return (
    <div className="w-full border border-slate-200 rounded-2xl shadow-sm bg-slate-50/10">
      <div className="flex items-center justify-between p-2 gap-2 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
        <div className="flex items-center gap-2 text-slate-700 text-sm">
          <strong>Knowledge Graph</strong>
          <span className="opacity-60">(drag nodes • pan background • wheel to zoom)</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fitView()} className="px-3 py-1.5 rounded-lg bg-white/30 text-slate-500 border border-slate-200 hover:bg-slate-100 text-sm">Fit</button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="px-3 py-1.5 rounded-lg bg-white text-slate-500 border border-slate-200 hover:bg-slate-100 text-sm">Reset</button>
        </div>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} className="block w-full" style={{ height }} />
        {/* Details drawer */}
        {selectedId && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur border border-slate-200 rounded-xl shadow p-3 max-w-xs text-sm">
            <div className="font-bold mb-1 text-slate-700">{selectedId}</div>
            <div className="text-slate-600">
              Type: <span style={{ color: colorForType(nodeMap.get(selectedId!)?.type) }}>{nodeMap.get(selectedId!)?.type || "—"}</span>
            </div>
            {/* Show incident edges */}
            <div className="mt-2">
              <div className="font-medium text-slate-700 mb-1">Connections</div>
              <ul className="list-disc list-inside space-y-1 max-h-40 overflow-auto">
                {edges.filter(e => e.source === selectedId || e.target === selectedId).map((e, i) => (
                  <li key={i} className="text-slate-600">
                    {e.source === selectedId ? (
                      <>→ <b>{e.target}</b> <span className="opacity-60">{e.relation ? `(${e.relation})` : ""}</span></>
                    ) : (
                      <>← <b>{e.source}</b> <span className="opacity-60">{e.relation ? `(${e.relation})` : ""}</span></>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 p-3 text-xs text-slate-600">
        {Array.from(new Set(data.nodes.map(n => n.type).filter(Boolean) as string[])).map((t) => (
          <div key={t} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full text-amber-50" style={{ background: colorForType(t) }} />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}


