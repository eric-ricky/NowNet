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

// process wifi_owners earnings (every Monday at 00:00)
// crons.cron("process earnings", "0 0 * * 1", internal.earnings.processEarnings);
// crons.interval(
//   "process earnings",
//   {
//     minutes: 10,
//   },
//   internal.earnings.processEarnings
// );

export default crons;
