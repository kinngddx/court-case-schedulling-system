import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  req: Request, 
  { params }: { params: { id: string } }
) {
  const judgeId = params.id;

  try {
    await prisma.$transaction(async (tx) => {


      await tx.judge.update({
  where: { id: judgeId },
  data: { isAvailable: false }
});


            





      // 1. Find all scheduled hearings for this judge
      const hearings = await tx.hearing.findMany({
        where: {
          judgeId: judgeId,
          status: 'Scheduled'
        },
        include: { case: true }
      });

      // 2. Get case IDs
      const caseIds = hearings.map(h => h.caseId);





      // 3. Delete hearings
      await tx.hearing.deleteMany({
        where: {
          judgeId: judgeId,
          status: 'Scheduled'
        }
      });

      // 4. Update cases back to Pending
      await tx.case.updateMany({
        where: { id: { in: caseIds } },
        data: { status: 'Pending' }
      });
    });

    return NextResponse.json({ 
      message: "Judge on leave. Cases moved to pending.",
      success: true 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process leave" }, 
      { status: 500 }
    );
  }
}
