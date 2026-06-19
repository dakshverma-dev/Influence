"use client";

import { Heart } from "@phosphor-icons/react";

import { useAppState } from "@/components/providers/app-state-provider";
import { Creator } from "@/lib/types";
import { getBaselineBreakdown } from "@/lib/scoring";
import { formatFollowers, formatPercent } from "@/lib/utils";

export function CreatorProfile({ creator }: { creator: Creator }) {
  const { favoriteIds, lastMatchRun, toggleFavorite } = useAppState();
  const latestMatch = lastMatchRun?.matches.find(
    (match) => match.creatorId === creator.id
  );
  const breakdown = latestMatch?.breakdown ?? getBaselineBreakdown(creator);
  const isFavorite = favoriteIds.includes(creator.id);

  const scoreRows = [
    { label: "Niche relevance", value: breakdown.nicheRelevance },
    { label: "Audience quality", value: breakdown.audienceQuality },
    { label: "Content style match", value: breakdown.contentStyleMatch },
    { label: "Budget fit", value: breakdown.budgetFit },
  ];

  return (
    <div className="space-y-6">
      <section className="card-panel p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="eyebrow">{creator.niche}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--ink)]">
              {creator.name}
            </h1>
            <p className="mt-2 text-base text-[var(--muted)]">{creator.handle}</p>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)]">
              {creator.bio}
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleFavorite(creator.id)}
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold ${
              isFavorite
                ? "bg-[rgba(228,82,111,0.14)] text-[#d43a63]"
                : "bg-[var(--panel-soft)] text-[var(--ink)]"
            }`}
          >
            <Heart size={18} weight={isFavorite ? "fill" : "regular"} />
            {isFavorite ? "Saved to favorites" : "Save to favorites"}
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-[26px] bg-[var(--panel-soft)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              Followers
            </p>
            <p className="mt-3 text-2xl font-semibold text-[var(--ink)]">
              {formatFollowers(creator.followerCount)}
            </p>
          </div>
          <div className="rounded-[26px] bg-[var(--panel-soft)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              Engagement
            </p>
            <p className="mt-3 text-2xl font-semibold text-[var(--ink)]">
              {formatPercent(creator.engagementRate)}
            </p>
          </div>
          <div className="rounded-[26px] bg-[var(--panel-soft)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              Platforms
            </p>
            <p className="mt-3 text-lg font-semibold text-[var(--ink)]">
              {creator.platforms.join(", ")}
            </p>
          </div>
          <div className="rounded-[26px] bg-[var(--panel-soft)] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              C-Score
            </p>
            <p className="mt-3 text-2xl font-semibold text-[var(--ink)]">
              {creator.cScore}/1000
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="card-panel p-6">
          <p className="eyebrow">Score breakdown</p>
          <div className="mt-6 space-y-4">
            {scoreRows.map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-sm font-medium text-[var(--muted)]">
                  <span>{row.label}</span>
                  <span>{row.value}/100</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-[rgba(124,58,237,0.08)]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#7c3aed,#f68c6d)]"
                    style={{ width: `${row.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-panel p-6">
          <p className="eyebrow">Past campaigns</p>
          <div className="mt-6 space-y-3">
            {creator.pastCampaigns.map((campaign) => (
              <div
                key={campaign}
                className="rounded-[24px] border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-4"
              >
                <p className="text-base font-semibold text-[var(--ink)]">{campaign}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Strong fit for {creator.niche.toLowerCase()} storytelling and audience trust.
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] bg-[linear-gradient(180deg,rgba(124,58,237,0.12),rgba(255,255,255,0.95))] p-5">
            <p className="text-sm font-semibold text-[var(--ink)]">Content style</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {creator.contentStyle}
            </p>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Audience hotspots: {creator.audienceCities.join(", ")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
