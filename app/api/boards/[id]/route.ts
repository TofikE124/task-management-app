import { boardSchema } from "@/app/schemas/boardSchema";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params: { id } }: Props) {
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
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  const board = await prisma.board.findUnique({ where: { id } });

  if (!board)
    return NextResponse.json({ message: "Board not found" }, { status: 404 });

  return NextResponse.json(board, { status: 200 });
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
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  const deletedBoard = await prisma.board.delete({
    where: { id },
    include: {
      columns: { include: { tasks: { include: { subtasks: true } } } },
    },
  });

  await prisma.board.updateMany({
    where: { index: { gt: deletedBoard.index } },
    data: {
      index: { decrement: 1 },
    },
  });

  return NextResponse.json(deletedBoard, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  type boardSchemaType = z.infer<typeof boardSchema>;
  const body = (await request.json()) as boardSchemaType;
  const validation = boardSchema.safeParse(body);

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

  const updatedBoard = await prisma.board.update({
    where: { id: body.id },
    data: { title: body.title },
    include: { columns: true },
  });

  const existingColumns = await prisma.column.findMany({
    where: { boardId: updatedBoard.id },
  });

  const columnsToDelete = existingColumns.filter(
    (column) => !body.columns.find((col) => col.id === column.id)
  );

  const columnsToAdd = body.columns.filter(
    (column) => !existingColumns.find((col) => col.id == column.id)
  );

  const columnsToModify = body.columns.filter((column) =>
    existingColumns.find((col) => col.id == column.id)
  );

  await prisma.column.deleteMany({
    where: {
      id: { in: columnsToDelete.map((col) => col.id) },
    },
  });

  await prisma.column.createMany({
    data: columnsToAdd.map((col) => ({
      boardId: updatedBoard.id,
      color: "#fff",
      title: col.title,
      index: body.columns.findIndex((c) => c.id == col.id),
    })),
  });

  for (const column of columnsToModify) {
    await prisma.column.update({
      where: { id: column.id },
      data: {
        title: column.title,
        index: body.columns.findIndex((c) => c.id == column.id),
      },
    });
  }

  return NextResponse.json(updatedBoard, { status: 200 });
}
