import { useSearchParams } from "@remix-run/react";
import clsx from "clsx";
import type { TrakrTransaction } from "types";

const TransactionLineItem = ({
  transaction,
}: {
  transaction: TrakrTransaction;
}) => {
  const [searchParams] = useSearchParams();
  const newTransactionId = searchParams.get("tId");
  const isNew = newTransactionId === transaction.id;

  return (
    <article className="flex items-center gap-3">
      <span id={transaction.id} className="-mt-48 pb-48" />
      <div className="relative p-1">
        <span className="absolute top-1 scale-110 text-[32px] opacity-50  blur-sm transition-transform will-change-transform">
          {transaction.label}
        </span>
        <div className="relative text-[32px]">{transaction.label}</div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <h3 className="pb-1 text-base font-medium text-gray-100">
            {transaction.name}
            {isNew ? (
              <span className="ml-4 rounded-md bg-emerald-300 px-1 py-1 text-xs font-medium uppercase text-white">
                new
              </span>
            ) : null}
          </h3>
          <h3 className="text-base font-medium tabular-nums text-gray-100">
            $
            {Number(
              new Intl.NumberFormat().format(transaction.amount / 100)
            ).toFixed(2)}
          </h3>
        </div>
        <div
          className={clsx(
            "ml-auto mr-4 h-3 w-3 rounded-full bg-white",
            transaction.type === "need"
              ? "bg-green"
              : transaction.type === "nice-to-have"
              ? "bg-yellow"
              : "bg-red"
          )}
        />
        {/* <p
            className={clsx(
              transaction.type === "need"
                ? "bg-green"
                : transaction.type === "nice-to-have"
                ? "bg-yellow"
                : "bg-red",
              "w-fit rounded-full px-2 py-1 text-xs font-medium text-white"
            )}
          >
            {transaction.type}
          </p> */}
      </div>
    </article>
  );
};

export { TransactionLineItem };
