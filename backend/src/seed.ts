import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env');
  process.exit(1);
}

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  type: String,
  salary: String,
  description: String,
  tags: [String],
  status: String,
  applicants: Number,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: false });

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

const companies = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Stripe', 'Shopify', 'Netflix',
  'Uber', 'Airbnb', 'Twitter', 'LinkedIn', 'Spotify', 'Adobe', 'Salesforce',
  'Oracle', 'IBM', 'Apple', 'Tesla', 'Zoom', 'GitHub', 'Figma', 'Notion',
  'Atlassian', 'Slack', 'Dropbox', 'HubSpot', 'Twilio', 'Vercel',
  'Cloudflare', 'MongoDB Inc'
];

const titles = [
  'Senior Frontend Engineer', 'Backend Developer', 
  'Full Stack Engineer', 'React Developer', 'Node.js Engineer',
  'DevOps Engineer', 'UI/UX Designer', 'Mobile Developer',
  'Data Engineer', 'Software Engineer', 'TypeScript Developer',
  'NestJS Developer', 'Cloud Engineer', 'API Developer',
  'Database Administrator', 'Platform Engineer',
  'Security Engineer', 'QA Engineer', 'ML Engineer',
  'Solutions Architect'
];

const locations = [
  'Remote', 'New York NY', 'San Francisco CA', 'London UK',
  'Berlin Germany', 'Dubai UAE', 'Cairo Egypt',
  'Amsterdam Netherlands', 'Toronto Canada', 'Austin TX',
  'Seattle WA', 'Singapore'
];

const genericTagsCombinations = [
  ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  ["Node.js", "Express", "MongoDB", "REST API"],
  ["NestJS", "TypeScript", "PostgreSQL", "Docker"],
  ["React", "Redux", "JavaScript", "CSS3"],
  ["Python", "FastAPI", "PostgreSQL", "Redis"],
  ["Vue.js", "Nuxt.js", "TypeScript", "GraphQL"],
  ["React Native", "TypeScript", "Firebase", "Redux"],
  ["GraphQL", "Apollo", "MongoDB", "Node.js"],
  ["Docker", "Kubernetes", "AWS", "Terraform"],
  ["Next.js", "NestJS", "TypeScript", "MongoDB"],
  ["Swift", "iOS", "Xcode", "REST API"],
  ["Kotlin", "Android", "Firebase", "MVVM"],
  ["AWS", "Lambda", "S3", "CloudFormation"],
  ["React", "Node.js", "MySQL", "Sequelize"],
  ["Angular", "TypeScript", "RxJS", "NgRx"]
];

const salaries = [
  "$50k - $70k", "$70k - $90k", "$90k - $120k",
  "$120k - $150k", "$150k - $180k", "$180k - $220k", "$220k+"
];

const types = ["Full-time", "Part-time", "Remote", "Hybrid"];

