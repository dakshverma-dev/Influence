"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { campaignTrend, nicheBreakdown, scoreDistribution } from "@/lib/constants";

export function AnalyticsCharts() {
  return (
    <div className="space-y-6">
      <section className="card-panel p-6 sm:p-8">
        <p className="eyebrow">Analytics</p>
        <h1 className="mt-4 section-title">A breadth page with useful-looking signal.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
          These charts are static by design, but they round out the brand-side product story and keep every sidebar route alive.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="card-panel p-5">
          <p className="text-lg font-semibold text-[var(--ink)]">Score distribution</p>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.12)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#7c3aed" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-panel p-5">
          <p className="text-lg font-semibold text-[var(--ink)]">Niche breakdown</p>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nicheBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.12)" />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={86} />
                <Tooltip />
                <Bar dataKey="value" fill="#f68c6d" radius={[0, 12, 12, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="card-panel p-5">
        <p className="text-lg font-semibold text-[var(--ink)]">Campaigns matched over time</p>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={campaignTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.12)" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="matched"
                stroke="#7c3aed"
                strokeWidth={3}
                dot={{ r: 4, fill: "#7c3aed" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
