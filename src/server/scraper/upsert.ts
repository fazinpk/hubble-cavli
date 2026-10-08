import "server-only";

import type { Prisma, SocialPlatform } from "@generated/prisma/client";
import { db } from "@server/db";

import { EVENT_SLUG } from "./consts";
import type {
  ExhibitorDetail,
  ExhibitorListItem,
  SourceCategory,
} from "./schemas";

export const upsertEventAndShows = async (exhibitors: ExhibitorListItem[]) => {
  const shows = new Map(exhibitors.map((e) => [e.show.id, e.show]));

  await db.$transaction(async (tx) => {
    const event = await tx.event.upsert({
      where: { slug: EVENT_SLUG },
      create: { slug: EVENT_SLUG },
      update: {},
    });
    for (const show of shows.values()) {
      const data = {
        eventId: event.id,
        name: show.name,
        startsAt: show.startsAt,
        endsAt: show.endsAt,
      };
      await tx.show.upsert({
        where: { id: show.id },
        create: { id: show.id, ...data },
        update: data,
      });
    }
  });
};

export const upsertCategories = async (categories: SourceCategory[]) => {
  await db.$transaction(async (tx) => {
    for (const { id, ...data } of categories) {
      await tx.category.upsert({
        where: { id },
        create: { id, ...data },
        update: data,
      });
    }
  });
};

const syncSocialLinks = async (
  tx: Prisma.TransactionClient,
  companyId: number,
  links: ExhibitorDetail["socialLinks"],
) => {
  const present = Object.entries(links).filter(
    (entry): entry is [SocialPlatform, string] => entry[1] !== null,
  );

  await tx.socialLink.deleteMany({
    where: {
      companyId,
      platform: { notIn: present.map(([platform]) => platform) },
    },
  });
  for (const [platform, url] of present) {
    await tx.socialLink.upsert({
      where: { companyId_platform: { companyId, platform } },
      create: { companyId, platform, url },
      update: { url },
    });
  }
};

export const upsertExhibitor = async (
  exhibitor: ExhibitorListItem,
  detail: ExhibitorDetail | null,
  seenAt: Date,
) => {
  await db.$transaction(async (tx) => {
    const country = exhibitor.country
      ? await tx.country.upsert({
          where: { name: exhibitor.country },
          create: { name: exhibitor.country },
          update: {},
        })
      : null;

    const companyData = {
      name: exhibitor.companyName,
      logoUrl: exhibitor.logoUrl,
      countryId: country?.id ?? null,
      ...(detail && {
        website: detail.website,
        profile: detail.profile,
        addressLine1: detail.addressLine1,
        addressLine2: detail.addressLine2,
        city: detail.city,
        state: detail.state,
        postalCode: detail.postalCode,
      }),
    };
    const company = await tx.company.upsert({
      where: { mmiUserId: exhibitor.mmiUserId },
      create: { mmiUserId: exhibitor.mmiUserId, ...companyData },
      update: companyData,
    });

    if (exhibitor.boothCode) {
      await tx.booth.upsert({
        where: {
          showId_code: { showId: exhibitor.show.id, code: exhibitor.boothCode },
        },
        create: {
          showId: exhibitor.show.id,
          code: exhibitor.boothCode,
          hall: exhibitor.hall,
        },
        update: { hall: exhibitor.hall },
      });
    }

    const exhibitorData = {
      companyId: company.id,
      showId: exhibitor.show.id,
      boothCode: exhibitor.boothCode,
      lastSeenAt: seenAt,
    };
    const saved = await tx.exhibitor.upsert({
      where: { mmiCustomerId: exhibitor.mmiCustomerId },
      create: { mmiCustomerId: exhibitor.mmiCustomerId, ...exhibitorData },
      update: exhibitorData,
    });

    if (detail) {
      await syncSocialLinks(tx, company.id, detail.socialLinks);
      await tx.exhibitorCategory.deleteMany({
        where: { exhibitorId: saved.id },
      });
      await tx.exhibitorCategory.createMany({
        data: detail.categories.map((category) => ({
          exhibitorId: saved.id,
          categoryId: category.id,
        })),
        skipDuplicates: true,
      });
    }
  });
};
