import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import useActiveUser from "../use-active-user";

const useTotalNetworks = () => {
  const { activeUser } = useActiveUser();
  const allNetworks = useQuery(api.wifis.getAllWifisAdmin, {
    adminEmail: activeUser?.email,
  });
  const [totalNetworks, setTotalNetworks] = useState(0);

  useEffect(() => {
    if (!allNetworks) return;

    const total = allNetworks.length;
    setTotalNetworks(total);
  }, [allNetworks]);

  return { totalNetworks };
};

export default useTotalNetworks;
