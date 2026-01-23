import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


//data retrieve krega bc yaaha pr

export async function GET() {
  const cases = await prisma.case.findMany();
  return NextResponse.json(cases);
}







export async function POST(request: Request) {
  const body = await request.json();
  
  const newCase = await prisma.case.create({
    data: {
      caseNumber: body.caseNumber,
      caseType: body.caseType,
      filedDate: new Date(body.filedDate),
      description: body.description,
    },
  });
  
  return NextResponse.json(newCase);
}