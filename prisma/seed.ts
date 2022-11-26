import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedTransaction } from "./seed-transactions";

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
  await prisma.source.create({
    data: {
      name: "Chase Sapphire Preferred",
      type: "credit_card",
      userId: user.id,
      balance: -100000,
    },
  });

  await prisma.source.create({
    data: {
      name: "Rapid Rewards Premier Card",
      type: "credit_card",
      userId: user.id,
      balance: -25000,
    },
  });

  await prisma.source.create({
    data: {
      name: "Wells Fargo Checking Account",
      type: "checking_account",
      userId: user.id,
      balance: 140000,
    },
  });

  await prisma.source.create({
    data: {
      name: "Wells Fargo Savings Account",
      type: "savings_account",
      userId: user.id,
      balance: 5000,
    },
  });

  const sources = await prisma.source.findMany();

  for (let i = 0; i < 50; i++) {
    await seedTransaction(
      user.id,
      sources.map((s) => s.id)
    );
  }

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
