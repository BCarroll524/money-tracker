import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import sub from "date-fns/sub";

const prisma = new PrismaClient();

async function seed() {
  const email = "blake@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("blakeiscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: "Blake",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  // lets add a couple transactions
  const chaseCreditCard = await prisma.source.create({
    data: {
      name: "Chase Preferred Card",
      type: "credit_card",
      userId: user.id,
    },
  });

  const southwestCard = await prisma.source.create({
    data: {
      name: "Southwest Travel Card",
      type: "credit_card",
      userId: user.id,
    },
  });

  const wellsAccount = await prisma.source.create({
    data: {
      name: "Wells Fargo Checking Account",
      type: "bank_account",
      userId: user.id,
    },
  });

  await prisma.transaction.createMany({
    data: [
      {
        name: "Equinox Membership",
        shortDescription: "Equinox monthly fee",
        amount: 25000,
        sourceId: chaseCreditCard.id,
        label: "🏋🏻",
        type: "splurge",
        userId: user.id,
        createdAt: new Date(),
      },
      {
        name: "Little Lunch",
        shortDescription: "morning coffee",
        amount: 515,
        sourceId: southwestCard.id,
        label: "☕️",
        type: "nice-to-have",
        userId: user.id,
        createdAt: sub(new Date(), { days: 2 }),
      },
      {
        name: "Costco Gas",
        shortDescription: "Bi weekly fill up",
        amount: 4829,
        sourceId: wellsAccount.id,
        label: "⛽️",
        type: "need",
        userId: user.id,
        createdAt: sub(new Date(), { days: 5 }),
      },
    ],
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
