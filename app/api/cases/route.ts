export const dynamic = "force-dynamic";    //dynamic forcefully kiya gya hai wrna static smj rha tha wo
export const revalidate = 0;


import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calculatePriority } from '@/lib/priority';


const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();


    
    
    //yaha pr case kitne din se chl rha wo nikal liya
    const filedDate = new Date(body.filedDate);
    const today = new Date();
    const ageInDays = Math.floor((today.getTime() - filedDate.getTime()) / (1000 * 60 * 60 * 24));
    
  //priority nikal lunga kitna score dena hai

    const priorityScore = calculatePriority({
      caseAgeInDays: ageInDays,
      crimeSeverity: body.crimeSeverity || 3,
      isUndertrial: body.isUndertrial || false,
      isVictimVulnerable: body.isVictimVulnerable || false
    });
    

    //new case ka option bhhi diya hu
    const newCase = await prisma.case.create({
      data: {
        caseNumber: body.caseNumber,
        caseType: body.caseType,
        filedDate: filedDate,
        description: body.description,
        priorityScore: priorityScore,
      },
    });
    


    return NextResponse.json(newCase);
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}

export async function GET() {
  try {
  
    const cases = await prisma.case.findMany({
      orderBy: { priorityScore: 'desc' }
    });
    return NextResponse.json(cases);
  } catch (error) {
    console.error("GET Error:", error);

    
    // Build time par crash hone se bachne ke liye empty array return karega
    return NextResponse.json([], { status: 200 }); 
  }
}