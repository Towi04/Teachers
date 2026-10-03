import { ActivityStudio } from "@/components/ActivityStudio";
import {
  activityDefinitions,
  type ActivityId,
  vocabularySets,
} from "@/lib/content";
import { notFound } from "next/navigation";

type CreateActivityPageProps = {
  params: Promise<{
    activityId: string;
  }>;
};

export function generateStaticParams() {
  return activityDefinitions.map((activity) => ({
    activityId: activity.id,
  }));
}

export async function generateMetadata({ params }: CreateActivityPageProps) {
  const { activityId } = await params;
  const activity = activityDefinitions.find((item) => item.id === activityId);

  return {
    title: activity
      ? `${activity.title} | MyOwnMaterials`
      : "Create material | MyOwnMaterials",
  };
}

export default async function CreateActivityPage({
  params,
}: CreateActivityPageProps) {
  const { activityId } = await params;
  const activity = activityDefinitions.find((item) => item.id === activityId);

  if (!activity) {
    notFound();
  }

  return (
    <main>
      <ActivityStudio
        initialActivityId={activity.id as ActivityId}
        initialSet={vocabularySets[0]}
        showPicker={false}
      />
    </main>
  );
}
