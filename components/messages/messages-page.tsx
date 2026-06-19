"use client";

import { ChatCircleDots, Sparkle } from "@phosphor-icons/react";

import { useAppState } from "@/components/providers/app-state-provider";

export function MessagesPage() {
  const { threads } = useAppState();

  return (
    <div className="space-y-6">
      <section className="card-panel p-6 sm:p-8">
        <p className="eyebrow">Messages</p>
        <h1 className="mt-4 section-title">Outreach threads stay connected to the match flow.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
          Seeded conversations live here already, and any outreach drafted from the matchmaker drops in instantly as a new thread.
        </p>
      </section>

      <section className="grid gap-4">
        {threads.map((thread) => (
          <article key={thread.id} className="card-panel p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold tracking-tight text-[var(--ink)]">
                    {thread.creatorName}
                  </h2>
                  <span className="rounded-full bg-[var(--panel-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    {thread.platform}
                  </span>
                  {thread.isGenerated ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-medium text-[var(--accent)]">
                      <Sparkle size={14} weight="fill" />
                      AI drafted
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">{thread.handle}</p>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                  {thread.lastMessage}
                </p>
              </div>

              <div className="rounded-[24px] bg-[var(--panel-soft)] px-4 py-4 text-sm text-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <ChatCircleDots size={18} />
                  <span>{thread.timestamp}</span>
                </div>
                <p className="mt-3 font-medium text-[var(--ink)]">
                  {thread.unread ? "Unread" : "Read"}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
