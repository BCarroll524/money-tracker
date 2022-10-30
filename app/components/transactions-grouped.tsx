import type { TrakrTransaction } from "types";
import { TransactionLineItem } from "./transaction-line-item";

const TransactionsGrouped = ({
  transactions,
  dateLabel,
}: {
  transactions: TrakrTransaction[];
  dateLabel: string;
}) => {
  return (
    <section className="px-5 pt-3 odd:bg-black-200">
      <h2 className="pb-4 text-base font-semibold text-white">{dateLabel}</h2>
      <div className="flex flex-col gap-3">
        {transactions.map((transaction) => (
          <TransactionLineItem transaction={transaction} key={transaction.id} />
        ))}
      </div>
      <div className="mt-3 w-full border-t border-gray-200" />
    </section>
  );
};

export { TransactionsGrouped };
