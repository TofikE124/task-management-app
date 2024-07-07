import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function DELETE(request: NextRequest, { params: { id } }: Props) {
  const session = await getServerSession();

  if (!session?.user)
    return NextResponse.json(
      { message: "You are not allowed to do that" },
      { status: 401 }
    );

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 400 });

  const deletedColumn = await prisma.column.delete({
    where: { id },
    include: { tasks: { include: { subtasks: true } } },
  });

  await prisma.column.updateMany({
    where: { index: { gt: deletedColumn.index } },
    data: { index: { decrement: 1 } },
  });

  return NextResponse.json(deletedColumn, { status: 200 });
}
