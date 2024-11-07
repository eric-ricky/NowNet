import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import useActiveUser from "../use-active-user";

const useWidthrawalRequestsStats = () => {
  const { activeUser } = useActiveUser();
  const transactions = useQuery(api.transactions.getWidthrawalTransactions, {
    adminEmail: activeUser?.email!,
  });

  const [totalWidthrawn, setTotalWidthrawn] = useState<number>(); // paid to users
  const [totalUpcomingWidthrawal, setTotalUpcomingWidthrawal] =
    useState<number>(); // pending

  useEffect(() => {
    if (!transactions) return;

    // total paid to users
    const totalSent = transactions
      .filter((t) => t.status === "COMPLETED")
      .reduce((acc, t) => acc + t.amount, 0);
    setTotalWidthrawn(totalSent);

    // total pending
    const totalPending = transactions
      .filter((t) => t.status === "PENDING")
      .reduce((acc, t) => acc + t.amount, 0);
    setTotalUpcomingWidthrawal(totalPending);
  }, [transactions]);

  return { totalWidthrawn, totalUpcomingWidthrawal };
};

export default useWidthrawalRequestsStats;
