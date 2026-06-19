import { NextResponse } from "next/server";

import { creators } from "@/lib/data";
import { defaultGroqModel, scoreCreatorWithGroq } from "@/lib/groq";
import {
  calculateAudienceQuality,
  calculateBrandFitScore,
  calculateBudgetFit,
} from "@/lib/scoring";
import { CampaignBrief, Creator, MatchResult } from "@/lib/types";
import { clamp } from "@/lib/utils";

type AiAssessment = {
  relevance: number;
  styleMatch: number;
  reason: string;
};

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function buildFallbackAssessment(creator: Creator, brief: CampaignBrief): AiAssessment {
  const campaignTokens = new Set(
    tokenize(`${brief.category} ${brief.targetAudience} ${brief.objective}`)
  );
  const creatorTokens = new Set(
    tokenize(
      `${creator.niche} ${creator.bio} ${creator.contentStyle} ${creator.audienceCities.join(" ")}`
    )
  );

  const overlap = Array.from(campaignTokens).filter((token) =>
    creatorTokens.has(token)
  ).length;

  const nicheExact =
    creator.niche.toLowerCase() === brief.category.toLowerCase() ? 1 : 0;
  const relevance = clamp(58 + overlap * 5 + nicheExact * 18, 40, 96);
  const styleMatch = clamp(
    54 + overlap * 4 + creator.contentConsistencyScore * 0.24,
    42,
    95
  );

  return {
    relevance: Math.round(relevance),
    styleMatch: Math.round(styleMatch),
    reason: `${creator.contentStyle.split(",")[0]} makes ${creator.name.split(" ")[0]} a credible fit for this brief.`,
  };
}

async function scoreSingleCreator(creator: Creator, brief: CampaignBrief) {
  const groqAssessment = process.env.GROQ_API_KEY
    ? await scoreCreatorWithGroq(creator, brief)
    : null;
  const aiAssessment = groqAssessment ?? buildFallbackAssessment(creator, brief);
  const audienceQuality = calculateAudienceQuality(creator);
  const budgetFit = calculateBudgetFit(creator, brief.budgetRangeId);
  const breakdown = {
    nicheRelevance: aiAssessment.relevance,
    audienceQuality,
    contentStyleMatch: aiAssessment.styleMatch,
    budgetFit,
  };

  const brandFitScore = calculateBrandFitScore(breakdown);

  return {
    creatorId: creator.id,
    creator,
    brandFitScore,
    cScore: creator.cScore,
    estimatedCost: creator.estCost,
    estimatedReach: creator.estReach,
    explanation: aiAssessment.reason,
    redFlag: creator.followerCount >= 300000 && audienceQuality < 40,
    breakdown,
    usedGroq: Boolean(groqAssessment),
  };
}

async function runWithConcurrency<TInput, TOutput>(
  values: TInput[],
  concurrency: number,
  worker: (value: TInput) => Promise<TOutput>
) {
  const results: TOutput[] = [];

  for (let index = 0; index < values.length; index += concurrency) {
    const batch = values.slice(index, index + concurrency);
    const batchResults = await Promise.all(batch.map((value) => worker(value)));
    results.push(...batchResults);
  }

  return results;
}

function isCampaignBrief(value: unknown): value is CampaignBrief {
  if (!value || typeof value !== "object") {
    return false;
  }

  const brief = value as Record<string, unknown>;

  return (
    typeof brief.category === "string" &&
    typeof brief.budgetRangeId === "string" &&
    typeof brief.targetAudience === "string" &&
    typeof brief.objective === "string"
  );
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!isCampaignBrief(body)) {
    return NextResponse.json({ error: "Invalid brief." }, { status: 400 });
  }

  const scored = await runWithConcurrency(creators, 5, (creator) =>
    scoreSingleCreator(creator, body)
  );
  const usedGroq = scored.some((match) => match.usedGroq);

  const matches = scored
    .sort((left, right) => right.brandFitScore - left.brandFitScore)
    .slice(0, 8)
    .map((match) => {
      const { usedGroq, ...rest } = match;
      void usedGroq;
      return rest;
    }) as MatchResult[];

  return NextResponse.json({
    matches,
    mode: usedGroq ? "groq" : "fallback",
    model: defaultGroqModel,
    scannedCreators: creators.length,
  });
}
