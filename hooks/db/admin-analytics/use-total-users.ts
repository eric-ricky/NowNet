import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import useActiveUser from "../use-active-user";

const useTotalUsers = () => {
  const { activeUser } = useActiveUser();
  const allUsers = useQuery(api.users.getAllUsersAdmin, {
    adminEmail: activeUser?.email,
  });
  const [totalUsers, setTotalUsers] = useState<number>();

  useEffect(() => {
    if (!allUsers) return;

    const total = allUsers.length;
    setTotalUsers(total);
  }, [allUsers]);

  return { totalUsers };
};

export default useTotalUsers;
