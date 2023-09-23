// const { PrismaClient } = require('@prisma/client');

// /**
//  * [Prisma] チートシート
//  * https://qiita.com/koffee0522/items/92be1826f1a150bfe62e
//  */

// const globalForPrisma = global as unknown as { prisma: typeof PrismaClient };

// module.exports.client = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;


import { PrismaClient } from '@prisma/client';

/**
 * [Prisma] チートシート
 * https://qiita.com/koffee0522/items/92be1826f1a150bfe62e
 */

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// export const client = globalForPrisma.prisma || new PrismaClient();

export const client: PrismaClient = globalThis.PRISMA_CLIENT || new PrismaClient();


// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
if ( process.env.NODE_ENV !== "production" ) globalThis.PRISMA_CLIENT = client;
