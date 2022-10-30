import { faker } from "@faker-js/faker";
import { sub } from "date-fns";
import { db } from "~/utils/db.server";

/**
 * We want to fill transactions on different days over the course of a couple months
 */

const randomItem = (array: any[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedTransaction = async (userId: string, sources: string[]) => {
  const randomSource = randomItem(sources);
  const randomType = randomItem(["need", "nice-to-have", "splurge"]);
  const randomLabel = randomItem(["🏋🏻", "☕️", "⛽️"]);
  const randomAmount = Math.round(Math.random() * 100 * 100) / 100;
  const randomDaysFrom = Math.round(Math.random() * 60);
  const date = new Date();
  const randomDate = sub(date, { days: randomDaysFrom });

  const transaction = await db.transaction.create({
    data: {
      name: faker.commerce.productName(),
      shortDescription: faker.commerce.productDescription(),
      amount: randomAmount,
      sourceId: randomSource,
      label: randomLabel,
      type: randomType,
      userId,
      createdAt: randomDate,
    },
  });
};
