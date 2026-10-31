export const defaultPortfolioData = {
  personal: {
    name: "Jeevan Gowda A V",
    title: "Full-Stack Developer & AI/ML Engineer",
    tagline: "Architecting Intelligent Systems, Machine Learning Pipelines & Scalable Web Experiences",
    bio: "Passionate technologist dedicated to building next-generation digital products. Specializing in Artificial Intelligence, Deep Learning, IoT automation, and modern full-stack web applications with high-polish aesthetics and rock-solid architecture.",
    email: "jeevangowdajeevan080@gmail.com",
    location: "Karnataka, India",
    availability: "Available for Projects & Full-time Roles",
    resumeUrl: "/assets/documents/resume.pdf",
    socials: {
      github: "https://github.com/jeevan-gowda8",
      linkedin: "https://www.linkedin.com/in/jeevan-gowda8",
      instagram: "https://www.instagram.com/ll_.jeevan._.gowda._ll"
    },
    stats: [
      { label: "Engineering Practice", value: "3+" },
      { label: "Systems Deployed", value: "12+" },
      { label: "Core Technologies", value: "15+" },
      { label: "Code Commits", value: "500+" }
    ]
  },
  projects: [
    {
      id: "terminator-ai",
      title: "T.E.R.M.I.N.A.T.O.R",
      subtitle: "Voice-Powered Intelligent Desktop System",
      description: "State-of-the-art voice-controlled desktop AI agent activated by custom wake-word detection. Seamlessly orchestrates native OS tasks, automated music playback, live weather forecasts, email dispatch, and real-time generative AI image synthesis completely hands-free.",
      category: "ai",
      badge: "Featured AI",
      accent: "#4f46e5",
      metaLabel: "AI Agent",
      metaYear: "2024",
      tags: ["Python", "OpenAI API", "Picovoice", "SpeechRecognition", "Automation"],
      githubUrl: "https://github.com/jeevan-gowda8",
      demoUrl: "https://github.com/jeevan-gowda8",
      highlights: [
        "Offline custom hotword detection with zero cloud latency",
        "NLP intent classification & multi-turn dialog parsing",
        "Automated OS API hooks for application control & media automation"
      ]
    },
    {
      id: "iot-monitoring",
      title: "Smart IoT Ecosystem & Mobile Hub",
      subtitle: "Telemetry & Industrial Automation Suite",
      description: "Enterprise-grade cross-platform Flutter application tailored for IoT device orchestration. Streams real-time telemetry from environmental microcontrollers, delivers visual analytics, instant threshold alarms, and low-latency two-way device control.",
      category: "mobile",
      badge: "IoT & Mobile",
      accent: "#0d9488",
      metaLabel: "IoT System",
      metaYear: "2024",
      tags: ["Flutter", "Dart", "REST APIs", "Cloud IoT", "MQTT", "Firebase"],
      githubUrl: "https://github.com/jeevan-gowda8",
      demoUrl: "https://github.com/jeevan-gowda8",
      highlights: [
        "Sub-100ms real-time metric streams with MQTT and WebSocket",
        "Interactive fluid charts with sensor historical trend analysis",
        "Custom rule engine for push notifications & emergency thresholds"
      ]
    },
    {
      id: "ai-vision-pipeline",
      title: "NeuroVision Edge Inspector",
      subtitle: "Real-Time Computer Vision & Detection",
      description: "Deep learning pipeline built on PyTorch and OpenCV executing real-time object tracking, surface anomaly detection, and facial biometric feature extraction with optimized TensorRT inference.",
      category: "ai",
      badge: "Deep Learning",
      accent: "#9333ea",
      metaLabel: "Computer Vision",
      metaYear: "2024",
      tags: ["PyTorch", "OpenCV", "YOLOv8", "CUDA", "Python"],
      githubUrl: "https://github.com/jeevan-gowda8",
      demoUrl: "https://github.com/jeevan-gowda8",
      highlights: [
        "Over 60 FPS real-time detection on consumer GPU hardware",
        "Custom dataset augmentation pipeline for high-accuracy generalization",
        "REST API serving inference models with batch processing"
      ]
    },
    {
      id: "cloud-dashboard",
      title: "OmniMetrics Cloud Dashboard",
      subtitle: "High-Performance Analytics Web Platform",
      description: "Modern reactive web application providing unified infrastructure health monitoring, automated report generation, and distributed system event logging with interactive data visualizers.",
      category: "web",
      badge: "Full Stack",
      accent: "#ea580c",
      metaLabel: "Web Platform",
      metaYear: "2024",
      tags: ["React", "JavaScript", "Node.js", "Firebase", "TailwindCSS"],
      githubUrl: "https://github.com/jeevan-gowda8",
      demoUrl: "https://github.com/jeevan-gowda8",
      highlights: [
        "Ultra-fast virtualized data grids rendering 10k+ event items smoothly",
        "Dynamic widget layout with drag-and-drop customization",
        "Role-based access control with granular permission policies"
      ]
    }
  ],
  skills: [
    {
      category: "Artificial Intelligence & ML",
      id: "ai",
      description: "Developing intelligent models, neural networks, and generative AI workflows",
      items: [
        { name: "Machine Learning", level: 90, note: "Supervised/unsupervised, scikit-learn, clustering" },
        { name: "Deep Learning", level: 85, note: "Neural networks, PyTorch, model optimization" },
        { name: "Computer Vision", level: 82, note: "OpenCV, YOLO, image segmentation" },
        { name: "NLP & LLM APIs", level: 88, note: "OpenAI API, prompt engineering, speech processing" },
        { name: "Data Science & Pandas", level: 92, note: "Data manipulation, NumPy, Matplotlib, Seaborn" }
      ]
    },
    {
      category: "Core Programming & Software",
      id: "programming",
      description: "Solid algorithmic foundations, OOP principles, and clean system code",
      items: [
        { name: "Python", level: 95, note: "FastAPI, scripting, automation, ML ecosystems" },
        { name: "Java", level: 82, note: "Object-oriented architecture, design patterns" },
        { name: "C / C++", level: 80, note: "Data structures, memory management, algorithms" },
        { name: "JavaScript / ES6+", level: 90, note: "Modern asynchronous workflows, closures, APIs" }
      ]
    },
    {
      category: "Web & Mobile Development",
      id: "frontend",
      description: "Crafting beautiful, reactive, fluid client interfaces and mobile apps",
      items: [
        { name: "React.js", level: 92, note: "Hooks, state management, component architecture" },
        { name: "Flutter & Dart", level: 86, note: "Cross-platform mobile apps, reactive state, custom UI" },
        { name: "HTML5 & Modern CSS", level: 95, note: "Responsive grid/flexbox, animations, micro-interactions" },
        { name: "RESTful APIs", level: 90, note: "API design, endpoint integration, JSON schemas" }
      ]
    },
    {
      category: "Cloud, IoT & Databases",
      id: "tools",
      description: "Cloud infrastructure, database systems, and physical computing",
      items: [
        { name: "Firebase & Firestore", level: 90, note: "Realtime DB, Authentication, Hosting, Rules" },
        { name: "SQL & Databases", level: 85, note: "Relational schema design, queries, normalization" },
        { name: "IoT & Microcontrollers", level: 84, note: "Sensors, ESP32, Arduino, hardware telemetry" },
        { name: "Git & GitHub", level: 92, note: "Version control, collaborative workflows, CI/CD basics" }
      ]
    }
  ],
  education: [
    {
      dateRange: "2023 — 2027",
      badge: "In Progress",
      degree: "Diploma in AI & Machine Learning",
      institution: "Government Tool Room and Training Centre (GTTC)",
      location: "Magadi, Karnataka",
      description: "Rigorous curriculum encompassing mathematical foundations for AI, deep neural networks, embedded IoT systems, robotics automation, and applied machine intelligence.",
      skills: ["Machine Learning", "Neural Networks", "Python", "Data Structures", "IoT Automation"]
    },
    {
      dateRange: "2022 — 2023",
      badge: "Completed",
      degree: "Secondary School Leaving Certificate (SSLC)",
      institution: "Shree Jnana Bharathi High School",
      location: "Huliyurdurga, Karnataka",
      description: "Graduated with distinction. Formed strong analytical reasoning in mathematics, physics, and computing that sparked a lifelong pursuit of software engineering.",
      skills: ["Mathematics", "Physics", "Computer Fundamentals", "Logic & Reasoning"]
    }
  ],
  services: [
    {
      title: "AI & ML Solutions",
      desc: "Custom intelligent models, predictive analytics, computer vision systems, and automated voice/text agents.",
      icon: "brain"
    },
    {
      title: "Full-Stack Web Apps",
      desc: "Blazing fast React frontends with clean APIs, Firebase realtime backends, and responsive UI design.",
      icon: "code"
    },
    {
      title: "IoT & Mobile Engineering",
      desc: "End-to-end connected device ecosystems with cross-platform Flutter mobile applications and live telemetry.",
      icon: "mobile"
    },
    {
      title: "Automation & Scripting",
      desc: "High-efficiency Python automation scripts for data collection, workflow integration, and API bridges.",
      icon: "bolt"
    }
  ],
  lastUpdated: new Date().toISOString()
};
