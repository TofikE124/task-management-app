import { taskSchema } from "@/app/schemas/taskSchema";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

  const deletedTask = await prisma.task.delete({
    where: { id },
    include: { subtasks: true },
  });

  await prisma.task.updateMany({
    where: { index: { gt: deletedTask.index } },
    data: { index: { decrement: 1 } },
  });

  return NextResponse.json(deletedTask, { status: 200 });
}

export async function PATCH(request: NextRequest, { params: { id } }: Props) {
  type taskSchemaType = z.infer<typeof taskSchema>;
  const body = (await request.json()) as taskSchemaType;

  const validation = taskSchema.safeParse(body);
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

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      columnId: body.columnId,
      title: body.title,
      description: body.description,
    },
    include: {
      subtasks: { orderBy: { index: "asc" } },
    },
  });

  const { subtasks } = body;

  await prisma.subtask.deleteMany({ where: { taskId: updatedTask.id } });
  await prisma.subtask.createMany({
    data: subtasks.map((subtask, index) => ({
      ...subtask,
      index,
      taskId: updatedTask.id,
    })),
  });

  return NextResponse.json(updatedTask, { status: 200 });
}
