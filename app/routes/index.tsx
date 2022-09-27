import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { startOfDay } from "date-fns";
import type { TrakrHandle, TrakrTransaction } from "types";
import { Header } from "~/components/header";
import { TransactionsGrouped } from "~/components/transactions-grouped";
import {
  getTotalSpent,
  getUsersTransactions,
} from "~/models/transaction.server";
import { formatMoney, groupTransactions } from "~/utils";
import { requireUser } from "~/utils/session.server";

export const handle: TrakrHandle & { id: string } = {
  id: "home",
  backgroundColor: "bg-slate-200",
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);

  const [transactions, totalSpent] = await Promise.all([
    getUsersTransactions(user.id),
    getTotalSpent(user.id),
  ]);

  return json({
    totalSpent,
    transactions,
  });
};

const getSpendingDiff = (transactions: TrakrTransaction[]) => {
  const today = startOfDay(new Date());
  const transactionsFromToday = transactions.filter(
    (transaction) => new Date(transaction.createdAt) > today
  );

  const totalSpentToday = transactionsFromToday.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  return totalSpentToday;
};

export default function Home() {
  const data = useLoaderData<typeof loader>();
  const spendingDiff = getSpendingDiff(data.transactions);
  const totalSpent = (data.totalSpent / 100).toFixed(2).toString().split(".");
  const transactionGroups = groupTransactions(data.transactions);
  return (
    <section>
      <Header />
      <div className="flex flex-col items-center justify-center pt-[68px] text-slate-900">
        <h1 className="text-2xl font-bold uppercase">Total Spent</h1>
        <p className="text-xl font-bold">
          ${formatMoney(Number(totalSpent[0]))}
          <span className="text-xs font-bold">.{totalSpent[1]}</span>
        </p>
        <p className="text-sm font-semibold text-green-600">
          + ${Number(formatMoney(spendingDiff / 100)).toFixed(2)} - Today
        </p>
      </div>
      <Link
        to="/transaction/new"
        className="mx-auto mt-3 mb-5 flex w-fit items-center justify-center gap-2 rounded-lg bg-slate-700 py-1 px-3"
      >
        <p className="text-base font-semibold uppercase text-white">
          add transaction
        </p>
        <ArrowSmallRightIcon className="h-4 w-4 text-white" />
      </Link>
      <div className="w-full border-t-2 border-slate-300 pb-3" />
      <div className="px-5">
        {data.transactions.length ? (
          transactionGroups.map((groups, index) => (
            <TransactionsGrouped
              key={index}
              transactions={groups.transactions}
              dateLabel={groups.label}
            />
          ))
        ) : (
          <p className="px-6 pt-5 text-center text-lg font-medium text-slate-900">
            You have not recorded any transactions yet. Click the button above
            to add to today's spending!
          </p>
        )}
      </div>
    </section>
  );
}
