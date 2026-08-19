import { homeContent } from "./home.content";

export const aboutContent = {
  header: {
    title: "About us"
  },

  intro: [
    {
      icon: "icon-cel-rings-love",
      title: "Personal Treatment",
      description: "Psychlogical porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur sit",
      borderClass: "border-left"
    },
    {
      icon: "icon-support",
      title: "Urgent Help After Hours",
      description: "Psychlogical porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur sit",
      borderClass: "border-bottom1"
    },
    {
      icon: "icon-checkup-svgrepo",
      title: "Personal relationships",
      description: "Psychlogical porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur sit",
      borderClass: "border-left border-bottom1 border2"
    },
    {
      icon: "icon-aim-target-arrow",
      iconStyle: "style2",
      title: "Reduce anxiety",
      description: "Psychlogical porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur sit",
      borderClass: ""
    }
  ],

  whyChoose: {
    experienceCount: "20",
    experienceLabel: "Year \n Experience ",
    title: "Welcome to \nour physical therapy \nservices",
    text1: "Welcome to Psychological Counseling",
    text2: "Over 20 years’ experience providing top quality therapy across world orem aliqua lonm andhn ipsum therapy services",
    features: [
      "Sed egestas tellus est aliquet eget tristique",
      "Sit amet consectetur adipiscin elites varius monte massa, blandit",
      "Proin ultrices massa arcu scelerisque facilisi egestas eassa"
    ],
    highlights: [
      {
        icon: "icon-idea",
        title: "Amazing \nCounseling Services"
      },
      {
        icon: "icon-brain-svgrepo",
        title: "Innovative \nphysical theraphy"
      }
    ],
    ctaText: "Something know about \nour services",
    ctaBtnText: "Our Counseling",
    ctaBtnLink: "/contact"
  },

  counter: [
    {
      icon: "icon-rating",
      count: "20",
      hasPlus: true,
      label: "Years of experience"
    },
    {
      icon: "icon-award-badge-quality",
      count: "120",
      hasPlus: false,
      label: "Awards Recieved"
    },
    {
      icon: "icon-appreciation-best-marketing",
      count: "3140",
      hasPlus: true,
      label: "Theraphy Issues Solve"
    },
    {
      icon: "icon-mail-message",
      iconStyle: "style2",
      count: "542",
      hasPlus: false,
      label: "Individual Counselling"
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
