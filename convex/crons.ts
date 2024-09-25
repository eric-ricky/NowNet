import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// update amount consumed for all connected subs
crons.interval(
  "amount consumed",
  { minutes: 1 },
  internal.subscriptions.updateConsumedAmount
);

// update user balance
crons.interval(
  "credit user balance",
  { minutes: 1 },
  internal.users.checkIfUserHasJuice
);

export default crons;
