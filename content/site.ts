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
  {
    id: "microsoft",
    title: "Applied AI/ML Engineer Intern",
    company: "Microsoft",
    team: "Core AI: Microsoft Foundry Team",
    location: "Redmond, WA",
    period: "Sep 2026 -- Present",
    date: "2026-09-01",
    type: "internship",
    bullets: [
      "Supporting Core AI: Microsoft Foundry Team, enterprise platform for model serving and agent development on Azure",
      "First project: an Nx remote cache keying build artifacts by content hash, cutting org-wide recompute cost and latency",
    ],
    technologies: ["Azure", "Nx"],
  },
  {
    id: "nvidia",
    title: "Security Software Engineer Intern",
    company: "NVIDIA",
    location: "Santa Clara, CA",
    period: "May 2026 -- Aug 2026",
    date: "2026-05-01",
    type: "internship",
    bullets: [
      "Deployed an agent with NeMo Agent Toolkit and LangGraph whose supervisor routes specialists over docs, threads, and APIs, then a synthesizer reconciles that evidence into cited resolutions for a 3,775-member support channel",
      "Supported the FAQ specialist with a pipeline that rebuilds the corpus on doc drift and publishes each version as an API-pinned JFrog digest, retrieving with a 2:1 Nemotron-to-BM25 hybrid at 0.81 relevance set satisfaction@5",
      "Served the copilot API with a shared append-only Postgres event log behind queued Slack ingestion, using partial unique claim indexes, bounded retries, and a dead-letter path to scale to concurrent workers",
    ],
    technologies: ["LangGraph", "NeMo Agent Toolkit", "Postgres", "JFrog"],
  },
  {
    id: "gtri",
    title: "Undergraduate Researcher",
    company: "Georgia Tech Research Institute (GTRI)",
    location: "Atlanta, GA",
    period: "Jan 2025 -- May 2026",
    date: "2025-01-01",
    type: "research",
    bullets: [
      "Extended LLM-Guided Evolution, a genetic programming architecture search that segments a reference PyTorch network into independently mutable blocks, then evolves variants over generations of LLM-driven crossover and mutation scored on accuracy against parameter count, discovering Pareto-optimal solutions for point cloud classification",
      "Ablated combinations of 4 retrieval backends (FAISS vector, PageIndex hierarchical, BM25 knowledge graph, run history) behind a shared interface, replaying a curated dataset of historical mutation prompts on a SLURM driver so paired tests identify the configuration best trading goodput and Pareto hypervolume against context cost",
      "Traced stalled throughput to static batching and KV cache fragmentation, both sizing work to the longest sequence in a batch, moving serving to vLLM for 3.6x throughput at above 95% cache use, then cutting generation from 700s to under 300s with speculative decoding against a 1B draft model, constrained to a JSON schema to keep mutations parseable",
    ],
    technologies: ["PyTorch", "vLLM", "SLURM", "FAISS", "PageIndex"],
  },
  {
    id: "todd-agriscience",
    title: "Software Engineer Intern",
    company: "Todd Agriscience",
    location: "Los Angeles, CA",
    period: "Jun 2025 -- Sep 2025",
    date: "2025-06-01",
    type: "internship",
    bullets: [
      "Built a locale-aware auth layer in Next.js edge middleware by chaining i18n and stateless session checks, resolving Google OAuth and email sign-ins against a DynamoDB store to stamp tenant/role claims, securing 20 client dashboards",
      "Designed an S3-triggered ML pipeline that ingests raw soil uploads, orchestrates Lambda-hosted scikit-learn scoring in Step Functions with idempotent execution, and returns reviewed recommendations",
    ],
    technologies: ["Next.js", "DynamoDB", "S3", "AWS Lambda", "scikit-learn"],
  },
];

