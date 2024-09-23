import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function getAmountConsumed(subscription: ISubscriptionsData) {
//   const now = new Date();
//   const startTime = new Date(subscription.startTime);
//   const timeTakenInHours =
//     (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
//   const totalAmmountConsumed =
//     timeTakenInHours * +(subscription.wifi?.rate || 0);

//   return totalAmmountConsumed;
// }

export function formatToKES(amount?: number | null): string {
  if (amount === null || amount === undefined) return "--";

  const roundedAmount = +amount.toFixed(2);
  return `KSH ${roundedAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}`;
}

export function getNextPaymentDate(date: Date): Date {
  const result = new Date(date);

  // calculate how many days to add to get to the next monday
  const dayOfWeek = result.getDay();
  const daysUntilMonday = (8 - dayOfWeek) % 7 || 7;

  // set the date to the next monday 00:00:00
  result.setDate(result.getDate() + daysUntilMonday);
  result.setHours(0, 0, 0, 0);

  return result;
}
