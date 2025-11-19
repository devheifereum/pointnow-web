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
        ],
      },
    ],
    sitemap: "https://pointnow.io/sitemap.xml",
  };
}

