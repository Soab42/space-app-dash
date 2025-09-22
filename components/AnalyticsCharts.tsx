"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type Basic = {
  byYear: { year: number | string; count: number }[];
  topOrganisms: { organism: string; count: number }[];
  topTags: { tag: string; count: number }[];
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const CustomTooltip = ({ active, payload, label }: any) => {
  console.log(payload);
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-2 border border-gray-700">
        <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export function AnalyticsCharts() {
  const [data, setData] = useState<Basic | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/analytics/basic`).then(r=>r.json()).then(setData);
  }, []);

  if (!data) return <div className="p-6">Loading…</div>;

  return (
    <>
 
 <section className="glass-card p-4 rounded-lg xl:col-span-2">
        <h2 className="font-semibold mb-4">Top Organisms</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topOrganisms}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A4A4A" />
              <XAxis dataKey="organism" stroke="#fff" />
              <YAxis allowDecimals={false} stroke="#fff" />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(130, 202, 157, 0.2)'}} />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass-card p-4 rounded-lg">
        <h2 className="font-semibold mb-4">Top Tags</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.topTags}
                dataKey="count"
                nameKey="tag"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {data.topTags.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass-card p-4 rounded-lg xl:col-span-3">
        <h2 className="font-semibold mb-4">Publications by Year</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.byYear}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A4A4A" />
              <XAxis dataKey="year" stroke="#fff" />
              <YAxis allowDecimals={false} stroke="#fff" />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(136, 132, 216, 0.2)'}}/>
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

    </>
  );
}
