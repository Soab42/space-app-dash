"use client";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type Basic = {
  byYear: { year: number | string; count: number }[];
  topOrganisms: { organism: string; count: number }[];
  topTags: { tag: string; count: number }[];
};

// ---- triangle bar helpers (from your sample) ----
const getPath = (x: number, y: number, width: number, height: number) => {
  return `M${x},${y + height}
C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${
    x + width / 2
  },${y}
C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
    x + width
  },${y + height}
Z`;
};

const TriangleBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const p = payload[0];
    return (
      <div className="glass-card p-2 border border-gray-700">
        <p className="label">{`${
          p.name ?? p.payload?.organism ?? p.payload?.year
        }: ${p.value}`}</p>
      </div>
    );
  }
  return null;
};

type Coordinate = { x: number; y: number };

type PieSectorData = {
  percent?: number;
  name?: string | number;
  midAngle?: number;
  middleRadius?: number;
  tooltipPosition?: Coordinate;
  value?: number;
  paddingAngle?: number;
  dataKey?: string;
  payload?: any;
};

type PieSectorDataItem = React.SVGProps<SVGPathElement> &
  Partial<import("recharts").SectorProps> &
  PieSectorData;

const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 0));
  const cos = Math.cos(-RADIAN * (midAngle ?? 0));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >
        {`Count ${value}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${((percent ?? 0) * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

// optional palette for per-slice colors
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
];

export function AnalyticsCharts() {
  const [data, setData] = useState<Basic | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const onEnter = (_: any, index: number) => setActiveIndex(index);

  useEffect(() => {
    fetch(`${API_BASE}/analytics/basic`)
      .then((r) => r.json())
      .then(setData)
      .catch((e) => console.error(e));
  }, []);

  if (!data) return <div className="p-6">Loading…</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* FIRST CHART: Top Organisms with Triangle Bars */}
      <section className=" p-4 rounded-lg xl:col-span-2">
        <h2 className="font-semibold mb-4 text-slate-900">Top Organisms</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.topOrganisms}
              margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4A4A4A" />
              <XAxis dataKey="organism" stroke="#000" />
              <YAxis allowDecimals={false} stroke="#000" />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(130, 202, 157, 0.12)" }}
              />
              <Bar
                dataKey="count"
                name="count"
                shape={<TriangleBar />}
                label={{ position: "top", fill: "#ccc" }}
              >
                {data.topOrganisms.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* MIDDLE CHART: Top Tags (unchanged) */}
      {/* TOP TAGS — Active Slice Pie */}
      <section className="p-4 rounded-lg col-span-1">
        <h2 className="font-semibold mb-4 text-slate-900">Top Tags</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {(() => {
              // map your API data to Pie format
              const pieData = (data.topTags ?? []).map((t) => ({
                name: t.tag,
                value: t.count,
              }));

              return (
                <PieChart>
                  <Pie
                    data={pieData}
                    activeShape={renderActiveShape}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    dataKey="value"
                    onMouseEnter={onEnter}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              );
            })()}
          </ResponsiveContainer>
        </div>
      </section>

      {/* LAST CHART: Publications by Year with Triangle Bars */}
      <section className="p-4 rounded-lg xl:col-span-3">
        <h2 className="font-semibold mb-4 text-slate-900">Publications by Year</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.byYear}
              margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4A4A4A" />
              <XAxis dataKey="year" stroke="#000" />
              <YAxis allowDecimals={false} stroke="#000" />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(136, 132, 216, 0.12)" }}
              />
              <Bar dataKey="count" fill="#8884d8" background={{ fill: '#eee' }} />
              {/* <Bar
                dataKey="count"
                name="count"
                shape={<TriangleBar />}
                label={{ position: "top", fill: "#ccc" }}
              >
                {data.byYear.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar> */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
