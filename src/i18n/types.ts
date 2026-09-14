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
  tech: string[];
  bullets: string[];
};

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
    services: string;
    skills: string;
    experience: string;
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

  /** The standalone "who I am" section, sitting between the hero and the work. */
  about: {
    label: string;
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
    email: string;
    phone: string;
    location: string;
    locationValue: string;
    socials: string;
    cv: string;
    sentTitle: string;
    sentBody: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    subjects: {
      landing: string;
      ecommerce: string;
      fullstack: string;
      job: string;
      other: string;
    };
    messageLabel: string;
    messagePlaceholder: string;
    sending: string;
    send: string;
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
