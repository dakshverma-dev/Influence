import { notFound } from "next/navigation";

import { CreatorProfile } from "@/components/creator/creator-profile";
import { getCreatorById } from "@/lib/data";

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creator = getCreatorById(id);

  if (!creator) {
    notFound();
  }

  return <CreatorProfile creator={creator} />;
}
