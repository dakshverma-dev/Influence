"use client";

import Link from "next/link";

import { useAppState } from "@/components/providers/app-state-provider";
import { creators } from "@/lib/data";
import { formatFollowers } from "@/lib/utils";

export default function FavoritesPage() {
  const { favoriteIds } = useAppState();
  const favorites = creators.filter((creator) => favoriteIds.includes(creator.id));

  return (
    <div className="space-y-6">
      <section className="card-panel p-6 sm:p-8">
        <p className="eyebrow">Favorites</p>
        <h1 className="mt-4 section-title">Shortlist the creators you want to revisit.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
          This page is simple on purpose: heart a creator anywhere, and they appear here instantly.
        </p>
      </section>

      {favorites.length === 0 ? (
        <section className="card-panel p-8 text-center">
          <p className="text-lg font-semibold text-[var(--ink)]">No favorites yet.</p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Save creators from the directory, profile page, or matchmaker results to build a shortlist.
          </p>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {favorites.map((creator) => (
            <article key={creator.id} className="card-panel p-5">
              <p className="text-sm font-medium text-[var(--accent)]">{creator.niche}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                {creator.name}
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{creator.handle}</p>
              <p className="mt-4 text-sm text-[var(--muted)]">
                {formatFollowers(creator.followerCount)} followers / C-Score {creator.cScore}/1000
              </p>
              <Link
                href={`/creator/${creator.id}`}
                className="mt-5 inline-flex text-sm font-semibold text-[var(--accent)]"
              >
                Open profile
              </Link>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
