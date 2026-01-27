import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



export async function GET() {
  try {
    const hearings = await prisma.hearing.findMany({
      include: {
        case: true,  //case table and judge table jud jayega isses
        judge: true, 
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