import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useMeasure from "react-use-measure";
import { useSSRLayoutEffect } from "~/utils/misc";
import type { TrakrHandle } from "types";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import * as Dialog from "@radix-ui/react-dialog";

export const handle: TrakrHandle & { id: string } = {
  id: "new-transaction",
  backgroundColor: "bg-slate-200",
};

export default function Calendar() {
  const [ref, bounds] = useMeasure();
  let today = startOfToday();
  let [date, setDate] = useState(today);
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMMM yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMMM yyyy", new Date());

  let days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  const getNextPeriod = (duration: Duration) => {
    let firstDayNextMonth = add(firstDayCurrentMonth, duration);
    setCurrentMonth(format(firstDayNextMonth, "MMMM yyyy"));
  };

  const prev = usePrevious(currentMonth);

  let direction = "increasing";
  if (prev) {
    direction =
      parse(prev, "MMMM yyyy", new Date()) >
      parse(currentMonth, "MMMM yyyy", new Date())
        ? "decreasing"
        : "increasing";
  }

  const [height, setHeight] = useState(0);
  useSSRLayoutEffect(() => {
    setHeight(bounds.height);
  }, [bounds.height]);

  const [open, setOpen] = useState(false);

  return (
    <section className="flex min-h-full flex-col items-center justify-center pt-10">
      <Dialog.Root open={open}>
        <Dialog.Trigger
          onClick={() => setOpen(true)}
          className="rounded-lg bg-black-100 py-3 px-4 font-inter placeholder:text-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple"
        >
          {format(date, "E, MMM do, yyyy")}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 overflow-hidden">
            <Dialog.Content className="absolute inset-0 flex items-center justify-center">
              <section className="h-fit w-[300px] rounded-lg bg-black-100 p-5 shadow-md">
                <div className="flex items-center gap-2 pb-3">
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 shadow-sm"
                    onClick={() => getNextPeriod({ years: -1 })}
                  >
                    <ChevronDoubleLeftIcon className="h-3 w-3 stroke-gray-200" />
                  </button>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300  text-center shadow-sm"
                    onClick={() => getNextPeriod({ months: -1 })}
                  >
                    <ChevronLeftIcon className="h-3 w-3 stroke-gray-200" />
                  </button>
                  <div className="flex-1 text-center text-base font-medium">
                    {currentMonth}
                  </div>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-md  border border-gray-300 shadow-sm"
                    onClick={() => getNextPeriod({ months: 1 })}
                  >
                    <ChevronRightIcon className="h-3 w-3 stroke-gray-200" />
                  </button>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300  shadow-sm"
                    onClick={() => getNextPeriod({ years: 1 })}
                  >
                    <ChevronDoubleRightIcon className="h-3 w-3 stroke-gray-200" />
                  </button>
                </div>

                <div className="mb-5 grid grid-cols-7 gap-4 text-center text-sm">
                  <p>Su</p>
                  <p>Mo</p>
                  <p>Tu</p>
                  <p>We</p>
                  <p>Th</p>
                  <p>Fr</p>
                  <p>Sa</p>
                </div>
                <div
                  className={clsx(
                    "relative overflow-hidden",
                    `h-[${height}px]`
                  )}
                  style={{ height: bounds.height }}
                >
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.section
                      ref={ref}
                      key={currentMonth}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      custom={direction}
                      // transition={{ duration: 1 }}
                      className="absolute w-full"
                    >
                      <div className="grid grid-cols-7 gap-x-4 gap-y-3 text-center text-sm">
                        {days.map((day, dayIdx) => (
                          <AspectRatio.Root
                            ratio={1}
                            key={day.toString()}
                            className={clsx(
                              // dayIdx === 0 && colStartClasses[getDay(day)],
                              isEqual(day, selectedDay) && "text-white",
                              !isEqual(day, selectedDay) &&
                                isToday(day) &&
                                "text-blue-500",
                              !isEqual(day, selectedDay) &&
                                !isToday(day) &&
                                isSameMonth(day, firstDayCurrentMonth) &&
                                "text-gray-900",
                              !isEqual(day, selectedDay) &&
                                !isToday(day) &&
                                !isSameMonth(day, firstDayCurrentMonth) &&
                                "text-gray-300",
                              isEqual(day, selectedDay) &&
                                isToday(day) &&
                                "bg-blue-500",
                              isEqual(day, selectedDay) &&
                                !isToday(day) &&
                                "bg-gray-900",
                              !isEqual(day, selectedDay) && "hover:bg-gray-200",
                              (isEqual(day, selectedDay) || isToday(day)) &&
                                "font-semibold",
                              "flex h-full w-full items-center justify-center rounded-full text-sm tabular-nums"
                            )}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedDay(day)}
                              className="h-full w-full"
                            >
                              <time dateTime={format(day, "yyyy-MM-dd")}>
                                {format(day, "d")}
                              </time>
                            </button>
                          </AspectRatio.Root>
                        ))}
                      </div>
                    </motion.section>
                  </AnimatePresence>
                </div>
                <div className="flex items-center justify-center gap-4 pt-5">
                  <button
                    onClick={() => setOpen(false)}
                    className="w-full rounded-lg border border-gray-300 py-2 text-sm shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      setDate(selectedDay);
                    }}
                    className="border-black bg-black w-full rounded-lg border py-2 text-sm text-white shadow-sm"
                  >
                    Apply
                  </button>
                </div>
              </section>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}

const variants = {
  enter: (direction: "increasing" | "decreasing") => ({
    x: direction === "increasing" ? "100%" : "-100%",
  }),
  center: { x: 0 },
  exit: (direction: "increasing" | "decreasing") => ({
    x: direction === "increasing" ? "-100%" : "100%",
  }),
};

function usePrevious<StateType>(value: StateType) {
  const [tuple, setTuple] = useState([null, value]); // [ prev, current ]

  if (tuple[1] !== value) {
    setTuple([tuple[1], value]);
  }

  return tuple[0];
}
