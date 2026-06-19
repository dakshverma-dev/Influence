import { budgetOptions } from "@/lib/constants";
import { CampaignBrief, Creator, MatchBreakdown } from "@/lib/types";
import { clamp } from "@/lib/utils";

export function calculateAudienceQuality(creator: Creator) {
  const baseScore =
    creator.engagementRate * 12 +
    creator.accountAgeYears * 2.8 +
    creator.contentConsistencyScore * 0.22;

  let score = baseScore;

  if (creator.followerCount >= 500000 && creator.engagementRate < 1.5) {
    score -= 36;
  } else if (creator.followerCount >= 300000 && creator.engagementRate < 2) {
    score -= 24;
  } else if (creator.followerCount >= 250000 && creator.engagementRate < 3) {
    score -= 12;
  }

  return Math.round(clamp(score, 8, 100));
}

export function calculateBudgetFit(creator: Creator, budgetRangeId: CampaignBrief["budgetRangeId"]) {
  const budget = budgetOptions[budgetRangeId];
  const midpoint =
    budget.max === null ? budget.min * 1.2 : (budget.min + budget.max) / 2;

  if (
    creator.estCost >= budget.min &&
    (budget.max === null || creator.estCost <= budget.max)
  ) {
    return 100;
  }

  const distance = Math.abs(creator.estCost - midpoint);
  const tolerance = Math.max(midpoint * 0.65, 45000);

  return Math.round(clamp(100 - (distance / tolerance) * 100, 5, 100));
}

export function calculateBrandFitScore(breakdown: MatchBreakdown) {
  const weighted =
    breakdown.nicheRelevance * 0.3 +
    breakdown.audienceQuality * 0.25 +
    breakdown.contentStyleMatch * 0.25 +
    breakdown.budgetFit * 0.2;

  return Math.round(weighted);
}

export function getBaselineBreakdown(creator: Creator): MatchBreakdown {
  const audienceQuality = calculateAudienceQuality(creator);
  const consistent = Math.round(clamp(creator.contentConsistencyScore, 0, 100));

  return {
    nicheRelevance: Math.round(clamp(creator.cScore / 10, 0, 100)),
    audienceQuality,
    contentStyleMatch: consistent,
    budgetFit: Math.round(clamp(82 - creator.estCost / 7000, 30, 100)),
  };
}
