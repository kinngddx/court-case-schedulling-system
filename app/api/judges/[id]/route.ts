import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update Judge (including availability)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Change to Promise
) {
  try {
    const { id } = await params; // 1. Unwrap params first
    const body = await req.json();
    
    const updated = await prisma.judge.update({
      where: { id: id },
      data: {
        name: body.name,
        expertise: body.expertise,
        maxCasesPerDay: body.maxCasesPerDay,
        isAvailable: body.isAvailable ?? true // Added for Leave System
      }
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Delete hearings first
    await prisma.hearing.deleteMany({
      where: { judgeId: id }
    });
    
    // Then delete judge
    await prisma.judge.delete({
      where: { id: id }
    });
    
    return NextResponse.json({ message: 'Judge deleted' });
  } catch (error) {
    console.error(error); // Check terminal for exact error
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}