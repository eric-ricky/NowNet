"use client";

import { saveUserSubscriptionStatus } from "@/actions/push-notifications";
import { Doc } from "@/convex/_generated/dataModel";
import useActiveUser from "@/hooks/db/use-active-user";
import { urlBase64ToUint8Array } from "@/lib/utils";
import { PropsWithChildren, useEffect } from "react";
import { toast } from "sonner";
import PushNotificationModal from "../modals/push-notification-modal";

const PushNotificationProvider = ({ children }: PropsWithChildren) => {
  const { activeUser } = useActiveUser();

  const enableNotification = async (user: Doc<"users">) => {
    console.log("ENABLING NOTIFICATION");
    try {
      // setIsLoading(true);

      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        //   setNotificationPermission(permission);
        if (permission === "granted") {
          await subscribeUser(user);
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
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!activeUser?._id) return;

    const init = async () => {
      console.log("INITIALIZING");
      if ("serviceWorker" in navigator && "PushManager" in window) {
        await enableNotification(activeUser);
      }
    };

    const timer = setTimeout(() => {
      init();
    }, 1000);

    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUser?._id]);

  const subscribeUser = async (user: Doc<"users">) => {
    if ("serviceWorker" in navigator) {
      try {
        let registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
          registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
            updateViaCache: "none",
          });
        }

        await generateSubscriptionEndpoint(registration, user);
      } catch (error) {
        console.log("ERROR SUBSCRIBING USER SW ====>", error);
      }
    }
  };

  const generateSubscriptionEndpoint = async (
    registration: ServiceWorkerRegistration,
    user: Doc<"users">
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

  return (
    <>
      {children}

      {activeUser && <PushNotificationModal user={activeUser} />}
    </>
  );
};

export default PushNotificationProvider;
