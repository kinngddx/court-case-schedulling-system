import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  await prisma.judge.updateMany({
    data: { isAvailable: true }
  });
  
  return NextResponse.json({ message: 'All judges available again' });
}