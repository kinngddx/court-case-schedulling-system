import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
  

    const pendingCases = await prisma.case.findMany({

        // console.log('Pending cases:', pendingCases.length);
      where: { status: "Pending" },
      orderBy: { priorityScore: "desc" },
    });


    console.log('=== SCHEDULER DEBUG ===');
console.log('Pending cases found:', pendingCases.length);
console.log('Case numbers:', pendingCases.map(c => c.caseNumber));

    // console.log('Pending cases:', pendingCases.length);

    
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




  
    const court = await prisma.court.findFirst();
    if (!court) return NextResponse.json({ error: "No courts available" }, { status: 400 });

    const createdHearings = [];

    //greedy use kiya hu
    for (const caseItem of pendingCases) {
      

//pehle expertise ke according
      const eligibleJudges = judges.filter((j) =>
        j.expertise.includes(caseItem.caseType)
      );




      if (eligibleJudges.length === 0) continue;

      //sort krna padega workload ke hisab se kaam dena hai 
      const bestJudge = eligibleJudges
        .sort((a, b) => a.hearings.length - b.hearings.length)[0];

      if (bestJudge.hearings.length >= bestJudge.maxCasesPerDay) continue;

    


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



      
      await prisma.case.update({
        where: { id: caseItem.id },
        data: { status: "Scheduled" },
      });

    
      
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