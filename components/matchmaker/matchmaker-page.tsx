"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import {
  ArrowRight,
  Lightning,
  ShieldWarning,
  Sparkle,
  Sliders,
  Warning,
  ChatCircleDots,
  Info,
  Check
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";

import { useAppState } from "@/components/providers/app-state-provider";
import { budgetOptions, defaultCampaignBrief } from "@/lib/constants";
import { MatchResult, MessageThread } from "@/lib/types";
import {
  formatCurrency,
  formatFollowers,
  formatPercent,
  titleFromBrief,
  getCreatorAvatar,
} from "@/lib/utils";

type MatchApiResponse = {
  matches: MatchResult[];
  mode: "groq" | "fallback";
  model: string;
  scannedCreators: number;
};

type OutreachApiResponse = {
  message: string;
  mode: "groq" | "fallback";
};

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 mt-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="card-panel overflow-hidden p-5 space-y-4">
          <div className="flex gap-4">
            <div className="skeleton h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-grow">
              <div className="skeleton h-5 w-40 rounded" />
              <div className="skeleton h-3 w-60 rounded" />
            </div>
          </div>
          <div className="skeleton h-16 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function MatchmakerPage() {
  const { lastMatchRun, setLastMatchRun, addOutreachThread, showToast, threads } = useAppState();
  const [form, setForm] = useState(lastMatchRun?.brief || defaultCampaignBrief);
  const [matches, setMatches] = useState<MatchResult[]>(lastMatchRun?.matches || []);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [draftingId, setDraftingId] = useState<string | null>(null);
  const [mode, setMode] = useState<"groq" | "fallback" | null>(lastMatchRun ? "fallback" : null);
  const [model, setModel] = useState("");
  const [scannedCreators, setScannedCreators] = useState(lastMatchRun?.matches.length ? 15 : 0);

  const topMatch = matches[0];

  const summary = useMemo(() => {
    if (!matches.length) {
      return null;
    }
    const flaggedCount = matches.filter((match) => match.redFlag).length;
    return {
      scanned: scannedCreators || 15,
      topScore: matches[0].brandFitScore,
      flaggedCount,
    };
  }, [matches, scannedCreators]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const startedAt = Date.now();

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Unable to score creators right now.");
      }

      const payload = (await response.json()) as MatchApiResponse;
      const elapsed = Date.now() - startedAt;

      if (elapsed < 1500) {
        await new Promise((resolve) => window.setTimeout(resolve, 1500 - elapsed));
      }

      setMatches(payload.matches);
      setMode(payload.mode);
      setModel(payload.model);
      setScannedCreators(payload.scannedCreators);

      setLastMatchRun({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        campaignName: titleFromBrief(form.category, form.objective),
        brief: form,
        matches: payload.matches,
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while scoring creators."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDraftOutreach(match: MatchResult) {
    setDraftingId(match.creatorId);

    try {
      const response = await fetch("/api/outreach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brief: form,
          creator: match.creator,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to draft outreach right now.");
      }

      const payload = (await response.json()) as OutreachApiResponse;
      const thread: MessageThread = {
        id: `outreach-${match.creatorId}-${Date.now()}`,
        creatorId: match.creatorId,
        creatorName: match.creator.name,
        handle: match.creator.handle,
        platform: "Instagram DM",
        preview: payload.message,
        lastMessage: payload.message,
        timestamp: "Just now",
        unread: true,
        isGenerated: true,
      };

      addOutreachThread(thread);
      showToast(`Outreach drafted for ${match.creator.name} and pushed to Messages.`);
    } catch (draftError) {
      showToast(
        draftError instanceof Error
          ? draftError.message
          : "Unable to draft outreach."
      );
    } finally {
      setDraftingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title Header */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ink)] text-[var(--background)]">
            <Sparkle size={20} weight="fill" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--ink)]">AI Matchmaker Cockpit</h1>
            <p className="text-xs text-[var(--muted)]">Score all seed creators, analyze audience flags, and draft invites.</p>
          </div>
        </div>
        {mode && (
          <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
            {mode === "groq" ? `LLM Scoring: ${model}` : "Standard scoring engine active"}
          </div>
        )}
      </div>

      {/* Main Grid Content */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left Side: Campaign Brief Form & Matches List */}
        <div className="space-y-6">
          {/* Brief Input Form */}
          <div className="card-panel bg-[var(--panel)] p-6">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3 mb-5">
              <Sliders size={18} className="text-[var(--accent)]" />
              <h2 className="text-sm font-bold text-[var(--ink)] uppercase tracking-wider">Configure Campaign Brief</h2>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold uppercase text-[var(--muted)]">Industry / Niche Category</label>
                <input
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, category: event.target.value }))
                  }
                  className="w-full mt-1.5 rounded-lg border border-[var(--border)] bg-[var(--canvas)] px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[var(--accent)] focus:bg-white"
                  placeholder="Skincare"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[var(--muted)]">Budget Target</label>
                <select
                  value={form.budgetRangeId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      budgetRangeId: event.target.value as typeof current.budgetRangeId,
                    }))
                  }
                  className="w-full mt-1.5 rounded-lg border border-[var(--border)] bg-[var(--canvas)] px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-[var(--accent)] focus:bg-white"
                >
                  {Object.entries(budgetOptions).map(([key, option]) => (
                    <option key={key} value={key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-[var(--muted)]">Target Audience Demographics</label>
                <textarea
                  value={form.targetAudience}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      targetAudience: event.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full mt-1.5 rounded-lg border border-[var(--border)] bg-[var(--canvas)] px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[var(--accent)] focus:bg-white"
                  placeholder="Women 18-30 in metro cities who follow skincare routines..."
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-[var(--muted)]">Campaign Core Objective</label>
                <textarea
                  value={form.objective}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, objective: event.target.value }))
                  }
                  rows={2}
                  className="w-full mt-1.5 rounded-lg border border-[var(--border)] bg-[var(--canvas)] px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[var(--accent)] focus:bg-white"
                  placeholder="Drive trial signups for our new sunscreen product line..."
                  required
                />
              </div>

              <div className="md:col-span-2 flex justify-start pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-6 text-xs font-bold text-white transition hover:bg-black/80 disabled:opacity-50"
                >
                  {loading ? "Scoring seed list..." : "Generate Match Rankings"}
                  <Sparkle size={14} weight="fill" className="text-[var(--accent)]" />
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-900">
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSkeleton />
          ) : matches.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">Scored Match Results</h3>

              {matches.map((match, index) => (
                <article
                  key={match.creatorId}
                  className="card-panel bg-[var(--panel)] p-5 transition hover:border-[var(--accent)]/30"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <img
                        src={getCreatorAvatar(match.creatorId)}
                        className="h-11 w-11 shrink-0 rounded-full object-cover border border-[var(--border)] shadow-sm"
                        alt={match.creator.name}
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/creator/${match.creatorId}`}
                            className="font-bold text-[var(--ink)] hover:text-[var(--accent)] flex items-center gap-1 text-sm sm:text-base"
                          >
                            {match.creator.name}
                            <Check size={12} weight="bold" className="text-blue-500 bg-blue-50 rounded-full p-0.5" />
                          </Link>
                          <span className="rounded-full bg-[var(--panel-soft)] px-2 py-0.5 text-[9px] font-bold text-[var(--muted)] uppercase">
                            Rank #{index + 1}
                          </span>
                        </div>
                        <p className="text-[10px] text-[var(--muted)] mt-0.5">{match.creator.handle}</p>
                        <p className="text-xs text-[var(--ink)] font-medium mt-2 leading-relaxed">
                          {match.creator.bio}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-start">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
                        {match.brandFitScore}% Fit
                      </span>
                      {threads.some((t) => t.creatorId === match.creatorId) ? (
                        <span className="inline-flex h-8 items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-3 text-xs font-semibold text-emerald-700">
                          <Check size={12} weight="bold" />
                          Invited
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDraftOutreach(match)}
                          disabled={draftingId === match.creatorId}
                          className="inline-flex h-8 items-center gap-1 rounded-lg bg-[var(--ink)] px-3 text-xs font-semibold text-white transition hover:bg-black/80 disabled:opacity-50 shadow-sm"
                        >
                          <Lightning size={12} weight="fill" />
                          {draftingId === match.creatorId ? "Drafting..." : "Outreach"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Creator Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[var(--panel-soft)] p-3.5 sm:grid-cols-4">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-[var(--muted)]">Followers</p>
                      <p className="text-xs font-bold text-[var(--ink)] mt-0.5">
                        {formatFollowers(match.creator.followerCount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-[var(--muted)]">Engagement</p>
                      <p className="text-xs font-bold text-[var(--ink)] mt-0.5">
                        {formatPercent(match.creator.engagementRate)}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-[9px] uppercase font-bold text-[var(--muted)]">Audience Quality</p>
                        {match.redFlag && (
                          <span className="rounded bg-red-100 px-1 text-[8px] font-black uppercase text-red-700 animate-pulse">
                            Flagged
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-[var(--ink)] mt-0.5">
                        {match.breakdown.audienceQuality}/100
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-[var(--muted)]">Vibely Score</p>
                      <p className="text-xs font-bold text-[var(--ink)] mt-0.5">
                        {match.cScore}/100
                      </p>
                    </div>
                  </div>

                  {/* Red Flag Reveal Box - Pinned near Audience Quality / Stats */}
                  {match.redFlag && (
                    <div className="mt-2.5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-950">
                      <ShieldWarning size={18} className="mt-0.5 shrink-0 text-red-700" />
                      <div>
                        <p className="font-bold">Audience Integrity Flag</p>
                        <p className="mt-0.5 leading-relaxed">
                          Follower signal is inflated relative to actual content interaction rate. Outbound messaging is not advised without manual profiling.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Brand Fit Score Breakdown */}
                  <div className="mt-4 border-t border-[var(--border)] pt-3">
                    <p className="text-[10px] uppercase font-bold text-[var(--muted)] mb-2">Match Logic Explanation</p>
                    <p className="text-xs leading-relaxed text-[var(--muted)]">{match.explanation}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>

        {/* Right Side: Brief Overview, Scoring Notes, Outreach Details */}
        <div className="space-y-6">
          {/* Summary / Stats Overview */}
          {summary && (
            <div className="card-panel bg-[var(--panel)] p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] border-b border-[var(--border)] pb-2">Analysis Results</h3>
              <div className="space-y-2 text-xs font-semibold text-[var(--ink)]">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Scanned Pool</span>
                  <span>{summary.scanned} Creators</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Top Match Score</span>
                  <span>{summary.topScore}% Fit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Audience Flags</span>
                  <span className="text-red-600 font-bold">{summary.flaggedCount} Found</span>
                </div>
              </div>
            </div>
          )}

          {/* Current Campaign Brief Display */}
          <div className="card-panel bg-[var(--panel)] p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] border-b border-[var(--border)] pb-2 mb-3">Active Brief Details</h3>
            <div className="space-y-3 text-xs font-medium text-[var(--ink)]">
              <div>
                <p className="text-[9px] uppercase font-bold text-[var(--muted)]">Objective</p>
                <p className="mt-0.5 leading-snug">{form.objective || "No objective brief set."}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-[var(--muted)]">Target Audience</p>
                <p className="mt-0.5 leading-snug">{form.targetAudience || "No demographics defined."}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-[var(--muted)]">Budget Tier</p>
                <p className="mt-0.5 font-bold text-[var(--accent)]">{budgetOptions[form.budgetRangeId]?.label || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Scoring Weight Notes */}
          <div className="card-panel bg-[var(--panel)] p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] border-b border-[var(--border)] pb-2 mb-3 flex items-center gap-1.5">
              <Info size={14} />
              Scoring Weights
            </h3>
            <p className="text-[11px] leading-relaxed text-[var(--muted)] mb-3">
              Vibely brand fit scores are calculated using a weighted multi-signal logic model:
            </p>
            <div className="space-y-2 text-[11px] font-semibold text-[var(--ink)]">
              <div className="flex justify-between">
                <span>Niche Relevance</span>
                <span>30% Weight</span>
              </div>
              <div className="flex justify-between">
                <span>Audience Quality</span>
                <span>25% Weight</span>
              </div>
              <div className="flex justify-between">
                <span>Content Style Match</span>
                <span>25% Weight</span>
              </div>
              <div className="flex justify-between">
                <span>Budget & Cost Fit</span>
                <span>20% Weight</span>
              </div>
            </div>
          </div>

          {/* Outreach Actions & Link to Messages */}
          <div className="card-panel bg-[linear-gradient(180deg,rgba(124,58,237,0.06),rgba(255,255,255,1))] p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] border-b border-[var(--border)] pb-2 mb-3 flex items-center gap-1.5">
              <ChatCircleDots size={14} />
              Inbox Actions
            </h3>
            <p className="text-[11px] leading-relaxed text-[var(--muted)] mb-3">
              Outreach drafts are compiled instantly using LLM text models and queued directly in your campaign mailbox.
            </p>
            <Link
              href="/messages"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] py-2.5 text-xs font-bold text-[var(--accent-contrast)] shadow-sm hover:bg-[var(--accent-strong)] transition"
            >
              Open Messaging Inbox
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
