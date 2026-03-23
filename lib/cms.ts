import { prisma } from "@/lib/prisma";
import {
  flavorSeeds,
  highlightSeeds,
  siteContentSeed,
  testimonialSeeds
} from "@/lib/default-data";
import { hashPassword } from "@/lib/passwords";

async function ensureBaseData() {
  const [site, admin, flavorCount, highlightCount, testimonialCount] = await Promise.all([
    prisma.siteContent.findFirst(),
    prisma.adminUser.findUnique({
      where: {
        email: process.env.ADMIN_EMAIL || "admin@iceretro.com"
      }
    }),
    prisma.flavor.count(),
    prisma.highlight.count(),
    prisma.testimonial.count()
  ]);

  if (!site) {
    await prisma.siteContent.create({
      data: siteContentSeed
    });
  }

  if (!admin) {
    await prisma.adminUser.create({
      data: {
        email: process.env.ADMIN_EMAIL || "admin@iceretro.com",
        name: process.env.ADMIN_NAME || "Ice Retro Admin",
        passwordHash: hashPassword(process.env.ADMIN_PASSWORD || "ice12345")
      }
    });
  }

  if (highlightCount === 0) {
    await prisma.highlight.createMany({
      data: highlightSeeds
    });
  }

  if (flavorCount === 0) {
    await prisma.flavor.createMany({
      data: flavorSeeds
    });
  }

  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: testimonialSeeds
    });
  }
}

export async function getSiteSnapshot() {
  await ensureBaseData();

  const [site, highlights, flavors, testimonials] = await Promise.all([
    prisma.siteContent.findFirstOrThrow(),
    prisma.highlight.findMany({
      orderBy: {
        sortOrder: "asc"
      }
    }),
    prisma.flavor.findMany({
      orderBy: {
        sortOrder: "asc"
      }
    }),
    prisma.testimonial.findMany({
      orderBy: {
        sortOrder: "asc"
      }
    })
  ]);

  return { site, highlights, flavors, testimonials };
}

export async function getDashboardSnapshot() {
  await ensureBaseData();

  const [site, highlights, flavors, testimonials, leads] = await Promise.all([
    prisma.siteContent.findFirstOrThrow(),
    prisma.highlight.findMany({
      orderBy: {
        sortOrder: "asc"
      }
    }),
    prisma.flavor.findMany({
      orderBy: {
        sortOrder: "asc"
      }
    }),
    prisma.testimonial.findMany({
      orderBy: {
        sortOrder: "asc"
      }
    }),
    prisma.lead.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })
  ]);

  return { site, highlights, flavors, testimonials, leads };
}
