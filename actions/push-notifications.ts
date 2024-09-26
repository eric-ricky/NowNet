"use server";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { ConvexHttpClient } from "convex/browser";
import webpush from "web-push";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function saveUserSubscriptionStatus({
  sub,
  user,
}: {
  sub: string;
  user: string;
}) {
  const userData = JSON.parse(user) as Doc<"users">;
  await client.mutation(api.users.updateUser, {
    id: userData._id,
    notificationSubscription: sub,
  });
  return { success: true };
}

export async function removeUserSubscriptionStatus({ user }: { user: string }) {
  const userData = JSON.parse(user) as Doc<"users">;
  await client.mutation(api.users.updateUser, {
    id: userData._id,
    notificationSubscription: undefined,
  });

  return { success: true };
}

export async function sendNotification({
  message,
  user,
  title,
}: {
  message: string;
  user: string;
  title: string;
}) {
  webpush.setVapidDetails(
    "mailto:your-email@example.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const userData = JSON.parse(user) as Doc<"users">;
  const { notificationSubscription } = userData;
  const subscription = notificationSubscription;
  if (!subscription) {
    throw new Error("No subscription available");
  }

  try {
    await webpush.sendNotification(
      JSON.parse(subscription),
      JSON.stringify({
        message: title,
        icon: "assets/icon128.png",
        body: message,
      })
    );

    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
