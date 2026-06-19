import { AnalyticsPoint, BudgetRangeId, CampaignRecord, MessageThread, TimeSeriesPoint } from "@/lib/types";

export const budgetOptions: Record<
  BudgetRangeId,
  { label: string; min: number; max: number | null }
> = {
  "50k-1l": { label: "Rs. 50K to Rs. 1L", min: 50000, max: 100000 },
  "1l-3l": { label: "Rs. 1L to Rs. 3L", min: 100000, max: 300000 },
  "3l-5l": { label: "Rs. 3L to Rs. 5L", min: 300000, max: 500000 },
  "5l-plus": { label: "Rs. 5L+", min: 500000, max: null },
};

export const dashboardStats = [
  { label: "Campaigns matched this month", value: "24" },
  { label: "Avg Brand Fit Score", value: "84%" },
  { label: "Top niches this week", value: "Skincare, Fitness, Tech" },
];

export const campaigns: CampaignRecord[] = [
  {
    id: "glowup-fest",
    name: "GlowUp Fest",
    brand: "Luma Skin",
    category: "Skincare",
    budgetRangeId: "1l-3l",
    targetAudience: "Women 18-30 in metro cities who follow skincare routines",
    objective: "Drive trial sign-ups for a monsoon-safe sunscreen line",
    status: "Live",
    matchedCreatorIds: ["anika-reddy", "riya-ray", "ishita-kohli"],
  },
  {
    id: "fit-india-movement",
    name: "Fit India Movement",
    brand: "MoveMint",
    category: "Fitness",
    budgetRangeId: "1l-3l",
    targetAudience: "Young professionals restarting a wellness routine",
    objective: "Push sign-ups for a 21-day challenge",
    status: "Live",
    matchedCreatorIds: ["arjun-veer", "ira-mathur", "rohan-naik"],
  },
  {
    id: "monsoon-vibes",
    name: "Monsoon Vibes",
    brand: "StayLite",
    category: "Travel",
    budgetRangeId: "50k-1l",
    targetAudience: "Couples planning rainy-season escapes from major cities",
    objective: "Boost bookings for weekend travel packages",
    status: "Completed",
    matchedCreatorIds: ["tara-malhotra", "aadi-sehgal", "sana-kapoor"],
  },
];

export const seededThreads: MessageThread[] = [
  {
    id: "thread-riya",
    creatorId: "riya-ray",
    creatorName: "Riya Ray",
    handle: "@riyaglowdiary",
    platform: "Instagram DM",
    preview: "Would love to hear your packaging angle before we lock the brief.",
    lastMessage: "Would love to hear your packaging angle before we lock the brief.",
    timestamp: "10:10 AM",
    unread: true,
  },
  {
    id: "thread-naina",
    creatorId: "naina-bhat",
    creatorName: "Naina Bhat",
    handle: "@techwithnaina",
    platform: "Email",
    preview: "Can you share expected turnaround for a launch-week explainer?",
    lastMessage: "Can you share expected turnaround for a launch-week explainer?",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: "thread-sana",
    creatorId: "sana-kapoor",
    creatorName: "Sana Kapoor",
    handle: "@sipwithsana",
    platform: "Instagram DM",
    preview: "The tasting challenge idea sounds strong. Let's align on deliverables.",
    lastMessage: "The tasting challenge idea sounds strong. Let's align on deliverables.",
    timestamp: "Yesterday",
    unread: false,
  },
];

export const scoreDistribution: AnalyticsPoint[] = [
  { name: "80-90", value: 8 },
  { name: "70-79", value: 6 },
  { name: "60-69", value: 3 },
  { name: "<60", value: 3 },
];

export const nicheBreakdown: AnalyticsPoint[] = [
  { name: "Skincare", value: 5 },
  { name: "Fitness", value: 4 },
  { name: "Tech", value: 4 },
  { name: "Food", value: 2 },
  { name: "Travel", value: 2 },
  { name: "Parenting", value: 2 },
  { name: "Gaming", value: 2 },
  { name: "Finance", value: 2 },
];

export const campaignTrend: TimeSeriesPoint[] = [
  { name: "Jan", matched: 6 },
  { name: "Feb", matched: 8 },
  { name: "Mar", matched: 12 },
  { name: "Apr", matched: 15 },
  { name: "May", matched: 18 },
  { name: "Jun", matched: 24 },
];

export const defaultBrandProfile = {
  name: "Vibely Demo Brand",
  industry: "Creator Marketing Platform",
  logo: "Lavender wordmark placeholder",
};

export const defaultCampaignBrief = {
  category: "Skincare",
  budgetRangeId: "1l-3l" as BudgetRangeId,
  targetAudience: "Women 18-30 in metro cities looking for simple routines",
  objective: "Drive creator-led trials for a new monsoon skincare launch",
};
