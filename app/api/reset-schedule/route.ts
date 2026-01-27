import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



export async function POST() {
  await prisma.hearing.deleteMany({});
  await prisma.case.updateMany({
    data: { status: 'Pending' }
  });
  
  return NextResponse.json({ message: 'Schedule reset complete' });
}