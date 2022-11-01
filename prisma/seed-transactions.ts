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
  const randomAmount = Math.round(Math.random() * 10000);
  const randomDaysFrom = Math.round(Math.random() * 15);
  const date = new Date();
  const randomDate = sub(date, { days: randomDaysFrom });

  await db.transaction.create({
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

(async () => {
  const users = await db.user.findMany();
  const sources = await db.source.findMany();

  for (const user of users) {
    for (let i = 0; i < 50; i++) {
      await seedTransaction(
        user.id,
        sources.map((s) => s.id)
      );
    }
  }
})();
