import { NextResponse } from "next/server";
import { getSiteSnapshot } from "@/lib/cms";

export async function GET() {
  const snapshot = await getSiteSnapshot();

  return NextResponse.json({
    brand: snapshot.site.brandName,
    hero: {
      eyebrow: snapshot.site.heroEyebrow,
      title: snapshot.site.heroTitle,
      subtitle: snapshot.site.heroSubtitle,
      description: snapshot.site.heroDescription
    },
    contact: {
      phone: snapshot.site.contactPhone,
      whatsapp: snapshot.site.whatsappNumber,
      instagram: snapshot.site.instagramHandle,
      address: snapshot.site.addressLine,
      hours: snapshot.site.serviceHours,
      zones: snapshot.site.deliveryZones
    },
    highlights: snapshot.highlights,
    flavors: snapshot.flavors,
    testimonials: snapshot.testimonials
  });
}
