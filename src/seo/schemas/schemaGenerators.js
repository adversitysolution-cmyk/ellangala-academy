import { siteConfig } from '../siteConfig.js';

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": `${siteConfig.url}/#organization`,
    "name": siteConfig.name,
    "legalName": siteConfig.legalName,
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/assets/images/resources/footer-logo.png`,
    "image": `${siteConfig.url}/assets/images/resources/hero-founder.png`,
    "description": siteConfig.defaultDescription,
    "email": siteConfig.contact.email,
    "telephone": siteConfig.contact.phone,
    "priceRange": "₹₹",
    "openingHours": siteConfig.contact.openingHours || "Mo-Fr 08:00-18:30",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:30"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteConfig.contact.streetAddress || "410, C Block, Radiant Karel, Nayandahalli",
      "addressLocality": siteConfig.contact.city || "Bengaluru",
      "addressRegion": siteConfig.contact.state || "Karnataka",
      "postalCode": siteConfig.contact.postalCode || "560039",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 12.9352,
      "longitude": 77.5186
    },
    "hasMap": "https://maps.google.com/maps?q=Radiant+Karel,+Nayandahalli,+Bengaluru,+Karnataka+560039",
    "areaServed": [
      {
        "@type": "City",
        "name": "Bengaluru"
      },
      {
        "@type": "State",
        "name": "Karnataka"
      },
      {
        "@type": "State",
        "name": "Kerala"
      },
      {
        "@type": "Country",
        "name": "India"
      }
    ],
    "founder": {
      "@type": "Person",
      "@id": `${siteConfig.url}/founder/#person`,
      "name": siteConfig.founder.name,
      "jobTitle": siteConfig.founder.title
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": siteConfig.contact.phone,
      "contactType": "customer service",
      "email": siteConfig.contact.email,
      "areaServed": ["Bengaluru", "Karnataka", "Kerala", "IN"],
      "availableLanguage": ["English", "Kannada"]
    },
    "sameAs": siteConfig.socialLinks
  };
}

export function generateLocalBusinessSchema() {
  return generateOrganizationSchema();
}

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/founder/#person`,
    "name": "Dr. Naveen Ellangala",
    "honorificPrefix": "Dr.",
    "jobTitle": "Positive Psychologist, Holistic Life Coach, Psychotherapist, Author & Mind Trainer",
    "description": "Positive Psychologist, Holistic Life Coach, Psychotherapist, International Certified NLP Counsellor, CBT Practitioner, Motivational Speaker, Writer, Poet, Hypnotherapist, Yoga Teacher, and author of 17 books, with over 16 years of experience in mental wellbeing, self-awareness, and meaningful living.",
    "url": `${siteConfig.url}/founder`,
    "image": siteConfig.founder.image,
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "degree",
        "name": "Ph.D. in Positive Psychology",
        "description": "Doctoral research: 'A Study and Formulation of a PERMA Model of Positive Psychology Based on the Literary Works of Saint Purandaradasa'"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "degree",
        "name": "M.Sc. in Psychology"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "degree",
        "name": "M.B.A. in Human Resources (HR)"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "certificate",
        "name": "N.L.P (Neuro Linguistic Programming) Practitioner & Counsellor"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "certificate",
        "name": "C.B.T (Cognitive Behaviour Therapy) Practitioner"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "certificate",
        "name": "Clinical Hypnotherapist"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "certificate",
        "name": "Y.I.C (Yoga Instructor Course) Certified Teacher"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "certificate",
        "name": "Psychotherapy & Reflexology Practitioner"
      }
    ],
    "award": [
      "Samskrithi Puraskritharu Prashasthi — Megamarati Kannada Matu Sahithya Vedike, Bangalore",
      "Kuvempu Rajya Prashasthi — Balaku Trust, Bangalore",
      "Samaja Seva Prashasthi — Vishwa Kannada Sahithya Mattu Samskrithika Samsthe, Bangalore",
      "Praja Vibhushana Rastra Prashasthi — Karunadu Seva Trust(R), Mysore",
      "Navaparva Satya Sachi Prashasthi — Nava Parva Foundation(R), Bangalore",
      "Best Educationalist — Jidayu Staffing Force Private Limited",
      "Rajyotsava Prashasthi — Kasturi Shrigannada Vedike, Mandya"
    ],
    "worksFor": {
      "@type": "EducationalOrganization",
      "@id": `${siteConfig.url}/#organization`,
      "name": siteConfig.name,
      "url": siteConfig.url
    },
    "memberOf": [
      {
        "@type": "Organization",
        "name": "International Mental Health Forum"
      },
      {
        "@type": "Organization",
        "name": "Jnanakoota Foundation",
        "url": "http://jnanakoota.org/"
      }
    ],
    "knowsAbout": [
      "Positive Psychology",
      "PERMA Model of Wellbeing",
      "Literary Works & Philosophy of Saint Purandaradasa",
      "Mind Training & Emotional Hygiene",
      "Mental Fitness & Resilience",
      "Cognitive Behaviour Therapy (CBT)",
      "Neuro Linguistic Programming (NLP)",
      "Spiritual Psychology & Indian Wisdom",
      "Positive Parenting & Child Psychology"
    ],
    "alumniOf": [
      {
        "@type": "EducationalOrganization",
        "name": "Bangalore University",
        "sameAs": "https://bangaloreuniversity.karnataka.gov.in/"
      },
      {
        "@type": "EducationalOrganization",
        "name": "Mangalore University",
        "sameAs": "https://www.mangaloreuniversity.ac.in/"
      },
      {
        "@type": "EducationalOrganization",
        "name": "S-VYASA Yoga University (Swami Vivekananda Yoga Anusandhana Samsthana)",
        "sameAs": "https://svyasa.edu.in/"
      }
    ],
    "sameAs": siteConfig.socialLinks
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
  const bookSlug = book.id || book.slug;
  const rawImg = book.image || book.img || '';
  const fullImage = rawImg.startsWith('http')
    ? rawImg
    : `${siteConfig.url}${rawImg.startsWith('/') ? rawImg : '/' + rawImg}`;
  const languageCode = book.inLanguage || (book.language === 'Kannada' ? 'kn' : 'en');
  const descriptionText = book.englishDescription || book.description || book.title;

  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${siteConfig.url}/shop/${bookSlug}/#book`,
    "name": book.title,
    "author": {
      "@type": "Person",
      "@id": `${siteConfig.url}/founder/#person`,
      "name": book.author || siteConfig.founder.name,
      "url": `${siteConfig.url}/founder`
    },
    "inLanguage": languageCode,
    "publisher": book.publisher || siteConfig.name,
    "url": `${siteConfig.url}/shop/${bookSlug}`,
    "image": fullImage,
    "description": descriptionText,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": book.numericPrice ? String(book.numericPrice) : (book.price?.replace(/[^0-9.]/g, '') || "0"),
      "availability": "https://schema.org/InStock",
      "url": `${siteConfig.url}/shop/${bookSlug}`
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
      "@id": `${siteConfig.url}/founder/#person`,
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
      "@id": `${siteConfig.url}/founder/#person`,
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

