import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function DELETE(req) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(req.url);
  const paramId = searchParams.get("id");

  const validator = z.string().uuid();

  const queryParams = validator.safeParse(paramId);

  if (!queryParams.success) {
    return Response.json(queryParams.error, { status: 400 });
  }

  const id = queryParams.data;

  const result = await prisma.Transaction.delete({
    where: {
      userId: user.id,
      id,
    },
  });

  return Response.json(result);
}
