/**
 * Curated list of Dr. Naveen Ellangala's real Positive Workshops & Programs
 * with topic associations for intelligent interest-based recommendations in the Community Feed.
 */

export const COMMUNITY_WORKSHOPS = [
  {
    id: 'the-art-of-mind-training',
    slug: 'the-art-of-mind-training',
    title: 'The Art of Mind Training',
    subtitle: 'Mastering mental discipline, focus & emotional resilience.',
    description: 'Structured mental fitness practices to master attention, regulate emotions, and foster calm clarity.',
    category: 'MIND TRAINING',
    badge: 'Flagship Workshop',
    image: '/assets/images/programs/the-art-of-mind-training.png',
    link: '/programs/the-art-of-mind-training',
    priority: 1,
    topics: [
      'mindfulness',
      'Mindfulness & Meditation',
      'mind-training',
      'Mind Training',
      'mental-wellbeing',
      'Emotional Wellbeing',
      'focus',
      'calmness'
    ]
  },
  {
    id: 'positive-psychology-meaningful-life',
    slug: 'positive-psychology-meaningful-life',
    title: 'Positive Psychology for a Meaningful Life',
    subtitle: 'Strengths, wellbeing, and purpose for everyday living.',
    description: 'Evidence-based tools grounded in the PERMA model to enhance everyday happiness and personal fulfillment.',
    category: 'POSITIVE WORKSHOP',
    badge: 'Popular Workshop',
    image: '/assets/images/programs/positive-psychology-meaningful-life.png',
    link: '/programs/positive-psychology-meaningful-life',
    priority: 2,
    topics: [
      'psychology',
      'Positive Psychology',
      'life-purpose',
      'Purpose & Meaning',
      'happiness',
      'wellbeing',
      'workshops',
      'Workshops & Retreats'
    ]
  },
  {
    id: 'spiritual-psychology-purposeful-life',
    slug: 'spiritual-psychology-purposeful-life',
    title: 'Spiritual Psychology for Daily Life',
    subtitle: 'Timeless spiritual wisdom harmonized with practical clarity.',
    description: 'Inner awareness, tranquility, and living with composure through ancient Indian philosophy.',
    category: 'SPIRITUAL PSYCHOLOGY',
    badge: 'Wisdom Series',
    image: '/assets/images/programs/spiritual-psychology-purposeful-life.png',
    link: '/programs/spiritual-psychology-purposeful-life',
    priority: 3,
    topics: [
      'spirituality',
      'Spiritual Wisdom',
      'bhagavad-gita',
      'Bhagavad Gita Wisdom',
      'inner-peace',
      'clarity',
      'life-purpose'
    ]
  },
  {
    id: 'positive-parenting',
    slug: 'positive-parenting',
    title: 'Positive Parenting',
    subtitle: 'Empathetic communication & stronger parent-child bonds.',
    description: 'Practical perspectives for conscious parenting, managing triggers, and cultivating a peaceful home.',
    category: 'PARENTING',
    badge: 'Family Growth',
    image: '/assets/images/programs/positive-parenting.png',
    link: '/programs/positive-parenting',
    priority: 4,
    topics: [
      'parenting',
      'Positive Parenting',
      'family',
      'relationships',
      'child-development',
      'conscious-living'
    ]
  },
  {
    id: 'student-success-mindset',
    slug: 'student-success-mindset',
    title: 'Student Success Mindset',
    subtitle: 'Academic focus, confidence & exam resilience.',
    description: 'Mind training techniques to boost concentration, overcome anxiety, and build consistent learning habits.',
    category: 'STUDENT SUCCESS',
    badge: 'Youth & Students',
    image: '/assets/images/programs/student-success-mindset.png',
    link: '/programs/student-success-mindset',
    priority: 5,
    topics: [
      'students',
      'Student Success Mindset',
      'study-skills',
      'exam-resilience',
      'academic-focus',
      'mind-training'
    ]
  },
  {
    id: 'positive-teaching',
    slug: 'positive-teaching',
    title: 'Positive Teaching',
    subtitle: 'Empowering educators with psychological classroom tools.',
    description: 'Pedagogy rooted in positive psychology to inspire student curiosity and sustain educator wellbeing.',
    category: 'EDUCATION',
    badge: 'Educator Masterclass',
    image: '/assets/images/programs/positive-teaching.png',
    link: '/programs/positive-teaching',
    priority: 6,
    topics: [
      'teaching',
      'Positive Teaching',
      'education',
      'pedagogy',
      'educators',
      'wellbeing'
    ]
  },
  {
    id: 'positive-psychology-at-the-workplace',
    slug: 'positive-psychology-at-the-workplace',
    title: 'Positive Psychology at the Workplace',
    subtitle: 'Stress resilience, collaborative leadership & wellbeing.',
    description: 'Enhance professional performance, psychological safety, and meaningful career balance.',
    category: 'WORKPLACE',
    badge: 'Corporate & Career',
    image: '/assets/images/programs/positive-psychology-at-the-workplace.png',
    link: '/programs/positive-psychology-at-the-workplace',
    priority: 7,
    topics: [
      'workplace',
      'career',
      'leadership',
      'productivity',
      'burnout-prevention',
      'mental-wellbeing'
    ]
  },
  {
    id: 'bhagavadgita-for-daily-life',
    slug: 'bhagavadgita-for-daily-life',
    title: 'Bhagavad Gita for a Meaningful Life',
    subtitle: 'Approaching responsibility & everyday life with balance.',
    description: 'Psychological interventions and philosophical insights for inner strength and ethical clarity.',
    category: 'TRANSFORMATION',
    badge: 'Transformational',
    image: '/assets/images/programs/bhagavadgita-for-daily-life.png',
    link: '/programs/bhagavadgita-for-daily-life',
    priority: 8,
    topics: [
      'bhagavad-gita',
      'Bhagavad Gita Wisdom',
      'Indian Wisdom',
      'spirituality',
      'life-purpose'
    ]
  },
  {
    id: 'mind-and-emotional-wellness',
    slug: 'mind-and-emotional-wellness',
    title: 'Mind & Emotional Wellness',
    subtitle: 'Holistic practices to calm anxiety & nurture peace.',
    description: 'Practical self-regulation tools to navigate anxiety, manage overwhelm, and sustain inner calm.',
    category: 'WELLNESS',
    badge: 'Wellness',
    image: '/assets/images/programs/mind-and-emotional-wellness.png',
    link: '/programs/mind-and-emotional-wellness',
    priority: 9,
    topics: [
      'mental-wellbeing',
      'Emotional Wellbeing',
      'anxiety',
      'calmness',
      'mindfulness'
    ]
  }
];

