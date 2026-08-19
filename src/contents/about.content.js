import { homeContent } from "./home.content";

export const aboutContent = {
  header: {
    title: "About us"
  },

  intro: [
    {
      icon: "fas fa-user-graduate",
      title: "Students",
      description: "Build focus, confidence, self-awareness and healthier habits for learning and everyday life.",
      borderClass: "border-left"
    },
    {
      icon: "fas fa-users",
      title: "Parents & Families",
      description: "Develop thoughtful communication, emotional awareness and healthier relationships within everyday family life.",
      borderClass: "border-bottom1"
    },
    {
      icon: "fas fa-user-tie",
      title: "Professionals & Individuals",
      description: "Strengthen mental fitness, emotional balance and purposeful approaches to work and personal life.",
      borderClass: "border-left border-bottom1 border2"
    },
    {
      icon: "fas fa-university",
      iconStyle: "style2",
      title: "Schools & Organisations",
      description: "Practical mind-training experiences designed for institutions, educators, teams and learning communities.",
      borderClass: ""
    }
  ],

  whyChoose: {
    experienceCount: "3",
    experienceLabel: "Core \n Pillars ",
    title: "Where Psychology \nWisdom and Practice \nCome Together",
    text1: "A practical approach to meaningful living",
    text2: "We combine psychological understanding, Indian perspectives and practical exercises so learning becomes useful in everyday life.",
    features: [
      "Positive Psychology & Research",
      "Indian Wisdom & Perspective",
      "Practical Mind Training"
    ],
    highlights: [
      {
        icon: "fas fa-lightbulb",
        title: "Human-Centred \nLearning"
      },
      {
        icon: "fas fa-brain",
        title: "Everyday \nApplication"
      }
    ],
    ctaText: "Discover what shapes \nour approach",
    ctaBtnText: "Our Approach",
    ctaBtnLink: "/about"
  },

  counter: [
    {
      icon: "icon-rating",
      count: "20000",
      hasPlus: true,
      label: "Individuals reached"
    },
    {
      icon: "icon-award-badge-quality",
      count: "300",
      hasPlus: true,
      label: "Institutions reached"
    },
    {
      icon: "icon-appreciation-best-marketing",
      count: "16",
      hasPlus: true,
      label: "Years of experience"
    },
    {
      icon: "fas fa-book-open",
      iconStyle: "style2",
      count: "15",
      hasPlus: false,
      label: "Books authored"
    }
  ],

  testimonials: {
    tagline: "Client Feedbacks",
    title: "What does the customer \nhave to say?",
    items: [
      {
        text: "Lorem Ipsum available, but the majority have suffered dimply free text Suspe ndisse suscipit sagittis dolore magna aliqua ipsum quia",
        image: "/assets/images/testimonial/testimonial-v1-img1.jpg",
        name: "Robert Anton",
        role: "Therapy Specialist"
      },
      {
        text: "Lorem Ipsum available, but the majority have suffered dimply free text Suspe ndisse suscipit sagittis dolore magna aliqua ipsum quia",
        image: "/assets/images/testimonial/testimonial-v1-img2.jpg",
        name: "Arun Wilan",
        role: "Therapy Specialist"
      },
      {
        text: "Lorem Ipsum available, but the majority have suffered dimply free text Suspe ndisse suscipit sagittis dolore magna aliqua ipsum quia",
        image: "/assets/images/testimonial/testimonial-v1-img3.jpg",
        name: "Kone Arkola",
        role: "Therapy Specialist"
      }
    ]
  },

  therapy: homeContent.therapy,

  team: homeContent.team,

  subscribe: {
    title: "Start your free trial \nright away.",
    text: "Subsrcibe for our upcoming latest articles"
  }
};
