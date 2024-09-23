import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

const useActiveUser = () => {
  const { user, isLoaded } = useUser();
  const activeUser = useQuery(api.users.getUser, {
    email: user?.emailAddresses[0].emailAddress!,
  });

  return { activeUser, isLoading: !isLoaded };
};

export default useActiveUser;
