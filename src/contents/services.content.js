import { homeContent } from './home.content';

export const servicesContent = {
  header: {
    title: "Our Services & Programs",
    breadcrumb: "Services"
  },

  servicesOne: homeContent.caseStudies.items.map((item, index) => ({
    title: item.title,
    link: item.link,
    img: item.image,
    icon: item.icon || "icon-brain-svgrepo",
    description: item.description,
    btnText: "Learn More",
    delay: `${((index % 3) + 1) * 0.1}s`
  })),

  servicesTwo: homeContent.caseStudies.items.map((item, index) => ({
    title: item.title,
    link: item.link,
    img: item.image,
    icon: item.icon || "icon-brain-svgrepo",
    delay: `${(index % 3) * 100}ms`,
    dir: index % 2 === 0 ? "fadeInLeft" : "fadeInRight"
  })),

  cta: {
    tagline: "Take The Next Step",
    title: "Ready to Transform Your Mental Fitness & Well-Being?",
    description: "Whether you are looking for personalized counseling, structured Mind Gym workshops, or academic & corporate training programs, we are here to support your journey.",
    btnText: "Book an Appointment",
    btnLink: "/contact",
    secondaryBtnText: "Explore Mind Gym",
    secondaryBtnLink: "/mindgym/mind-gym",
    phoneText: "Direct Counseling Line",
    phoneNumber: "+91 99000 00000",
    features: [
      "Evidence-based Positive Psychology frameworks",
      "Personalized 1-on-1 Guidance & Mind Training",
      "Experiential Student, Family & Corporate Workshops"
    ]
  }
};
