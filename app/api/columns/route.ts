import { useSidebarProvider } from "./../../hooks/useSidebarProvider";
import { columnSchema } from "./../../schemas/columnSchema";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  type columnSchemaType = z.infer<typeof columnSchema>;
  const body = (await request.json()) as columnSchemaType;

  const validation = columnSchema.safeParse(body);
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

  const columns = await prisma.column.findMany({
    where: { boardId: body.boardId },
    select: { _count: true },
  });

  const column = await prisma.column.create({
    data: {
      title: body.title,
      boardId: body.boardId!,
      color: "#fff",
      index: columns.length,
    },
  });

  return NextResponse.json(column, { status: 201 });
}