export const projects = [
  {
    title: "CloudScribe AI",
    summary:
      "An event-driven GCP pipeline that turns lecture recordings into timestamped transcripts, with a time-aligned study layer joining transcripts and on-screen visuals to generate notes, semantic search, and cited Q&A.",
    repo: "Coming Soon",
    demo: "Coming Soon",
    tech: ["TypeScript", "Next.js", "Google Cloud Platform", "Docker"],
  },
  {
    title: "Telegram Job Tracker",
    summary:
      "Be the first to apply to any new entry-level job opening in tech. Join the Telegram channel below.",
    repo: "https://github.com/suryaatm21/job-tracker",
    demo: "https://t.me/summer2026swe",
    tech: ["Python", "GitHub Actions", "GitHub Contents API", "Telegram API"],
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
  location: "New York, NY",
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
  gpa: "3.8/4.0 (Faculty Honors)",
  graduationDate: "Expected May 2027",
  coursework: [
    "Design & Analysis of Algorithms",
    "Computer Architecture",
    "Database Systems",
    "Perception & Robotics",
  ],
};

export const professionalExperience = [
  {
    id: "microsoft",
    title: "Applied AI/ML Engineer Intern",
    company: "Microsoft",
    location: "Redmond, WA",
    period: "Sep 2026 -- Present",
    bullets: [
      "Supporting Core AI: Microsoft Foundry Team, enterprise platform for model serving and agent development on Azure",
      "First project: an Nx remote cache keying build artifacts by content hash, cutting org-wide recompute cost and latency",
    ],
  },
  {
    id: "nvidia",
    title: "Security Software Engineer Intern",
    company: "NVIDIA",
    location: "Santa Clara, CA",
    period: "May 2026 -- Aug 2026",
    bullets: [
      "Deployed an agent with NeMo Agent Toolkit and LangGraph whose supervisor routes specialists over docs, threads, and APIs, then a synthesizer reconciles that evidence into cited resolutions for a 3,775-member support channel",
      "Supported the FAQ specialist with a pipeline that rebuilds the corpus on doc drift and publishes each version as an API-pinned JFrog digest, retrieving with a 2:1 Nemotron-to-BM25 hybrid at 0.81 relevance set satisfaction@5",
      "Served the copilot API with a shared append-only Postgres event log behind queued Slack ingestion, using partial unique claim indexes, bounded retries, and a dead-letter path to scale to concurrent workers",
    ],
  },
  {
    id: "gtri",
    title: "Undergraduate Researcher",
    company: "Georgia Tech Research Institute (GTRI)",
    location: "Atlanta, GA",
    period: "Jan 2025 -- May 2026",
    bullets: [
      "Extended LLM-Guided Evolution, a genetic programming architecture search that segments a reference PyTorch network into independently mutable blocks, then evolves variants over generations of LLM-driven crossover and mutation scored on accuracy against parameter count, discovering Pareto-optimal solutions for point cloud classification",
      "Ablated combinations of 4 retrieval backends (FAISS vector, PageIndex hierarchical, BM25 knowledge graph, run history) behind a shared interface, replaying a curated dataset of historical mutation prompts on a SLURM driver so paired tests identify the configuration best trading goodput and Pareto hypervolume against context cost",
      "Traced stalled throughput to static batching and KV cache fragmentation, both sizing work to the longest sequence in a batch, moving serving to vLLM for 3.6x throughput at above 95% cache use, then cutting generation from 700s to under 300s with speculative decoding against a 1B draft model, constrained to a JSON schema to keep mutations parseable",
    ],
  },
  {
    id: "todd-agriscience",
    title: "Software Engineer Intern",
    company: "Todd Agriscience",
    location: "Los Angeles, CA",
    period: "Jun 2025 -- Sep 2025",
    bullets: [
      "Built a locale-aware auth layer in Next.js edge middleware by chaining i18n and stateless session checks, resolving Google OAuth and email sign-ins against a DynamoDB store to stamp tenant/role claims, securing 20 client dashboards",
      "Designed an S3-triggered ML pipeline that ingests raw soil uploads, orchestrates Lambda-hosted scikit-learn scoring in Step Functions with idempotent execution, and returns reviewed recommendations",
    ],
  },
];

export const technicalSkills = {
  languages: ["Python", "C", "C++", "Java", "Bash", "SQL"],
  aiMl: [
    "PyTorch",
    "TensorFlow",
    "Sklearn",
    "LLMs",
    "RAG",
    "Fine tuning (LoRA, QLoRA)",
    "Quantization",
    "Distillation",
  ],
  systemsAndInfra: [
    "Distributed systems",
    "Concurrency",
    "GCP",
    "AWS",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Linux",
    "Datadog",
  ],
};
