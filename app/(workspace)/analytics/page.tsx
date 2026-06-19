"use client";

import dynamic from "next/dynamic";

const AnalyticsCharts = dynamic(
  () =>
    import("@/components/analytics/analytics-charts").then(
      (module) => module.AnalyticsCharts
    ),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6">
        <section className="card-panel p-6 sm:p-8">
          <p className="eyebrow">Analytics</p>
          <h1 className="mt-4 section-title">A breadth page with useful-looking signal.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
            Loading charts...
          </p>
        </section>
        <div className="card-panel p-5">
          <div className="skeleton h-72 rounded-[28px]" />
        </div>
      </div>
    ),
  }
);

export default function AnalyticsPage() {
  return <AnalyticsCharts />;
}
