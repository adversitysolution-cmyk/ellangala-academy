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
    email: "info@ellangala.com",
    phone: "+91-99867-44700",
    streetAddress: "410, C Block, Radiant Karel, Nayandahalli",
    address: "410, C Block, Radiant Karel, Nayandahalli, Bengaluru, Karnataka – 560039",
    city: "Bengaluru",
    state: "Karnataka",
    country: "IN",
    postalCode: "560039",
    openingHours: "Mo-Fr 08:00-18:30"
  },
  socialLinks: [
    "https://www.facebook.com/share/1UB9HNkoav/",
    "https://www.instagram.com/dr.naveen_ellangala?igsh=dncwc25rd2NyaHdi",
    "https://www.linkedin.com/in/dr-naveen-ellangala-60933b75?utm_source=share_via&utm_content=profile&utm_medium=member_android"
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
