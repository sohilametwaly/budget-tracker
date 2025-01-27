import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function GET(req) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  //extract te type from the url==> ?type="income"
  const { searchParams } = new URL(req.url);
  const paramType = searchParams.get("type");

  const validator = z.enum(["expense", "income"]).nullable();
  const queryParams = validator.safeParse(paramType);

  if (!queryParams.success) {
    return Response.json(queryParams.error, {
      status: 400,
    });
  }

  const type = queryParams.data;

  const categories = await prisma.Category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }), //include type if defined
    },
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(categories);
}

export async function DELETE(req) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  //extract te type from the url==> ?type="income"
  const { searchParams } = new URL(req.url);
  const paramType = searchParams.get("type");
  const paramName = searchParams.get("name");

  const validator = z.object({
    type: z.enum(["expense", "income"]),
    name: z.string(),
  });
  const queryParams = validator.safeParse({
    type: paramType,
    name: paramName,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error, {
      status: 400,
    });
  }

  const { type, name } = queryParams.data;

  const result = await prisma.Category.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        type,
        name,
      },
    },
  });

  return Response.json(result);
}
