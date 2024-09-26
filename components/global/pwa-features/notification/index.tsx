"use client";

import {
  removeUserSubscriptionStatus,
  saveUserSubscriptionStatus,
} from "@/actions/push-notifications";
import { Switch } from "@/components/ui/switch";
import { Doc } from "@/convex/_generated/dataModel";
import { urlBase64ToUint8Array } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PushNotificationSettings = ({ user }: { user: Doc<"users"> }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>(Notification.permission);

  useEffect(() => {
    setNotificationPermission(Notification.permission);

    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
    }
  }, []);

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

        toast.info("Go to your device settings and enable notification");
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
  };

  const disableNotification = async () => {
    try {
      setIsLoading(true);
      setNotificationPermission("denied");
      // update db
      await removeUserSubscriptionStatus({
        user: JSON.stringify(user),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="cursor-pointer">
      {notificationPermission}
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <div className="flex items-center">
          <Switch
            onClick={(e) => {
              e.stopPropagation();

              notificationPermission === "granted" &&
              !!user.notificationSubscription
                ? disableNotification()
                : enableNotification();
            }}
            checked={
              notificationPermission === "granted" &&
              !!user.notificationSubscription
            }
          />

          <div>
            {notificationPermission === "granted" &&
            !!user.notificationSubscription
              ? "G"
              : "D"}
          </div>
        </div>
      )}
    </div>
  );
};

export default PushNotificationSettings;
