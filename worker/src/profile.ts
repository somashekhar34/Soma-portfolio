// Condensed background used as grounding context for the fit-analysis model.
// Keep this in sync with the portfolio's src/data/resume.ts by hand; this
// worker is deployed separately from the static site and doesn't import it.
export const CANDIDATE_CONTEXT = `
Name: Somasekhar Addakula
Title: Data Engineer
Certification: Google Cloud Professional Data Engineer
Education: MS in Data Science, State University of New York at Buffalo (GPA 3.75)

SUMMARY:
Data engineer with 4+ years designing data models, warehouses, and ETL/ELT pipelines
in SQL, Spark SQL, and Python across AWS, Azure Databricks, GCP, and Snowflake. Builds
customer service and support data (including a production Contact Center AI agent for
service calls), security and fraud data intelligence with risk flags and anomaly
detection, and generative AI / agentic AI / knowledge-graph data foundations. Owns data
quality, monitoring, on-call incident response, root-cause analysis, security and
compliance standards, and mentors engineers.

SKILLS:
Languages & SQL: Python, SQL, PySpark, Spark SQL, TypeScript, JavaScript, C, BigQuery TVFs, MERGE/UPDATE DML
Cloud: AWS (S3, Glue, EMR, Redshift, Lambda, Kinesis, DynamoDB, Step Functions), GCP (BigQuery, Dataflow, Dataproc, Pub/Sub, Cloud Run, Cloud Composer), Azure (Data Factory, Databricks, Synapse, Event Hubs, Entra ID)
Warehousing & DBs: Snowflake, BigQuery, Redshift, PostgreSQL, MySQL, Oracle, Firestore, Supabase, Neo4j, Redis, Pinecone
Orchestration: dbt, Airflow/Cloud Composer, Dagster, Azure Data Factory, Cloud Scheduler, n8n
Generative & Conversational AI: LLMs, LangChain, GPT/Gemini/BERT, Prompt Engineering, Vector Retrieval, Dialogflow CX, Google Contact Center AI (CCAI), ElevenLabs, Hugging Face Transformers
Web/Backend: Flask, FastAPI, Node.js, React, Angular, WebSockets, WebRTC, Twilio, REST/OpenAPI
ML, BI & DevOps: scikit-learn, TensorFlow, Keras, Tableau, Power BI, Looker Studio, Terraform, Git, pytest, Locust, Kafka

EXPERIENCE:
- Data Engineer, Egen Inc (2024-Present, Illinois, US): Built a fraud detection platform for a state unemployment
  insurance agency combining clickstream + batch claims/wage/employer data in BigQuery/Snowflake. Engineered
  event-driven ingestion pipelines (Cloud Functions, Scheduler, PySpark on Databricks). Developed a SQL rules
  engine with a Neo4j property-graph solution to surface cross-matches between linked claimants, behind an
  investigator portal with Document AI ID checks. Built a Google Contact Center AI voice agent automating
  employer service calls (OpenAPI, webhooks, Cloud Run, load-tested with Locust). Built a real-time streaming
  pipeline for Caliber Collision predicting vehicle recalibration needs using BERT/Gemini.
- Data Engineer, Infosys Limited (2021-2023, India): Built a data platform optimizing ad spend across Amazon Ads,
  Facebook, Pinterest, DV360, The Trade Desk, Google Analytics. Ingested via Dagster/Azure Data Factory batch jobs
  and streaming feeds, processed with PySpark/Spark SQL on Azure Databricks. Modeled campaign performance (ROAS,
  CPA) with dbt. Delivered Tableau dashboards.
- Data Science Intern, Spero Institute (Jan-May 2024, Texas, US): Built a mental healthcare analytics platform
  bridging patients, providers, and insurers. Integrated a predictive model for level-of-care recommendations.
  Built ETL pipelines on AWS (S3, Glue, Redshift, Lambda) with PySpark plus Kafka streaming, processing clinical
  data using HL7/FHIR standards. Added generative AI features with GPT-3, LangChain, Pinecone.
- Founding Engineer (Part Time), 4142 Limited (London, UK): Founding engineer of an AI startup (~GBP 8M valuation)
  building four AI products (Squidgy, FanatiQ, YEAA, Handled). Built the Squidgy agentic automation platform
  (Python, PostgreSQL, Supabase, n8n, MCP), helping win paying clients across the UK and Australia.

FREELANCE / CLIENT WORK: Accuracast (digital marketing agency, web/API dev), Blastmymarket (AI agents/automated
outreach platform, browser extension + virtual handset with real-time analytics), True Colors (dating app,
app features), Quick3PL (industrial equipment sourcing/3PL, sales outreach + logistics integrations with
ImportYeti), Hot Brass Orlando (indoor shooting range, built and maintains their website).

DOMAIN STRENGTHS: data engineering & warehousing, ETL/ELT, data modeling, fraud/security analytics, generative
and agentic AI data foundations, conversational AI / contact center AI, knowledge graphs, cloud platform
engineering (AWS/GCP/Azure), BI/reporting, mentoring engineers, on-call/incident response, startup + freelance
experience (comfortable in ambiguous, fast-moving environments as well as structured enterprise teams).
`.trim();
