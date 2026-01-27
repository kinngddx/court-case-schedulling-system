import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const judges = await prisma.judge.findMany({
    include: {
      hearings: {
        where: {
          status: 'Scheduled'
        }
      }
    }
  });
  
  // Calculate workload kiya hu
  const judgesWithWorkload = judges.map(judge => ({
    ...judge,
    currentWorkload: judge.hearings.length,
    availableCapacity: judge.maxCasesPerDay - judge.hearings.length
  }));
  
  return NextResponse.json(judgesWithWorkload);
}



export async function POST(request: Request) {
  const body = await request.json();
  

  //new judge dalne ke liye hai 
  const newJudge = await prisma.judge.create({
    data: {
      name: body.name,
      expertise: body.expertise,
      maxCasesPerDay: body.maxCasesPerDay || 5,
    },
  });
  
  return NextResponse.json(newJudge);
}