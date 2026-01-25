import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



export async function GET() {
  try {
    const hearings = await prisma.hearing.findMany({
      include: {
        case: true,  // This joins the Case table
        judge: true, // This joins the Judge table
        court : true,
     
    },
      orderBy: {
        scheduledDate: 'asc',
      },
    });
    return NextResponse.json(hearings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hearings" }, { status: 500 });
  }
}