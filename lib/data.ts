import creatorSeed from "@/data/creators.json";
import { campaigns, seededThreads } from "@/lib/constants";
import { CampaignRecord, Creator, MessageThread } from "@/lib/types";

export const creators = creatorSeed as Creator[];

export function getCreatorById(id: string) {
  return creators.find((creator) => creator.id === id);
}

export function getCreatorsByIds(ids: string[]) {
  return ids
    .map((id) => getCreatorById(id))
    .filter((creator): creator is Creator => Boolean(creator));
}

export function getCampaigns(): CampaignRecord[] {
  return campaigns;
}

export function getSeedThreads(): MessageThread[] {
  return seededThreads;
}
