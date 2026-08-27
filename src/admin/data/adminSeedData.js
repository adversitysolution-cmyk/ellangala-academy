// Seed data for Ellangala's Academy Admin Dashboard (Demo / Testing Mode)

export const initialEnrollments = [
  {
    id: "ENR-2026-0001",
    fullName: "Aarav Sharma",
    phone: "98765 43210",
    email: "aarav.sharma@example.com",
    city: "Bengaluru",
    interest: "Positive Parenting",
    type: "Workshop",
    message: "Interested in the upcoming weekend batch for parents of teenagers.",
    status: "New",
    submittedAt: "2026-08-22T14:30:00Z",
    updatedAt: "2026-08-22T14:30:00Z",
    internalNotes: "Prefers morning slots on Saturdays."
  },
  {
    id: "ENR-2026-0002",
    fullName: "Priya Venkatesh",
    phone: "98450 12345",
    email: "priya.v@example.com",
    city: "Mysuru",
    interest: "Student Mentoring",
    type: "Mentoring",
    message: "Looking for 1-on-1 exam anxiety mentoring for my 10th grade daughter.",
    status: "Contacted",
    submittedAt: "2026-08-21T10:15:00Z",
    updatedAt: "2026-08-21T16:20:00Z",
    internalNotes: "Spoke via phone. Sent orientation PDF to email."
  },
  {
    id: "ENR-2026-0003",
    fullName: "Rajesh Kulkarni",
    phone: "99001 88776",
    email: "rajesh.k@example.com",
    city: "Hubballi",
    interest: "Positive Psychology at the Workplace",
    type: "Workshop",
    message: "Corporate workshop inquiry for a team of 25 software engineers.",
    status: "Follow-Up",
    submittedAt: "2026-08-20T18:45:00Z",
    updatedAt: "2026-08-21T11:00:00Z",
    internalNotes: "Proposal sent on 21st Aug. Scheduled follow-up call for Monday."
  },
  {
    id: "ENR-2026-0004",
    fullName: "Sunita Reddy",
    phone: "94480 55443",
    email: "sunita.reddy@example.com",
    city: "Bengaluru",
    interest: "The Art of Mind Training",
    type: "Workshop",
    message: "Wanted to confirm if online participation is available.",
    status: "Enrolled",
    submittedAt: "2026-08-19T09:00:00Z",
    updatedAt: "2026-08-19T14:10:00Z",
    internalNotes: "Payment confirmed. Added to August online cohort."
  },
  {
    id: "ENR-2026-0005",
    fullName: "Kiran Deshmukh",
    phone: "98220 99881",
    email: "kiran.d@example.com",
    city: "Belagavi",
    interest: "Career Mentoring",
    type: "Mentoring",
    message: "Mid-career transition guidance needed.",
    status: "Closed",
    submittedAt: "2026-08-15T11:20:00Z",
    updatedAt: "2026-08-18T16:00:00Z",
    internalNotes: "Completed 3 1-on-1 mentoring sessions."
  }
];

