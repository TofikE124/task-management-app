import { moveBoardSchema } from "@/app/schemas/moveSchemas/moveBoardSchema";
import { moveTaskSchema } from "@/app/schemas/moveSchemas/moveTaskSchema";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params: { id } }: Props) {
  type moveTaskSchemaType = z.infer<typeof moveTaskSchema>;
  const body = (await request.json()) as moveTaskSchemaType;

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

  const { boardId, beforeId, columnId, newColumnId } = body;
  const tasks = await prisma.task.findMany({
    where: { columnId },
    orderBy: { index: "asc" },
  });
  const index1 = tasks.findIndex((t) => t.id == id);

  if (columnId == newColumnId) {
    let index2 =
      beforeId == "-1"
        ? tasks.length
        : tasks.findIndex((t) => t.id == beforeId);
    index2 = index2 > index1 ? index2 - 1 : index2;

    if (index1 > index2)
      await prisma.task.updateMany({
        where: { columnId: columnId, index: { gte: index2, lt: index1 } },
        data: { index: { increment: 1 } },
      });
    else if (index2 > index1)
      await prisma.task.updateMany({
        where: { columnId: columnId, index: { lte: index2, gt: index1 } },
        data: { index: { decrement: 1 } },
      });

    await prisma.task.update({
      where: { id: id },
      data: { index: index2 },
    });
  } else {
    await prisma.task.updateMany({
      where: { columnId, index: { gt: index1 } },
      data: { index: { decrement: 1 } },
    });

    const newColumnTasks = await prisma.task.findMany({
      where: { columnId: newColumnId },
    });

    const index2 =
      beforeId == "-1"
        ? newColumnTasks.length
        : newColumnTasks.findIndex((t) => t.id == beforeId);

    await prisma.task.updateMany({
      where: { columnId: newColumnId, index: { gte: index2 } },
      data: { index: { increment: 1 } },
    });

    await prisma.task.update({
      where: { id: id },
      data: { columnId: newColumnId, index: index2 },
    });
  }
  const updatedColumns = await prisma.column.findMany({ where: { boardId } });
  return NextResponse.json(updatedColumns, { status: 200 });
}
