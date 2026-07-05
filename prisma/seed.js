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
    }
    else {
        console.log(`Admin user already exists: ${adminEmail}`);
    }
    const categories = [
        'Apartment',
        'House',
        'Studio',
        'Condo',
        'Duplex',
        'Villa'
    ];
    for (const name of categories) {
        const existing = await prisma.category.findUnique({ where: { name } });
        if (!existing) {
            await prisma.category.create({
                data: { name, description: `Standard ${name} category` },
            });
            console.log(`Category created: ${name}`);
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
