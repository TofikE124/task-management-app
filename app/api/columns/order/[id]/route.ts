import { moveBoardSchema } from "@/app/schemas/moveSchemas/moveBoardSchema";
import { moveColumnSchema } from "@/app/schemas/moveSchemas/moveColumnSchema";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params: { id } }: Props) {
  type moveColumnSchemaType = z.infer<typeof moveColumnSchema>;
  const body = (await request.json()) as moveColumnSchemaType;

  const validation = moveBoardSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

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

  const { boardId, beforeId } = body;

  const columns = await prisma.column.findMany({
    where: { boardId },
    orderBy: { index: "asc" },
  });

  const index1 = columns.findIndex((col) => col.id == id);
  const index2 = columns.findIndex((col) => col.id == beforeId);

  if (index1 > index2) {
    await prisma.column.updateMany({
      where: { index: { gte: index2, lt: index1 } },
      data: { index: { increment: 1 } },
    });

    await prisma.column.update({
      where: { id: id },
      data: { index: index2 },
    });
  } else if (index2 > index1) {
    await prisma.column.updateMany({
      where: { index: { lte: index2, gt: index1 } },
      data: { index: { decrement: 1 } },
    });

    await prisma.column.update({
      where: { id: id },
      data: { index: index2 },
    });
  }

  const updatedColumns = await prisma.column.findMany({ where: { boardId } });
  return NextResponse.json(updatedColumns, { status: 200 });
}