function getDescription(title: string): string {
  const t = title.toLowerCase();
  
  const companyDescription = "We are an innovative, fast-growing company looking for passionate individuals to join our team. We value collaboration, diversity, and continuous learning.";
  
  let responsibilities = "";
  let requirements = "";
  
  if (t.includes('frontend') || t.includes('react') || t.includes('vue') || t.includes('angular') || t.includes('ui') && !t.includes('design')) {
    responsibilities = `- Build and maintain highly responsive user interfaces using modern web technologies like React and TypeScript.
- Collaborate with designers to translate Figma designs into pixel-perfect, accessible UI components.
- Optimize web applications for maximum speed and scalability across cross-browser environments.
- Participate in code reviews and mentor junior developers.
- Contribute to our internal component library and design system.`;
    requirements = `- 3+ years of professional experience in frontend development.
- Deep understanding of React, TypeScript, and modern CSS (Tailwind, Styled Components).
- Experience with state management (Redux, Zustand, Context API).
- Strong knowledge of web performance optimization techniques.
- Familiarity with testing frameworks like Jest or Cypress.`;
  } else if (t.includes('backend') || t.includes('node') || t.includes('nest') || t.includes('api') || t.includes('database')) {
    responsibilities = `- Design, build, and maintain scalable microservices and robust REST/GraphQL APIs.
- Optimize database schemas and queries for maximum performance (PostgreSQL, MongoDB).
- Work closely with frontend engineers to integrate APIs.
- Ensure high availability and system security across all services.
- Troubleshoot and debug complex backend issues.`;
    requirements = `- 4+ years of backend development experience.
- Strong proficiency in Node.js, NestJS, Python, or Go.
- Solid understanding of database design and optimization.
- Experience building scalable microservices and distributed systems.
- Familiarity with containerization and cloud platforms (AWS, GCP).`;
  } else if (t.includes('devops') || t.includes('cloud') || t.includes('platform') || t.includes('security')) {
    responsibilities = `- Design, implement, and maintain CI/CD pipelines for automated testing and deployment.
- Manage and scale cloud infrastructure using Infrastructure as Code (Terraform, CloudFormation).
- Ensure system health through robust monitoring and logging (Prometheus, Grafana, ELK).
- Containerize applications using Docker and orchestrate with Kubernetes.
- Implement security best practices across the platform.`;
    requirements = `- 3+ years of experience in a DevOps or SRE role.
- Strong knowledge of AWS, Azure, or Google Cloud.
- Proficiency in Kubernetes, Docker, and CI/CD tools (GitHub Actions, Jenkins).
- Scripting skills in Bash, Python, or Go.
- Experience with infrastructure as code (Terraform).`;
  } else if (t.includes('mobile') || t.includes('ios') || t.includes('android') || t.includes('swift') || t.includes('kotlin')) {
    responsibilities = `- Lead the development of our flagship mobile application.
- Deliver a smooth and responsive mobile user experience with offline support.
- Optimize application performance and memory usage.
- Manage seamless deployment to the Apple App Store and Google Play Store.
- Collaborate with product managers to define new features.`;
    requirements = `- 3+ years of mobile development experience (iOS/Android/React Native).
- Strong understanding of mobile UI/UX principles.
- Experience with state management, caching, and offline data sync.
- Familiarity with CI/CD for mobile apps.
- Proven track record of publishing high-quality apps.`;
  } else if (t.includes('design') || t.includes('ui/ux')) {
    responsibilities = `- Lead the creation of comprehensive design systems and component libraries.
- Conduct impactful user research, interviews, and usability testing.
- Create wireframes, user flows, and interactive prototypes using Figma.
- Collaborate closely with product managers and engineers to ensure implementation matches design.
- Advocate for user-centric design principles across the organization.`;
    requirements = `- 4+ years of experience in Product Design or UI/UX Design.
- Exceptional portfolio demonstrating intuitive user experiences and visual design skills.
- Expert proficiency in Figma and prototyping tools.
- Strong understanding of design systems and responsive design.
- Excellent communication and presentation skills.`;
  } else {
    responsibilities = `- Take ownership of complex technical challenges and drive product innovation.
- Collaborate with cross-functional teams to deliver high-quality software.
- Write clean, maintainable, and well-tested code.
- Participate in agile ceremonies and sprint planning.
- Mentor team members and promote best engineering practices.`;
    requirements = `- Solid experience in software engineering and architecture.
- Strong problem-solving and analytical skills.
- Proficiency in modern programming languages and frameworks.
- Excellent communication and teamwork abilities.
- Passion for learning and adapting to new technologies.`;
  }

  return `${companyDescription}\n\n### About the Role\n${responsibilities}\n\n### Requirements\n${requirements}\n\n### What we offer\n- Competitive salary and equity packages\n- Fully remote or hybrid work options\n- Comprehensive health, dental, and vision insurance\n- $2,000 annual learning and development budget\n- Flexible PTO and paid parental leave`;
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getTagsForRole(title: string): string[] {
  if (title === 'UI/UX Designer') {
    const designTags = [
      ["Figma", "Adobe XD", "Sketch", "Prototyping"],
      ["Figma", "User Research", "Wireframing", "Design Systems"],
      ["Adobe XD", "Illustrator", "Photoshop", "UI Design"],
      ["Figma", "Framer", "Motion Design", "Component Design"]
    ];
    return getRandomItem(designTags);
  }
  if (title === 'QA Engineer') return ["Selenium", "Jest", "Cypress", "Testing"];
  if (title === 'Data Engineer') return ["Python", "Spark", "Kafka", "Airflow"];
  if (title === 'ML Engineer') return ["Python", "TensorFlow", "PyTorch", "Scikit-learn"];
  if (title === 'Solutions Architect') return ["AWS", "Azure", "System Design", "Microservices"];
  if (title === 'Security Engineer') return ["Penetration Testing", "OWASP", "Cybersecurity", "AWS"];
  if (title === 'Database Administrator') return ["MySQL", "PostgreSQL", "MongoDB", "Redis"];
  
  return getRandomItem(genericTagsCombinations);
}

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected.');

    console.log('Deleting existing jobs...');
    await Job.deleteMany({});
    
    console.log('Inserting 200 new jobs...');
    const jobsToInsert = [];
    const now = new Date();

    for (let i = 0; i < 200; i++) {
      const company = getRandomItem(companies);
      const title = getRandomItem(titles);
      const location = getRandomItem(locations);
      const type = getRandomItem(types);
      const tags = getTagsForRole(title);
      const salary = getRandomItem(salaries);
      
      const applicants = getRandomInt(5, 230);
      const daysAgo = Math.floor(Math.random() * 60);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      jobsToInsert.push({
        title,
        company,
        location,
        type,
        salary,
        description: getDescription(title),
        tags,
        status: "open",
        applicants,
        createdAt
      });
    }

    await Job.insertMany(jobsToInsert);
    console.log('✅ 200 jobs seeded successfully');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();
