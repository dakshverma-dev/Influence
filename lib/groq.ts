import { CampaignBrief, Creator } from "@/lib/types";
import { clamp } from "@/lib/utils";

type JsonPayload = Record<string, unknown>;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Default selected from Groq's current supported production models docs.
export const defaultGroqModel = process.env.GROQ_MODEL_ID ?? "openai/gpt-oss-20b";

function extractJsonObject(content: string) {
  const match = content.match(/\{[\s\S]*\}/);
  return match ? match[0] : content;
}

async function groqRequest({
  responseFormat,
  system,
  temperature,
  user,
}: {
  system: string;
  user: string;
  temperature: number;
  responseFormat?: "json_object";
}) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: defaultGroqModel,
      temperature,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      ...(responseFormat
        ? { response_format: { type: responseFormat } }
        : {}),
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  return data.choices?.[0]?.message?.content ?? null;
}

export async function scoreCreatorWithGroq(
  creator: Creator,
  brief: CampaignBrief
) {
  const content = await groqRequest({
    system:
      "You score Indian creator-brand fit. Return strict JSON only with numeric relevance, numeric styleMatch, and short reason.",
    user: `Campaign brief:
Category: ${brief.category}
Budget: ${brief.budgetRangeId}
Target audience: ${brief.targetAudience}
Objective: ${brief.objective}

Creator:
Name: ${creator.name}
Niche: ${creator.niche}
Bio: ${creator.bio}
Platforms: ${creator.platforms.join(", ")}
Audience cities: ${creator.audienceCities.join(", ")}
Content style: ${creator.contentStyle}
Engagement rate: ${creator.engagementRate}

Respond as JSON:
{
  "relevance": 0-100,
  "styleMatch": 0-100,
  "reason": "max 18 words"
}`,
    temperature: 0.3,
    responseFormat: "json_object",
  });

  if (!content) {
    return null;
  }

  try {
    const parsed = JSON.parse(extractJsonObject(content)) as JsonPayload;
    const relevance = Number(parsed.relevance);
    const styleMatch = Number(parsed.styleMatch);
    const reason = String(parsed.reason ?? "").trim();

    if (Number.isNaN(relevance) || Number.isNaN(styleMatch) || !reason) {
      return null;
    }

    return {
      relevance: Math.round(clamp(relevance, 0, 100)),
      styleMatch: Math.round(clamp(styleMatch, 0, 100)),
      reason,
    };
  } catch {
    return null;
  }
}

export async function generateOutreachWithGroq(
  creator: Creator,
  brief: CampaignBrief
) {
  const content = await groqRequest({
    system:
      "You write warm, concise creator outreach for brand partnerships. Return only the message body, 3 to 4 short sentences.",
    user: `Write a personalized outreach DM for this creator.

Campaign category: ${brief.category}
Target audience: ${brief.targetAudience}
Objective: ${brief.objective}
Budget band: ${brief.budgetRangeId}

Creator name: ${creator.name}
Handle: ${creator.handle}
Niche: ${creator.niche}
Bio: ${creator.bio}
Style: ${creator.contentStyle}
Past campaigns: ${creator.pastCampaigns.join(", ")}

Keep it direct, friendly, and specific.`,
    temperature: 0.6,
  });

  return content?.trim() || null;
}