export function generateScholarlyArticleSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": `${siteConfig.url}/research/#scholarly-article`,
    "name": "A Study and Formulation of a PERMA Model of Positive Psychology Based on the Literary Works of Saint Purandaradasa",
    "headline": "A Study and Formulation of a PERMA Model of Positive Psychology Based on the Literary Works of Saint Purandaradasa",
    "author": {
      "@type": "Person",
      "@id": `${siteConfig.url}/founder/#person`,
      "name": "Dr. Naveen Ellangala",
      "jobTitle": "Positive Psychologist & Author",
      "url": `${siteConfig.url}/founder`
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      "name": siteConfig.name,
      "url": siteConfig.url
    },
    "url": `${siteConfig.url}/research`,
    "inLanguage": ["en", "kn"],
    "description": "Original doctoral research by Dr. Naveen Ellangala formulating an indigenous cross-cultural PERMA model of Positive Psychology grounded in the 16th-century devotional compositions and philosophical teachings of Saint Purandaradasa.",
    "abstract": "This doctoral study explores the synthesis of Western Positive Psychology—specifically Martin Seligman's PERMA framework (Positive Emotions, Engagement, Relationships, Meaning, Accomplishment)—with the spiritual and ethical philosophy embedded in the literary works of Saint Purandaradasa. The research establishes an indigenous, culturally rooted model of psychological flourishing, emotional hygiene, and purposeful living, bridging classical Indian wisdom with modern behavioural science.",
    "keywords": [
      "PERMA Model",
      "Saint Purandaradasa",
      "Positive Psychology",
      "Haridasa Literature",
      "Indian Psychology",
      "Human Flourishing",
      "Dr. Naveen Ellangala",
      "Positive MindGym",
      "Emotional Hygiene",
      "Spiritual Psychology"
    ],
    "about": [
      {
        "@type": "Thing",
        "name": "Positive Psychology"
      },
      {
        "@type": "Thing",
        "name": "PERMA Model of Wellbeing"
      },
      {
        "@type": "Person",
        "name": "Saint Purandaradasa"
      },
      {
        "@type": "Thing",
        "name": "Indian Wisdom & Mind Training"
      }
    ]
  };
}
