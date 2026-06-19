export type BudgetRangeId =
  | "50k-1l"
  | "1l-3l"
  | "3l-5l"
  | "5l-plus";

export type CampaignBrief = {
  category: string;
  budgetRangeId: BudgetRangeId;
  targetAudience: string;
  objective: string;
};

export type Creator = {
  id: string;
  name: string;
  handle: string;
  niche: string;
  bio: string;
  followerCount: number;
  engagementRate: number;
  estReach: number;
  estCost: number;
  accountAgeYears: number;
  contentConsistencyScore: number;
  platforms: string[];
  cScore: number;
  audienceCities: string[];
  contentStyle: string;
  pastCampaigns: string[];
};

export type MatchBreakdown = {
  nicheRelevance: number;
  audienceQuality: number;
  contentStyleMatch: number;
  budgetFit: number;
};

export type MatchResult = {
  creatorId: string;
  creator: Creator;
  brandFitScore: number;
  cScore: number;
  estimatedCost: number;
  estimatedReach: number;
  explanation: string;
  redFlag: boolean;
  breakdown: MatchBreakdown;
};

export type CampaignRecord = {
  id: string;
  name: string;
  brand: string;
  category: string;
  budgetRangeId: BudgetRangeId;
  targetAudience: string;
  objective: string;
  status: "Live" | "Draft" | "Completed";
  matchedCreatorIds?: string[];
};

export type MatchRun = {
  id: string;
  createdAt: string;
  campaignName: string;
  brief: CampaignBrief;
  matches: MatchResult[];
};

export type MessageThread = {
  id: string;
  creatorId?: string;
  creatorName: string;
  handle: string;
  platform: string;
  preview: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  isGenerated?: boolean;
};

export type ToastMessage = {
  id: string;
  label: string;
};

export type AnalyticsPoint = {
  name: string;
  value: number;
};

export type TimeSeriesPoint = {
  name: string;
  matched: number;
};
