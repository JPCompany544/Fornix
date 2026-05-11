"use client";

import React from 'react';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

/**
 * Pure Chart UI Component
 * Renders a high-fidelity line chart for stock price history.
 * No API calls or business logic allowed here.
 */
export default function StockChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  // Determine if the price trend is positive for coloring
  const isPositive = data.length > 1 && data[data.length - 1].price >= data[0].price;
  const strokeColor = isPositive ? "#10b981" : "#f43f5e";
  const fillColor = isPositive ? "#10b981" : "#f43f5e";

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fillColor} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={fillColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="time" hide />
          <YAxis domain={["auto", "auto"]} hide />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const val = payload[0].payload.price;
                return (
                  <div className="bg-slate-950 text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl">
                    <p className="text-xl font-black tracking-tight">${Number(val).toFixed(2)}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                      {new Date(payload[0].payload.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#chartGradient)"
            dot={false}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
