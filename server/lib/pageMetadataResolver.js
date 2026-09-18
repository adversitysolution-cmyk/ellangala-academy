import { siteConfig } from '../../src/seo/siteConfig.js';
import { shopContent } from '../../src/contents/shop.content.js';
import { programsData } from '../../src/contents/programsData.content.js';
import { blogContent } from '../../src/contents/blog.content.js';
import { getStore } from '../db/store.js';
import {
  generateOrganizationSchema,
  generatePersonSchema,
  generateBreadcrumbSchema,
  generateBookSchema,
  generateEventSchema,
  generateArticleSchema,
  generateScholarlyArticleSchema
} from '../../src/seo/schemas/schemaGenerators.js';

export async function resolvePageMetadata(pathname = '/') {
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/';
  const baseDomain = siteConfig.url || 'https://ellangala.com';

  // 1. Home Page
  if (cleanPath === '/') {
    return {
      title: siteConfig.defaultTitle,
      description: siteConfig.defaultDescription,
      canonical: `${baseDomain}/`,
      image: siteConfig.defaultOgImage,
      type: 'website',
      schemas: [generateOrganizationSchema()]
    };
  }

  // 2. Founder Profile Page
  if (cleanPath === '/founder') {
    return {
      title: 'Dr. Naveen Ellangala | Founder, Positive Psychologist & Author | Ellangala’s Academy',
      description: 'Explore the biography, 16+ years of experience, publications, research, and mind training vision of Dr. Naveen Ellangala, Founder of Ellangala’s Academy.',
      canonical: `${baseDomain}/founder`,
      image: `${baseDomain}/assets/images/team/naveen-ellangala.png`,
      type: 'profile',
      schemas: [
        generatePersonSchema(),
        generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Dr. Naveen Ellangala', path: '/founder' }
        ])
      ]
    };
  }

  // 3. About Page
  if (cleanPath === '/about') {
    return {
      title: 'About Us | Positive Psychology & Mind Training | Ellangala’s Academy',
      description: 'Learn about the mission, philosophy, and practical mind-training initiatives at Ellangala’s Academy founded by Dr. Naveen Ellangala.',
      canonical: `${baseDomain}/about`,
      image: siteConfig.defaultOgImage,
      type: 'website',
      schemas: [
        generateOrganizationSchema(),
        generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About Us', path: '/about' }
        ])
      ]
    };
  }

  // 3b. Doctoral Research Page
  if (cleanPath === '/research' || cleanPath === '/doctoral-research' || cleanPath === '/perma-purandaradasa-research') {
    return {
      title: 'Doctoral Research on PERMA Model & Saint Purandaradasa | Dr. Naveen Ellangala | Ellangala’s Academy',
      description: 'Explore Dr. Naveen Ellangala’s doctoral research formulating a PERMA Model of Positive Psychology based on the literary works of Saint Purandaradasa.',
      canonical: `${baseDomain}/research`,
      image: `${baseDomain}/assets/images/team/naveen-ellangala.png`,
      type: 'article',
      schemas: [
        generateScholarlyArticleSchema(),
        generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Research', path: '/research' }
        ])
      ]
    };
  }

  // 4. Positive Workshops
  if (cleanPath === '/positive-workshops' || cleanPath === '/workshops') {
    return {
      title: 'Positive Workshops | Practical Mind Training & Life Skills | Ellangala’s Academy',
      description: 'Evidence-informed experiential workshops on Positive Psychology, Indian wisdom, stress management, parenting, and emotional wellness.',
      canonical: `${baseDomain}/positive-workshops`,
      image: `${baseDomain}/assets/images/services/positive-psychology.png`,
      type: 'website',
      schemas: [
        generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Positive Workshops', path: '/positive-workshops' }
        ])
      ]
    };
  }

  // 5. Positive Mentoring
  if (cleanPath === '/positive-mentoring' || cleanPath === '/mentoring') {
    return {
      title: 'Positive Mentoring | 1-on-1 Personalized Guidance | Ellangala’s Academy',
      description: 'One-on-one reflective mentoring sessions tailored for students, professionals, parents, and individuals seeking purpose, focus, and clarity.',
      canonical: `${baseDomain}/positive-mentoring`,
      image: `${baseDomain}/assets/images/services/therapy-v1-img1.png`,
      type: 'website',
      schemas: [
        generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Positive Mentoring', path: '/positive-mentoring' }
        ])
      ]
    };
  }

  // 6. MindGym & MindGym App
  if (cleanPath === '/mindgym') {
    return {
      title: 'Positive MindGym | Practical Mind Training & Mental Fitness | Ellangala’s Academy',
      description: 'Daily mental fitness workouts, cognitive drills, emotional hygiene routines, and guided practice created by Dr. Naveen Ellangala.',
      canonical: `${baseDomain}/mindgym`,
      image: `${baseDomain}/assets/images/services/mind-gym.png`,
      type: 'website',
      schemas: [
        generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Positive MindGym', path: '/mindgym' }
        ])
      ]
    };
  }

  if (cleanPath === '/mindgym/app') {
    return {
      title: 'Positive MindGym App | Daily Guided Mind Training Audio & Practice',
      description: 'Download the official Positive MindGym App for iOS and Android. Build daily mental strength, resilience, and inner tranquility.',
      canonical: `${baseDomain}/mindgym/app`,
      image: `${baseDomain}/assets/images/services/mind-gym.png`,
      type: 'website',
      schemas: [
        generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'MindGym', path: '/mindgym' },
          { name: 'App', path: '/mindgym/app' }
        ])
      ]
    };
  }

  // 7. Resources & Shop
  if (cleanPath === '/resources' || cleanPath === '/shop') {
    return {
      title: 'Resources & 17 Published Books | Dr. Naveen Ellangala | Ellangala’s Academy',
      description: 'Explore 17 published books, workbooks, and affirmation card sets on Positive Psychology, Bhagavad Gita for daily life, and purposeful living.',
      canonical: `${baseDomain}/resources`,
      image: `${baseDomain}/assets/images/books/Bhagavadgeetha for Meaningful Life.png`,
      type: 'website',
      schemas: [
        generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Resources', path: '/resources' }
        ])
      ]
    };
  }

  // 8. Individual Book / Shop Detail (`/shop/:id` or `/resources/:id`)
  const shopMatch = cleanPath.match(/^\/(?:shop|resources)\/([a-zA-Z0-9_-]+)$/);
  if (shopMatch) {
    const productId = shopMatch[1].toLowerCase();
    const product = (shopContent?.shop?.products || []).find(
      p => p.id?.toLowerCase() === productId || p.slug?.toLowerCase() === productId
    );
    if (product) {
      const bookImg = product.image || product.img || siteConfig.defaultOgImage;
      const desc = product.englishDescription || product.description || `Read ${product.title} by Dr. Naveen Ellangala. Published work exploring Positive Psychology and purposeful living.`;
      return {
        title: `${product.title} | Books by Dr. Naveen Ellangala | Ellangala’s Academy`,
        description: desc,
        canonical: `${baseDomain}/shop/${product.id}`,
        image: bookImg.startsWith('http') ? bookImg : `${baseDomain}${bookImg.startsWith('/') ? bookImg : '/' + bookImg}`,
        type: 'book',
        schemas: [
          generateBookSchema(product),
          generateBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Resources', path: '/resources' },
            { name: product.title, path: `/shop/${product.id}` }
          ])
        ]
      };
    }
  }

  // 9. Program Details (`/programs/:slug` or `/services/:slug`)
  const programMatch = cleanPath.match(/^\/(?:programs|services|mentoring|mindgym)\/([a-zA-Z0-9_-]+)$/);
  if (programMatch) {
    const slug = programMatch[1];
    const program = programsData?.[slug];
    if (program) {
      const heroImg = program.heroImage || siteConfig.defaultOgImage;
      return {
        title: `${program.title} | Programs | Ellangala’s Academy`,
        description: program.shortPositioning || program.whatIs?.content?.slice(0, 160) || siteConfig.defaultDescription,
        canonical: `${baseDomain}/programs/${slug}`,
        image: heroImg.startsWith('http') ? heroImg : `${baseDomain}${heroImg.startsWith('/') ? heroImg : '/' + heroImg}`,
        type: 'website',
        schemas: [
          generateBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Programs', path: '/positive-workshops' },
            { name: program.title, path: `/programs/${slug}` }
          ])
        ]
      };
    }
  }

  // 10. Events Listing & Event Details (`/events` & `/events/:slug`)
  if (cleanPath === '/events') {
    return {
      title: 'Events & Live Mind Training Workshops | Ellangala’s Academy',
      description: 'Discover upcoming interactive webinars, offline workshops, and training series conducted by Dr. Naveen Ellangala.',
      canonical: `${baseDomain}/events`,
      image: siteConfig.defaultOgImage,
      type: 'website',
      schemas: [
        generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' }
        ])
      ]
    };
  }

  const eventMatch = cleanPath.match(/^\/events\/([a-zA-Z0-9_-]+)$/);
  if (eventMatch) {
    const eventSlug = eventMatch[1];
    try {
      const store = await getStore();
      const event = (store?.events || []).find(e => e.slug === eventSlug || e.id === eventSlug);
      if (event) {
        const eventImg = event.image || siteConfig.defaultOgImage;
        return {
          title: `${event.title} | Events | Ellangala’s Academy`,
          description: event.shortDescription || event.description?.slice(0, 160) || siteConfig.defaultDescription,
          canonical: `${baseDomain}/events/${event.slug}`,
          image: eventImg.startsWith('http') ? eventImg : `${baseDomain}${eventImg.startsWith('/') ? eventImg : '/' + eventImg}`,
          type: 'event',
          schemas: [
            generateEventSchema(event),
            generateBreadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Events', path: '/events' },
              { name: event.title, path: `/events/${event.slug}` }
            ])
          ]
        };
      }
    } catch {
      // Ignore DB error and fallback
    }
  }

  // 11. Blog Listing & Blog Details (`/blog`, `/insights`, `/insights/:slug`, `/blog/:id`)
  if (cleanPath === '/blog' || cleanPath === '/insights') {
    return {
      title: 'Blog & Insights | Positive Psychology & Wellbeing Articles | Ellangala’s Academy',
      description: 'Read insightful articles on mental fitness, parenting, emotional hygiene, mindfulness, and the intersection of Indian wisdom with modern psychology.',
      canonical: `${baseDomain}/blog`,
      image: siteConfig.defaultOgImage,
      type: 'website',
      schemas: [
        generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' }
        ])
      ]
    };
  }

  const blogMatch = cleanPath.match(/^\/(?:insights|blog|blog-details)\/([a-zA-Z0-9_-]+)$/);
  if (blogMatch) {
    const blogSlug = blogMatch[1];
    let blog = null;
    try {
      const store = await getStore();
      blog = (store?.blogs || []).find(b => b.slug === blogSlug || b.id === blogSlug);
    } catch {
      // fallback to static
    }
    if (!blog && blogContent?.list?.posts) {
      blog = blogContent.list.posts.find(p => p.slug === blogSlug || p.id === blogSlug);
    }
    if (blog) {
      const blogImg = blog.image || blog.img || siteConfig.defaultOgImage;
      return {
        title: `${blog.title} | Ellangala’s Academy`,
        description: blog.excerpt || blog.details?.text1?.slice(0, 160) || siteConfig.defaultDescription,
        canonical: `${baseDomain}/insights/${blog.slug || blog.id}`,
        image: blogImg.startsWith('http') ? blogImg : `${baseDomain}${blogImg.startsWith('/') ? blogImg : '/' + blogImg}`,
        type: 'article',
        schemas: [
          generateArticleSchema(blog),
          generateBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Insights', path: '/blog' },
            { name: blog.title, path: `/insights/${blog.slug || blog.id}` }
          ])
        ]
      };
    }
  }

  // 12. Contact, FAQ, Verify Certificate
  if (cleanPath === '/contact') {
    return {
      title: 'Contact Us | Ellangala’s Academy',
      description: 'Get in touch with Dr. Naveen Ellangala and the Ellangala’s Academy team for inquiries, workshop bookings, and program enrollments.',
      canonical: `${baseDomain}/contact`,
      image: siteConfig.defaultOgImage,
      type: 'website',
      schemas: [
        generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact Us', path: '/contact' }
        ])
      ]
    };
  }

  if (cleanPath === '/faq') {
    return {
      title: 'Frequently Asked Questions | Ellangala’s Academy',
      description: 'Find answers to common questions about workshops, positive mentoring, MindGym sessions, book orders, and enrollment at Ellangala’s Academy.',
      canonical: `${baseDomain}/faq`,
      image: siteConfig.defaultOgImage,
      type: 'website',
      schemas: [
        generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: '/faq' }
        ])
      ]
    };
  }

  if (cleanPath === '/verify-certificate') {
    return {
      title: 'Verify Certificate Authenticity | Ellangala’s Academy',
      description: 'Official online verification portal for workshop and program completion certificates issued by Ellangala’s Academy.',
      canonical: `${baseDomain}/verify-certificate`,
      image: siteConfig.defaultOgImage,
      type: 'website',
      schemas: [
        generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Verify Certificate', path: '/verify-certificate' }
        ])
      ]
    };
  }

  // 13. Default Fallback
  return {
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    canonical: `${baseDomain}${cleanPath === '/' ? '/' : cleanPath}`,
    image: siteConfig.defaultOgImage,
    type: 'website',
    schemas: [generateOrganizationSchema()]
  };
}

export function buildHeadTagsHtml(meta) {
  const schemasHtml = (meta.schemas || [])
    .filter(Boolean)
    .map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n    ');

  return `
    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}" />
    <link rel="canonical" href="${escapeHtml(meta.canonical)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

    <!-- Open Graph / Social Media -->
    <meta property="og:site_name" content="${escapeHtml(siteConfig.name)}" />
    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:url" content="${escapeHtml(meta.canonical)}" />
    <meta property="og:type" content="${escapeHtml(meta.type || 'website')}" />
    <meta property="og:image" content="${escapeHtml(meta.image || siteConfig.defaultOgImage)}" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter / X Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="${escapeHtml(siteConfig.twitterHandle)}" />
    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
    <meta name="twitter:image" content="${escapeHtml(meta.image || siteConfig.defaultOgImage)}" />

    <!-- Schema.org JSON-LD Structured Data -->
    ${schemasHtml}
  `.trim();
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
