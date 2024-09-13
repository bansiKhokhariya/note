import type { Metadata } from "next";
import config from "@/config";

export const getSEOTags = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
}: Metadata & {
  canonicalUrlRelative?: string;
  extraTags?: Record<string, any>;
} = {}) => {

  // Remove the log in production
  if (process.env.NODE_ENV === "development") {
    console.log("SEO Title: ", title);
  }

  // Metadata generation
  const metadataBase = new URL(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/"
      : `${config.domainName}`
  );

  return {
    title: title || config.appName,
    description: description || config.appDescription,
    keywords: keywords || ["note", "notes app", "productivity"],
    applicationName: config.appName,
    metadataBase,

    openGraph: {
      title: openGraph?.title || config.appName,
      description: openGraph?.description || config.appDescription,
      url: openGraph?.url || `https://${config.domainName}/`,
      siteName: openGraph?.siteName || config.appName,
      locale: "en_US",
      type: "website",
      images: openGraph?.images || [`${metadataBase.href}share.png`], // Fallback image
    },

    twitter: {
      title: openGraph?.title || config.appName,
      description: openGraph?.description || config.appDescription,
      card: "summary_large_image",
      creator: "@your_twitter_handle", // Customize with your Twitter handle
    },

    ...(canonicalUrlRelative && {
      alternates: { canonical: `${metadataBase.href}${canonicalUrlRelative}` },
    }),

    ...extraTags,
  };
};

export const renderSchemaTags = () => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "http://schema.org",
          "@type": "SoftwareApplication",
          name: config.appName,
          description: config.appDescription,
          image: `https://${config.domainName}/icon.png`,
          url: `https://${config.domainName}/`,
          author: {
            "@type": "Person",
            name: "Marc Lou", // Replace with the correct author name
          },
          datePublished: "2023-08-01",
          applicationCategory: "EducationalApplication",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "12",
          },
          offers: [
            {
              "@type": "Offer",
              price: "9.00",
              priceCurrency: "USD",
            },
          ],
        }),
      }}
    />
  );
};
