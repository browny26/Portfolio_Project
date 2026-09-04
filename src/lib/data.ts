export type CaseStudyImage = {
  src: string;
  alt: string;
  /** CSS aspect-ratio value, e.g. "16/9" */
  aspect: string;
};

export type CaseStudy = {
  tagline: string;
  role: string;
  client: string;
  timeline: string;
  hero: CaseStudyImage;
  overview: string[];
  challenge: { intro: string; constraints: string[] };
  process: { title: string; body: string; image: CaseStudyImage }[];
  decisions: { title: string; why: string; tradeoff: string }[];
  results: { value: string; label: string }[];
  gallery: CaseStudyImage[];
  learnings: string[];
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  description: string;
  tech: string[];
  image: string;
  links: { live?: string; repo?: string; design?: string };
  color: string;
  caseStudy?: CaseStudy;
};

const atlasCaseStudy: CaseStudy = {
  tagline:
    "An AI-powered travel planner that turns a destination and a few preferences into a day-by-day itinerary, backed by real flight data.",
  role: "Full Stack Developer",
  client: "Side project",
  timeline: "2024",
  hero: {
    src: "/imgs/mockupAtlas.jpeg",
    alt: "Atlas dashboard shown on a laptop mockup",
    aspect: "16/9",
  },
  overview: [
    "Atlas is a full-stack travel planning platform I designed and built end to end. You pick a destination, set dates and preferences, and Atlas generates a complete itinerary with AI, then layers real flight data on top so the plan is something you can actually book.",
    "I owned the whole product: the React front-end, the Java Spring Boot REST API, the PostgreSQL database on Supabase, authentication with JWT and Google OAuth, and the AI pipeline. It started as a way to see how far I could push LLMs inside a real application, and it became the project where I learned the most about performance.",
  ],
  challenge: {
    intro:
      "Trip planning is fragmented: flights on one site, ideas scattered across blogs and maps, and no single place that turns a vague idea into a concrete plan. The goal was to build that place. The hard part was making AI generation fast enough to feel like a product feature instead of a demo.",
    constraints: [
      "The first AI stack took over five minutes to generate a single itinerary",
      "Flight data had to be real, through the Amadeus API, with its own auth flow and rate limits",
      "Sign-in needed both email and password and Google OAuth, on a solo project with no budget",
    ],
  },
  process: [
    {
      title: "Designing the flow",
      body: "I mapped the journey before writing code: sign in, choose a destination, tune preferences, generate, refine. Each screen answers one question, so the AI step never feels like a black box.",
      image: {
        src: "/imgs/atlas-pages.png",
        alt: "Overview of the main Atlas screens",
        aspect: "4/3",
      },
    },
    {
      title: "Building the API and the data model",
      body: "The Spring Boot back-end exposes a REST API for users, trips and itineraries, with PostgreSQL on Supabase. Flight lookups through Amadeus live in their own service, isolated from the AI calls, so each integration can change without touching the other.",
      image: {
        src: "/imgs/atlas-dashboard.png",
        alt: "Atlas dashboard with saved trips",
        aspect: "3/2",
      },
    },
    {
      title: "Making the AI fast",
      body: "The first version ran Python with Ollama and a local Mistral model. It worked, but one itinerary took over five minutes. I moved inference to Groq and OpenAI and reworked the prompts around that, cutting response time to a few seconds.",
      image: {
        src: "/imgs/atlas-itinerary-generator.png",
        alt: "Atlas itinerary generator screen",
        aspect: "3/2",
      },
    },
  ],
  decisions: [
    {
      title: "Groq and OpenAI instead of a local model",
      why: "Local inference was free but far too slow for an interactive flow. Hosted models made generation near-instant and let me pick the right model for each step.",
      tradeoff: "The app now depends on external providers and pays per request.",
    },
    {
      title: "JWT plus Google OAuth",
      why: "Email and password with JWT keeps the API stateless, while Google OAuth removes friction for people who just want to try the app.",
      tradeoff: "Two sign-in paths mean twice the edge cases to handle and test.",
    },
    {
      title: "Real flights from the Amadeus API",
      why: "An itinerary is only useful if you can act on it. Live flight data makes the plan bookable instead of a list of guesses.",
      tradeoff: "One more integration to maintain, with rate limits and its own authentication.",
    },
  ],
  results: [
    {
      value: "5 min → seconds",
      label: "AI itinerary generation, before and after moving to Groq and OpenAI",
    },
    {
      value: "2",
      label: "Sign-in methods: email and password with JWT, and Google OAuth",
    },
    {
      value: "Live",
      label: "Flight data from the Amadeus API inside every plan",
    },
  ],
  gallery: [
    {
      src: "/imgs/atlas-signin.png",
      alt: "Atlas sign-in screen",
      aspect: "16/9",
    },
    {
      src: "/imgs/atlas-auth.png",
      alt: "Atlas authentication screen",
      aspect: "4/3",
    },
    {
      src: "/imgs/atlas-navigation.png",
      alt: "Atlas navigation and map view",
      aspect: "4/3",
    },
  ],
  learnings: [
    "Performance is a product feature. A five-minute wait made the AI feel broken even when the output was good; a few seconds made the same output feel effortless.",
    "Keeping every third-party service behind its own layer paid off the moment I swapped the AI provider. Next time I would define the itinerary data shape before writing the first prompt, so the front-end and the model agree from day one.",
  ],
};