/**
 * Returns intelligent workshop recommendations based on user's selected interest topics
 * and active feed category, falling back gracefully to top flagship workshops.
 *
 * @param {Object} options
 * @param {Array<string>} [options.userTopics] - Array of user interest topic tags
 * @param {string} [options.selectedCategory] - Currently active channel/category
 * @param {number} [options.limit=2] - Number of workshops to return
 * @returns {Array<Object>}
 */
export function getRecommendedWorkshops({ userTopics = [], selectedCategory = 'all', limit = 2 } = {}) {
  const activeTopics = (Array.isArray(userTopics) ? userTopics : [])
    .map(t => String(t).trim().toLowerCase())
    .filter(Boolean);

  const activeCategory = selectedCategory && selectedCategory !== 'all'
    ? String(selectedCategory).trim().toLowerCase()
    : null;

  const scored = COMMUNITY_WORKSHOPS.map(workshop => {
    let score = 0;
    const workshopTopicsLower = workshop.topics.map(t => t.toLowerCase());

    // Category filter in sidebar gives strong intent match
    if (activeCategory) {
      const catMatch = workshopTopicsLower.some(t =>
        t === activeCategory || t.includes(activeCategory) || activeCategory.includes(t)
      );
      if (catMatch) {
        score += 30;
      }
    }

    // Match each of the user's selected interest topics
    for (const ut of activeTopics) {
      const match = workshop.topics.find(t => {
        const tl = t.toLowerCase();
        return tl === ut || tl.includes(ut) || ut.includes(tl);
      });
      if (match) {
        score += 15;
      }
    }

    return {
      ...workshop,
      score
    };
  });

  // Sort descending by match score, then ascending by editorial priority
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.priority - b.priority;
  });

  return scored.slice(0, limit);
}
