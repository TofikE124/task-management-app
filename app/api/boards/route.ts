import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { boardSchema } from "./../../schemas/boardSchema";

export async function GET(request: NextRequest) {
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

  const boards = await prisma.board.findMany({
    where: { user: user! },
    include: {
      columns: {
        orderBy: { index: "asc" },
        include: {
          tasks: {
            orderBy: { index: "asc" },
            include: { subtasks: { orderBy: { index: "asc" } } },
          },
        },
      },
    },
    orderBy: { index: "asc" },
  });
  return NextResponse.json(boards, { status: 200 });
}

export async function POST(request: NextRequest) {
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
    include: { boards: { select: { _count: true } } },
  });

  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 400 });

  const board = await prisma.board.create({
    data: {
      id: body.id,
      title: body.title,
      userId: user.id,
      index: user.boards.length,
    },
  });

  await prisma.column.createMany({
    data: body.columns.map((col, index) => ({
      id: col.id,
      boardId: board.id,
      color: "#fff",
      title: col.title,
      index: index,
    })),
  });

  return NextResponse.json(board, { status: 201 });
}