const sacithLabCaseStudy: CaseStudy = {
  tagline:
    "A bilingual luxury showcase for a patented, height-adjustable stool, designed in Figma and built to feel as refined as the product it presents.",
  role: "Full Stack Developer & UI/UX Designer",
  client: "Sacith S.r.l.",
  timeline: "2025",
  hero: {
    src: "/imgs/mockupSacithLab.svg",
    alt: "Sacith Lab website shown on a laptop mockup",
    aspect: "4/3",
  },
  overview: [
    "Sacith Lab's website was conceived as a luxury product showcase, emphasizing modernity, elegance and the innovative design of the stool.",
    "The site merges visual storytelling with technical precision, creating an immersive experience for both Italian and English-speaking users.",
    "From Figma prototypes to implementation, the platform was built to highlight the product's aesthetics while ensuring accessibility, performance and a seamless user experience.",
  ],
  challenge: {
    intro:
      "The client wanted a website that positioned the stool as a high-end design object, reflecting both craftsmanship and modern luxury. The challenge was to balance minimalist design with rich visual content and smooth interactivity, without compromising load speed or usability.",
    constraints: [
      "A bilingual experience, Italian and English, with content that stays easy to maintain",
      "A visually rich yet minimalist design, optimized for performance and mobile-first access",
      "Smooth animations and carousels that never slow the page down",
    ],
  },
  process: [
    {
      title: "UI/UX design in Figma",
      body: "A complete design system and high-fidelity prototypes were created in Figma to ensure a visually appealing and cohesive interface: balanced typography, refined visual hierarchy and smooth transitions, all chosen to evoke sophistication and modern elegance.",
      image: {
        src: "/imgs/sacith-lab-phones.svg",
        alt: "Sacith Lab mobile screens",
        aspect: "4/3",
      },
    },
    {
      title: "Bilingual content on a modular PHP base",
      body: "The backend runs on PHP and MySQL, powering content and modular page routing. Italian and English copy lives in JSON translation files, so switching language is seamless and adding a new one is a matter of adding a file.",
      image: {
        src: "/imgs/sacithLab.png",
        alt: "Sacith Lab homepage with the Italian and English language switch",
        aspect: "16/9",
      },
    },
    {
      title: "Motion, performance and deployment",
      body: "HTML5, Tailwind CSS and vanilla JavaScript, with AOS.js and Swiper.js for scroll effects and carousels that present the stool as a luxury design object. The site is hosted on Aruba Linux via cPanel, updated through Git and FTP, and optimized with WebP images, caching and accessibility best practices.",
      image: {
        src: "/imgs/sacith-lab-dimensions.jpeg",
        alt: "Sacith Lab dimensions section on a tablet",
        aspect: "4/3",
      },
    },
  ],
  decisions: [
    {
      title: "JSON translation files for two languages",
      why: "Italian and English content managed via JSON files keeps translations side by side, easy to edit and scalable to new languages.",
      tradeoff: "Copy changes still go through a developer, since there is no editor interface.",
    },
    {
      title: "Vanilla JavaScript with AOS.js and Swiper.js",
      why: "A showcase needs motion, not application state. Two small libraries deliver scroll effects and carousels without the weight of a framework.",
      tradeoff: "Less structure to lean on if the site grows into something more interactive.",
    },
    {
      title: "Aruba Linux hosting with cPanel, Git and FTP",
      why: "PHP and MySQL run natively on the client's hosting, and updates ship through Git and FTP with no extra infrastructure.",
      tradeoff: "Deployments are manual, so every release needs care and a checklist.",
    },
  ],
  results: [
    {
      value: "IT · EN",
      label: "A bilingual site that positions the stool as a premium design product",
    },
    {
      value: "WebP",
      label: "Optimized images and caching keep the visual-heavy pages fast and responsive",
    },
    {
      value: "Scalable",
      label: "A platform ready for future products and enhancements, shaped with the client at every round of feedback",
    },
  ],
  gallery: [
    {
      src: "/imgs/sacith-lab-contact.png",
      alt: "Sacith Lab contacts section",
      aspect: "16/9",
    },
    {
      src: "/imgs/sacith-lab-colors.png",
      alt: "Available colours section on mobile",
      aspect: "16/9",
    },
  ],
  learnings: [
    "This project deepened my understanding of high-end digital design and internationalization, combining visual storytelling with performance and usability. It strengthened my skills in designing visually driven websites that balance aesthetics with performance.",
    "Managing bilingual content with JSON translation files gave me a maintainable approach to internationalization, and turning Figma designs into responsive, elegant interfaces sharpened my design-to-implementation workflow.",
    "Working closely with the client, staying receptive to feedback and improving iteratively, made the collaboration as much a part of the result as the code.",
  ],
};

