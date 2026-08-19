export const homeContent = {
  // =========================================================
  // 1. HERO SLIDER
  // Purpose:
  // Academy Promise → MindGym → Programs
  // Keep the same 3-slide structure and existing image slots.
  // =========================================================
  slider: [
    {
      bgImage: "/assets/images/slider/slider-v1-img1.jpg",
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
      bgImage: "/assets/images/slider/slider-v1-img2.jpg",
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
      icon: "icon-cel-rings-love",
      title: "Students",
      description:
        "Build focus, confidence, self-awareness and healthier habits for learning and everyday life.",
      borderClass: "border-left",
    },
    {
      icon: "icon-support",
      title: "Parents & Families",
      description:
        "Develop thoughtful communication, emotional awareness and healthier relationships within everyday family life.",
      borderClass: "border-bottom1",
    },
    {
      icon: "icon-checkup-svgrepo",
      title: "Professionals & Individuals",
      description:
        "Strengthen mental fitness, emotional balance and purposeful approaches to work and personal life.",
      borderClass: "border-left border-bottom1 border2",
    },
    {
      icon: "icon-aim-target-arrow",
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
        image: "/assets/images/services/mind-gym.jpg",
        icon: "icon-valentines",
        title: "Mind Gym",
        link: "/mindgym/mind-gym",
        description:
          "Structured mind training for greater awareness, focus, balance and everyday mental fitness.",
        btnText: "Learn More",
        delay: "0.1s",
      },
      {
        image: "/assets/images/services/positive-mind-toolkit.jpg",
        icon: "icon-disappointed-boy",
        title: "Positive Mind Toolkit",
        link: "/mindgym/toolkit",
        description:
          "Simple practical tools for calmness, clarity, focus and challenging everyday mental moments.",
        btnText: "Learn More",
        delay: "0.2s",
      },
      {
        image: "/assets/images/services/positive-mindgym-app.jpg",
        icon: "icon-pediatrics",
        title: "Positive MindGym App",
        link: "/mindgym/app",
        description:
          "Guided mind-training practices supporting regular mental wellbeing wherever everyday life happens.",
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
    title: "Where Psychology \nWisdom and Practice \nCome Together",

    text1: "A practical approach to meaningful living",

    text2:
      "We combine psychological understanding, Indian perspectives and practical exercises so learning becomes useful in everyday life.",

    features: [
      "Positive Psychology & Research",
      "Indian Wisdom & Perspective",
      "Practical Mind Training",
    ],

    highlights: [
      {
        icon: "icon-idea",
        title: "Human-Centred \nLearning",
      },
      {
        icon: "icon-brain-svgrepo",
        title: "Everyday \nApplication",
      },
    ],

    ctaText: "Discover what shapes \nour approach",
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
      {
        image: "/assets/images/case/positive-psychology-meaningful-life.jpg",
        icon: "icon-spa",
        title: "Positive Workshop",
        link: "/positive-workshops",
        description:
          "Evidence-based interactive workshops designed to build healthy thought patterns, emotional resilience, and flourishing lives.",
      },
      {
        image: "/assets/images/case/positive-mentoring.jpg",
        icon: "icon-hands-helping",
        title: "Positive Mentoring",
        link: "/positive-mentoring",
        description:
          "Personalized, one-on-one mentorship programs supporting students, parents, teachers, and professionals for purposeful growth.",
      },
      {
        image: "/assets/images/case/mind-gym.jpg",
        icon: "icon-brain-svgrepo",
        title: "Positive MindGym",
        link: "/mindgym",
        description:
          "Systematic mental training through digital apps, dedicated wellness centres, and practical first-aid toolkits for daily wellbeing.",
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
      icon: "icon-mail-message",
      iconStyle: "style2",
      count: "15",
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
      name: "Naveen Ellangala",
      role: "Founder · Positive Psychologist · Author",
    },
    title: "A journey shaped by \npsychology, wisdom \nand practice",

    leftItems: [
      {
        icon: "icon-checkup-svgrepo",
        title: "Positive Psychologist & Life Coach",
        description:
          "Over 16 years of work exploring the mind, wellbeing, personal growth and practical approaches to meaningful living.",
        delay: "100ms",
      },
      {
        icon: "icon-brain-svgrepo2",
        title: "Author, Researcher & Educator",
        description:
          "Author of 15 books, with research connecting Positive Psychology, Indian wisdom and contemporary approaches to human wellbeing.",
        delay: "200ms",
      },
    ],

    rightBox: {
      icon: "icon-brain-svgrepo",
      title: "Creator of Mind Gym & \nPositive Mind Toolkit",
      description:
        "Practical mind-training frameworks created to turn psychological understanding into awareness, healthier mental habits and everyday practice.",
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
    tagline: "Client Feedbacks",
    title: "What does the customer \nhave to say?",
    items: [
      {
        text: "Naveen’s sessions gave me a clearer perspective on life, relationships, and personal growth. His practical approach made positive thinking simple and meaningful.",
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
        text: "Naveen’s guidance helped our team build stronger communication and a positive mindset. The sessions were engaging, practical, and genuinely impactful.",
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
        text: "The session offered a fresh perspective on personal development and mental wellbeing. Naveen explains complex ideas in a simple and inspiring way.",
        image: "/assets/images/testimonial/testimonial-v1-img2.jpg",
        name: "Suresh Bhat",
        role: "Program Participant",
      },
      {
        text: "Naveen’s workshop created meaningful changes in the way I think and respond to situations. His practical wisdom continues to influence both my personal and professional life.",
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
        name: "Naveen Ellangala",
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
        image: "/assets/images/blog/blog-mind-gym.png",
        category: "Positive Psychology",
        day: "25",
        monthYear: "Apr 22",
        author: "By Admin",
        comments: "12 Comment",
        title: "Strengthening Mental Fitness: The Science of Positive Mind Gym & Emotional Hygiene",
        link: "/blog-details?id=strengthening-mental-fitness-mind-gym",
        btnText: "Read More",
        description:
          "Just as regular physical workouts build bodily stamina, proactive mental fitness conditioning transforms how we process daily stress, emotional turbulence, and personal challenges.",
        animation: "fadeInLeft",
      },
      {
        image: "/assets/images/blog/blog-ancient-wisdom.png",
        category: "Ancient Wisdom",
        day: "25",
        monthYear: "Apr 23",
        author: "By Admin",
        comments: "12 Comment",
        title: "Integrating Ancient Indian Wisdom with Modern Positive Psychology for Meaningful Living",
        link: "/blog-details?id=integrating-ancient-wisdom-modern-psychotherapy",
        btnText: "Read More",
        description:
          "Discover how the profound principles of the Bhagavad Gita and Indian psychological traditions harmonize seamlessly with contemporary cognitive-behavioral science to guide purposeful living.",
        animation: "fadeInRight",
      },
    ],
  },
};
