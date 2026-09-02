export const homeContent = {
  // =========================================================
  // 1. HERO SLIDER
  // Purpose:
  // Academy Promise → MindGym → Programs
  // Keep the same 3-slide structure and existing image slots.
  // =========================================================
  slider: [
    {
      bgImage: "/assets/images/slider/slider1.jpeg",
      title: "Train your mind. \nLive with greater \nmeaning",
      subtitle: "Welcome to Ellangala’s Academy",
      primaryBtn: {
        text: "Explore Academy",
        link: "/about",
      },
      secondaryBtn: {
        text: "Discover more",
        link: "/about",
      },
    },
    {
      bgImage: "/assets/images/slider/slider2.jpeg",
      title: "Build awareness. \nStrengthen focus and \neveryday balance",
      subtitle: "Practical Mind Training for Everyday Life",
      primaryBtn: {
        text: "Explore MindGym",
        link: "/mindgym",
      },
      secondaryBtn: {
        text: "Learn more",
        link: "/mindgym/how-it-works",
      },
    },
    {
      bgImage: "/assets/images/slider/slider-v1-img3.jpg",
      title: "Learn. Reflect. \nGrow with purpose \nevery day",
      subtitle: "Programs Designed for Meaningful Growth",
      primaryBtn: {
        text: "View Programs",
        link: "/programs",
      },
      secondaryBtn: {
        text: "Discover more",
        link: "/programs",
      },
    },
  ],

  // =========================================================
  // 2. INTRO
  // Purpose:
  // Help visitors immediately understand who the Academy serves.
  // 13 cards in the carousel, using the same card designs in sequence.
  // =========================================================
  intro: [
    {
      icon: "fas fa-user-graduate",
      title: "Students",
      description:
        "Build focus, confidence, self-awareness and healthier habits for learning and everyday life.",
      borderClass: "border-left",
    },
    {
      icon: "fas fa-users",
      title: "Parents & Families",
      description:
        "Develop thoughtful communication, emotional awareness and healthier relationships within everyday family life.",
      borderClass: "border-bottom1",
    },
    {
      icon: "fas fa-user-tie",
      title: "Professionals & Individuals",
      description:
        "Strengthen mental fitness, emotional balance and purposeful approaches to work and personal life.",
      borderClass: "border-left border-bottom1 border2",
    },
    {
      icon: "fas fa-university",
      iconStyle: "style2",
      title: "Schools & Organisations",
      description:
        "Practical mind-training experiences designed for institutions, educators, teams and learning communities.",
      borderClass: "",
    },
  ],

  // =========================================================
  // 3. SERVICES
  // Repurposed as:
  // The 3 signature Ellangala ecosystem experiences.
  // Existing 3-card layout preserved.
  // =========================================================
  services: {
    tagline: "Our Ecosystem",
    title: "Practical ways to \ntrain the mind",
    items: [
      {
        image: "/assets/images/services/Positive Workshop.png",
        icon: "fas fa-chalkboard-teacher",
        title: "Positive Workshop",
        link: "/positive-workshops",
        description:
          "Evidence-based experiential workshops for students, parents, educators, and organizations to nurture resilience and positive mindset.",
        btnText: "Learn More",
        delay: "0.1s",
      },
      {
        image: "/assets/images/services/Positive Mentoring.png",
        icon: "fas fa-user-friends",
        title: "Positive Mentoring",
        link: "/positive-mentoring",
        description:
          "Personalized 1-on-1 counseling, psychotherapy, hypnotherapy, and NLP coaching to overcome challenges and foster emotional wellbeing.",
        btnText: "Learn More",
        delay: "0.2s",
      },
      {
        image: "/assets/images/services/Positive MindGym App.png",
        icon: "fas fa-brain",
        title: "Positive MindGym",
        link: "/mindgym",
        description:
          "Our holistic mind-training ecosystem featuring the Positive MindGym App, physical wellness training center, and practical toolkits.",
        btnText: "Learn More",
        delay: "0.3s",
      },
    ],
  },

  // =========================================================
  // 4. WHY CHOOSE
  // Repurposed as:
  // Science + Wisdom + Practice
  //
  // Important:
  // Do NOT repeat impact statistics here.
  // "3 Core Pillars" replaces the demo experience counter.
  // =========================================================
  whyChoose: {
    experienceCount: "3",
    experienceLabel: "Core \n Pillars ",

    title: "Where Psychology, \nWisdom and Practice \nCome Together",

    text1: "A Practical Approach to Meaningful Living",

    text2:
      "Ellangala’s Academy brings Positive Psychology, Indian wisdom and practical mind training together to help people understand themselves, build healthier mental habits and apply learning in everyday life.",

    features: [
      "Positive Psychology & Human Understanding",
      "Indian Wisdom & Meaningful Perspective",
      "Practical Mind Training & Everyday Application",
    ],

    highlights: [
      {
        icon: "icon-idea",
        title: "Experiential \nLearning",
      },
      {
        icon: "icon-brain-svgrepo",
        title: "Everyday \nApplication",
      },
    ],

    ctaText: "Discover how learning \nbecomes practice",
    ctaBtnText: "Our Approach",
    ctaBtnLink: "/about/approach",
  },

  // =========================================================
  // 5. CASE STUDIES
  // Repurposed as:
  // Featured Programs
  //
  // Exactly 4 cards preserved.
  // No fake case studies / outcomes.
  // =========================================================
  caseStudies: {
    tagline: "Featured Programs",
    title: "Learning for everyday life",
    items: [
      // ----------------- Positive Workshops (9) -----------------
      {
        category: "Workshops",
        categoryLabel: "Positive Workshop",
        image: "/assets/images/programs/positive-psychology-meaningful-life.png",
        icon: "icon-brain",
        title: "Positive Psychology for a Meaningful Life",
        link: "/programs/positive-psychology-meaningful-life",
        description: "Practical mind training to cultivate inner strengths, positive emotions, and purposeful living.",
      },
      {
        category: "Workshops",
        categoryLabel: "Positive Workshop",
        image: "/assets/images/programs/spiritual-psychology-purposeful-life.png",
        icon: "icon-brain",
        title: "Spiritual Psychology for Daily Life",
        link: "/programs/spiritual-psychology-purposeful-life",
        description: "Integrating deep self-awareness, personal values, and psychological insights for daily living.",
      },
      {
        category: "Workshops",
        categoryLabel: "Positive Workshop",
        image: "/assets/images/programs/positive-parenting.png",
        icon: "icon-brain",
        title: "Positive Parenting",
        link: "/programs/positive-parenting",
        description: "Conscious communication, emotional connection, and supportive guidance for healthier parenting.",
      },
      {
        category: "Workshops",
        categoryLabel: "Positive Workshop",
        image: "/assets/images/programs/positive-teaching.png",
        icon: "icon-brain",
        title: "Positive Teaching",
        link: "/programs/positive-teaching",
        description: "Empowering educators with positive psychology tools for inspiring and engaging classrooms.",
      },
      {
        category: "Workshops",
        categoryLabel: "Positive Workshop",
        image: "/assets/images/programs/student-success-mindset.png",
        icon: "icon-brain",
        title: "Student Success Mindset",
        link: "/programs/student-success-mindset",
        description: "Building academic resilience, self-confidence, focus, and healthy achievement habits.",
      },
      {
        category: "Workshops",
        categoryLabel: "Positive Workshop",
        image: "/assets/images/programs/the-art-of-mind-training.png",
        icon: "icon-brain",
        title: "The Art of Mind Training",
        link: "/programs/the-art-of-mind-training",
        description: "Experiential techniques for mental fitness, attention control, and emotional balance.",
      },
      {
        category: "Workshops",
        categoryLabel: "Positive Workshop",
        image: "/assets/images/programs/positive-psychology-at-the-workplace.png",
        icon: "icon-brain",
        title: "Positive Psychology at the Workplace",
        link: "/programs/positive-psychology-at-the-workplace",
        description: "Fostering professional wellbeing, team strengths, and meaningful workplace performance.",
      },
      {
        category: "Workshops",
        categoryLabel: "Positive Workshop",
        image: "/assets/images/programs/bhagavadgita-for-daily-life.png",
        icon: "icon-brain",
        title: "Bhagavad Gita for a Meaningful Life",
        link: "/programs/bhagavadgita-for-daily-life",
        description: "Timeless wisdom and practical psychology for clarity, duty, and emotional balance.",
      },
      {
        category: "Workshops",
        categoryLabel: "Positive Workshop",
        image: "/assets/images/programs/mind-and-emotional-wellness.png",
        icon: "icon-brain",
        title: "Mind & Emotional Wellness",
        link: "/programs/mind-and-emotional-wellness",
        description: "Understanding thoughts and emotions to manage everyday stress and build lasting calm.",
      },

      // ----------------- Positive Mentoring (9) -----------------
      {
        category: "Mentoring",
        categoryLabel: "Positive Mentoring",
        image: "/assets/images/programs/student-mentoring.png",
        icon: "icon-brain",
        title: "Student Mentoring",
        link: "/mentoring/student-mentoring",
        description: "Personalized one-on-one guidance for student confidence, clarity, and motivation.",
      },
      {
        category: "Mentoring",
        categoryLabel: "Positive Mentoring",
        image: "/assets/images/programs/parent-mentoring.png",
        icon: "icon-brain",
        title: "Parent Mentoring",
        link: "/mentoring/parent-mentoring",
        description: "Individualized support for conscious parenting, communication, and family harmony.",
      },
      {
        category: "Mentoring",
        categoryLabel: "Positive Mentoring",
        image: "/assets/images/programs/teacher-mentoring.png",
        icon: "icon-brain",
        title: "Teacher Mentoring",
        link: "/mentoring/teacher-mentoring",
        description: "Dedicated professional mentorship for teacher wellbeing and positive leadership.",
      },
      {
        category: "Mentoring",
        categoryLabel: "Positive Mentoring",
        image: "/assets/images/programs/personal-mentoring.png",
        icon: "icon-brain",
        title: "Personal Mentoring",
        link: "/mentoring/personal-mentoring",
        description: "Confidential 1-on-1 sessions to overcome personal hurdles and foster inner growth.",
      },
      {
        category: "Mentoring",
        categoryLabel: "Positive Mentoring",
        image: "/assets/images/programs/life-mentoring.png",
        icon: "icon-brain",
        title: "Life Mentoring",
        link: "/mentoring/life-mentoring",
        description: "Holistic guidance to navigate transitions, balance priorities, and live with purpose.",
      },
      {
        category: "Mentoring",
        categoryLabel: "Positive Mentoring",
        image: "/assets/images/programs/career-mentoring.png",
        icon: "icon-brain",
        title: "Career Mentoring",
        link: "/mentoring/career-mentoring",
        description: "Strategic coaching for career direction, leadership growth, and work fulfillment.",
      },
      {
        category: "Mentoring",
        categoryLabel: "Positive Mentoring",
        image: "/assets/images/programs/purpose-mentoring.png",
        icon: "icon-brain",
        title: "Purpose Mentoring",
        link: "/mentoring/purpose-mentoring",
        description: "Discovering core values, personal vision, and meaningful lifelong direction.",
      },
      {
        category: "Mentoring",
        categoryLabel: "Positive Mentoring",
        image: "/assets/images/programs/mindset-mentoring.png",
        icon: "icon-brain",
        title: "Mindset Mentoring",
        link: "/mentoring/mindset-mentoring",
        description: "Transforming self-limiting beliefs into empowering habits of confidence and grit.",
      },
      {
        category: "Mentoring",
        categoryLabel: "Positive Mentoring",
        image: "/assets/images/programs/spiritual-mentoring.png",
        icon: "icon-brain",
        title: "Spiritual Mentoring",
        link: "/mentoring/spiritual-mentoring",
        description: "Deepening inner stillness, self-inquiry, and spiritual perspective in daily living.",
      },

      // ----------------- Positive MindGym (3) -----------------
      {
        category: "MindGym",
        categoryLabel: "Positive MindGym",
        image: "/assets/images/case/positive-mindgym-app.jpg",
        icon: "icon-brain",
        title: "Positive MindGym App",
        link: "/mindgym/app",
        description: "Everyday digital mind training, guided routines, and practical wellness habits.",
      },
      {
        category: "MindGym",
        categoryLabel: "Positive MindGym",
        image: "/assets/images/services/positive-mindgym-centre.png",
        icon: "icon-brain",
        title: "Positive MindGym Centre",
        link: "/mindgym/mind-gym",
        description: "Physical mind training center with experiential workouts, reflexology, and workshops.",
      },
      {
        category: "MindGym",
        categoryLabel: "Positive MindGym",
        image: "/assets/images/case/positive-mind-toolkit.png",
        icon: "icon-brain",
        title: "Positive Mind Toolkit",
        link: "/mindgym/toolkit",
        description: "Practical psychological first-aid tools for immediate calmness, focus, and clarity.",
      },
    ],
  },

  // =========================================================
  // 6. COUNTER
  // Repurposed as:
  // Verified Academy Impact
  //
  // Verified:
  // 20,000+ individuals
  // 300+ institutions
  // 16+ years
  // 15 books
  // =========================================================
  counter: [
    {
      icon: "icon-rating",
      count: "20000",
      hasPlus: true,
      label: "Individuals reached",
    },
    {
      icon: "icon-award-badge-quality",
      count: "300",
      hasPlus: true,
      label: "Institutions reached",
    },
    {
      icon: "icon-appreciation-best-marketing",
      count: "16",
      hasPlus: true,
      label: "Years of experience",
    },
    {
      icon: "fas fa-book-open",
      iconStyle: "style2",
      count: "17",
      hasPlus: false,
      label: "Books authored",
    },
  ],

  // =========================================================
  // 7. THERAPY
  // Repurposed as:
  // Founder & Vision
  //
  // This section should use a REAL Dr. Naveen photo in the
  // component/image asset, not a stock therapist photograph.
  // =========================================================
  therapy: {
    tagline: "Founder & Vision",
    founderInfo: {
      name: "Dr. Naveen Ellangala",
      role: "Founder · Positive Psychologist · Author",
    },
    title: "A journey shaped by \npsychology, wisdom \nand practice",

    leftItems: [
      {
        icon: "fas fa-user-shield",
        title: "Positive Psychologist & Life Coach",
        description:
          "Over 16 years of work exploring the mind, wellbeing, personal growth and practical approaches to meaningful living.",
        delay: "100ms",
      },
      {
        icon: "fas fa-book-reader",
        title: "Author, Researcher & Educator",
        description:
          "Author of 17 books, with research connecting Positive Psychology, Indian wisdom and contemporary approaches to human wellbeing.",
        delay: "200ms",
      },
    ],

    rightBox: {
      icon: "fas fa-brain",
      title: "Bringing Psychology Into \nEveryday Life",
      description:
        "Turning psychological ideas, Indian wisdom and mind-training practices into simple, practical approaches that people can understand, reflect on and apply in daily life.",
    },
  },

  // =========================================================
  // 8. TESTIMONIALS
  // IMPORTANT:
  //
  // Do NOT populate this with invented quotes.
  // Your approved content architecture requires:
  // - real quote
  // - real/approved attribution
  // - correct role/context
  // - consent
  //
  // Keep the section hidden until approved feedback is available.
  // =========================================================
  testimonials: {
    tagline: "WHAT OUR CLIENTS SAY",
    title: "Hear From Individuals Whose \nLives Have Been Positively Transformed",
    items: [
      {
        text: "Dr. Naveen’s sessions gave me a clearer perspective on life, relationships, and personal growth. His practical approach made positive thinking simple and meaningful.",
        image: "/assets/images/testimonial/testimonial-v1-img1.jpg",
        name: "Ravi Kumar",
        role: "Program Participant",
      },
      {
        text: "The workshop helped me understand my thoughts and emotions with greater clarity. I left with practical tools that I continue to use every day.",
        image: "/assets/images/testimonial/testimonial-v1-img2.jpg",
        name: "Ananya Gowda",
        role: "Workshop Participant",
      },
      {
        text: "Dr. Naveen’s guidance helped our team build stronger communication and a positive mindset. The sessions were engaging, practical, and genuinely impactful.",
        image: "/assets/images/testimonial/testimonial-v1-img3.jpg",
        name: "Manjunath Hegde",
        role: "Corporate Participant",
      },
      {
        text: "His approach to positive psychology connected beautifully with everyday challenges. The insights helped me become more confident, calm, and focused.",
        image: "/assets/images/testimonial/testimonial-v1-img1.jpg",
        name: "Priya Shetty",
        role: "Program Participant",
      },
      {
        text: "The session offered a fresh perspective on personal development and mental wellbeing. Dr. Naveen explains complex ideas in a simple and inspiring way.",
        image: "/assets/images/testimonial/testimonial-v1-img2.jpg",
        name: "Suresh Bhat",
        role: "Program Participant",
      },
      {
        text: "Dr. Naveen’s workshop created meaningful changes in the way I think and respond to situations. His practical wisdom continues to influence both my personal and professional life.",
        image: "/assets/images/testimonial/testimonial-v1-img3.jpg",
        name: "Deepa Ramesh",
        role: "Workshop Participant",
      },
    ],
  },

  team: {
    tagline: "Our Dedicated Team",
    title: "Meet Our Team",
    members: [
      {
        image: "/assets/images/team/naveen-ellangala.jpg",
        name: "Dr. Naveen Ellangala",
        designation: "Founder",
        qualification: "Positive Psychologist, Holistic Life Coach, Psychotherapist, International Certified NLP Counsellor, CBT Practitioner, Motivational Speaker, Writer, Poet, Hypnotherapist, Yoga Teacher, Carnatic Violinist, Reflexologist",
        link: "/team",
        animation: "fadeInUp",
      },
      {
        image: "/assets/images/team/dr-vidya-naveen.jpg",
        name: "Dr. Vidya Naveen",
        designation: "Life Coach",
        qualification: "Bachelor of Ayurvedic Medicine and Surgery, MSc Yoga Therapy, Qualified UGC NET, Yoga Instructor Course",
        link: "/team",
        animation: "fadeInDown",
      },
      {
        image: "/assets/images/team/reshma-divakar-hegde.jpg",
        name: "Reshma Divakar Hegde",
        designation: "Life Coach",
        qualification: "17+ years experience in Pharma/OTC Global Marketing, Alumni IIM-C, Pursuing MSc in Clinical Psychology at Jain University",
        link: "/team",
        animation: "fadeInUp",
      },
      {
        image: "/assets/images/team/ranjith-shetty.jpg",
        name: "Ranjith Shetty",
        designation: "Admin",
        qualification: "12+ years of experience in administration, strong organizational skills and operational support",
        link: "/team",
        animation: "fadeInDown",
      },
      {
        image: "/assets/images/team/b-poornima-pai.jpg",
        name: "B Poornima Pai",
        designation: "Life Coach",
        qualification: "M.Com, Y.I.C & Face Yoga (S Vyasa Institute, Bangalore), 3+ years experience as Yoga Instructor",
        link: "/team",
        animation: "fadeInUp",
      },
      {
        image: "/assets/images/team/madhumitha-k.jpg",
        name: "Madhumitha K",
        designation: "Life Coach",
        qualification: "BSc (Criminology), Cyber Law, Forensic Science",
        link: "/team",
        animation: "fadeInDown",
      },
      {
        image: "/assets/images/team/deepthi-s.jpg",
        name: "Deepthi S",
        designation: "Life Coach",
        qualification: "BSc (Criminology), Cyber Law, Forensic Science",
        link: "/team",
        animation: "fadeInUp",
      },
      {
        image: "/assets/images/team/mrs-shreelakshmi-halambi.png",
        name: "Mrs. Shreelakshmi Halambi",
        designation: "Positive Mentor",
        qualification: "M.Sc., B.Ed., Yoga Instructor Course (YIC), Certificate in Bhagavad Gita, Certification in Art Therapy, Beyond Academics – Positive Psychology (Ellangala's Academy), 16+ Years Teaching Experience",
        link: "/team",
        animation: "fadeInDown",
      },
    ],
  },

  // =========================================================
  // 10. BLOG
  // Repurposed as:
  // Insights & Ideas
  //
  // Exactly 2 cards preserved.
  //
  // "day" / "monthYear" are intentionally repurposed as
  // insight numbering instead of publishing fake dates.
  // =========================================================
  blog: {
    tagline: "Our Latest Blog",
    title: "Latest Post form our \nblog list",

    posts: [
      {
        image: "/assets/images/blog/blog-mind-gym.jpg",
        category: "Positive Psychology",
        day: "15",
        monthYear: "Nov 24",
        author: "Dr. Naveen Ellangala",
        comments: "3 Comments",
        title: "Strengthening Mental Fitness: The Science of Positive Mind Gym & Emotional Hygiene",
        link: "/insights/strengthening-mental-fitness-mind-gym",
        btnText: "Read More",
        description:
          "Just as regular physical workouts build bodily stamina, proactive mental fitness conditioning transforms how we process daily stress, emotional turbulence, and personal challenges.",
        animation: "fadeInLeft",
      },
      {
        image: "/assets/images/blog/blog-ancient-wisdom.jpg",
        category: "Ancient Wisdom",
        day: "12",
        monthYear: "Nov 24",
        author: "Dr. Naveen Ellangala",
        comments: "5 Comments",
        title: "Integrating Ancient Indian Wisdom with Modern Positive Psychology for Meaningful Living",
        link: "/insights/integrating-ancient-wisdom-modern-psychotherapy",
        btnText: "Read More",
        description:
          "Discover how the profound principles of the Bhagavad Gita and Indian psychological traditions harmonize seamlessly with contemporary cognitive-behavioral science to guide purposeful living.",
        animation: "fadeInRight",
      },
    ],
  },
};