export const initialOrders = [
  {
    id: "ORD-2026-0001",
    customer: {
      firstName: "Ananya",
      lastName: "Rao",
      email: "ananya.rao@example.com",
      phone: "99800 11223"
    },
    shippingAddress: {
      streetAddress: "#142, 4th Main, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      zipcode: "560038",
      country: "India"
    },
    items: [
      {
        id: 1,
        title: "Positive Psychology Handbook",
        quantity: 1,
        unitPrice: 450,
        subtotal: 450,
        image: "/assets/images/shop/shop-product-1.jpg"
      },
      {
        id: 2,
        title: "Mind Training & Meditation Journal",
        quantity: 2,
        unitPrice: 350,
        subtotal: 700,
        image: "/assets/images/shop/shop-product-2.jpg"
      }
    ],
    subtotal: 1150,
    shipping: 50,
    discount: 0,
    total: 1200,
    paymentStatus: "Paid",
    orderStatus: "Processing",
    createdAt: "2026-08-22T11:20:00Z",
    updatedAt: "2026-08-22T11:25:00Z",
    internalNotes: "Packed and ready for dispatch via BlueDart courier."
  },
  {
    id: "ORD-2026-0002",
    customer: {
      firstName: "Vikram",
      lastName: "Patil",
      email: "vikram.patil@example.com",
      phone: "98441 22334"
    },
    shippingAddress: {
      streetAddress: "Flat 302, Green Acres, College Road",
      city: "Dharwad",
      state: "Karnataka",
      zipcode: "580001",
      country: "India"
    },
    items: [
      {
        id: 3,
        title: "Bhagavad Gita for Daily Life",
        quantity: 1,
        unitPrice: 599,
        subtotal: 599,
        image: "/assets/images/shop/shop-product-3.jpg"
      }
    ],
    subtotal: 599,
    shipping: 50,
    discount: 50,
    total: 599,
    paymentStatus: "Pending",
    orderStatus: "New",
    createdAt: "2026-08-21T15:40:00Z",
    updatedAt: "2026-08-21T15:40:00Z",
    internalNotes: "Cash on delivery order. Customer phone verified."
  },
  {
    id: "ORD-2026-0003",
    customer: {
      firstName: "Meera",
      lastName: "Nambiar",
      email: "meera.n@example.com",
      phone: "97312 44556"
    },
    shippingAddress: {
      streetAddress: "No. 88, VV Puram",
      city: "Mysuru",
      state: "Karnataka",
      zipcode: "570002",
      country: "India"
    },
    items: [
      {
        id: 4,
        title: "Positive Parenting Guidebook",
        quantity: 1,
        unitPrice: 399,
        subtotal: 399,
        image: "/assets/images/shop/shop-product-4.jpg"
      }
    ],
    subtotal: 399,
    shipping: 50,
    discount: 0,
    total: 449,
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    createdAt: "2026-08-20T12:10:00Z",
    updatedAt: "2026-08-21T09:00:00Z",
    internalNotes: "Shipped via DTDC tracking #DT992812."
  },
  {
    id: "ORD-2026-0004",
    customer: {
      firstName: "Siddharth",
      lastName: "Joshi",
      email: "sid.joshi@example.com",
      phone: "98860 33445"
    },
    shippingAddress: {
      streetAddress: "Plot 12, Vidyanagar",
      city: "Hubballi",
      state: "Karnataka",
      zipcode: "580021",
      country: "India"
    },
    items: [
      {
        id: 1,
        title: "Positive Psychology Handbook",
        quantity: 2,
        unitPrice: 450,
        subtotal: 900,
        image: "/assets/images/shop/shop-product-1.jpg"
      }
    ],
    subtotal: 900,
    shipping: 0,
    discount: 100,
    total: 800,
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    createdAt: "2026-08-18T10:00:00Z",
    updatedAt: "2026-08-20T14:30:00Z",
    internalNotes: "Delivered successfully."
  },
  {
    id: "ORD-2026-0005",
    customer: {
      firstName: "Deepa",
      lastName: "Hegde",
      email: "deepa.hegde@example.com",
      phone: "94498 77665"
    },
    shippingAddress: {
      streetAddress: "Main Road, Sirsi",
      city: "Uttara Kannada",
      state: "Karnataka",
      zipcode: "581401",
      country: "India"
    },
    items: [
      {
        id: 2,
        title: "Mind Training & Meditation Journal",
        quantity: 1,
        unitPrice: 350,
        subtotal: 350,
        image: "/assets/images/shop/shop-product-2.jpg"
      }
    ],
    subtotal: 350,
    shipping: 50,
    discount: 0,
    total: 400,
    paymentStatus: "Cancelled",
    orderStatus: "Cancelled",
    createdAt: "2026-08-15T16:30:00Z",
    updatedAt: "2026-08-16T11:00:00Z",
    internalNotes: "Cancelled by customer before dispatch."
  }
];
