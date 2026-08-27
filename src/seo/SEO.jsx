import React from 'react';
import { Helmet } from 'react-helmet-async';
import { siteConfig, getCanonicalUrl } from './siteConfig';

export default function SEO({
  title,
  description,
  canonical,
  image,
  type = 'website',
  noindex = false,
  keywords = [],
  structuredData = null
}) {
  const fullTitle = title
    ? (title.includes('Ellangala') ? title : `${title} | ${siteConfig.name}`)
    : siteConfig.defaultTitle;

  const metaDescription = description || siteConfig.defaultDescription;
  const canonicalUrl = getCanonicalUrl(canonical || '');
  const ogImageUrl = image
    ? (image.startsWith('http') ? image : `${siteConfig.url}${image.startsWith('/') ? image : '/' + image}`)
    : siteConfig.defaultOgImage;

  const keywordString = Array.isArray(keywords) ? keywords.join(', ') : keywords;

  const schemas = Array.isArray(structuredData) ? structuredData : (structuredData ? [structuredData] : []);

  return (
    <Helmet>
      {/* Standard HTML Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywordString && <meta name="keywords" content={keywordString} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots Directive */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter / X Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteConfig.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* JSON-LD Structured Data */}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
