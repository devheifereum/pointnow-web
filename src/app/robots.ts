import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/profile/",
          "/auth/",
          "/*/dashboard/",
          "/*/settings/",
          "/*/staff/",
          "/*/analytics/",
          "/*/transactions/",
          "/*/branches/",
          "/*/customers/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/profile/",
          "/auth/",
          "/*/dashboard/",
          "/*/settings/",
          "/*/staff/",
          "/*/analytics/",
          "/*/transactions/",
          "/*/branches/",
          "/*/customers/",
        ],
      },
    ],
    sitemap: "https://www.pointnow.io/sitemap.xml",
  };
}
