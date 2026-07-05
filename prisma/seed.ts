import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminEmail = 'admin@rentnest.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'RentNest#Admin2026';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  // Create categories
  const categories = [
    'Apartment',
    'House',
    'Studio',
    'Condo',
    'Duplex',
    'Villa'
  ];

  const categoryRecords: Record<string, string> = {};
  for (const name of categories) {
    const existing = await prisma.category.findUnique({ where: { name } });
    if (!existing) {
      const cat = await prisma.category.create({
        data: { name, description: `Standard ${name} category` },
      });
      categoryRecords[name] = cat.id;
      console.log(`Category created: ${name}`);
    } else {
      categoryRecords[name] = existing.id;
    }
  }

  // Create sample landlords
  const samplePassword = await bcrypt.hash('password123', 12);

  const landlord1 = await prisma.user.upsert({
    where: { email: 'landlord1@rentnest.com' },
    update: {},
    create: {
      name: 'John Smith',
      email: 'landlord1@rentnest.com',
      password: samplePassword,
      role: Role.LANDLORD,
      phone: '+1-555-0101',
      address: '456 Landlord Lane, New York, NY',
    },
  });
  console.log(`Landlord created/found: ${landlord1.email}`);

  const landlord2 = await prisma.user.upsert({
    where: { email: 'landlord2@rentnest.com' },
    update: {},
    create: {
      name: 'Sarah Johnson',
      email: 'landlord2@rentnest.com',
      password: samplePassword,
      role: Role.LANDLORD,
      phone: '+1-555-0102',
      address: '789 Property Ave, Los Angeles, CA',
    },
  });
  console.log(`Landlord created/found: ${landlord2.email}`);

  // Create sample tenants
  const tenant1 = await prisma.user.upsert({
    where: { email: 'tenant1@rentnest.com' },
    update: {},
    create: {
      name: 'Alice Williams',
      email: 'tenant1@rentnest.com',
      password: samplePassword,
      role: Role.TENANT,
      phone: '+1-555-0201',
      address: '101 Tenant Blvd, Chicago, IL',
    },
  });
  console.log(`Tenant created/found: ${tenant1.email}`);

  const tenant2 = await prisma.user.upsert({
    where: { email: 'tenant2@rentnest.com' },
    update: {},
    create: {
      name: 'Bob Davis',
      email: 'tenant2@rentnest.com',
      password: samplePassword,
      role: Role.TENANT,
      phone: '+1-555-0202',
      address: '202 Renter St, Houston, TX',
    },
  });
  console.log(`Tenant created/found: ${tenant2.email}`);

  // Create sample properties
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
      landlordId: landlord1.id,
    },
    {
      title: 'Cozy Studio near Central Park',
      description: 'A well-lit studio apartment just steps away from Central Park. Perfect for singles or couples.',
      location: 'New York',
      address: '350 West 72nd St, New York, NY 10023',
      rent: 1800,
      bedrooms: 1,
      bathrooms: 1,
      area: 500,
      amenities: ['wifi', 'laundry', 'elevator'],
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
      categoryId: categoryRecords['Studio'],
      landlordId: landlord1.id,
    },
    {
      title: 'Luxury LA Villa with Pool',
      description: 'A stunning 4-bedroom villa with a private pool, garden, and panoramic views of the Hollywood Hills.',
      location: 'Los Angeles',
      address: '8800 Sunset Blvd, Los Angeles, CA 90069',
      rent: 5500,
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      amenities: ['wifi', 'parking', 'pool', 'garden', 'security'],
      images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6'],
      categoryId: categoryRecords['Villa'],
      landlordId: landlord2.id,
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
      categoryId: categoryRecords['House'],
      landlordId: landlord2.id,
    },
  ];

  for (const prop of sampleProperties) {
    const existing = await prisma.property.findFirst({
      where: { title: prop.title, landlordId: prop.landlordId },
    });
    if (!existing) {
      await prisma.property.create({ data: prop });
      console.log(`Property created: ${prop.title}`);
    } else {
      console.log(`Property already exists: ${prop.title}`);
    }
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
