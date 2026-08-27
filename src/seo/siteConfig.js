// Central Production Site Configuration for Ellangala's Academy SEO/AEO/GEO/HEO
export const siteConfig = {
  name: "Ellangala’s Academy",
  legalName: "Ellangala’s Academy for Positive Psychology & Mind Training",
  url: "https://ellangala.com",
  defaultTitle: "Ellangala’s Academy | Positive Psychology, Mind Training & MindGym",
  titleTemplate: "%s | Ellangala’s Academy",
  defaultDescription: "Explore Positive Psychology, mind training, Positive MindGym, mentoring, workshops, books, and practical resources by Dr. Naveen Ellangala for meaningful everyday living.",
  defaultOgImage: "https://ellangala.com/assets/images/resources/hero-founder.png",
  twitterHandle: "@ellangalaacademy",
  founder: {
    name: "Dr. Naveen Ellangala",
    title: "Founder, Positive Psychologist & Author",
    image: "https://ellangala.com/assets/images/team/naveen-ellangala.png",
    bio: "Positive Psychologist, Author, and Founder of Ellangala’s Academy with over 16 years of experience in mind training, mental fitness, and human transformation."
  },
  contact: {
    email: "contact@ellangala.com",
    phone: "+91 98450 12345",
    address: "Ellangala’s Academy, Nayandahalli, Outer Ring Road, Bengaluru, Karnataka 560039",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    postalCode: "560039"
  },
  socialLinks: [
    "https://facebook.com/ellangalaacademy",
    "https://instagram.com/ellangalaacademy",
    "https://youtube.com/ellangalaacademy",
    "https://linkedin.com/company/ellangala-academy"
  ]
};

export function getCanonicalUrl(path = '') {
  if (!path) return siteConfig.url;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // Extract pathname if it contains domain
    try {
      const parsed = new URL(path);
      return `${siteConfig.url}${parsed.pathname}`;
    } catch {
      return siteConfig.url;
    }
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Strip trailing slashes unless it's root
  const trimmedPath = cleanPath.length > 1 && cleanPath.endsWith('/') ? cleanPath.slice(0, -1) : cleanPath;
  return `${siteConfig.url}${trimmedPath}`;
}
