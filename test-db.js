const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { id: true, customerName: true, serviceMode: true, source: true, status: true, pickupDate: true, expectedVisitAt: true, createdAt: true }
  });
  console.log(JSON.stringify(leads, null, 2));
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
