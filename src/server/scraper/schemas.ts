import { z } from "zod";

import { SOURCE_TIMEZONE_OFFSET } from "./consts";

const cleanText = z
  .string()
  .nullish()
  .transform((value) => value?.trim() || null);

const sourceDate = z
  .string()
  .transform((value) => new Date(`${value}${SOURCE_TIMEZONE_OFFSET}`))
  .refine((date) => !Number.isNaN(date.getTime()), "Invalid date");

const exhibitorListItemSchema = z
  .object({
    customer: z.object({
      id: z.number().int(),
      userId: z.string().trim().min(1),
      showId: z.number().int(),
      companyName: z.string().trim().min(1),
      country: cleanText,
      squareLogo: cleanText,
      exhibitorDetail: z
        .object({ boothNo: cleanText, hallNo: cleanText })
        .nullable(),
      show: z.object({
        showName: z.string().trim().min(1),
        startDate: sourceDate,
        endDate: sourceDate,
      }),
    }),
  })
  .transform(({ customer }) => ({
    mmiCustomerId: customer.id,
    mmiUserId: customer.userId,
    companyName: customer.companyName,
    country: customer.country,
    logoUrl: customer.squareLogo,
    boothCode: customer.exhibitorDetail?.boothNo ?? null,
    hall: customer.exhibitorDetail?.hallNo ?? null,
    show: {
      id: customer.showId,
      name: customer.show.showName,
      startsAt: customer.show.startDate,
      endsAt: customer.show.endDate,
    },
  }));

export const exhibitorListDataSchema = z
  .object({
    catalogueQueries: z.object({
      exhibitorsWithWishListGroup: z.object({
        totalCount: z.number().int().min(0),
        exhibitors: z.array(exhibitorListItemSchema),
      }),
    }),
  })
  .transform((data) => data.catalogueQueries.exhibitorsWithWishListGroup);

const categorySchema = z.object({
  id: z.number().int(),
  categoryType: z.string(),
  mainCategory: cleanText,
  categoryName: cleanText,
  subCategory: cleanText,
});

const SUPPORTED_CATEGORY_TYPES = ["SECTOR", "EXHIBITOR"] as const;
type SupportedCategoryType = (typeof SUPPORTED_CATEGORY_TYPES)[number];

const isSupportedCategoryType = (type: string): type is SupportedCategoryType =>
  (SUPPORTED_CATEGORY_TYPES as readonly string[]).includes(type);

export const exhibitorDetailDataSchema = z
  .object({
    globalAnonymousQueries: z.object({
      customers: z
        .object({
          website: cleanText,
          companyProfile: cleanText,
          address1: cleanText,
          address2: cleanText,
          city: cleanText,
          state: cleanText,
          postalCode: cleanText,
          linkedinLink: cleanText,
          twitterLink: cleanText,
          facebookLink: cleanText,
          youtubeLink: cleanText,
          exhibitorDetail: z
            .object({ shortCompanyProfile: cleanText })
            .nullable(),
          customerCategories: z
            .array(z.object({ category: categorySchema }))
            .nullable(),
        })
        .nullable(),
    }),
  })
  .transform(({ globalAnonymousQueries: { customers: detail } }) => {
    if (!detail) return null;

    const categories = (detail.customerCategories ?? []).flatMap(
      ({ category }) => {
        const type = category.categoryType;
        if (!isSupportedCategoryType(type) || !category.mainCategory) return [];
        return [
          {
            id: category.id,
            type,
            mainCategory: category.mainCategory,
            name: category.categoryName,
            subCategory: category.subCategory,
          },
        ];
      },
    );

    return {
      website: detail.website,
      profile:
        detail.companyProfile ??
        detail.exhibitorDetail?.shortCompanyProfile ??
        null,
      addressLine1: detail.address1,
      addressLine2: detail.address2,
      city: detail.city,
      state: detail.state,
      postalCode: detail.postalCode,
      socialLinks: {
        LINKEDIN: detail.linkedinLink,
        TWITTER: detail.twitterLink,
        FACEBOOK: detail.facebookLink,
        YOUTUBE: detail.youtubeLink,
      },
      categories,
    };
  });

export type ExhibitorListItem = z.output<typeof exhibitorListItemSchema>;
export type ExhibitorDetail = NonNullable<
  z.output<typeof exhibitorDetailDataSchema>
>;
export type SourceCategory = ExhibitorDetail["categories"][number];
