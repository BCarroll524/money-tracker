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
    <section>
      <h2 className="pb-4 text-base font-semibold text-slate-900">
        {dateLabel}
      </h2>
      <div className="flex flex-col gap-3">
        {transactions.map((transaction) => (
          <TransactionLineItem transaction={transaction} key={transaction.id} />
        ))}
      </div>
      <div className=" mt-3 w-full border-t-2 border-slate-300 pb-3" />
    </section>
  );
};

export { TransactionsGrouped };