export const projects: Project[] = [
  {
    slug: "atlas",
    title: "Atlas",
    subtitle: "Travel Planning Platform",
    category: "Web Development · AI Integration",
    year: "2025",
    description:
      "Next-generation travel platform integrating interactive maps, smart search, and real-time AI-powered recommendations.",
    tech: [
      "React 19",
      "Java Spring Boot",
      "PostgreSQL",
      "Groq",
      "OpenAI",
      "Amadeus API",
      "Google OAuth",
      "Supabase",
      "Tailwind CSS",
      "Vite",
      "Docker",
    ],
    image: "/imgs/mockupAtlas.jpeg",
    links: { live: "#", repo: "#" },
    color: "#4f46e5",
    caseStudy: atlasCaseStudy,
  },
  {
    slug: "sacith-lab",
    title: "Sacith Lab",
    subtitle: "Luxury Product Showcase",
    category: "Web Development",
    year: "2025",
    description:
      "High-end bilingual product showcase for a patented luxury stool for Sacith S.r.l. Built with HTML, PHP and Tailwind CSS.",
    tech: [
      "HTML",
      "PHP",
      "Tailwind CSS",
      "Figma",
      "JavaScript",
      "MySQL",
      "AOS.js",
      "Swiper.js",
      "Aruba Linux",
    ],
    image: "/imgs/mockupSacithLab.svg",
    links: { live: "#" },
    color: "#d97706",
    caseStudy: sacithLabCaseStudy,
  },
  {
    slug: "sacith",
    title: "Sacith",
    subtitle: "Product Catalog",
    category: "Web Development · SEO",
    year: "2024–2025",
    description:
      "Modern bilingual product catalog for Italian air-massage systems company 'Sacith S.r.l.'. Full SEO optimization with Google Analytics integration.",
    tech: ["PHP", "MySQL", "JavaScript", "Tailwind CSS"],
    image: "/imgs/mockupSacith.png",
    links: { live: "#" },
    color: "#059669",
  },
  {
    slug: "novavice",
    title: "NovaVice",
    subtitle: "Architecture Firm Website",
    category: "Web Development",
    year: "2025",
    description:
      "Architecture firm website where motion is the core experience. Seamless GSAP animations create an immersive exploration.",
    tech: ["HTML", "CSS", "JavaScript", "GSAP"],
    image: "/imgs/mockupNovaVice.png",
    links: { live: "#", repo: "#" },
    color: "#7c3aed",
  },
  {
    slug: "awwwards",
    title: "Awwwards",
    subtitle: "Interactive Universe",
    category: "Web Development",
    year: "2024",
    description:
      "Immersive universe with rich product array in interconnected overlay experience. Advanced GSAP animations and video integration.",
    tech: ["React", "GSAP", "Video"],
    image: "/imgs/mockupAwwwards.png",
    links: { live: "#", repo: "#" },
    color: "#2563eb",
  },

  // {
  //   slug: "japan",
  //   title: "Japan",
  //   subtitle: "Web Design Concept",
  //   category: "Web Design",
  //   year: "2025",
  //   description:
  //     "Web design celebrating Japan's beauty with minimalist layout, deep red tones, and neutral accents. Figma design project.",
  //   tech: ["Figma"],
  //   image: "/imgs/mockupJapan.png",
  //   links: { design: "#" },
  //   color: "#dc2626",
  // },

  // {
  //   slug: "auth-app",
  //   title: "Auth App",
  //   subtitle: "Flutter Authentication",
  //   category: "App Development",
  //   year: "2024",
  //   description:
  //     "Powerful modern authentication system with Flutter and Firebase. Supports email/password and OAuth login.",
  //   tech: ["Flutter", "Firebase", "Google OAuth", "Apple OAuth"],
  //   image: "/imgs/mockupAuth.png",
  //   links: { repo: "#" },
  //   color: "#0891b2",
  // },
  // {
  //   slug: "film-app",
  //   title: "Film App",
  //   subtitle: "TMDB-Powered Discovery",
  //   category: "App Development",
  //   year: "2024",
  //   description:
  //     "Flutter app leveraging TMDB API for film discovery. Browse trending movies, search, and save favorites.",
  //   tech: ["Flutter", "TMDB API", "Dart"],
  //   image: "/imgs/mockupMovie.png",
  //   links: { repo: "#" },
  //   color: "#7c3aed",
  // },
];

