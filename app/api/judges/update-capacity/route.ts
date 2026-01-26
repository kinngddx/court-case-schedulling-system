import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



export async function POST() {
  await prisma.judge.updateMany({
    where: { isAvailable: true },
    data: { maxCasesPerDay: 20 }
  });
  
  return NextResponse.json({ message: 'All available judges capacity updated to 20' });
}