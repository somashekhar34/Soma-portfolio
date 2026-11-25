export const profile = {
  name: "Somasekhar Goud Addakula",
  shortName: "Somasekhar Addakula",
  title: "Data Engineer",
  tagline: "Customer Service, Security & AI Data Platforms",
  summary:
    "Data engineer with 4+ years designing data models, warehouses, and ETL/ELT pipelines in SQL, SparkSQL, and Python across AWS, Azure Databricks, GCP, and Snowflake. I build customer service and support data — including a production Contact Center AI agent for service calls — security and fraud data intelligence with risk flags and anomaly detection, and generative AI, agentic AI, and knowledge-graph data foundations. I own data quality, monitoring, on-call incident response, and root-cause analysis, follow security and compliance standards, and mentor engineers.",
  location: "United States",
  email: "somasekhar.addakula@gmail.com",
  phone: "+1 716 604 4029",
  github: "https://github.com/somashekhar34",
  linkedin: "https://linkedin.com/in/somasekhar-addakula",
  blog: "https://somashekhar34.blogspot.com",
  resumeFile: "resume/Somasekhar_Addakula_Resume.pdf",
  badges: ["Google Cloud Professional Data Engineer", "4+ Years Experience", "MS Data Science"],
};

export type SkillGroup = {
  title: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages & Advanced SQL",
    skills: [
      "Python", "SQL", "PySpark", "SparkSQL", "TypeScript", "JavaScript", "C",
      "BigQuery TVFs", "MERGE/UPDATE DML", "Property Graphs",
    ],
  },
  {
    title: "Cloud Platforms",
    skills: [
      "AWS (S3, Glue, EMR, Redshift, Lambda, Kinesis, DynamoDB, Step Functions)",
      "GCP (BigQuery, Dataflow, Dataproc, Pub/Sub, Cloud Run, Cloud Composer)",
      "Azure (Data Factory, Databricks, Synapse, Event Hubs, Entra ID)",
    ],
  },
  {
    title: "Warehousing & Databases",
    skills: [
      "Snowflake", "BigQuery", "Redshift", "PostgreSQL", "MySQL", "Oracle",
      "Firestore", "Supabase", "Neo4j", "Redis", "Pinecone",
    ],
  },
  {
    title: "Orchestration & Transformation",
    skills: ["dbt", "Airflow / Cloud Composer", "Dagster", "Azure Data Factory", "Cloud Scheduler", "n8n"],
  },
  {
    title: "Generative & Conversational AI",
    skills: [
      "LLMs & LangChain", "GPT / Gemini / BERT", "Prompt Engineering", "Vector Retrieval",
      "Dialogflow CX", "Google Contact Center AI (CCAI)", "ElevenLabs", "Hugging Face Transformers",
    ],
  },
  {
    title: "Web, APIs & Backend",
    skills: ["Flask", "FastAPI", "Node.js", "React.js", "Angular", "WebSockets", "WebRTC", "Twilio", "REST/OpenAPI"],
  },
  {
    title: "ML, BI & DevOps",
    skills: [
      "Scikit-learn", "TensorFlow", "Keras", "Tableau", "Power BI", "Looker Studio",
      "Terraform", "Git", "pytest", "Locust", "Kafka",
    ],
  },
];

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Senior Associate Data Engineer",
    company: "Egen Inc",
    period: "2024 — Present",
    location: "Illinois, United States",
    bullets: [
      "Built a fraud detection platform for a state unemployment insurance agency, combining LogRocket clickstream data with batch claims, wage, and employer data in BigQuery and Snowflake.",
      "Engineered an event-driven ingestion pipeline (Cloud Functions, Scheduler, PySpark on Databricks) made idempotent with MERGE loads, retries, and alerting — feeding session- and user-level anomaly flags.",
      "Developed a SQL rules engine with versioned flag history and a Neo4j property-graph solution to surface cross-matches between linked claimants, behind an investigator portal with Document AI ID checks.",
      "Built a Google Contact Center AI voice agent automating employer service calls, integrated with backend data via OpenAPI and webhooks on Cloud Run, and load-tested with Locust.",
      "For Caliber Collision, built a real-time streaming pipeline predicting whether a vehicle needs calibration after repair, using BERT/Gemini to fill missing parts codes.",
    ],
  },
  {
    role: "Founding Engineer (Part Time)",
    company: "4142 Limited",
    period: "Oct 2024 — Apr 2026",
    location: "London, United Kingdom",
    bullets: [
      "Founding engineer of a startup valued at ~£8M, building four AI products (Squidgy, FanatiQ, YEAA, Handled).",
      "Built the Squidgy agentic platform (Python, PostgreSQL, Supabase, n8n, MCP), helping win 5 paying clients across the UK and Australia and supporting partnerships with NatWest.",
      "Delivered ElevenLabs voice agents and GoHighLevel sales funnels for clients, generating qualified leads and cutting turnaround times.",
    ],
  },
  {
    role: "Data Science Intern",
    company: "Spero Institute",
    period: "Jan 2024 — May 2024",
    location: "Texas, United States",
    bullets: [
      "Built a mental healthcare analytics platform bridging patients, providers, and insurers to ensure patients receive the right care and documentation.",
      "Integrated a predictive model recommending the required level of care from symptoms and measurement-based care metrics, learning from outcomes over time.",
      "Built ETL pipelines on AWS (S3, Glue, Redshift, Lambda) with PySpark plus Kafka streaming, processing clinical data using HL7 and FHIR standards.",
      "Added generative AI features with GPT-3, LangChain, and Pinecone, using Scale AI labeling to validate output quality for clinicians.",
    ],
  },
  {
    role: "Big Data Engineer / ETL Developer",
    company: "Infosys Limited",
    period: "2021 — 2023",
    location: "India",
    bullets: [
      "Built a data platform optimizing sales and ad spend across Amazon Ads, Facebook, Pinterest, DV360, The Trade Desk, and Google Analytics — unifying campaign, click, conversion, and spend data.",
      "Ingested platform data via scheduled batch jobs (Dagster, Azure Data Factory) and streaming feeds, processing it with PySpark/SparkSQL on Azure Databricks.",
      "Modeled cross-channel campaign performance (ROAS, CPA, spend pacing) with dbt, with validation and reconciliation checks.",
      "Delivered Tableau dashboards guiding the client's marketing team to shift budget toward the best-performing platforms.",
    ],
  },
  {
    role: "Freelance Web & API Developer",
    company: "Blastmymarket | Accuracast",
    period: "2018 — 2021",
    location: "Remote (United States & United Kingdom)",
    bullets: [
      "Built a browser extension and virtual handset (React, TypeScript, Node.js) with real-time engagement analytics via WebSockets, WebRTC, and Twilio on GCP.",
      "Built feed pipelines connecting a resort booking API to Google and Facebook listings using Python, cron, and XML generation.",
    ],
  },
];

