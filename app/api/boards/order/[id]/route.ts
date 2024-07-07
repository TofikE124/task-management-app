import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { moveBoardSchema } from "@/app/schemas/moveSchemas/moveBoardSchema";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params: { id } }: Props) {
  type moveBoardSchemaType = z.infer<typeof moveBoardSchema>;
  const body = (await request.json()) as moveBoardSchemaType;

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

  const { beforeId } = body;
  const boards = await prisma.board.findMany({
    where: { userId: user.id },
    orderBy: { index: "asc" },
  });

  const index1 = boards.findIndex((b) => b.id == id);
  let index2 =
    beforeId == "-1"
      ? boards.length
      : boards.findIndex((b) => b.id == beforeId);
  index2 = index2 > index1 ? index2 - 1 : index2;

  if (index2 != index1) {
    if (index1 > index2) {
      await prisma.board.updateMany({
        where: { userId: user.id, index: { lt: index1, gte: index2 } },
        data: { index: { increment: 1 } },
      });

      await prisma.board.update({
        where: { id: id },
        data: { index: index2 },
      });
    } else {
      await prisma.board.updateMany({
        where: { userId: user.id, index: { gt: index1, lte: index2 } },
        data: { index: { decrement: 1 } },
      });

      await prisma.board.update({
        where: { id: id },
        data: { index: index2 },
      });
    }
  }

  const updatedBoards = await prisma.board.findMany({
    where: { userId: user.id },
  });

  return NextResponse.json(updatedBoards, { status: 200 });
}
