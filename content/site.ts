export const navigation = [
  { label: "Me", href: "#home" },
  { label: "Resources", href: "#resources" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  name: "Surya Atmuri",
  tagline:
    "Junior in cs @ georgia tech building solutions to real problems. Currently scaling Untab and sharing recruitment resources on LinkedIn 😁",
  profileImage: "https://i.imgur.com/0QUH8nY.jpg",
  profileImageAlt: "Profile picture",
  cta: {
    primary: {
      text: "Get in touch",
      href: "#contact",
    },
    secondary: {
      text: "See resume",
      href: "https://drive.google.com/file/d/1u5K2wNYF_pDkESpnWuVUmBaAh7oetXnS/view?usp=sharing",
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
    title: "Education & Skills",
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
    name: "Weightlifting, Hooping, and Jogging",
    emoji: "💪🏽",
  },
  {
    name: "Anime: Watching Clannad After Story",
    emoji: "🎥",
    color: "from-pink-500 to-purple-500",
  },
  {
    name: "Reading: \"When Things Fall Apart\"",
    emoji: "📚",
    color: "from-blue-500 to-green-500",
  },
  {
    name: "Cloudgazing: This Portfolio's Inspiration",
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
    title: "Job Tracker Bot (Telegram alerts)",
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
    id: "vip-research",
    title: "Undergraduate Researcher",
    company: "Automated Algorithm Design - VIP",
    location: "Atlanta, GA",
    period: "Jan 2025 -- Present",
    date: "2025-01-01",
    type: "research",
    bullets: [
      "Developed an LLM-guided AutoML pipeline with Mixtral-8x7B to evolve PyTorch architectures for 3D point cloud classification, running 10 generations and benchmarking 100+ model variants per run with SLURM on PACE ICE",
      "Advanced PointNet++ performance by evolving a variant that raised test accuracy from 62.7% to 67.1% (+7%), while reducing model complexity metrics to achieve a Pareto-optimal balance of accuracy and efficiency",
      "Doubled request throughput with asynchronous batching using asyncio, cutting inference latency by 50%",
    ],
    technologies: ["Python", "PyTorch", "Mixtral-8x7B", "SLURM", "asyncio"],
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
      "Engineered a role-based authentication system with NextAuth.js, middleware, and an AWS DynamoDB session store, securing all admin routes against unauthorized access while sustaining sub-10ms latency for 20 client dashboards",
      "Resolved 4 critical production blockers in a Next.js 15/React 18 SaaS platform, fixing build errors, dependency conflicts, and context propagation failures in route redirects, supporting full internationalization (i18n) and updated test harnesses",
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
      "Built a SharePoint based intranet platform leveraging SPFx, TypeScript, Webpack, and Gulp driving employee engagement with upwards of 1,100 total visits and 217 visits in the final 30 days of term",
      "Configured CRUD workflows using Power Automate and JavaScript, improving backend synchronization efficiency and reducing manual input errors, contributing to a seamless experience for 17 unique users over 2 months",
      "Analyzed data queries using SQL in PowerBI's SQL Server and Excel's command line to model commercial patterns of 400+ health care professionals and compare tele-sales call activity to determine sales impact in weekly reports",
    ],
    technologies: ["SharePoint", "SPFx", "TypeScript", "Power Automate", "SQL"],
  },
  {
    id: "sb-dental",
    title: "Data Analyst Intern",
    company: "SB Dental Studio",
    location: "Plainsboro, NJ",
    period: "Jun 2023 -- Jul 2023",
    date: "2023-06-01",
    type: "internship",
    bullets: [
      "Restructured patient data with Dentrix software, automating follow-ups and minimizing scheduling conflicts by 60%",
      "Streamlined payment processing system, validating insurance policies for 140+ claim forms to ensure compliance",
    ],
    technologies: ["Dentrix", "Data Management", "Process Automation"],
  },
];

export const projects = [
  {
    title: "This Portfolio Website",
    summary:
      "Built a modern portfolio with Next.js 15 featuring custom animation system (TextReveal, FloatingElement, ScrollReveal), GSAP-powered 3D cylindrical text, and smooth parallax effects, deployed on Netlify with 5 9s availability.",
    repo: "https://github.com/suryaatm21/portfolio-website",
    demo: "https://surya.theuntab.com",
    tech: ["Next.js", "TypeScript", "Framer Motion", "GSAP", "Tailwind CSS"],
  },
  {
    title: "Job Tracker Bot",
    summary:
      "Shipped a GitHub Actions pipeline with TTL caching to monitor internship repos, actively delivering alerts to 1,300+ contacts and 60+ active users, scaling reliably on three CI pipelines with sub-15s runtimes and under 1% job failure rate.",
    repo: "https://github.com/suryaatm21/job-tracker",
    demo: "https://t.me/summer2026swe",
    tech: ["Python", "GitHub Actions", "Telegram API"],
  },
  {
    title: "CloudScribe AI",
    summary:
      "Deploying a serverless pipeline using GCP's Cloud Storage, Pub/Sub, and Firebase Functions to transcribe and summarize multi modal media inputs with sub-30s latency and under 2s trigger response.",
    repo: "Coming Soon",
    demo: "Coming Soon",
    tech: ["TypeScript", "Next.js", "Google Cloud", "Docker", "Firebase"],
  },
  {
    title: "Spotify Playlist Optimizer",
    summary:
      "Designed a FastAPI backend with PostgreSQL and Spotify OAuth, batch processing tracks with average latency under 200ms, and integrated ReccoBeats API to fetch 95%+ of audio features.",
    repo: "https://github.com/suryaatm21/spotify-optimizer",
    demo: "https://www.youtube.com/watch?v=oDh19udD8h0",
    tech: ["REST APIs", "FastAPI", "PostgreSQL", "scikit-learn"],
  },
  {
    title: "Spoiler Alert - Web Development GT",
    summary:
      "Led frontend scrum development of the Fridge dashboard using React, Flask, and Gemini API to automate expiry and category inputs, reducing manual entry steps by 40%.",
    repo: "https://github.com/suryaatm21/spoiler_alert",
    demo: "https://www.youtube.com/watch?v=YOLyiLElo8w",
    tech: ["JavaScript", "Flask", "React", "SQLite"],
  },
];

export const contact = {
  form: {
    title: "Send a Message",
    subjectLabel: "Subject",
    subjectPlaceholder: "What would you like to discuss?",
    messageLabel: "Message",
    messagePlaceholder:
      "Tell me about your team, question, or endeavors! Or give me a book, song, or anime rec",
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
  {
    id: "vip-research",
    title: "Undergraduate Researcher",
    company:
      "Automated Algorithm Design - Vertically Integrated Projects (VIP)",
    location: "Atlanta, GA",
    period: "Jan 2025 -- Present",
    bullets: [
      "Developed an LLM-guided AutoML pipeline with Mixtral-8x7B to evolve PyTorch architectures for 3D point cloud classification, running 10 generations and benchmarking 100+ model variants per run with SLURM on PACE ICE",
      "Advanced PointNet++ performance by evolving a variant that raised test accuracy from 62.7% to 67.1% (+7%), while reducing model complexity metrics to achieve a Pareto-optimal balance of accuracy and efficiency",
      "Doubled request throughput with asynchronous batching using asyncio, cutting inference latency by 50%",
    ],
  },
  {
    id: "todd-agriscience",
    title: "Software Engineering Intern",
    company: "Todd Agriscience",
    location: "Los Angeles, CA",
    period: "Jun 2025 -- Sep 2025",
    bullets: [
      "Engineered a role-based authentication system with NextAuth.js, middleware, and an AWS DynamoDB session store, securing all admin routes against unauthorized access while sustaining sub-10ms latency for 20 client dashboards",
      "Resolved 4 critical production blockers in a Next.js 15/React 18 SaaS platform, fixing build errors, dependency conflicts, and context propagation failures in route redirects, supporting full internationalization (i18n) and updated test harnesses",
    ],
  },
  {
    id: "acrotech-biopharma",
    title: "Software Engineering Intern",
    company: "Acrotech Biopharma Inc.",
    location: "East Windsor, NJ",
    period: "Jun 2024 -- Aug 2024",
    bullets: [
      "Built a SharePoint based intranet platform leveraging SPFx, TypeScript, Webpack, and Gulp driving employee engagement with upwards of 1,100 total visits and 217 visits in the final 30 days of term",
      "Configured CRUD workflows using Power Automate and JavaScript, improving backend synchronization efficiency and reducing manual input errors, contributing to a seamless experience for 17 unique users over 2 months",
      "Analyzed data queries using SQL in PowerBI's SQL Server and Excel's command line to model commercial patterns of 400+ health care professionals and compare tele-sales call activity to determine sales impact in weekly reports",
    ],
  },
];

export const resumeProjects = [
  {
    id: "job-tracker-bot",
    title: "Job Tracker Bot",
    technologies: ["Python", "GitHub Actions", "Telegram API"],
    period: "Aug 2025 -- Present",
    repo: "https://github.com/suryaatm21/job-tracker",
    bullets: [
      "Shipped a GitHub Actions pipeline with TTL caching to monitor internship repos, actively delivering alerts to 1,300+ contacts and 60+ active users, scaling reliably on three CI pipelines with sub-15s runtimes and under 1% job failure rate.",
    ],
  },
  {
    id: "cloudscribe-ai",
    title: "CloudScribe AI",
    technologies: [
      "TypeScript",
      "Next.js",
      "Google Cloud",
      "Docker",
      "Firebase",
    ],
    period: "Jan 2025 -- Present",
    bullets: [
      "Deploying a serverless pipeline using GCP's Cloud Storage, Pub/Sub, and Firebase Functions to transcribe and summarize multi modal media inputs (e.g., .mp3, .mp4) with sub-30s latency and under 2s trigger response",
      "Containerized video processing with Docker and deployed to Cloud Run, integrating OpenAI APIs for semantic summarization with over 90% similarity to human-written notes using cosine and ROUGE metrics across 150+ tests",
    ],
  },
  {
    id: "spotify-optimizer",
    title: "Spotify Playlist Optimizer",
    technologies: ["REST APIs", "FastAPI", "PostgreSQL", "scikit-learn"],
    period: "Oct 2024 -- Aug 2025",
    repo: "https://github.com/suryaatm21/spotify-optimizer",
    bullets: [
      "Designed a FastAPI backend with PostgreSQL and Spotify OAuth, batch processing tracks with average latency under 200ms, and integrated ReccoBeats API to fetch 95%+ of audio features with data imputation fallback",
      "Applied K-Means and DBSCAN clustering with PCA visualizations on audio features to reveal playlist-level patterns, enabling organization and filtering via CRUD operations through the Spotify Web API",
    ],
  },
  {
    id: "spoiler-alert",
    title: "Spoiler Alert - Web Development GT",
    technologies: ["JavaScript", "Flask", "React", "SQLite"],
    period: "Sep 2024 -- Dec 2024",
    repo: "https://github.com/suryaatm21/spoiler_alert",
    bullets: [
      "Led frontend scrum development of the Fridge dashboard using React, Flask, and Gemini API to automate expiry and category inputs, reducing manual entry steps by 40% and cutting input time from 30s to under 10s per item",
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
