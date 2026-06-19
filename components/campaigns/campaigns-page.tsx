"use client";

import { useMemo } from "react";

import { useAppState } from "@/components/providers/app-state-provider";
import { campaigns } from "@/lib/constants";
import { getCreatorsByIds } from "@/lib/data";
import { formatCurrency, getBudgetLabel } from "@/lib/utils";

export function CampaignsPage() {
  const { lastMatchRun } = useAppState();

  const recentCampaigns = useMemo(() => {
    const seeded = campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      objective: campaign.objective,
      audience: campaign.targetAudience,
      budget: getBudgetLabel(campaign.budgetRangeId),
      creators: getCreatorsByIds(campaign.matchedCreatorIds ?? []),
      status: campaign.status,
    }));

    if (!lastMatchRun) {
      return seeded;
    }

    return [
      {
        id: lastMatchRun.id,
        name: lastMatchRun.campaignName,
        objective: lastMatchRun.brief.objective,
        audience: lastMatchRun.brief.targetAudience,
        budget: getBudgetLabel(lastMatchRun.brief.budgetRangeId),
        creators: lastMatchRun.matches.slice(0, 3).map((match) => match.creator),
        status: "Live",
      },
      ...seeded,
    ];
  }, [lastMatchRun]);

  return (
    <div className="space-y-6">
      <section className="card-panel p-6 sm:p-8">
        <p className="eyebrow">Campaigns</p>
        <h1 className="mt-4 section-title">Recent and live campaign runs.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
          Static campaign cards cover breadth, and the latest matchmaker brief appears here with its ranked creators so the experience feels stitched together.
        </p>
      </section>

      <section className="grid gap-4">
        {recentCampaigns.map((campaign) => (
          <article key={campaign.id} className="card-panel p-5">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
                    {campaign.name}
                  </h2>
                  <span className="rounded-full bg-[var(--panel-soft)] px-3 py-1 text-sm font-medium text-[var(--muted)]">
                    {campaign.status}
                  </span>
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                  {campaign.objective}
                </p>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  Audience: {campaign.audience}
                </p>
              </div>

              <div className="rounded-[24px] bg-[var(--panel-soft)] px-5 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                  Budget band
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--ink)]">
                  {campaign.budget}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {campaign.creators.map((creator) => (
                <div
                  key={creator.id}
                  className="rounded-[24px] border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-4"
                >
                  <p className="text-base font-semibold text-[var(--ink)]">{creator.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{creator.handle}</p>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    Est. cost {formatCurrency(creator.estCost)}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
