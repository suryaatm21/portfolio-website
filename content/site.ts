export const navigation = [
  { label: "Resources", href: "#resources" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  name: "Surya Atmuri",
  tagline:
    "Junior in cs @ georgia tech building solutions to real problems. Bootstrapping Untab and sharing recruitment resources on LinkedIn 😁",
  interactionHint:
    "Watch the clouds and birds follow your cursor - press {toggleKey} to toggle the flock, and {addKey} to add a bird",
  profileImage: "https://i.imgur.com/0QUH8nY.jpg",
  profileImageAlt: "Profile picture",
  cta: {
    primary: {
      text: "Get in touch",
      href: "#contact",
    },
    secondary: {
      text: "See resume",
      href: "https://drive.google.com/file/d/1BxddwN_BnbFDPceLH-sliI9SRgRtgIPN/view?usp=sharing",
    },
  },
};

export const sections = {
  experience: {
    title: "Professional Experience",
    description:
      "My journey in building impactful products and growing as a developer",
  },
  projects: {
    title: "🔥 Projects 🔥",
  },
  education: {
    title: "Education & Certifications",
    description: "Academic background and technical expertise",
  },
  resources: {
    title: "My Recruitment Resources",
    description: "Curated tools and resources to help you get a job",
    buttonText: "Get access",
    buttonHref: "https://resources.theuntab.com",
  },
  contact: {
    title: "Get In Touch",
  },
};

export const hobbies = [
  {
    name: "Weightlifting, Hooping, Jogging",
    emoji: "💪🏽",
  },
  {
    name: "Anime: The Disastrous Life of Saiki K.",
    emoji: "🎥",
    color: "from-pink-500 to-purple-500",
  },
  {
    name: "Reading: \"Demian\"",
    emoji: "📚",
    color: "from-blue-500 to-green-500",
  },
  {
    name: "Cloudgazing: My Portfolio's Inspiration",
    emoji: "☁️",
    color: "from-sky-400 to-blue-500",
  },
];

export const footer = {
  copyright: "© 2025 Surya. Built with Next.js and Tailwind CSS.",
  backToTop: "Back to top",
};

export const socials = [
  { label: "GitHub", href: "https://github.com/suryaatm21", icon: "Github" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/surya-atmuri",
    icon: "Linkedin",
  },
  { label: "Email", href: "mailto:surya@theuntab.com", icon: "Mail" },
];

export const resources = [
  {
    title: "System Design Cheatsheet",
    href: "https://www.linkedin.com/posts/surya-atmuri_systemdesign-softwareengineering-interviewprep-activity-7276018965661794304-3b3a",
    description: "NeetCode Pro system design for beginners notes + more.",
    status: "available",
  },
  {
    title: "Telegram Job Tracker",
    href: "https://t.me/summer2026swe",
    description:
      "Always be the first to know about the latest openings in tech.",
    status: "available",
  },
  {
    title: "Neet: Coding Interviewer GPT",
    href: "https://chatgpt.com/g/g-68d5a88f14c88191bcbdb3444a680082-neet-personal-interviewer",
    description:
      "Never get stuck in a technical interview again. Try this personalized GPT in practice.",
    status: "available",
  },
  {
    title: "Perplexity Comet (AI Browser)",
    href: "https://pplx.ai/surya-atmuri",
    description: "Best way I've found to pull the most up-to-date sources.",
    status: "available",
  },
];

export const experience = [
  {
    id: "todd",
    year: "2024",
    title: "Internship at Todd",
    bullets: [
      "Built features in a live startup codebase",
      "Shipped fast – measured impact with user feedback",
    ],
  },
  {
    id: "untab",
    year: "2023–now",
    title: "Untab",
    bullets: [
      "Pomodoro-style tab closer",
      "Expanding into a browser productivity suite",
    ],
  },
];

export const timelineText = {
  badge: "Professional Journey",
  title: "Experience Timeline",
  description: "Navigate through my professional journey and key milestones",
  quickNav: "Timeline",
  // Additional configurable text content
  navigationLabels: {
    previous: "Previous experience",
    next: "Next experience",
    goToExperience: "Go to experience",
  },
  contentLabels: {
    technologies: "Technologies",
    keyAchievements: "Key Achievements",
    location: "Location",
    period: "Period",
  },
  accessibility: {
    goToCompany: "Go to", // Will be followed by company name
    goToExperience: "Go to experience", // Will be followed by number
    timelineNavigation: "Use arrow keys to navigate timeline",
  },
};

export const timeline = [
  /*
  {
    id: 'glossgenius',
    title: 'Software Engineering Intern',
    company: 'GlossGenius',
    location: 'New York, NY',
    period: 'Sep 2026 -- Dec 2026',
    date: '2026-09-01',
    type: 'internship',
    bullets: [
      'Incoming Fall 2026 AI Agents Team: Working on AI agentic product features facing 100,000+ client businesses',
    ],
    technologies: ['AI Agents'],
  },
  {
    id: 'microsoft',
    title: 'Software Engineering Intern',
    company: 'Microsoft',
    location: 'Redmond, WA',
    period: 'May 2026 -- Aug 2026',
    date: '2026-05-01',
    type: 'internship',
    bullets: [
      'Incoming Summer 2026: Core AI Platforms Team',
    ],
    technologies: [],
  },
  */
  {
    id: "gtri",
    title: "Undergraduate Researcher",
    company: "Georgia Tech Research Institute (GTRI)",
    location: "Atlanta, GA",
    period: "Jan 2025 -- Present",
    date: "2025-01-01",
    type: "research",
    bullets: [
      "Designing a RAG pipeline on LLM-guided evolutionary PyTorch architecture search on CIFAR-10, using 2 FAISS vector indices with a cross-encoder reranker to retrieve prior experiments and documentation for faster NAS convergence",
      "Migrated the Python inference server to utilize vLLM’s continuous batching and PagedAttention, accelerating throughput by 3.6x and achieving >95% KV cache utilization to serve Llama-3.3-70B models within 80GB VRAM limits",
      "Engineered a distributed fitness inheritance system with self-correcting LLM infrastructure on a SLURM cluster to reuse CNN checkpoints and autonomously resolve runtime errors, cutting 48+ redundant GPU evaluations per run",
    ],
    technologies: ["Python", "PyTorch", "vLLM", "SLURM", "FAISS"],
  },
  {
    id: "todd-agriscience",
    title: "Software Engineering Intern",
    company: "Todd Agriscience",
    location: "Los Angeles, CA",
    period: "Jun 2025 -- Sep 2025",
    date: "2025-06-01",
    type: "internship",
    bullets: [
      "Formulated a role-based authentication system with NextAuth.js middleware and an AWS DynamoDB session store, centralizing user identity and securing admin routes with sub-10ms latency for 20 client dashboards",
      "Integrated internationalization (i18n) into a Next.js 15/React 18 SaaS platform with middleware chaining to propagate locale context across authenticated redirects, resolving 4 production blockers to stabilize application routing",
    ],
    technologies: [
      "Next.js",
      "React",
      "NextAuth.js",
      "AWS DynamoDB",
      "TypeScript",
    ],
  },
  {
    id: "acrotech-biopharma",
    title: "Software Engineering Intern",
    company: "Acrotech Biopharma Inc.",
    location: "East Windsor, NJ",
    period: "Jun 2024 -- Aug 2024",
    date: "2024-06-01",
    type: "internship",
    bullets: [
      "Built a SharePoint intranet platform with SPFx, TypeScript, Webpack, and Gulp to centralize department resources behind role based permissions, driving 1,100+ cumulative employee visits within 3 months",
      "Developed JavaScript Power Automate workflow schedules that use CRUD operations to synchronize Excel and SharePoint databases, enforcing eventual consistency and reliable record updates across 9 departments",
    ],
    technologies: ["SharePoint", "SPFx", "TypeScript", "Power Automate"],
  },
];

export const projects = [
  {
    title: "Telegram Job Tracker",
    summary:
      "Be the first to apply to any new entry-level job opening in tech. Join the Telegram channel below.",
    repo: "https://github.com/suryaatm21/job-tracker",
    demo: "https://t.me/summer2026swe",
    tech: ["Python", "GitHub Actions", "Telegram API"],
  },
  {
    title: "CloudScribe AI",
    summary: "Building a cloud-native platform to take lecture notes for you.",
    repo: "Coming Soon",
    demo: "Coming Soon",
    tech: [
      "TypeScript",
      "Next.js",
      "Google Cloud Platform",
      "Docker",
      "Firebase",
    ],
  },
  {
    title: "Spotify Playlist Optimizer",
    summary:
      "Organize your Spotify music library with intent and machine learning.",
    repo: "https://github.com/suryaatm21/spotify-optimizer",
    demo: "https://www.youtube.com/watch?v=oDh19udD8h0",
    tech: ["REST APIs", "FastAPI", "PostgreSQL", "scikit-learn"],
  },
  {
    title: "This Portfolio Website",
    summary:
      "Stop stalking and go build your own, just reference this source code when you do.",
    repo: "https://github.com/suryaatm21/portfolio-website",
    demo: "https://surya.theuntab.com",
    tech: ["Next.js", "TypeScript", "Framer Motion", "GSAP", "Tailwind CSS"],
  },
  {
    title: "Spoiler Alert - Web Development GT",
    summary:
      "Track your fridge ingredients, generate recipes, and manage shopping lists for your groceries. And share your fridges with family members, roommates, or colleagues.",
    repo: "https://github.com/suryaatm21/spoiler_alert",
    demo: "https://www.youtube.com/watch?v=YOLyiLElo8w",
    tech: ["JavaScript", "Flask", "React", "SQLite"],
  },
];

export const contact = {
  form: {
    title: "Slide a DM",
    subjectLabel: "Subject",
    subjectPlaceholder: "Exercise free will here",
    messageLabel: "Message",
    messagePlaceholder: "Tell me about your team, question, or endeavors!",
    submitText: "Send Message",
    disclaimer:
      "This will open your default email client with a prefilled message. Your email address will not be stored or shared.",
  },
  availability: {
    title: "Currently Seeking: To Be a Better Engineer",
    content:
      "Open to summer/fall 2026 internships in software engineering, cloud computing, and applied AI",
  },
  social: {
    title: "Find me elsewhere",
  },
};

// Resume data structures
export const personal = {
  name: "Surya Atmuri",
  location: "Princeton, NJ",
  phone: "(732)-735-0687",
  email: "suryaatmuri57@gmail.com",
  linkedin: "https://www.linkedin.com/in/surya-atmuri/",
  github: "https://github.com/suryaatm21",
  citizenship: "US Citizen",
};

export const education = {
  institution: "Georgia Institute of Technology - College of Computing",
  location: "Atlanta, GA",
  degree: "B.S. in Computer Science",
  gpa: "3.9/4.0 (Faculty Honors)",
  graduationDate: "Expected May 2027",
  coursework: [
    "CS 1331: Object Oriented Programming (OOP)",
    "CS 1332: Data Structures",
    "MATH 1554: Linear Algebra",
    "CS 2050: Discrete Math",
    "CS 2110: Computer Organization & Programming",
    "CS 2340: Objects & Design",
    "CS 3510: Design & Analysis of Algorithms",
    "ISYE 3770: Statistics & Applications",
    "CS 4400: Database Systems",
    "CS 4641: Machine Learning",
    "DeepLearning.AI: Supervised Machine Learning",
    "DeepLearning.AI: Advanced Learning Algorithms",
    "DeepLearning.AI: Unsupervised Learning",
  ],
};

export const professionalExperience = [
  /*
  {
    id: 'glossgenius',
    title: 'Software Engineering Intern',
    company: 'GlossGenius',
    location: 'New York, NY',
    period: 'Sep 2026 -- Dec 2026',
    bullets: [
      'Incoming Fall 2026 AI Agents Team: Working on AI agentic product features facing 100,000+ client businesses',
    ],
  },
  {
    id: 'microsoft',
    title: 'Software Engineering Intern',
    company: 'Microsoft',
    location: 'Redmond, WA',
    period: 'May 2026 -- Aug 2026',
    bullets: [
      'Incoming Summer 2026: Core AI Platforms Team',
    ],
  },
  */
  {
    id: "gtri",
    title: "Undergraduate Researcher",
    company: "Georgia Tech Research Institute (GTRI)",
    location: "Atlanta, GA",
    period: "Jan 2025 -- Present",
    bullets: [
      "Designing a RAG pipeline on LLM-guided evolutionary PyTorch architecture search on CIFAR-10, using 2 FAISS vector indices with a cross-encoder reranker to retrieve prior experiments and documentation for faster NAS convergence",
      "Migrated the Python inference server to utilize vLLM’s continuous batching and PagedAttention, accelerating throughput by 3.6x and achieving >95% KV cache utilization to serve Llama-3.3-70B models within 80GB VRAM limits",
      "Engineered a distributed fitness inheritance system with self-correcting LLM infrastructure on a SLURM cluster to reuse CNN checkpoints and autonomously resolve runtime errors, cutting 48+ redundant GPU evaluations per run",
    ],
  },
  {
    id: "todd-agriscience",
    title: "Software Engineering Intern",
    company: "Todd Agriscience",
    location: "Los Angeles, CA",
    period: "Jun 2025 -- Sep 2025",
    bullets: [
      "Formulated a role-based authentication system with NextAuth.js middleware and an AWS DynamoDB session store, centralizing user identity and securing admin routes with sub-10ms latency for 20 client dashboards",
      "Integrated internationalization (i18n) into a Next.js 15/React 18 SaaS platform with middleware chaining to propagate locale context across authenticated redirects, resolving 4 production blockers to stabilize application routing",
    ],
  },
  {
    id: "acrotech-biopharma",
    title: "Software Engineering Intern",
    company: "Acrotech Biopharma Inc.",
    location: "East Windsor, NJ",
    period: "Jun 2024 -- Aug 2024",
    bullets: [
      "Built a SharePoint intranet platform with SPFx, TypeScript, Webpack, and Gulp to centralize department resources behind role based permissions, driving 1,100+ cumulative employee visits within 3 months",
      "Developed JavaScript Power Automate workflow schedules that use CRUD operations to synchronize Excel and SharePoint databases, enforcing eventual consistency and reliable record updates across 9 departments",
    ],
  },
];

export const technicalSkills = {
  languages: [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "SQL",
    "HTML",
    "CSS",
    "LaTeX",
    "C",
    "C++",
    "Swift",
  ],
  frameworks: [
    "React",
    "Angular",
    "Next.js",
    "Node.js",
    "GraphQL",
    "FastAPI",
    "TailwindCSS",
    "Flask",
    "Django",
    "Scrum",
    "Agile",
    "RAG",
  ],
  developerTools: [
    "Git",
    "GitHub",
    "NPM",
    "AWS",
    "GCP",
    "Azure",
    "Postman",
    "Storybook",
    "MongoDB",
    "CI/CD",
    "Jira",
    "Figma",
    "VSCode",
  ],
  libraries: [
    "Pandas",
    "NumPy",
    "Seaborn",
    "scikit-learn",
    "Matplotlib",
    "TensorFlow",
    "PyTorch",
    "Axios",
    "LangChain",
    "Transformers",
  ],
};