export const services = [
  {
    icon: "💻",
    title: "Software Developing",
    subtitle: "Full Stack",
    description:
      "Bring your vision to life. I collaborate to develop websites that truly represent your unique identity and style — from database to UI.",
    tech: ["React", "Next.js", "Node.js", "TypeScript", "Java Spring Boot"],
  },
  {
    icon: "✦",
    title: "UI/UX Design",
    subtitle: "Design Systems",
    description:
      "Craft your online presence. I design websites that not only look stunning but also tell your story with clarity and elegance.",
    tech: ["Figma", "Tailwind CSS", "GSAP", "Framer Motion"],
  },
  {
    icon: "◈",
    title: "AI Integration",
    subtitle: "Smart Solutions",
    description:
      "Smart solutions for modern needs. I integrate AI into your product to enhance user experience and streamline operations.",
    tech: ["OpenAI", "Groq", "Pinecone", "LangChain"],
  },
];

export const skills = {
  Frontend: [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "SASS",
    "GSAP",
    "Framer Motion",
    "Redux",
    "React Query",
    "Bootstrap",
    "Material UI",
    "Zod",
    "Jest",
    "React Testing Library",
    "Axios",
    "Ant Design",
  ],
  Backend: [
    "Java Spring Boot",
    "Node.js",
    "Express.js",
    "PHP",
    "REST APIs",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Firebase",
    "Python",
  ],
  "Tools & Platforms": [
    "Figma",
    "Git",
    "GitHub",
    "Bitbucket",
    "Docker",
    "Vercel",
    "Render",
    "Supabase",
    "Firebase",
    "Postman",
    "GA",
    "GTM",
    "OpenAI API",
    "Pinecone",
    "PostHog",
    "GCP",
    "Azure",
    "PhpMyAdmin",
  ],
};

