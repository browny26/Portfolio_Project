import type { CaseStudy, Dictionary, Project } from "../types";

const newmannCaseStudy: CaseStudy = {
  tagline:
    "An AI email assistant that reads your inbox the way you do: it drafts replies in your own voice, and lets you automate labels and rules either by building them or by describing them in a chat.",
  role: "Founding Engineer & Tech Lead",
  client: "Newmann AI",
  timeline: "2024 to Present",
  hero: {
    src: "/imgs/newmann-landing.webp",
    alt: "Newmann inbox dashboard shown on a laptop mockup",
    aspect: "16/9",
  },
  overview: [
    "Newmann is a B2B SaaS platform that connects to Gmail or Outlook and turns an inbox into something manageable: it decides what actually deserves attention, writes draft replies grounded in how you have answered similar emails before, and applies the labels and rules you define, either in a rule builder or by describing them to a chatbot. The platform is currently in testing ahead of its first release.",
  ],
  myRole:
    "I joined at inception as Founding Engineer and Tech Lead. I own the architecture and the technology choices, from stack selection to the design of the REST API in Java Spring Boot, and the AI engineering end to end: every prompt is written from scratch and the retrieval pipeline on Pinecone is mine. I work alongside a front-end and a back-end developer who carry the implementation forward, and the decisions that shape the system come through me.",
  challenge: {
    intro:
      "A generic model can write a polite email. It cannot write your email. The product only works if the draft sounds like the person sending it and if the assistant knows when to stay silent, and both of those have to hold while processing every message that lands in an inbox, at a cost per email that a subscription can absorb.",
    constraints: [
      "Drafts had to be grounded in each user's own history, not in a generic model voice",
      "Gmail push notifications can arrive more than once, so the pipeline had to be idempotent and never produce duplicate drafts, labels or vectors",
      "Newsletters and automated senders are a large share of any inbox: running an LLM on all of them would have burned budget for nothing",
      "Two providers, Gmail and Microsoft, each with its own OAuth flow and its own idea of what a label is",
      "Users needed both precise control over automations and a way to create them without learning a rule syntax",
    ],
  },
  process: [
    {
      title: "Architecture and the ingestion pipeline",
      body: "Spring Boot exposes the REST API, PostgreSQL on Supabase stores the data with row-level security and multilingual content, and Next.js with React and TypeScript runs the front-end. Incoming mail arrives through a webhook pipeline built around idempotency and deduplication keys, so the same message can be delivered twice without ever producing a second draft. Providers are modelled per email account rather than per provider type, which is what made adding Microsoft alongside Gmail a configuration change instead of a rewrite.",
      image: {
        src: "/imgs/newmann-settings.webp",
        alt: "Newmann settings: theme, language, email signature, Newmann labels and the user's role",
        aspect: "16/10",
      },
    },
    {
      title: "Retrieval, prompts and the user's voice",
      body: "Every relevant email is embedded and stored in Pinecone, so a new message is answered with the user's own past exchanges in context. I keep separate namespaces for context emails and for feedback signals: when the two shared a namespace, rejected drafts started polluting retrieval and pulling the model towards the answers the user had explicitly turned down. Rejections are also categorised, because 'this needed no reply' and 'the tone was wrong' are two different lessons and only one of them should stop future drafts.",
      image: {
        src: "/imgs/newmann-draft.webp",
        alt: "Editing a draft in Newmann: the original draft next to the new version, with a field to ask the AI to regenerate it",
        aspect: "16/10",
      },
    },
    {
      title: "Two ways to build an automation",
      body: "The rule builder gives full control: you define the label, the conditions and the written description the model works from, and you can see exactly what will happen. Next to it sits a chatbot for everything else: you describe what you want and a stateful multi-turn flow assembles the same rule, asking for the missing pieces and stopping to confirm when it looks like one that already exists. Both paths write to one rule model, so nothing behaves differently depending on where it was created.",
      image: {
        src: "/imgs/newmann-automation-chat.webp",
        alt: "Newmann automation chat creating a label from a natural language description",
        aspect: "16/10",
      },
    },
    {
      title: "Shipping it and keeping it observable",
      body: "CI runs on GitHub Actions for both front-end and back-end, with branch protection; the front-end deploys to Vercel and the Spring Boot API runs on Azure, with Flyway migrations against Supabase. I set up product analytics on PostHog EU and transactional email on Resend; the deployment pipeline was built with another developer and the team maintains it together. Getting the deployed environment stable meant working through OAuth redirects, CORS, HikariCP pool sizing and Supabase connection routing over the session pooler, the unglamorous half of running your own infrastructure.",
      image: {
        src: "/imgs/newmann-labels.webp",
        alt: "The labels list in Newmann, with the automated drafts setting and the rules linked to each label",
        aspect: "16/10",
      },
    },
  ],
  decisions: [
    {
      title:
        "Detect automated senders from headers first, AI only as a fallback",
      why: "Newsletters and no-reply senders identify themselves in the email headers. Reading them costs nothing and covers around 95% of cases, so the model is only called for the genuinely ambiguous ones. Those emails are still embedded into Pinecone as context, and only draft generation is skipped.",
      tradeoff:
        "A hand-written heuristic to maintain as senders change how they label themselves.",
    },
    {
      title: "Separate Pinecone namespaces per retrieval purpose",
      why: "Context and feedback answer different questions. Keeping them apart is the difference between a draft informed by how you write and a draft drifting towards what you already rejected.",
      tradeoff:
        "More namespaces to manage, and every new signal type needs a deliberate decision about where it lives.",
    },
    {
      title: "A rule builder and a chatbot, not one or the other",
      why: "People who know exactly what they want should not have to negotiate with a chat, and people who do not should not have to learn a form. Both surfaces produce the same rule, so the choice is about comfort rather than capability.",
      tradeoff:
        "Two interfaces over one model: every change to what a rule can do has to land in both, and stateful multi-turn conversations are far harder to test than a form.",
    },
    {
      title: "Parallelisation and caching over a heavier AI framework",
      why: "The response time users feel comes from how many model calls run at once and how many are avoided entirely. CompletableFuture parallelisation, batching and a lazy cache for importance evaluation moved the numbers; an extra abstraction layer would not have.",
      tradeoff:
        "More concurrency to reason about, and caching means being explicit about when a stale verdict is acceptable.",
    },
    {
      title: "EU-hosted analytics and infrastructure from the start",
      why: "Email content passes through the system and the customers are European. Choosing EU-hosted services while the codebase was small made data residency a setting rather than a migration.",
      tradeoff:
        "A narrower set of providers to choose from, sometimes at a higher price.",
    },
  ],
  results: [
    {
      value: "~95%",
      label:
        "of automated senders identified from email headers alone in testing, at zero token cost",
    },
    {
      value: "Gmail · Outlook",
      label:
        "Both providers supported through a per-account model, each with its own OAuth2 flow",
    },
    {
      value: "Idempotent",
      label:
        "A webhook pipeline keyed so that repeated deliveries cannot produce a second draft, label or vector",
    },
    {
      value: "2 paths",
      label:
        "A rule builder and a conversational assistant writing to one automation model",
    },
  ],
  gallery: [
    {
      src: "/imgs/newmann-login.webp",
      alt: "Newmann sign-in page, with Google or Microsoft login",
      aspect: "16/10",
    },
    {
      src: "/imgs/newmann-dashboard-overview.webp",
      alt: "Newmann dashboard with labels, automated drafts and active rules",
      aspect: "16/10",
    },
    {
      src: "/imgs/newmann-homepage.webp",
      alt: "Newmann landing page",
      aspect: "16/10",
    },
  ],
  learnings: [
    "Deciding the architecture first means every shortcut becomes somebody else's inheritance. Isolating providers per account, keeping retrieval namespaces separate and making the pipeline idempotent all looked like over-engineering on day one, and they are the reason two more developers could build on top without renegotiating the foundations.",
    "The cheapest AI call is the one you do not make. Reading a header before reaching for a model changed the unit economics of the product more than any prompt optimisation did.",
    "Feedback is not one signal. Treating 'no reply needed' and 'wrong tone' as the same rejection quietly taught the system to stop being useful, and separating them was a modelling problem long before it was a prompting one.",
    "Offering two ways into the same feature was worth the duplicated surface, but only because both write to a single rule model. Had I let the chatbot build its own shortcut version, the two would have drifted within a month.",
  ],
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
      tradeoff:
        "The app now depends on external providers and pays per request.",
    },
    {
      title: "JWT plus Google OAuth",
      why: "Email and password with JWT keeps the API stateless, while Google OAuth removes friction for people who just want to try the app.",
      tradeoff:
        "Two sign-in paths mean twice the edge cases to handle and test.",
    },
    {
      title: "Real flights from the Amadeus API",
      why: "An itinerary is only useful if you can act on it. Live flight data makes the plan bookable instead of a list of guesses.",
      tradeoff:
        "One more integration to maintain, with rate limits and its own authentication.",
    },
  ],
  results: [
    {
      value: "5 min → seconds",
      label:
        "AI itinerary generation, before and after moving to Groq and OpenAI",
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
      src: "/imgs/atlas-services.webp",
      alt: "The Atlas Services page, with a large Adventure heading and a grid of landscape photographs",
      aspect: "16/10",
    },
    {
      src: "/imgs/atlas-adventure.webp",
      alt: "The Atlas Adventure page, with the form that generates an itinerary from destination, days, budget and interests",
      aspect: "16/10",
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
      tradeoff:
        "Copy changes still go through a developer, since there is no editor interface.",
    },
    {
      title: "Vanilla JavaScript with AOS.js and Swiper.js",
      why: "A showcase needs motion, not application state. Two small libraries deliver scroll effects and carousels without the weight of a framework.",
      tradeoff:
        "Less structure to lean on if the site grows into something more interactive.",
    },
    {
      title: "Aruba Linux hosting with cPanel, Git and FTP",
      why: "PHP and MySQL run natively on the client's hosting, and updates ship through Git and FTP with no extra infrastructure.",
      tradeoff:
        "Deployments are manual, so every release needs care and a checklist.",
    },
  ],
  results: [
    {
      value: "IT · EN",
      label:
        "A bilingual site that positions the stool as a premium design product",
    },
    {
      value: "WebP",
      label:
        "Optimized images and caching keep the visual-heavy pages fast and responsive",
    },
    {
      value: "Scalable",
      label:
        "A platform ready for future products and enhancements, shaped with the client at every round of feedback",
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

const projects: Project[] = [
  {
    slug: "newmann",
    title: "Newmann",
    subtitle: "AI Email Assistant",
    category: "Web Development · AI Engineering",
    year: "2024 to Present",
    description:
      "B2B SaaS platform that drafts email replies in your own voice and turns plain-language descriptions into inbox automations, across Gmail and Outlook.",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Java Spring Boot",
      "OpenAI",
      "Pinecone",
      "Supabase",
      "PostgreSQL",
      "Gmail API",
      "Microsoft Graph",
      "OAuth2",
      "Azure",
      "PostHog",
      "Resend",
      "GitHub Actions",
      "Vercel",
    ],
    image: "/imgs/newmann-landing.webp",
    links: { live: "#" },
    color: "#0f766e",
    caseStudy: newmannCaseStudy,
  },
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
];

const en: Dictionary = {
  cvUrl: "/cv/LuisaCerinOgbeiwi_cv_en.pdf",

  meta: {
    title: "Luisa Cerin Ogbeiwi — Software & AI Developer",
    description:
      "Full-stack developer crafting modern websites and sleek interfaces. Blending design and code to deliver unique digital experiences.",
    keywords: [
      "web developer",
      "designer",
      "full-stack",
      "React",
      "Next.js",
      "TypeScript",
      "Milan",
      "Gallarate",
      "freelance",
      "portfolio",
      "modern websites",
      "sleek interfaces",
      "digital experiences",
      "Luisa Cerin Ogbeiwi",
      "Ai Integration",
      "UI/UX",
      "responsive design",
      "frontend",
      "backend",
    ],
    projectsTitle: "Projects — Luisa Cerin Ogbeiwi",
    projectsDescription:
      "A selection of projects spanning web development, UI/UX design and mobile applications.",
    contactTitle: "Contact — Luisa Cerin Ogbeiwi",
    contactDescription:
      "Have a project in mind, a job offer, or just want to say hello? Get in touch.",
    caseStudySuffix: "Case study · Luisa Cerin Ogbeiwi",
    notFoundTitle: "Page not found — Luisa Cerin Ogbeiwi",
  },

  notFound: {
    label: "Error 404",
    code: "404",
    title: "Page",
    titleAccent: "not found",
    body: "The page you are looking for does not exist, or it has moved somewhere else. Here is the way back.",
    home: "Back home →",
    projects: "See the projects",
  },

  nav: {
    projects: "Projects",
    services: "Services",
    skills: "Skills",
    experience: "Experience",
    contact: "Contact",
  },

  header: {
    getInTouch: "Get in touch",
    menu: "Menu",
    close: "Close",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchLanguage: "Switch language",
    info: {
      status: "Status",
      statusValue: "Available for projects",
      email: "Email",
      linkedin: "Linkedin",
      cv: "CV",
      cvValue: "Open PDF ↗",
      location: "Location",
      locationValue: "Gallarate, Italy",
    },
  },

  hero: {
    line1: "Software & AI",
    line2: "Developer",
    based: "Based in Gallarate, Italy",
    availability: "Available for freelance",
    blurb:
      "I craft modern websites and sleek interfaces — blending design and code to deliver unique digital experiences.",
  },

  projectsBanner: {
    label: "Selected work",
    title: "Projects",
    titleItalic: "& work",
  },

  services: {
    label: "What I do",
    title: "Services",
    items: [
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
    ],
  },

  skills: {
    label: "Tech stack",
    title: "Skills",
    groups: {
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
    },
  },

  about: {
    label: "About me",
    highlights: ["Gallarate", "LLMs", "RAG-based", "conversational assistants"],
    bio: "Full-stack and AI developer based in Gallarate, Italy. I build digital experiences that combine thoughtful design with clean, scalable code, bringing LLMs into products: conversational assistants, automations and RAG-based features. Currently studying Digital Communication & Computer Science at the University of Milan.",
    facts: {
      location: "Location",
      locationValue: "Gallarate, Italy",
      university: "University",
      universityValue: "Univ. degli Studi di Milano",
      languages: "Languages",
      languagesValue: "Italian · English (B2)",
      status: "Status",
      statusValue: "Open to work",
      cv: "CV",
      cvValue: "Open PDF ↗",
    },
  },

  experience: {
    label: "Career",
    title: "Experience",
    items: [
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
    ],
  },

  footer: {
    line1: "Have a project",
    line2: "in mind?",
    cta: "Get in touch →",
    role: "Software & AI Developer · Gallarate, Italy",
    github: "GitHub",
    linkedin: "LinkedIn",
  },

  projectsPage: {
    label: "All projects",
    title: "My",
    titleAccent: "Work",
    intro:
      "A selection of projects spanning web development, UI/UX design and mobile applications.",
    caseStudy: "Case study →",
    viewSite: "View site ↗",
    github: "GitHub →",
  },

  contactPage: {
    label: "Get in touch",
    title: "Let's",
    titleAccent: "talk",
    intro:
      "Have a project in mind, a job offer, or just want to say hello? I'd love to hear from you.",
    email: "Email",
    phone: "Phone",
    location: "Location",
    locationValue: "Gallarate, Italy",
    socials: "Socials",
    cv: "CV",
    sentTitle: "Message sent!",
    sentBody: "Thanks for reaching out. I'll get back to you within 24 hours.",
    nameLabel: "Name *",
    namePlaceholder: "Your name",
    emailLabel: "Email *",
    emailPlaceholder: "your@email.com",
    subjectLabel: "Subject",
    subjectPlaceholder: "Select a topic",
    subjects: {
      landing: "Landing page",
      ecommerce: "E-commerce",
      fullstack: "Full-stack project",
      job: "Job offer",
      other: "Other",
    },
    messageLabel: "Message *",
    messagePlaceholder: "Tell me about your project or idea...",
    sending: "Sending...",
    send: "Send message →",
  },

  caseStudy: {
    allProjects: "← All projects",
    counter: "Case study",
    role: "Role",
    myRole: "My role",
    type: "Type",
    year: "Year",
    category: "Category",
    viewSite: "View site ↗",
    github: "GitHub →",
    overview: "Overview",
    challenge: "The challenge",
    process: "Process",
    processTitle: "How it came together",
    decisions: "Key decisions",
    decisionsTitle: "Choices that shaped the product",
    why: "Why",
    tradeoff: "Trade-off",
    results: "Results",
    resultsTitle: "What changed",
    gallery: "Gallery",
    learnings: "What I learned",
    nextProject: "Next project",
    moreWork: "More work",
  },

  projects,
};

export default en;
