import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import useActiveUser from "../use-active-user";

const useActiveSubscriptions = () => {
  const { activeUser } = useActiveUser();
  const activeSubscriptionsData = useQuery(
    api.subscriptions.getAllActiveSubscriptionsAdmin,
    {
      adminEmail: activeUser?.email,
    }
  );
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);

  useEffect(() => {
    if (!activeSubscriptionsData) return;

    const totalSubscriptions = activeSubscriptionsData.length;
    setActiveSubscriptions(totalSubscriptions);
  }, [activeSubscriptionsData]);

  return { activeSubscriptions };
};

export default useActiveSubscriptions;
