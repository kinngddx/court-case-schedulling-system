import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // 1. Fetch pending cases sorted by priorityScore (100 is highest)
    const pendingCases = await prisma.case.findMany({

        // console.log('Pending cases:', pendingCases.length);
      where: { status: "Pending" },
      orderBy: { priorityScore: "desc" },
    });


    console.log('=== SCHEDULER DEBUG ===');
console.log('Pending cases found:', pendingCases.length);
console.log('Case numbers:', pendingCases.map(c => c.caseNumber));

    // console.log('Pending cases:', pendingCases.length);

    // 2. Fetch judges including their current scheduled hearings
    const judges = await prisma.judge.findMany({
       where: { isAvailable: true },
      include: {
        hearings: {
          where: { status: "Scheduled" }
        }
      }
    });



    console.log('Available judges:', judges.map(j => ({
  name: j.name,
  workload: j.hearings.length,
  maxCases: j.maxCasesPerDay
})));




    // 3. Fetch a default court (or first available)
    const court = await prisma.court.findFirst();
    if (!court) return NextResponse.json({ error: "No courts available" }, { status: 400 });

    const createdHearings = [];

    // 4. Greedy Assignment
    for (const caseItem of pendingCases) {
      // Filter by expertise
      const eligibleJudges = judges.filter((j) =>
        j.expertise.includes(caseItem.caseType)
      );

      if (eligibleJudges.length === 0) continue;

      // Sort by workload (number of hearings already assigned)
      // and check if they are under their maxCapacity
      const bestJudge = eligibleJudges
        .sort((a, b) => a.hearings.length - b.hearings.length)[0];

      if (bestJudge.hearings.length >= bestJudge.maxCasesPerDay) continue;

      // 5. Create the Hearing
      const hearing = await prisma.hearing.create({
        data: {
          caseId: caseItem.id,
          judgeId: bestJudge.id,
          courtId: court.id,
        //   scheduledDate: new Date(Date.now() + 86400000), // Schedules for tomorrow

        scheduledDate: new Date(Date.now() + Math.random() * 7 * 86400000),
          status: "Scheduled",
        },
      });

      // 6. Update Case Status
      await prisma.case.update({
        where: { id: caseItem.id },
        data: { status: "Scheduled" },
      });

      // Update local judge object so next loop sees increased workload
      bestJudge.hearings.push(hearing as any);
      createdHearings.push(hearing);
    }

    return NextResponse.json({
      message: "Scheduling completed",
      count: createdHearings.length,
    });
  } catch (error) {
    console.error("Scheduling error:", error);
    return NextResponse.json({ error: "Failed to schedule" }, { status: 500 });
  }
}