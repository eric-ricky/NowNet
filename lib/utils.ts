import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

// for push notifications
export function urlBase64ToUint8Array(base64String: string) {
  // const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  // const base64 = (base64String + padding)
  //   .replace(/\\-/g, "+")
  //   .replace(/_/g, "/");

  // const rawData = window.atob(base64);
  // const outputArray = new Uint8Array(rawData.length);

  // for (let i = 0; i < rawData.length; ++i) {
  //   outputArray[i] = rawData.charCodeAt(i);
  // }
  // return outputArray;

  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