export type Project = {
  title: string;
  description: string;
  tags: string[];
  context: string;
};

export const projects: Project[] = [
  {
    title: "Fraud Detection & Investigator Portal",
    description:
      "An event-driven fraud intelligence platform for a state unemployment agency: clickstream + batch claims data feed a SQL rules engine with versioned flag history and a Neo4j property-graph layer that surfaces cross-matches between linked claimants, backed by Document AI identity checks.",
    tags: ["BigQuery", "Snowflake", "Databricks", "Neo4j", "Cloud Functions", "Document AI"],
    context: "Egen Inc",
  },
  {
    title: "Contact Center AI Voice Agent",
    description:
      "A production Google Contact Center AI voice agent automating employer service calls end-to-end, wired into backend systems through OpenAPI and webhooks on Cloud Run, and load-tested with Locust before rollout.",
    tags: ["Dialogflow CX", "Google CCAI", "Cloud Run", "OpenAPI", "Locust"],
    context: "Egen Inc",
  },
  {
    title: "Collision Calibration Prediction Pipeline",
    description:
      "A real-time streaming pipeline predicting whether a vehicle needs recalibration after repair from its make, model, and parts list, using BERT/Gemini to fill in missing or inconsistent parts codes.",
    tags: ["Streaming", "BERT", "Gemini", "Real-time ML"],
    context: "Egen Inc · Caliber Collision",
  },
  {
    title: "Squidgy — Agentic Automation Platform",
    description:
      "One of four AI products at an early-stage startup: a multi-agent automation platform built on Python, PostgreSQL, and Supabase with n8n workflows over MCP, which helped win five paying clients across the UK and Australia.",
    tags: ["Python", "Supabase", "n8n", "MCP", "Multi-agent"],
    context: "4142 Limited",
  },
  {
    title: "Mental Healthcare Analytics Platform",
    description:
      "A clinical analytics platform bridging patients, providers, and insurers, with a predictive model recommending the right level of care from symptoms and outcomes, and GenAI features (GPT-3, LangChain, Pinecone) validated with clinician-reviewed labeling.",
    tags: ["AWS", "PySpark", "Kafka", "LangChain", "Pinecone", "HL7/FHIR"],
    context: "Spero Institute",
  },
  {
    title: "Cross-Channel Ad Spend Platform",
    description:
      "A unified data platform reconciling campaign, click, conversion, and spend data across Amazon Ads, Facebook, Pinterest, DV360, and The Trade Desk, modeled with dbt and surfaced through Tableau dashboards that shifted marketing budget to top performers.",
    tags: ["dbt", "Azure Databricks", "Dagster", "Tableau"],
    context: "Infosys Limited",
  },
];

export const education = {
  degree: "Master of Science in Data Science",
  school: "State University of New York at Buffalo",
  period: "Jan 2023 — Jun 2024",
  location: "Buffalo, New York, United States",
  gpa: "3.75",
};

export const certifications = [
  "Google Cloud Professional Data Engineer",
  "Microsoft Azure AZ-900",
  "Udacity: Data Analyst Nanodegree",
  "Udacity: Intro to Machine Learning with TensorFlow",
  "Udacity: Natural Language Processing",
  "Infosys Certified: Python and SQL",
  "DeepLearning.AI: Generative AI for Everyone",
  "DeepLearning.AI: ChatGPT Prompt Engineering",
];

export const publication = {
  title: "Augmented Reality — Published Research Paper",
  venue: "IJNIET (UGC-approved journal)",
  date: "January 2020",
};
