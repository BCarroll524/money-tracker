import clsx from "clsx";
import type { TrakrTransaction } from "types";

const TransactionLineItem = ({
  transaction,
}: {
  transaction: TrakrTransaction;
}) => {
  return (
    <article className="flex justify-between">
      <div className="flex gap-3">
        <h4 className="self-center p-1 text-[32px] font-semibold">
          {transaction.label}
        </h4>
        <div>
          <h3 className="pb-1 text-base font-medium text-gray-100">
            {transaction.name}
          </h3>
          <p
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
          </p>
        </div>
      </div>
      <h3 className="text-base font-medium tabular-nums text-gray-100">
        $
        {Number(
          new Intl.NumberFormat().format(transaction.amount / 100)
        ).toFixed(2)}
      </h3>
    </article>
  );
};

export { TransactionLineItem };
