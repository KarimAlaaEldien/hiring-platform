import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const jobSchema = new mongoose.Schema({
  title: String, company: String, location: String, type: String,
  salary: String, description: String, tags: [String],
  status: String, applicants: Number, createdAt: Date
}, { timestamps: false });

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return d; }

// ─── Data ────────────────────────────────────────────────────────────────────
const egyptianCompanies = [
  'Instabug','Paymob','Breadfast','Bosta','Swvl','Vezeeta','Halan','Elmenus',
  'Fawry','OLX Egypt','Jumia Egypt','MoneyFellows','Aman','Maxab','Robusta Studio',
  'Vodafone Egypt','Orange Egypt','Etisalat Egypt','eFinance','Banque Misr Digital',
  'CIB Egypt','Widebot','Dsquares','Klivvr','Trella','Flick','Thndr','Sarwa',
  'Letswork','Workfast','Toptal Egypt Office','Andela Egypt','Dell Egypt',
  'IBM Egypt','Microsoft Egypt','Amazon Egypt','SAP Egypt','Oracle Egypt',
  'Schneider Electric Egypt','Siemens Egypt','Valeo Egypt',
];

const globalCompanies = [
  'GitLab','Shopify','Stripe','Vercel','Figma','Notion','Linear','Loom',
  'Cloudflare','MongoDB Inc','Atlassian','DataDog','HashiCorp','PlanetScale',
  'Railway','Supabase','Fly.io','Render','DigitalOcean','Netlify',
];

const locations = {
  egypt: [
    'Cairo, Egypt (On-site)','Cairo, Egypt (Hybrid)','Smart Village, Giza (Hybrid)',
    'Maadi, Cairo (On-site)','Nasr City, Cairo (Hybrid)','New Cairo (Hybrid)',
    'Alexandria, Egypt (On-site)','Heliopolis, Cairo (On-site)',
    'Dokki, Giza (On-site)','October City, Giza (On-site)',
  ],
  remote: [
    'Remote (Egypt-based)','Remote (Worldwide)','Remote (EMEA)',
    'Remote (Africa & Middle East)',
  ],
};

const types = ['Full-time','Full-time','Full-time','Remote','Hybrid','Part-time','Contract'];

// ─── Job Templates ───────────────────────────────────────────────────────────
interface JobTemplate {
  title: string;
  tags: string[];
  egyptSalary: string;
  globalSalary: string;
  description: string;
}

