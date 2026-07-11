import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning database...');

  // 1. Clean the database
  // Remove all payments, reviews, rental requests, properties, categories, and users
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.rentalRequest.deleteMany();
  await prisma.property.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('Database cleaned completely.');

  console.log('Seeding database...');

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@rentnest.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'RentNestAdmin2026';
  const hashedPassword = await bcrypt.hash(adminPassword, Number(process.env.BCRYPT_SALT_ROUNDS) || 12);

  await prisma.user.create({
    data: {
      name: 'System Admin',
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`Admin user created: ${adminEmail}`);

  // Create exactly 5 meaningful categories
  const categories = [
    'Apartment',
    'Suburban House',
    'Luxury Villa',
    'Commercial Space',
    'Vacation Cabin'
  ];

  const categoryRecords: Record<string, string> = {};
  for (const name of categories) {
    const cat = await prisma.category.create({
      data: { name, description: `High quality ${name} properties` },
    });
    categoryRecords[name] = cat.id;
    console.log(`Category created: ${name}`);
  }

  // Create exactly 2 landlord accounts
  const samplePassword = await bcrypt.hash('password123', Number(process.env.BCRYPT_SALT_ROUNDS) || 12);

  const landlord1 = await prisma.user.create({
    data: {
      name: 'John Smith',
      email: 'landlord1@rentnest.com',
      password: samplePassword,
      role: Role.LANDLORD,
      phone: '+1-555-0101',
      address: '456 Landlord Lane, New York, NY',
    },
  });
  console.log(`Landlord created: ${landlord1.email}`);

  const landlord2 = await prisma.user.create({
    data: {
      name: 'Sarah Johnson',
      email: 'landlord2@rentnest.com',
      password: samplePassword,
      role: Role.LANDLORD,
      phone: '+1-555-0102',
      address: '789 Property Ave, Los Angeles, CA',
    },
  });
  console.log(`Landlord created: ${landlord2.email}`);

  // Create exactly 1 property assigned to each landlord
  const sampleProperties = [
    {
      title: 'Modern Downtown Apartment',
      description: 'A spacious 2-bedroom apartment in the heart of downtown with city views and modern amenities.',
      location: 'New York',
      address: '100 Broadway, New York, NY 10005',
      rent: 2500,
      bedrooms: 2,
      bathrooms: 2,
      area: 950,
      amenities: ['wifi', 'parking', 'gym', 'doorman'],
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
      categoryId: categoryRecords['Apartment'],
      landlordId: landlord1.id, // Assigned to Landlord 1
    },
    {
      title: 'Family-Friendly Suburban House',
      description: 'A charming 3-bedroom house in a quiet suburban neighborhood with a large backyard and garage.',
      location: 'Los Angeles',
      address: '1234 Oak Drive, Pasadena, CA 91101',
      rent: 3200,
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      amenities: ['wifi', 'parking', 'backyard', 'garage'],
      images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994'],
      categoryId: categoryRecords['Suburban House'],
      landlordId: landlord2.id, // Assigned to Landlord 2
    }
  ];

  for (const prop of sampleProperties) {
    await prisma.property.create({ data: prop });
    console.log(`Property created: ${prop.title}`);
  }

  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
