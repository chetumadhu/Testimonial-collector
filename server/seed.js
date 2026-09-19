require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Space = require('./models/Space');
const Testimonial = require('./models/Testimonial');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/testimonial_db');
    console.log('✅ Connected to MongoDB for seeding...');
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  await connectDB();

  try {
    console.log('🧹 Clearing existing collections...');
    await User.deleteMany({});
    await Space.deleteMany({});
    await Testimonial.deleteMany({});

    console.log('👤 Creating demo user...');
    const demoUser = await User.create({
      name: 'Alex Rivera',
      email: 'demo@trustpulse.io',
      password: 'password123',
      isVerified: true,
    });

    console.log(`Created user: ${demoUser.email} (password: password123)`);

    console.log('🏢 Creating demo spaces...');
    const space1 = await Space.create({
      owner: demoUser._id,
      name: 'Acme Cloud Platform',
      slug: 'acme-cloud',
      headerTitle: 'Tell us how Acme Cloud powers your workflow',
      customMessage: 'We love building for engineers and product teams. Tell us how Acme Cloud has helped scale your apps.',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      questions: [
        'What was the main reason you chose Acme Cloud?',
        'How much deployment time has your team saved?',
        'What would you tell someone considering our platform?',
      ],
      settings: {
        collectStarRating: true,
        mandatoryAvatar: false,
        thankYouTitle: 'You are awesome! 🎉',
        thankYouMessage: 'Thank you for giving us honest feedback. We read every single review!',
        redirectUrl: '',
        accentColor: '#10b981',
      },
    });

    const space2 = await Space.create({
      owner: demoUser._id,
      name: 'Apex Design Studio',
      slug: 'apex-design',
      headerTitle: 'Feedback for Apex Design Studio',
      customMessage: 'Thank you for collaborating with us. Let us know how your new brand and UI redesign impacted your team.',
      logoUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=120&auto=format&fit=crop&q=80',
      questions: [
        'How satisfied are you with the final design deliverables?',
        'Did our team meet your timelines and quality expectations?',
        'How has the redesign impacted your user engagement?',
      ],
      settings: {
        collectStarRating: true,
        mandatoryAvatar: false,
        thankYouTitle: 'Huge Thanks! ✨',
        thankYouMessage: 'Your testimonial helps our boutique studio grow and win dream clients.',
        redirectUrl: '',
        accentColor: '#6366f1',
      },
    });

    console.log('💬 Seeding realistic testimonials...');
    const demoTestimonials = [
      {
        spaceId: space1._id,
        clientName: 'Sarah Jenkins',
        clientEmail: 'sarah.j@datadrive.io',
        companyRole: 'Head of Engineering at DataDrive',
        rating: 5,
        reviewText:
          'Acme Cloud cut our deployment pipeline from 42 minutes down to under 4 minutes. The developer ergonomics and instant rollbacks give our team total confidence shipping multiple times a day.',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        status: 'approved',
        isFeatured: true,
        isLiked: true,
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        spaceId: space1._id,
        clientName: 'Marcus Vance',
        clientEmail: 'marcus@hypergrowth.co',
        companyRole: 'Co-Founder & CTO',
        rating: 5,
        reviewText:
          'Migrating from our legacy AWS cluster to Acme Cloud was effortlessly smooth. The edge routing and built-in SSL saved us thousands in devops consulting fees.',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        status: 'approved',
        isFeatured: true,
        isLiked: true,
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        spaceId: space1._id,
        clientName: 'Elena Rostova',
        clientEmail: 'elena@vortexscale.com',
        companyRole: 'VP of Product at Vortex',
        rating: 5,
        reviewText:
          'The observability dashboard is pure art. Our incident MTTR dropped by 65% in the very first month. Cannot imagine operating without it now.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'approved',
        isFeatured: true,
        isLiked: false,
        submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        spaceId: space1._id,
        clientName: 'David Chen',
        clientEmail: 'david@finflow.org',
        companyRole: 'Senior SRE at FinFlow',
        rating: 4,
        reviewText:
          'Extremely solid infrastructure and exceptional uptime. Support is prompt and technical. Looking forward to additional multi-region failover presets in upcoming releases.',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        status: 'approved',
        isFeatured: false,
        isLiked: true,
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        spaceId: space1._id,
        clientName: 'Priya Sharma',
        clientEmail: 'priya@synapseai.tech',
        companyRole: 'Founder & CEO at Synapse AI',
        rating: 5,
        reviewText:
          'Customer conversion on our landing page increased immediately once we integrated TrustPulse social proof widgets. It builds trust in seconds!',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        status: 'approved',
        isFeatured: false,
        isLiked: true,
        submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        spaceId: space1._id,
        clientName: 'Liam O’Connor',
        clientEmail: 'liam@craftflow.io',
        companyRole: 'Lead Architect',
        rating: 5,
        reviewText:
          'Just submitted this review! The public collection form was super fast and didn’t require any registration. A seamless experience.',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        status: 'pending', // In moderation inbox!
        isFeatured: false,
        isLiked: false,
        submittedAt: new Date(),
      },
      {
        spaceId: space1._id,
        clientName: 'Sophia Lin',
        clientEmail: 'sophia@orbitapp.co',
        companyRole: 'Growth Marketing Manager',
        rating: 4,
        reviewText:
          'Great product overall. The embed widget took under 2 minutes to drop into our Webflow site. Highly recommended.',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        status: 'pending', // In moderation inbox!
        isFeatured: false,
        isLiked: false,
        submittedAt: new Date(),
      },
      {
        spaceId: space1._id,
        clientName: 'Test User',
        clientEmail: 'spam@test.com',
        companyRole: 'Tester',
        rating: 2,
        reviewText: 'Archived test review for testing moderation inbox status filters.',
        avatarUrl: '',
        status: 'archived',
        isFeatured: false,
        isLiked: false,
        submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      // Space 2 reviews
      {
        spaceId: space2._id,
        clientName: 'Chloe Dupont',
        clientEmail: 'chloe@luxura.fr',
        companyRole: 'CMO at Luxura Paris',
        rating: 5,
        reviewText:
          'Apex Design completely transformed our digital brand identity. Our customer engagement surged by 120% within two weeks of launch.',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        status: 'approved',
        isFeatured: true,
        isLiked: true,
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        spaceId: space2._id,
        clientName: 'Julian Meyer',
        clientEmail: 'julian@neotech.de',
        companyRole: 'Product Director',
        rating: 5,
        reviewText:
          'Flawless design systems, pixel-perfect Figma components, and wonderful communication throughout. A premier studio in every sense.',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        status: 'approved',
        isFeatured: true,
        isLiked: true,
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ];

    await Testimonial.insertMany(demoTestimonials);
    console.log(`✅ Seeded ${demoTestimonials.length} demo testimonials.`);
    console.log('\n===========================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Credentials:');
    console.log('Email:    demo@trustpulse.io');
    console.log('Password: password123');
    console.log('Spaces:');
    console.log('1. /collect/acme-cloud -> Wall: /wall/acme-cloud');
    console.log('2. /collect/apex-design -> Wall: /wall/apex-design');
    console.log('===========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();
