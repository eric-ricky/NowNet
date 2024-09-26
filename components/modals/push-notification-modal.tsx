"use client";

import { saveUserSubscriptionStatus } from "@/actions/push-notifications";
import { Doc } from "@/convex/_generated/dataModel";
import { urlBase64ToUint8Array } from "@/lib/utils";
import { BellRing, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const PushNotificationModal = ({ user }: { user: Doc<"users"> }) => {
  const [hideModal, setHideModal] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>(Notification.permission);

  useEffect(() => {
    setNotificationPermission(Notification.permission);
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      const userSubscription = user.notificationSubscription
        ? JSON.parse(user.notificationSubscription)
        : null;
      setSubscription(userSubscription);
    }
  }, [user.notificationSubscription]);

  useEffect(() => {
    if (subscription && notificationPermission === "granted") {
      setHideModal(true);
    } else {
      setHideModal(false);
    }
  }, [subscription, notificationPermission]);

  const enableNotification = async () => {
    try {
      setIsLoading(true);

      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === "granted") {
          await subscribeUser();
          return;
        }

        toast.error("Go to your device settings and enable notification", {
          style: {
            color: "red",
          },
        });
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeUser = async () => {
    if ("serviceWorker" in navigator) {
      try {
        let registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
          registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
            updateViaCache: "none",
          });
        }

        await generateSubscriptionEndpoint(registration);
      } catch (error) {
        console.log("ERROR SUBSCRIBING USER SW ====>", error);
      }
    }
  };

  const generateSubscriptionEndpoint = async (
    registration: ServiceWorkerRegistration
  ) => {
    const applicationServerKey = urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
    );
    const sub = await registration.pushManager.subscribe({
      applicationServerKey,
      userVisibleOnly: true,
    });

    // store sub to db
    await saveUserSubscriptionStatus({
      sub: JSON.stringify(sub),
      user: JSON.stringify(user),
    });
    setSubscription(sub);
  };

  if (hideModal || !isSupported) return null;

  return (
    <div className="fixed bottom-4 left-5 bg-white shadow-2xl border border-slate-400 rounded-xl p-4 flex flex-col gap-4 w-[320px] md:w-96">
      <BellRing size={32} className="text-blue-500 animate-bounce " />

      <div className="font-medium">Enable Notifications</div>

      <div className="text-muted-foreground text-sm">
        Get notified and never miss an important update on your platform
        activities.
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={enableNotification}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-400 active:scale-90 transition"
        >
          {isLoading && <Loader2 className="mr-2 animate-spin " />}
          Enable Notification
        </Button>
      </div>
    </div>
  );
};

export default PushNotificationModal;
