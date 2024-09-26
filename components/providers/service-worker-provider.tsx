"use client";

import { PropsWithChildren, useEffect } from "react";

const ServiceWorkerProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
  };

  return <>{children}</>;
};

export default ServiceWorkerProvider;
