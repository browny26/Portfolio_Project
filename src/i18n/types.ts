/** Shape of a locale dictionary: every string the site renders, plus its content. */

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
  /**
   * Optional narrative paragraph about what the author personally did on the
   * project. Rendered under its own labelled row ("Il mio ruolo" / "My role")
   * when present, so the "what the project is" and "what I did" halves stay
   * distinct instead of stacking inside Overview.
   */
  myRole?: string;
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

export type Service = {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
};

export type Experience = {
  role: string;
  company: string;
  location?: string;
  period: string;
  /**
   * When the role started and, if it is over, ended: "YYYY-MM", or "YYYY" when
   * only the year is known. Drives the timeline on the About page; a role
   * without `end` is still ongoing.
   */
  start: string;
  end?: string;
  tech: string[];
  bullets: string[];
};

export const contactSubjects = [
  "landing",
  "ecommerce",
  "fullstack",
  "job",
  "other",
] as const;

export type ContactSubject = (typeof contactSubjects)[number];

export type Dictionary = {
  /** Public path of the CV for this locale, opened in a new tab wherever it is linked. */
  cvUrl: string;

  meta: {
    title: string;
    description: string;
    keywords: string[];
    projectsTitle: string;
    projectsDescription: string;
    contactTitle: string;
    contactDescription: string;
    aboutTitle: string;
    aboutDescription: string;
    /** Suffix appended to a case study title, e.g. "— Case study · Luisa Cerin Ogbeiwi" */
    caseStudySuffix: string;
    notFoundTitle: string;
  };

  notFound: {
    label: string;
    code: string;
    title: string;
    titleAccent: string;
    body: string;
    home: string;
    projects: string;
  };

  nav: {
    projects: string;
    about: string;
    services: string;
    contact: string;
  };

  header: {
    getInTouch: string;
    menu: string;
    close: string;
    openMenu: string;
    closeMenu: string;
    switchLanguage: string;
    info: {
      status: string;
      statusValue: string;
      email: string;
      linkedin: string;
      cv: string;
      cvValue: string;
      location: string;
      locationValue: string;
    };
  };

  hero: {
    line1: string;
    line2: string;
    based: string;
    availability: string;
    blurb: string;
  };

  projectsBanner: {
    label: string;
    title: string;
    titleItalic: string;
  };

  services: {
    label: string;
    title: string;
    items: Service[];
  };

  skills: {
    label: string;
    title: string;
    /** Category name -> the technologies under it. Category names are display strings. */
    groups: Record<string, string[]>;
  };

  /** The short "who I am" on the home page, between the hero and the work. It leads to the About page. */
  aboutTeaser: {
    label: string;
    bio: string;
    /** Phrases of the bio that get highlighted as the reader scrolls past them. */
    highlights: string[];
    cta: string;
  };

  /** The About page: its heading, then the full bio with the facts under it. */
  about: {
    label: string;
    title: string;
    titleAccent: string;
    bio: string;
    /** Phrases of the bio that get highlighted as the reader scrolls past them. */
    highlights: string[];
    facts: {
      location: string;
      locationValue: string;
      university: string;
      universityValue: string;
      languages: string;
      languagesValue: string;
      status: string;
      statusValue: string;
      cv: string;
      cvValue: string;
    };
  };

  experience: {
    label: string;
    title: string;
    timeline: {
      /** Accessible name of the chart. */
      label: string;
      today: string;
      exact: string;
      yearOnly: string;
      ongoing: string;
    };
    items: Experience[];
  };

  footer: {
    line1: string;
    line2: string;
    cta: string;
    role: string;
    github: string;
    linkedin: string;
  };

  projectsPage: {
    label: string;
    title: string;
    titleAccent: string;
    intro: string;
    caseStudy: string;
    viewSite: string;
    github: string;
  };

  contactPage: {
    label: string;
    title: string;
    titleAccent: string;
    intro: string;
    copyEmail: string;
    emailCopied: string;
    /** Shown when the clipboard is unavailable and the address is selected instead. */
    emailSelected: string;
    openMail: string;
    status: string;
    statusValue: string;
    reply: string;
    replyValue: string;
    phone: string;
    location: string;
    locationValue: string;
    socials: string;
    cv: string;
    cvValue: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjects: Record<ContactSubject, string>;
    messageLabel: string;
    messagePlaceholder: string;
    errors: {
      name: string;
      email: string;
      message: string;
      send: string;
    };
    sending: string;
    send: string;
    sentTitle: string;
    sentBody: string;
    /** "{subject}" and "{count}" are replaced with the message's subject and length. */
    sentRecap: string;
    noSubject: string;
    again: string;
  };

  caseStudy: {
    allProjects: string;
    counter: string;
    role: string;
    /** Section label for the "what I personally did" paragraph. */
    myRole: string;
    type: string;
    year: string;
    category: string;
    viewSite: string;
    github: string;
    overview: string;
    challenge: string;
    process: string;
    processTitle: string;
    decisions: string;
    decisionsTitle: string;
    why: string;
    tradeoff: string;
    results: string;
    resultsTitle: string;
    gallery: string;
    learnings: string;
    nextProject: string;
    moreWork: string;
  };

  projects: Project[];
};
