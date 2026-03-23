"use server";

import { LeadStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/passwords";
import { clearAdminSession, getAdminSession, setAdminSession } from "@/lib/session";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function numberValue(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key) || fallback);
  return Number.isFinite(value) ? value : fallback;
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

function revalidateCms() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/api/site");
}

export async function loginAction(formData: FormData) {
  const email = text(formData, "email").toLowerCase();
  const password = text(formData, "password");

  if (!email || !password) {
    redirect("/admin/login?error=Informe+email+e+senha");
  }

  const user = await prisma.adminUser.findUnique({
    where: {
      email
    }
  });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    redirect("/admin/login?error=Credenciais+invalidas");
  }

  await setAdminSession(user.email);
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function updateSiteAction(formData: FormData) {
  await requireAdmin();

  await prisma.siteContent.update({
    where: { id: text(formData, "id") },
    data: {
      brandName: text(formData, "brandName"),
      heroEyebrow: text(formData, "heroEyebrow"),
      heroTitle: text(formData, "heroTitle"),
      heroSubtitle: text(formData, "heroSubtitle"),
      heroDescription: text(formData, "heroDescription"),
      announcement: text(formData, "announcement"),
      primaryCtaLabel: text(formData, "primaryCtaLabel"),
      primaryCtaHref: text(formData, "primaryCtaHref"),
      secondaryCtaLabel: text(formData, "secondaryCtaLabel"),
      secondaryCtaHref: text(formData, "secondaryCtaHref"),
      experienceTitle: text(formData, "experienceTitle"),
      experienceDescription: text(formData, "experienceDescription"),
      storyTitle: text(formData, "storyTitle"),
      storyBody: text(formData, "storyBody"),
      contactPhone: text(formData, "contactPhone"),
      whatsappNumber: text(formData, "whatsappNumber"),
      instagramHandle: text(formData, "instagramHandle"),
      addressLine: text(formData, "addressLine"),
      serviceHours: text(formData, "serviceHours"),
      deliveryZones: text(formData, "deliveryZones")
    }
  });

  revalidateCms();
}

export async function createHighlightAction(formData: FormData) {
  await requireAdmin();

  await prisma.highlight.create({
    data: {
      kicker: text(formData, "kicker"),
      title: text(formData, "title"),
      description: text(formData, "description"),
      ctaLabel: text(formData, "ctaLabel") || null,
      ctaHref: text(formData, "ctaHref") || null,
      tone: text(formData, "tone") || "cream",
      sortOrder: numberValue(formData, "sortOrder")
    }
  });

  revalidateCms();
}

export async function updateHighlightAction(formData: FormData) {
  await requireAdmin();

  await prisma.highlight.update({
    where: {
      id: text(formData, "id")
    },
    data: {
      kicker: text(formData, "kicker"),
      title: text(formData, "title"),
      description: text(formData, "description"),
      ctaLabel: text(formData, "ctaLabel") || null,
      ctaHref: text(formData, "ctaHref") || null,
      tone: text(formData, "tone") || "cream",
      sortOrder: numberValue(formData, "sortOrder")
    }
  });

  revalidateCms();
}

export async function deleteHighlightAction(formData: FormData) {
  await requireAdmin();

  await prisma.highlight.delete({
    where: {
      id: text(formData, "id")
    }
  });

  revalidateCms();
}

export async function createFlavorAction(formData: FormData) {
  await requireAdmin();

  await prisma.flavor.create({
    data: {
      category: text(formData, "category"),
      name: text(formData, "name"),
      description: text(formData, "description"),
      price: text(formData, "price"),
      badge: text(formData, "badge") || null,
      accentColor: text(formData, "accentColor") || "#ff6f61",
      featured: checked(formData, "featured"),
      intensity: numberValue(formData, "intensity", 3),
      sortOrder: numberValue(formData, "sortOrder")
    }
  });

  revalidateCms();
}

export async function updateFlavorAction(formData: FormData) {
  await requireAdmin();

  await prisma.flavor.update({
    where: {
      id: text(formData, "id")
    },
    data: {
      category: text(formData, "category"),
      name: text(formData, "name"),
      description: text(formData, "description"),
      price: text(formData, "price"),
      badge: text(formData, "badge") || null,
      accentColor: text(formData, "accentColor") || "#ff6f61",
      featured: checked(formData, "featured"),
      intensity: numberValue(formData, "intensity", 3),
      sortOrder: numberValue(formData, "sortOrder")
    }
  });

  revalidateCms();
}

export async function deleteFlavorAction(formData: FormData) {
  await requireAdmin();

  await prisma.flavor.delete({
    where: {
      id: text(formData, "id")
    }
  });

  revalidateCms();
}

export async function createTestimonialAction(formData: FormData) {
  await requireAdmin();

  await prisma.testimonial.create({
    data: {
      author: text(formData, "author"),
      role: text(formData, "role"),
      quote: text(formData, "quote"),
      rating: numberValue(formData, "rating", 5),
      sortOrder: numberValue(formData, "sortOrder")
    }
  });

  revalidateCms();
}

export async function updateTestimonialAction(formData: FormData) {
  await requireAdmin();

  await prisma.testimonial.update({
    where: {
      id: text(formData, "id")
    },
    data: {
      author: text(formData, "author"),
      role: text(formData, "role"),
      quote: text(formData, "quote"),
      rating: numberValue(formData, "rating", 5),
      sortOrder: numberValue(formData, "sortOrder")
    }
  });

  revalidateCms();
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdmin();

  await prisma.testimonial.delete({
    where: {
      id: text(formData, "id")
    }
  });

  revalidateCms();
}

export async function updateLeadStatusAction(formData: FormData) {
  await requireAdmin();

  const status = text(formData, "status") as LeadStatus;
  const safeStatus = Object.values(LeadStatus).includes(status) ? status : LeadStatus.NEW;

  await prisma.lead.update({
    where: {
      id: text(formData, "id")
    },
    data: {
      status: safeStatus
    }
  });

  revalidateCms();
}
