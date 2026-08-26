import { siteConfig } from '../../src/seo/siteConfig.js';

export function toAbsoluteUrl(path) {
  if (!path) return `${siteConfig.url}/assets/images/resources/hero-founder.png`;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${cleanPath}`;
}

export function generateContentSeo({ type = 'event', title, slug, description, image, customSeo = {} }) {
  const customTitle = customSeo?.title?.trim();
  const customDesc = customSeo?.description?.trim();
  const customImg = customSeo?.image?.trim();
  const isNoindex = Boolean(customSeo?.noindex);

  const fallbackTitle = title
    ? (title.includes('Ellangala') ? title : `${title} | ${siteConfig.name}`)
    : siteConfig.defaultTitle;

  const finalTitle = customTitle || fallbackTitle;
  const finalDesc = customDesc || description || siteConfig.defaultDescription;
  const basePath = type === 'blog' ? `/insights/${slug}` : `/events/${slug}`;
  const finalCanonical = toAbsoluteUrl(basePath);
  const finalImage = toAbsoluteUrl(customImg || image || siteConfig.defaultOgImage);

  return {
    title: finalTitle,
    description: finalDesc,
    canonical: finalCanonical,
    image: finalImage,
    noindex: isNoindex,
    robots: isNoindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  };
}
