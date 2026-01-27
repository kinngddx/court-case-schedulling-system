import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Judges


  const judges = await Promise.all([
    prisma.judge.create({
      data: { name: 'Justice Sharma', expertise: ['Criminal', 'Civil'], maxCasesPerDay: 5 }
    }),
    prisma.judge.create({
      data: { name: 'Justice Verma', expertise: ['Family', 'Civil'], maxCasesPerDay: 4 }
    }),
    prisma.judge.create({
      data: { name: 'Justice Kumar', expertise: ['Criminal'], maxCasesPerDay: 6 }
    }),
  ]);

  // Create Courts  

  const courts = await Promise.all([
    prisma.court.create({ data: { name: 'Court 1', location: 'Delhi', capacity: 1 } }),
    prisma.court.create({ data: { name: 'Court 2', location: 'Mumbai', capacity: 1 } }),
  ]);

  // cases create kiay jate
  const caseTypes = ['Criminal', 'Civil', 'Family'];
  for (let i = 1; i <= 50; i++) {
    await prisma.case.create({
      data: {
        caseNumber: `CASE${i.toString().padStart(3, '0')}`,
        caseType: caseTypes[Math.floor(Math.random() * caseTypes.length)],
        filedDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        description: `Test case ${i}`,
        priorityScore: Math.floor(Math.random() * 100),
      },
    });
  }

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());