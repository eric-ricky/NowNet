import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import useActiveUser from "../use-active-user";

const useWidthrawalRequestsStats = () => {
  const { activeUser } = useActiveUser();
  const widthrawaltransactions = useQuery(
    api.widthrawaltransactions.getAllWidthrawalTransactionRequests,
    {
      adminEmail: activeUser?.email,
    }
  );

  const [totalWidthrawn, setTotalWidthrawn] = useState(0);
  const [totalUpcomingWidthrawal, setTotalUpcomingWidthrawal] = useState(0);
  const [totalWidthrawalTC, setTotalWidthrawalTC] = useState(0);

  useEffect(() => {
    if (!widthrawaltransactions) return;

    // transaction cost
    const totalTransactionCost = widthrawaltransactions.reduce(
      (prev, curr) => prev + curr.transaction_cost,
      0
    );
    setTotalWidthrawalTC(totalTransactionCost);

    // total widthrawn
    const totalWidthrawnAmount = widthrawaltransactions
      .filter((t) => t.payment_status_description === "Completed")
      .reduce((prev, curr) => prev + curr.total_payable, 0);
    setTotalWidthrawn(totalWidthrawnAmount);

    // total upcoming widthrawals
    const totalUpcomingWidthrawalAmount = widthrawaltransactions
      .filter((t) => t.payment_status_description === "Pending")
      .reduce((prev, curr) => prev + curr.total_payable, 0);
    setTotalUpcomingWidthrawal(totalUpcomingWidthrawalAmount);
  }, [widthrawaltransactions]);

  return { totalWidthrawn, totalUpcomingWidthrawal, totalWidthrawalTC };
};

export default useWidthrawalRequestsStats;
