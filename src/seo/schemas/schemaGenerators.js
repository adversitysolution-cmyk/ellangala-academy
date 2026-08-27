import { siteConfig } from '../siteConfig';

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${siteConfig.url}/#organization`,
    "name": siteConfig.name,
    "legalName": siteConfig.legalName,
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/assets/images/resources/logo-1.png`,
    "description": siteConfig.defaultDescription,
    "founder": {
      "@type": "Person",
      "@id": `${siteConfig.url}/about/founder/#person`,
      "name": siteConfig.founder.name,
      "jobTitle": siteConfig.founder.title
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Nayandahalli, Outer Ring Road",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "postalCode": "560039",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": siteConfig.contact.phone,
      "contactType": "customer service",
      "email": siteConfig.contact.email,
      "areaServed": "IN",
      "availableLanguage": ["English", "Kannada"]
    },
    "sameAs": siteConfig.socialLinks
  };
}

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/about/founder/#person`,
    "name": siteConfig.founder.name,
    "jobTitle": siteConfig.founder.title,
    "worksFor": {
      "@type": "EducationalOrganization",
      "@id": `${siteConfig.url}/#organization`,
      "name": siteConfig.name
    },
    "url": `${siteConfig.url}/about/founder`,
    "image": siteConfig.founder.image,
    "description": siteConfig.founder.bio,
    "knowsAbout": [
      "Positive Psychology",
      "Mind Training",
      "Mental Fitness",
      "Emotional Intelligence",
      "Positive Parenting",
      "Indian Wisdom & Philosophy"
    ]
  };
}

export function generateBreadcrumbSchema(items = []) {
  const itemListElement = items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.path.startsWith('http') ? item.path : `${siteConfig.url}${item.path.startsWith('/') ? item.path : '/' + item.path}`
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };
}

export function generateBookSchema(book) {
  if (!book) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${siteConfig.url}/shop/${book.id}/#book`,
    "name": book.title,
    "author": {
      "@type": "Person",
      "@id": `${siteConfig.url}/about/founder/#person`,
      "name": book.author || siteConfig.founder.name
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      "name": siteConfig.name
    },
    "image": book.image?.startsWith('http') ? book.image : `${siteConfig.url}${book.image}`,
    "description": book.description || book.title,
    "inLanguage": book.language || "English",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": book.price || "0",
      "availability": "https://schema.org/InStock",
      "url": `${siteConfig.url}/shop/${book.id}`
    }
  };
}

export function generateEventSchema(event) {
  if (!event) return null;
  const isOnline = event.mode === 'Online';
  return {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    "@id": `${siteConfig.url}/events/${event.slug}/#event`,
    "name": event.title,
    "description": event.shortDescription || event.description,
    "startDate": `${event.date}T${event.startTime || '10:00'}:00+05:30`,
    "endDate": `${event.date}T${event.endTime || '13:00'}:00+05:30`,
    "eventStatus": event.status === 'cancelled'
      ? "https://schema.org/EventCancelled"
      : "https://schema.org/EventScheduled",
    "eventAttendanceMode": isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : (event.mode === 'Hybrid' ? "https://schema.org/MixedEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode"),
    "location": isOnline
      ? {
          "@type": "VirtualLocation",
          "url": event.googleMeetLink || `${siteConfig.url}/events/${event.slug}`
        }
      : {
          "@type": "Place",
          "name": event.venue || siteConfig.name,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": event.address || "Nayandahalli, Outer Ring Road",
            "addressLocality": event.city || "Bengaluru",
            "addressRegion": "Karnataka",
            "country": "IN"
          }
        },
    "organizer": {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      "name": siteConfig.name,
      "url": siteConfig.url
    },
    "performer": {
      "@type": "Person",
      "@id": `${siteConfig.url}/about/founder/#person`,
      "name": event.speaker || siteConfig.founder.name
    },
    "offers": {
      "@type": "Offer",
      "price": event.priceType === 'Free' ? "0" : (event.price || "0"),
      "priceCurrency": "INR",
      "availability": event.registrationOpen ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      "url": `${siteConfig.url}/events/${event.slug}/register`
    }
  };
}

export function generateArticleSchema(article) {
  if (!article) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${siteConfig.url}/blog-details/${article.id}/#article`,
    "headline": article.title,
    "description": article.excerpt || article.title,
    "image": article.image?.startsWith('http') ? article.image : `${siteConfig.url}${article.image}`,
    "author": {
      "@type": "Person",
      "@id": `${siteConfig.url}/about/founder/#person`,
      "name": article.author || siteConfig.founder.name
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/assets/images/resources/logo-1.png`
      }
    },
    "datePublished": article.date || "2026-08-01",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog-details/${article.id}`
    }
  };
}