const templates: JobTemplate[] = [
  // Frontend
  {
    title: 'Senior React Developer',
    tags: ['React','TypeScript','Redux Toolkit','Tailwind CSS','Jest','Vite'],
    egyptSalary: '$3,500 – $5,500 / month',
    globalSalary: '$120,000 – $170,000 / year',
    description: `We are looking for a **Senior React Developer** to lead frontend development of our core product.

### Responsibilities
- Architect and build scalable, high-performance React applications using TypeScript.
- Define coding standards, patterns, and reusable component libraries.
- Optimize rendering performance using memoization, lazy loading, and code splitting.
- Conduct thorough code reviews and mentor junior developers.
- Collaborate with designers to implement pixel-perfect UI from Figma.

### Requirements
- 4+ years of professional React experience.
- Strong TypeScript proficiency.
- Deep understanding of state management (Redux Toolkit, Zustand, or Jotai).
- Experience with testing (Jest, React Testing Library, Cypress).
- Familiarity with build tools (Vite, Webpack, Turbopack).

### What We Offer
- Competitive USD salary.
- Private health insurance.
- $1,500/year learning budget.
- Remote-first culture with flexible hours.`,
  },
  {
    title: 'Frontend Engineer – Next.js',
    tags: ['Next.js','React','TypeScript','Tailwind CSS','Prisma','tRPC'],
    egyptSalary: '$2,500 – $4,000 / month',
    globalSalary: '$100,000 – $145,000 / year',
    description: `We are hiring a **Next.js Frontend Engineer** to build and optimize our consumer-facing web application.

### Responsibilities
- Develop and maintain Next.js pages using the App Router and Server Components.
- Implement server-side rendering (SSR) and static site generation (SSG) strategies.
- Build fully responsive, accessible UI components with Tailwind CSS.
- Integrate tRPC and Prisma for type-safe full-stack development.
- Optimize Core Web Vitals and Lighthouse scores.

### Requirements
- 3+ years with React, 1+ year with Next.js App Router.
- Solid TypeScript skills.
- Experience with Tailwind CSS.
- Understanding of SEO and web performance optimization.
- Familiarity with CI/CD pipelines.

### What We Offer
- Competitive salary.
- Fully remote options available.
- 21 days PTO.
- Stock options or profit sharing.`,
  },
  {
    title: 'Vue.js Frontend Developer',
    tags: ['Vue.js','Nuxt.js','TypeScript','Pinia','Vuetify','GraphQL'],
    egyptSalary: '$2,000 – $3,500 / month',
    globalSalary: '$90,000 – $130,000 / year',
    description: `We are looking for a skilled **Vue.js Developer** to work on our enterprise SaaS platform.

### Responsibilities
- Build complex UI components and pages using Vue 3 Composition API and Nuxt.js.
- Integrate with GraphQL APIs using Apollo Client.
- Maintain and extend our Pinia-based state management architecture.
- Write unit tests using Vitest and end-to-end tests with Playwright.
- Participate in design reviews and sprint planning.

### Requirements
- 3+ years Vue.js experience (Vue 3 required).
- Experience with Nuxt.js 3 and server-side rendering.
- Solid TypeScript skills.
- GraphQL API integration experience.
- Strong CSS skills.`,
  },
  {
    title: 'React Native Mobile Developer',
    tags: ['React Native','TypeScript','Redux','Firebase','Expo','REST APIs'],
    egyptSalary: '$2,800 – $4,500 / month',
    globalSalary: '$110,000 – $155,000 / year',
    description: `Join our mobile team as a **React Native Developer** to build and scale our cross-platform app.

### Responsibilities
- Develop new features for our iOS and Android apps using React Native and TypeScript.
- Integrate with REST APIs, push notifications (FCM/APNs), and deep linking.
- Optimize app performance, reduce bundle size, and manage memory efficiently.
- Manage app releases on App Store and Google Play Store.
- Collaborate with backend engineers on API design.

### Requirements
- 3+ years React Native experience.
- Published at least one app on both App Store and Google Play.
- Strong TypeScript and Redux skills.
- Experience with Expo or bare React Native.
- Understanding of native modules when necessary.`,
  },
  // Backend
  {
    title: 'Senior Node.js Backend Engineer',
    tags: ['Node.js','NestJS','TypeScript','MongoDB','Redis','Docker','RabbitMQ'],
    egyptSalary: '$4,000 – $6,500 / month',
    globalSalary: '$140,000 – $190,000 / year',
    description: `We are hiring a **Senior Node.js Engineer** to design and build high-scale backend services.

### Responsibilities
- Design, build, and maintain microservices using NestJS and TypeScript.
- Build event-driven architectures with RabbitMQ or Kafka.
- Design and optimize MongoDB and Redis data models.
- Containerize services with Docker and deploy to Kubernetes.
- Lead technical design discussions and mentor mid-level engineers.

### Requirements
- 5+ years backend experience, 3+ with Node.js/NestJS.
- Expert TypeScript skills.
- Strong distributed systems knowledge.
- Experience with Docker, Kubernetes, and cloud platforms (AWS/GCP).
- Deep MongoDB and Redis knowledge.`,
  },
  {
    title: 'Python Backend Developer',
    tags: ['Python','FastAPI','PostgreSQL','SQLAlchemy','Celery','AWS','Docker'],
    egyptSalary: '$2,800 – $4,500 / month',
    globalSalary: '$120,000 – $165,000 / year',
    description: `We are looking for a **Python Backend Developer** to build scalable APIs and data services.

### Responsibilities
- Build and maintain RESTful APIs using Python and FastAPI.
- Design efficient PostgreSQL schemas and optimize queries.
- Implement async task queues with Celery and Redis.
- Deploy services to AWS (ECS, Lambda, RDS, SQS).
- Write comprehensive unit and integration tests using Pytest.

### Requirements
- 3+ years Python backend development.
- Strong experience with FastAPI or Django REST Framework.
- Solid PostgreSQL skills including query optimization.
- AWS experience (ECS, Lambda, S3).
- Familiarity with async programming (asyncio).`,
  },
  {
    title: 'Backend Engineer – Java Spring Boot',
    tags: ['Java','Spring Boot','Microservices','Kafka','PostgreSQL','Kubernetes','Jenkins'],
    egyptSalary: '$3,500 – $6,000 / month',
    globalSalary: '$130,000 – $180,000 / year',
    description: `We are hiring a **Java Spring Boot Engineer** to join our core platform team.

### Responsibilities
- Design and build scalable microservices using Java Spring Boot.
- Implement event-driven communication using Apache Kafka.
- Optimize PostgreSQL queries and design efficient data models.
- Build CI/CD pipelines with Jenkins or GitHub Actions.
- Participate in architecture reviews and code reviews.

### Requirements
- 4+ years Java development with Spring Boot.
- Strong microservices architecture experience.
- Deep Kafka or message queue knowledge.
- PostgreSQL or Oracle experience.
- Kubernetes deployment experience.`,
  },
  {
    title: 'Go (Golang) Backend Developer',
    tags: ['Go','gRPC','PostgreSQL','Redis','Kubernetes','Docker','Protocol Buffers'],
    egyptSalary: '$3,500 – $5,500 / month',
    globalSalary: '$140,000 – $195,000 / year',
    description: `We are looking for a **Go Developer** to build high-performance backend services.

### Responsibilities
- Write highly concurrent, performant services in Go.
- Design and implement gRPC APIs with Protocol Buffers.
- Build scalable event processing systems.
- Optimize PostgreSQL queries for high-throughput workloads.
- Manage Docker containerization and Kubernetes deployment.

### Requirements
- 3+ years of Go development.
- Deep understanding of Go concurrency patterns.
- Experience with gRPC and Protocol Buffers.
- PostgreSQL and Redis expertise.
- Kubernetes deployment experience.`,
  },
  {
    title: 'Ruby on Rails Developer',
    tags: ['Ruby','Rails','PostgreSQL','Redis','Sidekiq','RSpec','AWS'],
    egyptSalary: '$3,000 – $5,000 / month',
    globalSalary: '$120,000 – $165,000 / year',
    description: `We are hiring a **Ruby on Rails Developer** to maintain and extend our SaaS platform.

### Responsibilities
- Build and maintain Rails APIs and background jobs.
- Write high-quality tests with RSpec.
- Optimize PostgreSQL queries and ActiveRecord associations.
- Manage async processing with Sidekiq.
- Deploy and maintain AWS infrastructure.

### Requirements
- 3+ years Ruby on Rails experience.
- Strong PostgreSQL skills.
- Experience with Sidekiq and Redis.
- Test-driven development (RSpec/Minitest).
- AWS deployment experience.`,
  },
  // Full Stack
  {
    title: 'Full Stack Engineer – MERN',
    tags: ['MongoDB','Express','React','Node.js','TypeScript','Socket.io','Docker'],
    egyptSalary: '$2,500 – $4,000 / month',
    globalSalary: '$100,000 – $145,000 / year',
    description: `We are looking for a **MERN Stack Engineer** to build features across our entire web platform.

### Responsibilities
- Build React dashboards and Node.js/Express APIs.
- Design MongoDB schemas for complex domain models.
- Implement real-time features with Socket.io.
- Write tests for both frontend (Jest) and backend (Mocha/Chai).
- Collaborate with product and design teams in agile sprints.

### Requirements
- 3+ years MERN stack experience.
- Strong React and Node.js skills.
- MongoDB and Mongoose proficiency.
- Experience with WebSockets or real-time systems.
- Docker containerization experience.`,
  },
  {
    title: 'Full Stack Developer – Next.js + NestJS',
    tags: ['Next.js','NestJS','TypeScript','PostgreSQL','Prisma','AWS','GraphQL'],
    egyptSalary: '$2,000 – $3,500 / month',
    globalSalary: '$95,000 – $140,000 / year',
    description: `We are hiring a **Full Stack Developer** to work on our modern TypeScript-first platform.

### Responsibilities
- Build Next.js frontend with Server Components and App Router.
- Develop NestJS backend APIs with GraphQL.
- Design PostgreSQL schemas with Prisma ORM.
- Deploy infrastructure on AWS (ECS, RDS, CloudFront).
- Own features end-to-end from design to production.

### Requirements
- 3+ years full-stack development experience.
- Strong Next.js and NestJS knowledge.
- PostgreSQL and Prisma experience.
- GraphQL API design experience.
- AWS deployment experience.`,
  },
  // DevOps
  {
    title: 'DevOps Engineer – AWS',
    tags: ['AWS','Terraform','Kubernetes','Docker','GitHub Actions','Prometheus','Grafana'],
    egyptSalary: '$4,500 – $7,000 / month',
    globalSalary: '$140,000 – $190,000 / year',
    description: `We are looking for a **DevOps Engineer** to scale our cloud infrastructure.

### Responsibilities
- Manage and scale AWS infrastructure using Terraform (IaC).
- Build and maintain Kubernetes clusters on EKS.
- Design CI/CD pipelines with GitHub Actions.
- Set up monitoring and alerting with Prometheus, Grafana, and PagerDuty.
- Implement cost optimization strategies to reduce cloud spending.

### Requirements
- 4+ years DevOps/SRE experience.
- AWS certified (Solutions Architect or DevOps Engineer preferred).
- Expert Kubernetes knowledge.
- Strong Terraform and IaC expertise.
- Experience with Helm and GitOps (ArgoCD/Flux).`,
  },
  {
    title: 'Site Reliability Engineer (SRE)',
    tags: ['SRE','Kubernetes','GCP','Terraform','Python','Prometheus','Grafana','Incident Response'],
    egyptSalary: '$4,000 – $6,500 / month',
    globalSalary: '$145,000 – $200,000 / year',
    description: `We are hiring an **SRE** to ensure the reliability of our high-traffic platform.

### Responsibilities
- Define and enforce SLOs, SLIs, and error budgets.
- Build observability stack (metrics, logs, distributed tracing).
- Lead incident response and drive post-mortem culture.
- Automate operational toil with Python.
- Collaborate with engineering teams to improve reliability.

### Requirements
- 4+ years SRE or DevOps experience.
- Strong GCP or AWS knowledge.
- Kubernetes expertise.
- Proficiency in Python for automation.
- Experience with distributed tracing (Jaeger, Zipkin).`,
  },
  // Data / ML
  {
    title: 'Data Engineer',
    tags: ['Python','Apache Spark','Apache Airflow','BigQuery','dbt','SQL','Kafka'],
    egyptSalary: '$3,000 – $5,000 / month',
    globalSalary: '$120,000 – $165,000 / year',
    description: `We are looking for a **Data Engineer** to build the infrastructure powering our analytics.

### Responsibilities
- Design and build ETL/ELT pipelines using Apache Airflow and dbt.
- Process large-scale event data with Apache Spark.
- Maintain BigQuery or Redshift data warehouses.
- Build real-time streaming pipelines with Kafka.
- Collaborate with data scientists and analysts on data modeling.

### Requirements
- 3+ years data engineering experience.
- Strong SQL and Python skills.
- Experience with Airflow and Spark.
- dbt and data modeling expertise.
- Familiarity with streaming systems (Kafka/Kinesis).`,
  },
  {
    title: 'ML Engineer',
    tags: ['Python','PyTorch','TensorFlow','HuggingFace','MLflow','FastAPI','Docker'],
    egyptSalary: '$4,000 – $6,500 / month',
    globalSalary: '$140,000 – $195,000 / year',
    description: `We are hiring an **ML Engineer** to bridge research and production AI systems.

### Responsibilities
- Train, evaluate, and deploy ML models to production.
- Build model serving infrastructure with FastAPI and Docker.
- Implement MLOps practices (MLflow, DVC, feature stores).
- Monitor model performance and manage retraining pipelines.
- Collaborate with data scientists to productionize experiments.

### Requirements
- 3+ years ML engineering experience.
- Strong Python and PyTorch/TensorFlow skills.
- HuggingFace Transformers experience.
- MLOps knowledge (MLflow, Weights & Biases, DVC).
- Experience deploying models with Docker and Kubernetes.`,
  },
  // Mobile
  {
    title: 'iOS Developer – Swift',
    tags: ['Swift','SwiftUI','UIKit','Combine','Core Data','REST APIs','XCTest'],
    egyptSalary: '$3,000 – $5,000 / month',
    globalSalary: '$130,000 – $175,000 / year',
    description: `We are hiring an **iOS Developer** to build our flagship consumer app.

### Responsibilities
- Develop new features using Swift, SwiftUI, and UIKit.
- Integrate with REST APIs and push notification systems (APNs).
- Implement offline-first functionality using Core Data.
- Write comprehensive unit and UI tests using XCTest.
- Collaborate with Android developers for feature parity.

### Requirements
- 3+ years iOS development in Swift.
- Experience with both SwiftUI and UIKit.
- MVVM or Clean Architecture understanding.
- Combine or async/await concurrency experience.
- App Store publishing and review experience.`,
  },
  {
    title: 'Android Developer – Kotlin',
    tags: ['Kotlin','Jetpack Compose','Android','MVVM','Coroutines','Retrofit','Room'],
    egyptSalary: '$2,800 – $4,500 / month',
    globalSalary: '$120,000 – $165,000 / year',
    description: `We are looking for a **Kotlin Android Developer** to scale our Android application.

### Responsibilities
- Build new features using Kotlin and Jetpack Compose.
- Maintain and improve existing XML-based UI components.
- Integrate REST APIs using Retrofit and manage offline caching with Room.
- Reduce ANRs and crashes to maintain a 4.5+ Play Store rating.
- Participate in architecture discussions.

### Requirements
- 3+ years Android development in Kotlin.
- Jetpack Compose proficiency.
- MVVM with ViewModel and LiveData/StateFlow.
- Kotlin Coroutines for async operations.
- Retrofit and Room database experience.`,
  },
  // Design
  {
    title: 'Senior Product Designer (UI/UX)',
    tags: ['Figma','Design Systems','User Research','Prototyping','Usability Testing','Accessibility'],
    egyptSalary: '$2,500 – $4,500 / month',
    globalSalary: '$110,000 – $155,000 / year',
    description: `We are looking for a **Senior Product Designer** to shape user experiences for millions.

### Responsibilities
- Own end-to-end design: research, wireframes, high-fidelity UI, and interactive prototypes.
- Maintain and evolve our product design system.
- Conduct usability tests and translate insights into actionable design improvements.
- Collaborate with PMs and engineers in agile sprints.
- Champion accessibility and inclusive design principles.

### Requirements
- 4+ years product design experience.
- Expert Figma proficiency (components, variables, auto-layout).
- Experience designing for high-scale consumer or enterprise apps.
- Strong user research and data-driven design skills.
- Excellent communication skills.`,
  },
  // QA / Testing
  {
    title: 'QA Engineer – Automation',
    tags: ['Cypress','Playwright','Jest','Selenium','Python','CI/CD','API Testing'],
    egyptSalary: '$2,000 – $3,500 / month',
    globalSalary: '$90,000 – $130,000 / year',
    description: `We are hiring a **QA Automation Engineer** to ensure the quality of our product at scale.

### Responsibilities
- Design and maintain automated test suites using Cypress and Playwright.
- Build API testing frameworks using Python and PyTest.
- Integrate tests into CI/CD pipelines (GitHub Actions).
- Define and track quality metrics (test coverage, defect rate).
- Collaborate with developers to prevent regressions.

### Requirements
- 3+ years QA automation experience.
- Strong Cypress or Playwright skills.
- Python scripting for API test automation.
- CI/CD integration experience.
- Understanding of software testing methodologies.`,
  },
  // Cybersecurity
  {
    title: 'Security Engineer – AppSec',
    tags: ['Penetration Testing','OWASP','SAST','DAST','AWS Security','Python','Burp Suite'],
    egyptSalary: '$4,000 – $6,500 / month',
    globalSalary: '$140,000 – $195,000 / year',
    description: `We are hiring an **Application Security Engineer** to secure our platform.

### Responsibilities
- Perform penetration testing on web and mobile applications.
- Conduct security code reviews and threat modeling.
- Integrate SAST/DAST tools into CI/CD pipelines.
- Build and maintain our bug bounty program.
- Educate engineering teams on secure coding practices.

### Requirements
- 4+ years application security experience.
- OWASP Top 10 expertise.
- Experience with Burp Suite, OWASP ZAP, and penetration testing tools.
- Security certifications (OSCP, CEH, or CISSP) preferred.
- Python scripting for security automation.`,
  },
];

