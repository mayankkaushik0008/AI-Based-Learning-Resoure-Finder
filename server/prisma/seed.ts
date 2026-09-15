import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo users
  const hashedPassword = await bcrypt.hash('demo123', 12);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@learnwise.ai' },
    update: {},
    create: {
      email: 'demo@learnwise.ai',
      password: hashedPassword,
      name: 'Demo User',
      educationLevel: 'Undergraduate',
      fieldOfStudy: 'Computer Science',
      skillLevel: 'INTERMEDIATE',
      interests: ['Web Development', 'Machine Learning', 'Data Science'],
      preferredResources: ['VIDEO', 'TUTORIAL', 'ARTICLE'],
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@learnwise.ai' },
    update: {},
    create: {
      email: 'admin@learnwise.ai',
      password: hashedPassword,
      name: 'Admin User',
      educationLevel: 'Postgraduate',
      fieldOfStudy: 'Computer Science',
      skillLevel: 'ADVANCED',
      isAdmin: true,
      interests: ['AI', 'Education Technology'],
      preferredResources: ['PAPER', 'DOCUMENTATION', 'ARTICLE'],
    },
  });

  console.log('✅ Users created:', {
    demo: demoUser.email,
    admin: adminUser.email,
  });

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      userId: demoUser.id,
      title: 'AI Chatbot with NLP',
      description: 'Building an intelligent chatbot using natural language processing and machine learning techniques',
      domain: 'Artificial Intelligence',
      technologies: ['Python', 'TensorFlow', 'Flask', 'Natural Language Processing'],
      skillLevel: 'INTERMEDIATE',
      projectType: 'ACADEMIC',
      currentStage: 'LEARNING',
      goals: 'Learn NLP fundamentals and build a functional chatbot',
      progress: 35,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      userId: demoUser.id,
      title: 'E-commerce Platform with React',
      description: 'Full-stack e-commerce application with user authentication, product catalog, and payment integration',
      domain: 'Web Development',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
      skillLevel: 'INTERMEDIATE',
      projectType: 'PERSONAL',
      currentStage: 'DEVELOPMENT',
      goals: 'Build a complete e-commerce solution',
      progress: 60,
    },
  });

  console.log('✅ Projects created:', project1.title, project2.title);

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
