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

// MPESA
export function getMpesaTransactionCost(amount: number): number {
  if (amount <= 49) {
    return 0;
  } else if (amount >= 50 && amount <= 100) {
    return 0;
  } else if (amount >= 101 && amount <= 500) {
    return 7;
  } else if (amount >= 501 && amount <= 1000) {
    return 13;
  } else if (amount >= 1001 && amount <= 1500) {
    return 23;
  } else if (amount >= 1501 && amount <= 2500) {
    return 33;
  } else if (amount >= 2501 && amount <= 3500) {
    return 53;
  } else if (amount >= 3501 && amount <= 5000) {
    return 57;
  } else if (amount >= 5001 && amount <= 7500) {
    return 78;
  } else if (amount >= 7501 && amount <= 10000) {
    return 90;
  } else if (amount >= 10001 && amount <= 15000) {
    return 100;
  } else if (amount >= 15001 && amount <= 20000) {
    return 105;
  } else if (amount >= 20001 && amount <= 35000) {
    return 108;
  } else if (amount >= 35001 && amount <= 50000) {
    return 108;
  } else if (amount >= 50001 && amount <= 250000) {
    return 108;
  }

  return 0; // Return -1 for amounts out of bounds
}
