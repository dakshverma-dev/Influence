"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import {
  Sparkle,
  ArrowRight,
  Lightning,
  ShieldWarning,
  Funnel,
  Sliders,
  Check,
  Eye,
  Envelope,
  UserPlus
} from "@phosphor-icons/react";
import { useAppState } from "@/components/providers/app-state-provider";
import { defaultCampaignBrief, budgetOptions } from "@/lib/constants";
import { MatchResult, MessageThread } from "@/lib/types";
import { formatCurrency, formatFollowers, formatPercent, titleFromBrief, getCreatorAvatar } from "@/lib/utils";

export default function DashboardPage() {
  const { lastMatchRun, setLastMatchRun, addOutreachThread, showToast, threads } = useAppState();
  const [loading, setLoading] = useState(false);
  const [draftingId, setDraftingId] = useState<string | null>(null);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem("dismiss-welcome-banner");
    if (dismissed === "true") {
      setShowWelcomeBanner(false);
    }
  }, []);

  const handleDismissBanner = () => {
    setShowWelcomeBanner(false);
    localStorage.setItem("dismiss-welcome-banner", "true");
  };
  
  // Filters state
  const [audienceMatch, setAudienceMatch] = useState<number>(80);
  const [followerFilter, setFollowerFilter] = useState<string>("any");
  const [engagementFilter, setEngagementFilter] = useState<string>("any");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  
  // Active Brief Edit state
  const [isEditingBrief, setIsEditingBrief] = useState(false);
  const [briefForm, setBriefForm] = useState(
    lastMatchRun?.brief || defaultCampaignBrief
  );

  // Trigger matches API
  const fetchMatches = async (briefData = briefForm) => {
    setLoading(true);
    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(briefData),
      });
      if (response.ok) {
        const payload = await response.json();
        setLastMatchRun({
          id: lastMatchRun?.id || crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          campaignName: titleFromBrief(briefData.category, briefData.objective),
          brief: briefData,
          matches: payload.matches,
        });
      }
    } catch (err) {
      console.error("Failed to fetch dashboard matches", err);
    } finally {
      setLoading(false);
    }
  };

  // Run initial match run on mount if none exists
  useEffect(() => {
    if (!lastMatchRun) {
      fetchMatches(defaultCampaignBrief);
    }
  }, []);

  const handleUpdateBrief = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingBrief(false);
    fetchMatches(briefForm);
  };

  // Apply filters on the matches locally
  const filteredMatches = useMemo(() => {
    if (!lastMatchRun?.matches) return [];
    
    return lastMatchRun.matches.filter((match) => {
      // Audience match filter (represented by brandFitScore)
      if (match.brandFitScore < audienceMatch) return false;
      
      // Followers filter
      if (followerFilter !== "any") {
        const count = match.creator.followerCount;
        if (followerFilter === "macro" && count < 500000) return false;
        if (followerFilter === "mid" && (count < 100000 || count >= 500000)) return false;
        if (followerFilter === "micro" && count >= 100000) return false;
      }
      
      // Engagement Filter
      if (engagementFilter !== "any") {
        const rate = match.creator.engagementRate;
        if (engagementFilter === "high" && rate < 5) return false;
        if (engagementFilter === "avg" && (rate < 2 || rate >= 5)) return false;
        if (engagementFilter === "low" && rate >= 2) return false;
      }

      // Category filter
      if (categoryFilter !== "all" && match.creator.niche.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      // Platform filter
      if (platformFilter !== "all" && !match.creator.platforms.map(p => p.toLowerCase()).includes(platformFilter.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [lastMatchRun?.matches, audienceMatch, followerFilter, engagementFilter, categoryFilter, platformFilter]);

  const handleDraftOutreach = async (match: MatchResult) => {
    setDraftingId(match.creatorId);
    try {
      const response = await fetch("/api/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief: lastMatchRun?.brief || defaultCampaignBrief,
          creator: match.creator,
        }),
      });

      if (response.ok) {
        const payload = await response.json();
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
      }
    } catch (err) {
      showToast("Unable to draft outreach right now.");
    } finally {
      setDraftingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Active Campaign Header Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
            <Sparkle size={20} weight="fill" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Active Campaign</p>
            <h1 className="text-lg font-bold text-[var(--ink)]">
              {lastMatchRun?.campaignName || "GlowUp Skincare Festive Campaign"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 border border-emerald-200">
            AI Scanning Active
          </span>
          <span className="text-[var(--muted)]">|</span>
          <span className="text-[var(--ink)]">
            Budget: {lastMatchRun?.brief ? budgetOptions[lastMatchRun.brief.budgetRangeId].label : "Rs. 1L to Rs. 3L"}
          </span>
        </div>
      </div>

      {/* Welcome Banner */}
      {showWelcomeBanner && (
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] shadow-sm group transition-all duration-300">
          <img
            src="/viray_banner.png"
            alt="Welcome to Viray"
            className="w-full h-auto object-cover min-h-[140px] md:min-h-0"
          />
          <button
            onClick={handleDismissBanner}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-xl font-bold text-white transition hover:bg-black/60 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10 leading-none"
            aria-label="Dismiss banner"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Grid Content */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left Side: Matches Cockpit */}
        <div className="space-y-6">
          {/* AI Analysis status banner */}
          <div className="rounded-xl border border-[var(--border)] bg-indigo-50/50 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-indigo-900 font-medium">
              <Sparkle size={18} weight="fill" className="text-[var(--accent)] animate-pulse" />
              <span>AI Analysis Complete: Scanned 12,340+ creators and found the best matches for your objective.</span>
            </div>
            <Link
              href="/matchmaker"
              className="text-xs font-bold uppercase text-[var(--accent)] hover:underline shrink-0"
            >
              Run New Match &rarr;
            </Link>
          </div>

          {/* Creators List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
                Ranked Matches ({filteredMatches.length})
              </h2>
              <span className="text-xs text-[var(--muted)]">Sorted by Best Match</span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card-panel p-5 space-y-4">
                    <div className="flex gap-4">
                      <div className="skeleton h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="skeleton h-4 w-1/4 rounded" />
                        <div className="skeleton h-3 w-1/3 rounded" />
                      </div>
                    </div>
                    <div className="skeleton h-3 w-full rounded" />
                  </div>
                ))}
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--panel)] p-12 text-center">
                <Funnel size={32} className="mx-auto text-[var(--muted)] opacity-50" />
                <p className="mt-2 text-sm font-semibold text-[var(--ink)]">No creators match your active filters.</p>
                <p className="text-xs text-[var(--muted)]">Try resetting or loosening the parameters in the sidebar.</p>
              </div>
            ) : (
              filteredMatches.map((match, idx) => (
                <article
                  key={match.creatorId}
                  className="card-panel bg-[var(--panel)] p-5 transition hover:border-[var(--accent)]/30 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <img
                        src={getCreatorAvatar(match.creatorId)}
                        className="h-12 w-12 shrink-0 rounded-full object-cover border border-[var(--border)] shadow-sm"
                        alt={match.creator.name}
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/creator/${match.creatorId}`}
                            className="font-bold text-[var(--ink)] hover:text-[var(--accent)] flex items-center gap-1"
                          >
                            {match.creator.name}
                            <Check size={14} weight="bold" className="text-blue-500 bg-blue-50 rounded-full p-0.5" />
                          </Link>
                          <span className="rounded-full bg-[var(--panel-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)]">
                            {match.creator.niche}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--muted)] mt-0.5">{match.creator.handle}</p>
                        <p className="text-xs text-[var(--ink)] font-medium mt-2 max-w-md">
                          {match.creator.bio}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-start">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                        {match.brandFitScore}% Match
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
                          className="inline-flex h-8 items-center gap-1 rounded-lg bg-[var(--ink)] px-3 text-xs font-semibold text-white transition hover:bg-black/80 disabled:opacity-50"
                        >
                          <Lightning size={14} weight="fill" />
                          {draftingId === match.creatorId ? "Drafting..." : "Outreach"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Creator Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-[var(--panel-soft)] p-3 sm:grid-cols-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[var(--muted)]">Followers</p>
                      <p className="text-sm font-bold text-[var(--ink)] mt-0.5">
                        {formatFollowers(match.creator.followerCount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[var(--muted)]">Eng. Rate</p>
                      <p className="text-sm font-bold text-[var(--ink)] mt-0.5">
                        {formatPercent(match.creator.engagementRate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[var(--muted)]">Est. Reach</p>
                      <p className="text-sm font-bold text-[var(--ink)] mt-0.5">
                        {formatFollowers(match.estimatedReach)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[var(--muted)]">Vibely Score</p>
                      <p className="text-sm font-bold text-[var(--ink)] mt-0.5">
                        {match.cScore}/100
                      </p>
                    </div>
                  </div>

                  {match.redFlag && (
                    <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/50 p-2.5 text-xs text-red-900">
                      <ShieldWarning size={16} className="mt-0.5 shrink-0 text-red-600" />
                      <p className="font-medium">
                        Audience flag: Engagement pattern appears artificial. Verify regional alignment before messaging.
                      </p>
                    </div>
                  )}
                </article>
              ))
            )}
          </div>

          {/* Explainer strip at bottom */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">How Vibely AI Matchmaker Works</h3>
            <div className="grid gap-4 sm:grid-cols-4 text-xs font-medium">
              <div className="space-y-1">
                <span className="text-[var(--accent)] font-bold">1. Brief Campaign</span>
                <p className="text-[var(--muted)]">AI parses objectives and targets from natural text inputs.</p>
              </div>
              <div className="space-y-1">
                <span className="text-[var(--accent)] font-bold">2. Scans & Scores</span>
                <p className="text-[var(--muted)]">Assesses brand fit, consistency, and audience details.</p>
              </div>
              <div className="space-y-1">
                <span className="text-[var(--accent)] font-bold">3. Identify Flags</span>
                <p className="text-[var(--muted)]">Warns campaign teams if creators carry inflated followings.</p>
              </div>
              <div className="space-y-1">
                <span className="text-[var(--accent)] font-bold">4. Fast Outreach</span>
                <p className="text-[var(--muted)]">Drafts custom invites pushed straight into chat channels.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Brief & Refine Panel */}
        <div className="space-y-6">
          {/* Campaign Brief Panel */}
          <div className="card-panel bg-[var(--panel)] p-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-3">
              <h3 className="text-sm font-bold text-[var(--ink)]">Campaign Brief</h3>
              <button
                onClick={() => setIsEditingBrief(!isEditingBrief)}
                className="text-xs font-semibold text-[var(--accent)] hover:underline"
              >
                {isEditingBrief ? "Cancel" : "Edit"}
              </button>
            </div>

            {isEditingBrief ? (
              <form onSubmit={handleUpdateBrief} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-[var(--muted)]">Category</label>
                  <input
                    value={briefForm.category}
                    onChange={(e) => setBriefForm({ ...briefForm, category: e.target.value })}
                    className="w-full mt-1 rounded-lg border border-[var(--border)] bg-[var(--canvas)] p-2 text-xs font-medium outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-[var(--muted)]">Target Audience</label>
                  <textarea
                    value={briefForm.targetAudience}
                    onChange={(e) => setBriefForm({ ...briefForm, targetAudience: e.target.value })}
                    className="w-full mt-1 rounded-lg border border-[var(--border)] bg-[var(--canvas)] p-2 text-xs font-medium outline-none focus:border-[var(--accent)]"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-[var(--muted)]">Objective</label>
                  <textarea
                    value={briefForm.objective}
                    onChange={(e) => setBriefForm({ ...briefForm, objective: e.target.value })}
                    className="w-full mt-1 rounded-lg border border-[var(--border)] bg-[var(--canvas)] p-2 text-xs font-medium outline-none focus:border-[var(--accent)]"
                    rows={2}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[var(--ink)] py-2 text-xs font-bold text-white shadow-sm hover:bg-black/80 transition"
                >
                  Save & Rematch
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-xs font-medium text-[var(--ink)]">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[var(--muted)]">Goal</p>
                  <p className="mt-0.5 leading-snug">{lastMatchRun?.brief.objective || "Brand Awareness & Sales"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[var(--muted)]">Category</p>
                  <p className="mt-0.5 leading-snug">{lastMatchRun?.brief.category || "Skincare"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[var(--muted)]">Target Audience</p>
                  <p className="mt-0.5 leading-snug">{lastMatchRun?.brief.targetAudience || "Women, 18-30, Urban"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[var(--muted)]">Platforms</p>
                  <div className="flex gap-2 mt-1">
                    <span className="rounded bg-[var(--panel-soft)] px-1.5 py-0.5 text-[10px] font-bold">Instagram</span>
                    <span className="rounded bg-[var(--panel-soft)] px-1.5 py-0.5 text-[10px] font-bold">YouTube</span>
                    <span className="rounded bg-[var(--panel-soft)] px-1.5 py-0.5 text-[10px] font-bold">TikTok</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Refine Matches Module */}
          <div className="card-panel bg-[var(--panel)] p-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-3">
              <h3 className="text-sm font-bold text-[var(--ink)] flex items-center gap-1.5">
                <Sliders size={16} />
                Refine Matches
              </h3>
              <button
                onClick={() => {
                  setAudienceMatch(80);
                  setFollowerFilter("any");
                  setEngagementFilter("any");
                  setCategoryFilter("all");
                  setPlatformFilter("all");
                }}
                className="text-[10px] font-bold text-[var(--muted)] uppercase hover:underline"
              >
                Reset
              </button>
            </div>

            <div className="space-y-4">
              {/* Audience Match Range */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[var(--muted)]">
                  <span>Min. Audience Match</span>
                  <span>{audienceMatch}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={audienceMatch}
                  onChange={(e) => setAudienceMatch(parseInt(e.target.value))}
                  className="w-full mt-1.5 accent-[var(--accent)]"
                />
              </div>

              {/* Followers dropdown */}
              <div>
                <label className="text-[10px] font-bold uppercase text-[var(--muted)]">Followers</label>
                <select
                  value={followerFilter}
                  onChange={(e) => setFollowerFilter(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-[var(--border)] bg-[var(--canvas)] p-2 text-xs font-semibold outline-none focus:border-[var(--accent)]"
                >
                  <option value="any">Any size</option>
                  <option value="macro">Macro (500K+)</option>
                  <option value="mid">Mid-tier (100K - 500K)</option>
                  <option value="micro">Micro (under 100K)</option>
                </select>
              </div>

              {/* Engagement Rate dropdown */}
              <div>
                <label className="text-[10px] font-bold uppercase text-[var(--muted)]">Engagement Rate</label>
                <select
                  value={engagementFilter}
                  onChange={(e) => setEngagementFilter(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-[var(--border)] bg-[var(--canvas)] p-2 text-xs font-semibold outline-none focus:border-[var(--accent)]"
                >
                  <option value="any">Any rate</option>
                  <option value="high">High (5%+)</option>
                  <option value="avg">Average (2% - 5%)</option>
                  <option value="low">Low (under 2%)</option>
                </select>
              </div>

              {/* Content Category dropdown */}
              <div>
                <label className="text-[10px] font-bold uppercase text-[var(--muted)]">Content Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-[var(--border)] bg-[var(--canvas)] p-2 text-xs font-semibold outline-none focus:border-[var(--accent)]"
                >
                  <option value="all">Select category</option>
                  <option value="skincare">Skincare</option>
                  <option value="beauty">Beauty</option>
                  <option value="fitness">Fitness</option>
                  <option value="tech">Tech</option>
                  <option value="travel">Travel</option>
                </select>
              </div>

              {/* Platforms dropdown */}
              <div>
                <label className="text-[10px] font-bold uppercase text-[var(--muted)]">Platforms</label>
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-[var(--border)] bg-[var(--canvas)] p-2 text-xs font-semibold outline-none focus:border-[var(--accent)]"
                >
                  <option value="all">Select platform</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
