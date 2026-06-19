import { NextResponse } from "next/server";

import { generateOutreachWithGroq } from "@/lib/groq";
import { CampaignBrief, Creator } from "@/lib/types";

function isCreator(value: unknown): value is Creator {
  if (!value || typeof value !== "object") {
    return false;
  }

  const creator = value as Record<string, unknown>;

  return (
    typeof creator.id === "string" &&
    typeof creator.name === "string" &&
    typeof creator.handle === "string"
  );
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

function buildFallbackOutreach(creator: Creator, brief: CampaignBrief) {
  const firstName = creator.name.split(" ")[0];

  return `Hi ${firstName}, loved how your ${creator.contentStyle.toLowerCase()} keeps ${creator.niche.toLowerCase()} content feeling credible. We are planning a ${brief.category.toLowerCase()} campaign for ${brief.targetAudience.toLowerCase()} and think your audience could be a strong fit. The goal is to ${brief.objective.charAt(0).toLowerCase()}${brief.objective.slice(1)}. If you are open, I would love to share the brief and timelines.`;
}

export async function POST(request: Request) {
  const body = await request.json();

  const brief = body?.brief;
  const creator = body?.creator;

  if (!isCampaignBrief(brief) || !isCreator(creator)) {
    return NextResponse.json({ error: "Invalid outreach payload." }, { status: 400 });
  }

  const generated =
    (await generateOutreachWithGroq(creator, brief)) ??
    buildFallbackOutreach(creator, brief);

  return NextResponse.json({
    message: generated,
    mode: process.env.GROQ_API_KEY ? "groq" : "fallback",
  });
}
