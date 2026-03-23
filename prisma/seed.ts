import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import {
  flavorSeeds,
  highlightSeeds,
  siteContentSeed,
  testimonialSeeds
} from "../lib/default-data";
import { hashPassword } from "../lib/passwords";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@iceretro.com";
  const adminName = process.env.ADMIN_NAME || "Ice Retro Admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "ice12345";

  const site = await prisma.siteContent.findFirst();

  if (site) {
    await prisma.siteContent.update({
      where: {
        id: site.id
      },
      data: siteContentSeed
    });
  } else {
    await prisma.siteContent.create({
      data: siteContentSeed
    });
  }

  await prisma.adminUser.upsert({
    where: {
      email: adminEmail
    },
    update: {
      name: adminName,
      passwordHash: hashPassword(adminPassword)
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash: hashPassword(adminPassword)
    }
  });

  await prisma.highlight.deleteMany();
  await prisma.flavor.deleteMany();
  await prisma.testimonial.deleteMany();

  await prisma.highlight.createMany({
    data: highlightSeeds
  });

  await prisma.flavor.createMany({
    data: flavorSeeds
  });

  await prisma.testimonial.createMany({
    data: testimonialSeeds
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
