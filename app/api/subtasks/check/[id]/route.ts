import { checkSubtaskSchema } from "@/app/schemas/checkSubtaskSchema";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params: { id } }: Props) {
  type checkSubtaskType = z.infer<typeof checkSubtaskSchema>;
  const body = (await request.json()) as checkSubtaskType;

  const validation = checkSubtaskSchema.safeParse(body);
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

  const updatedSubtask = await prisma.subtask.update({
    where: { id },
    data: { checked: body.checked },
  });

  return NextResponse.json(updatedSubtask, { status: 200 });
}
