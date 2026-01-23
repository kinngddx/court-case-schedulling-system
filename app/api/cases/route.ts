
// import { Prisma } from '@prisma/client';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calculatePriority } from '@/lib/priority';

const prisma = new PrismaClient();

// rest of your code...

export async function POST(request: Request) {
  const body = await request.json();
  
  // Calculate case age
  const filedDate = new Date(body.filedDate);
  const today = new Date();
  const ageInDays = Math.floor((today.getTime() - filedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate priority
  const priorityScore = calculatePriority({
    caseAgeInDays: ageInDays,
    crimeSeverity: body.crimeSeverity || 3,
    isUndertrial: body.isUndertrial || false,
    isVictimVulnerable: body.isVictimVulnerable || false
  });
  
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
}



// ```

// ---

// ## Test:

// **Create judge:**
// ```
// // POST http://localhost:3000/api/judges
// {
//   "name": "Justice Sharma",
//   "expertise": ["Criminal", "Civil"],
//   "maxCasesPerDay": 5
// }


// // **Create case with priority:**
// ```
// // POST http://localhost:3000/api/cases
// {
//   "caseNumber": "CASE002",
//   "caseType": "Criminal",
//   "filedDate": "2024-06-15",
//   "description": "Assault case",
//   "crimeSeverity": 4,
//   "isUndertrial": true,
//   "isVictimVulnerable": false
// }