export type Experience = {
  role: string;
  company: string;
  location?: string;
  period: string;
  tech: string[];
  bullets: string[];
};

export const experience: Experience[] = [
  {
    role: "Frontend Developer",
    company: "Contactlab (TeamSystem Group)",
    location: "Milan",
    period: "March 2026 — Present",
    tech: ["React", "TypeScript", "fp-ts", "Ant Design"],
    bullets: [
      "Building the front-end of a Customer Data Platform (CDP) with React, TypeScript and functional programming paradigms with fp-ts",
      "Developing complex UI components with Ant Design",
      "Working in an Agile team on an enterprise codebase, focusing on code quality and reusable patterns",
    ],
  },
  {
    role: "Junior Developer",
    company: "HRM Group",
    location: "Milan",
    period: "November 2024 — March 2026",
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "SCSS",
      "Ant Design",
      "Java Spring Boot",
    ],
    bullets: [
      "Built and maintained the front-end architecture of the main product from scratch, translating Figma designs into fully responsive interfaces",
      "Integrated back-end features with Java Spring Boot, improving data flows and system reliability",
      "Contributed to 2+ Agile projects, building reusable components and optimising data-layer caching",
      "Mentored a junior intern: wrote documentation and onboarding materials that reduced ramp-up time by 40%",
    ],
  },
  {
    role: "Founding Engineer & Tech Lead",
    company: "Newmann AI",
    location: "Remote",
    period: "2024 — Present",
    tech: [
      "Next.js",
      "TypeScript",
      "React",
      "fp-ts",
      "Java Spring Boot",
      "Spring AI",
      "Supabase",
      "PostgreSQL",
      "OpenAI",
      "Pinecone",
      "PostHog",
      "Resend",
      "GitHub Actions",
      "Vercel",
      "Render",
    ],
    bullets: [
      "Joined at inception as Founding Engineer and Tech Lead of an AI platform (currently in MVP) that automates email management through NLP-driven label/rule automation with Gmail and Microsoft/Azure integration",
      "Own the AI engineering with Spring AI: wrote all prompts from scratch and designed the retrieval pipeline with Pinecone for semantic search",
      "Designed the entire stack architecture, from technology selection to REST API design with Java Spring Boot; Next.js/React frontend with fp-ts and PostgreSQL on Supabase with RLS and multilingual support",
      "Set up and manage the full infrastructure: CI/CD with GitHub Actions, deployment on Vercel and Render, analytics with PostHog EU and transactional emails via Resend",
    ],
  },
  {
    role: "Founding Engineer",
    company: "Macrobite",
    period: "2025 — Present",
    tech: ["React", "TypeScript", "Supabase", "Supabase Edge Functions"],
    bullets: [
      "Joined from day one as Founding Engineer, contributing to product definition and development of the web app",
      "Macrobite (currently in MVP) lets users order food delivered to refrigerated lockers installed in gyms, with access via PIN or QR code generated automatically at checkout",
      "Evaluated several hardware solutions (TTLock, Seam API, igloohome, Akiles) and implemented the access logic via Supabase Edge Functions and a React frontend",
    ],
  },
  {
    role: "Freelance Full Stack Developer",
    company: "Sacith s.r.l.",
    location: "Cassano Magnago",
    period: "February 2025 — Present",
    tech: [
      "PHP",
      "HTML",
      "Tailwind CSS",
      "JavaScript",
      "SQL",
      "GA4",
      "GTM",
      "Google Search Console",
    ],
    bullets: [
      "Managed the full development lifecycle of the showcase website and digital product catalogue independently",
      "Kept direct communication with the client to gather requirements and iterate on UX feedback within bi-weekly sprints",
      "Implemented SEO best practices and integrated GA4, GTM and Search Console (+35% organic traffic)",
      "Built an internal PHP + SQL dashboard for autonomous product management",
    ],
  },
];
