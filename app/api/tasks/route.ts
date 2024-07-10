import { taskSchema } from "@/app/schemas/taskSchema";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
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

  const column = await prisma.column.findUnique({
    where: { id: body.columnId },
    include: { tasks: { select: { _count: true } } },
  });
  if (!column)
    return NextResponse.json({ message: "Column not found" }, { status: 404 });

  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  const createdTask = await prisma.task.create({
    data: {
      id: body.id,
      title: body.title,
      description: body.description,
      columnId: body.columnId,
      index: column?.tasks.length,
    },
  });

  await prisma.subtask.createMany({
    data: body.subtasks.map((subtask, index) => ({
      taskId: createdTask.id,
      title: subtask.title,
      checked: subtask.checked,
      index,
    })),
  });

  return NextResponse.json(createdTask, { status: 201 });
}
