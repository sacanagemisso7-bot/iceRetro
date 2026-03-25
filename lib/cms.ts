import { prisma } from "@/lib/prisma";
import {
  flavorSeeds,
  highlightSeeds,
  siteContentSeed,
  testimonialSeeds
} from "@/lib/default-data";
import { hasUsableDatabase } from "@/lib/runtime-db";

const fallbackDate = new Date("2026-01-01T00:00:00.000Z");

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

function dedupeItems<T>(items: T[], key: (item: T) => string) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const itemKey = key(item);

    if (seen.has(itemKey)) {
      return false;
    }

    seen.add(itemKey);
    return true;
  });
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
    const [site, highlights, flavors, testimonials] = await Promise.all([
      prisma.siteContent.findFirst(),
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

    const fallback = createFallbackSnapshot();
    const dedupedFlavors = dedupeItems(
      flavors,
      (item) => `${item.name.trim().toLowerCase()}|${item.category.trim().toLowerCase()}`
    );

    return {
      site: site ?? fallback.site,
      highlights: highlights.length ? highlights : fallback.highlights,
      flavors: dedupedFlavors.length ? dedupedFlavors : fallback.flavors,
      testimonials: testimonials.length ? testimonials : fallback.testimonials
    };
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
    const [site, highlights, flavors, testimonials, leads] = await Promise.all([
      prisma.siteContent.findFirst(),
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

    const fallback = createFallbackSnapshot();
    const dedupedFlavors = dedupeItems(
      flavors,
      (item) => `${item.name.trim().toLowerCase()}|${item.category.trim().toLowerCase()}`
    );

    return {
      site: site ?? fallback.site,
      highlights: highlights.length ? highlights : fallback.highlights,
      flavors: dedupedFlavors.length ? dedupedFlavors : fallback.flavors,
      testimonials: testimonials.length ? testimonials : fallback.testimonials,
      leads
    };
  } catch (error) {
    logCmsFallback("dashboard", error);
    return createFallbackSnapshot();
  }
}
