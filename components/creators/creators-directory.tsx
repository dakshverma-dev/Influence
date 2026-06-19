"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Heart } from "@phosphor-icons/react";

import { useAppState } from "@/components/providers/app-state-provider";
import { creators } from "@/lib/data";
import { formatFollowers, formatPercent } from "@/lib/utils";

export function CreatorsDirectory() {
  const { favoriteIds, toggleFavorite } = useAppState();
  const [niche, setNiche] = useState("All");
  const [followerBand, setFollowerBand] = useState("All");
  const [engagementFloor, setEngagementFloor] = useState("0");

  const niches = useMemo(
    () => ["All", ...new Set(creators.map((creator) => creator.niche))],
    []
  );

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      const matchesNiche = niche === "All" || creator.niche === niche;
      const matchesFollowers =
        followerBand === "All" ||
        (followerBand === "<100k" && creator.followerCount < 100000) ||
        (followerBand === "100k-300k" &&
          creator.followerCount >= 100000 &&
          creator.followerCount <= 300000) ||
        (followerBand === "300k+" && creator.followerCount > 300000);
      const matchesEngagement =
        creator.engagementRate >= Number(engagementFloor);

      return matchesNiche && matchesFollowers && matchesEngagement;
    });
  }, [engagementFloor, followerBand, niche]);

  return (
    <div className="space-y-6">
      <section className="card-panel p-6 sm:p-8">
        <p className="eyebrow">Creators</p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="section-title">Browse the creator roster.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
              All seed creators are filterable client-side, so the directory feels fully functional even outside the matchmaker flow.
            </p>
          </div>
          <div className="rounded-[28px] bg-[var(--panel-soft)] px-5 py-4 text-sm text-[var(--muted)]">
            Showing <span className="font-semibold text-[var(--ink)]">{filteredCreators.length}</span> of {creators.length} creators
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--ink)]">
            Niche
            <select
              value={niche}
              onChange={(event) => setNiche(event.target.value)}
              className="rounded-2xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 outline-none focus:border-[var(--accent)]"
            >
              {niches.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--ink)]">
            Follower range
            <select
              value={followerBand}
              onChange={(event) => setFollowerBand(event.target.value)}
              className="rounded-2xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 outline-none focus:border-[var(--accent)]"
            >
              <option value="All">All</option>
              <option value="<100k">Below 100K</option>
              <option value="100k-300k">100K to 300K</option>
              <option value="300k+">300K+</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--ink)]">
            Min engagement
            <select
              value={engagementFloor}
              onChange={(event) => setEngagementFloor(event.target.value)}
              className="rounded-2xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 outline-none focus:border-[var(--accent)]"
            >
              <option value="0">0%+</option>
              <option value="3">3%+</option>
              <option value="5">5%+</option>
              <option value="7">7%+</option>
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredCreators.map((creator) => {
          const isFavorite = favoriteIds.includes(creator.id);

          return (
            <article key={creator.id} className="card-panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-medium text-[var(--accent)]">
                    {creator.niche}
                  </span>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                    {creator.name}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{creator.handle}</p>
                </div>
                <button
                  type="button"
                  aria-label="Toggle favorite"
                  onClick={() => toggleFavorite(creator.id)}
                  className={`rounded-full p-2 ${
                    isFavorite
                      ? "bg-[rgba(228,82,111,0.12)] text-[#d43a63]"
                      : "bg-[var(--panel-soft)] text-[var(--muted)]"
                  }`}
                >
                  <Heart size={18} weight={isFavorite ? "fill" : "regular"} />
                </button>
              </div>

              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{creator.bio}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] bg-[var(--panel-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                    Followers
                  </p>
                  <p className="mt-2 text-xl font-semibold text-[var(--ink)]">
                    {formatFollowers(creator.followerCount)}
                  </p>
                </div>
                <div className="rounded-[22px] bg-[var(--panel-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                    Engagement
                  </p>
                  <p className="mt-2 text-xl font-semibold text-[var(--ink)]">
                    {formatPercent(creator.engagementRate)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <p className="text-sm font-medium text-[var(--muted)]">
                  C-Score <span className="text-[var(--ink)]">{creator.cScore}/1000</span>
                </p>
                <Link
                  href={`/creator/${creator.id}`}
                  className="text-sm font-semibold text-[var(--accent)]"
                >
                  View creator
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
