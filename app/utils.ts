import { json } from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import {
  differenceInCalendarDays,
  format,
  getDay,
  isToday,
  isYesterday,
  startOfDay,
} from "date-fns";
import { useMemo } from "react";
import type { TrakrHandle, TrakrTransaction } from "types";

import type { User } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

export function useHasMatch(id: string) {
  const matchingRoutes = useMatches();
  return useMemo(
    () =>
      matchingRoutes.some((route) => (route.handle as TrakrHandle)?.id === id),
    [matchingRoutes, id]
  );
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {}).format(amount);
}

export function groupTransactions(transactions: TrakrTransaction[]) {
  const groupedTransactions: Record<string, TrakrTransaction[]> = {};
  transactions.forEach((transaction) => {
    const date = startOfDay(new Date(transaction.createdAt));
    const key = date.toISOString().split("T")[0];
    if (!groupedTransactions[key]) {
      groupedTransactions[key] = [];
    }
    groupedTransactions[key].push(transaction);
  });

  const array = Object.entries(groupedTransactions).map(([key, value]) => {
    const transactions = value.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return {
      label: getRelativeDay(new Date(key)),
      transactions,
    };
  });

  return array;
}

/**
 * Today
 * Yesterday
 * 2 days ago
 * Last ${dayOfWeek} (if it's within the week)
 * ${dayOfWeek}, ${month} ${dayOfMonth}
 */

export function getRelativeDay(date: Date) {
  if (isToday(date)) {
    return "Today";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  if (differenceInCalendarDays(date, new Date()) <= 7) {
    const day = getDay(date);
    switch (day) {
      case 0:
        return "Last Sunday";
      case 1:
        return "Last Monday";
      case 2:
        return "Last Tuesday";
      case 3:
        return "Last Wednesday";
      case 4:
        return "Last Thursday";
      case 5:
        return "Last Friday";
      case 6:
        return "Last Saturday";
      default:
        return "Unknown Day";
    }
  }
  return format(date, "EEEE, MMMM do");
}

export function badRequest<ActionData>(data: ActionData) {
  return json(data, { status: 400 });
}

export function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "Unknown Error";
}
