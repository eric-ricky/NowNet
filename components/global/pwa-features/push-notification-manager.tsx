"use client";

import { urlBase64ToUint8Array } from "@/lib/utils";
import { useEffect, useState } from "react";

const PushNotificationManager = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  };

  const subscribeToPush = async () => {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    //   await subscribeUser(sub)
  };

  const unsubscribeFromPush = async () => {
    await subscription?.unsubscribe();
    setSubscription(null);
    //   await unsubscribeUser()
  };

  const sendTestNotification = async () => {
    if (subscription) {
      // await sendNotification(message)
      setMessage("");
    }
  };

  if (!isSupported) {
    return <div>Push notifications are not supported in this browser.</div>;
  }

  return (
    <div>
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <div>You are subscribed to push notifications.</div>
          <button onClick={unsubscribeFromPush}>Unsubscribe</button>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendTestNotification}>Send Test</button>
        </>
      ) : (
        <>
          <div>You are not subscribed to push notifications.</div>
          <button onClick={subscribeToPush}>Subscribe</button>
        </>
      )}
    </div>
  );
};

export default PushNotificationManager;
