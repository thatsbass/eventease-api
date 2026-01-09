import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import { Roles } from '../src/common/constants/roles.constant';
import { Permissions } from '../src/common/constants/permissions.constant';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    /* =========================
       PERMISSIONS
       ========================= */

    const permissions = Object.values(Permissions);

    for (const name of permissions) {
        await prisma.permission.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    /* =========================
       ROLES + RELATIONS
       ========================= */

    // Admin
    await prisma.role.upsert({
        where: { name: Roles.ADMIN },
        update: {},
        create: {
            name: Roles.ADMIN,
            permissions: {
                connect: permissions.map((name) => ({ name })),
            },
        },
    });

    // Organizer
    await prisma.role.upsert({
        where: { name: Roles.ORGANIZER },
        update: {},
        create: {
            name: Roles.ORGANIZER,
            permissions: {
                connect: [
                    { name: Permissions.CREATE_EVENT },
                    { name: Permissions.UPDATE_EVENT },
                    { name: Permissions.DELETE_EVENT },
                    { name: Permissions.SCAN_TICKET },
                ],
            },
        },
    });

    // Participant
    await prisma.role.upsert({
        where: { name: Roles.PARTICIPANT },
        update: {},
        create: {
            name: Roles.PARTICIPANT,
            permissions: {
                connect: [
                    { name: Permissions.BUY_TICKET },
                ],
            },
        },
    });

    console.log('✅ Roles & permissions seeded correctly');
}

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