// ─── Seed ────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected. Clearing existing jobs...');
    await Job.deleteMany({});

    const docsToInsert: any[] = [];

    // 1. Egyptian companies: each template × 4-5 locations → ~100 jobs
    for (const tmpl of templates) {
      const egyptLocs = [...locations.egypt, ...locations.remote.slice(0,2)];
      for (let i = 0; i < 5; i++) {
        const company = rand(egyptianCompanies);
        const location = rand(egyptLocs);
        const type = location.includes('Remote') ? 'Remote' : rand(types);
        docsToInsert.push({
          title: tmpl.title,
          company,
          location,
          type,
          salary: tmpl.egyptSalary,
          tags: tmpl.tags,
          description: `**${company}** is one of the leading tech companies in the region.\n\n${tmpl.description}`,
          status: 'open',
          applicants: randInt(3, 200),
          createdAt: daysAgo(randInt(0, 45)),
        });
      }
    }

    // 2. Global companies: each template × 2 → ~40 jobs
    for (const tmpl of templates) {
      for (let i = 0; i < 2; i++) {
        const company = rand(globalCompanies);
        const location = rand(locations.remote);
        docsToInsert.push({
          title: tmpl.title,
          company,
          location,
          type: 'Remote',
          salary: tmpl.globalSalary,
          tags: tmpl.tags,
          description: `**${company}** is a globally recognized technology company.\n\n${tmpl.description}`,
          status: 'open',
          applicants: randInt(20, 500),
          createdAt: daysAgo(randInt(0, 30)),
        });
      }
    }

    console.log(`Inserting ${docsToInsert.length} jobs...`);
    await Job.insertMany(docsToInsert);
    console.log(`✅ ${docsToInsert.length} realistic jobs seeded successfully!`);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

seed();
