import { prisma } from "@/lib/prisma";
import {
  flavorSeeds,
  highlightSeeds,
  siteContentSeed,
  testimonialSeeds
} from "@/lib/default-data";
import { hashPassword } from "@/lib/passwords";
import { hasUsableDatabase } from "@/lib/runtime-db";

const fallbackDate = new Date("2026-01-01T00:00:00.000Z");

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

function createFallbackSnapshot() {
  return {
    site: {
      id: "seed-site",
      ...siteContentSeed,
      createdAt: fallbackDate,
      updatedAt: fallbackDate
    },
    highlights: highlightSeeds.map((item, index) => ({
      id: `seed-highlight-${index + 1}`,
      ...item,
      ctaLabel: item.ctaLabel || null,
      ctaHref: item.ctaHref || null,
      createdAt: fallbackDate,
      updatedAt: fallbackDate
    })),
    flavors: flavorSeeds.map((item, index) => ({
      id: `seed-flavor-${index + 1}`,
      ...item,
      badge: item.badge || null,
      createdAt: fallbackDate,
      updatedAt: fallbackDate
    })),
    testimonials: testimonialSeeds.map((item, index) => ({
      id: `seed-testimonial-${index + 1}`,
      ...item,
      createdAt: fallbackDate,
      updatedAt: fallbackDate
    })),
    leads: []
  };
}

function logCmsFallback(scope: string, error: unknown) {
  console.error(`[cms:${scope}] Falling back to seed content`, error);
}

export async function getSiteSnapshot() {
  if (!hasUsableDatabase()) {
    logCmsFallback("site", "Database disabled for this runtime");
    const fallback = createFallbackSnapshot();
    return {
      site: fallback.site,
      highlights: fallback.highlights,
      flavors: fallback.flavors,
      testimonials: fallback.testimonials
    };
  }

  try {
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
  } catch (error) {
    logCmsFallback("site", error);
    const fallback = createFallbackSnapshot();
    return {
      site: fallback.site,
      highlights: fallback.highlights,
      flavors: fallback.flavors,
      testimonials: fallback.testimonials
    };
  }
}

export async function getDashboardSnapshot() {
  if (!hasUsableDatabase()) {
    logCmsFallback("dashboard", "Database disabled for this runtime");
    return createFallbackSnapshot();
  }

  try {
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
  } catch (error) {
    logCmsFallback("dashboard", error);
    return createFallbackSnapshot();
  }
}
