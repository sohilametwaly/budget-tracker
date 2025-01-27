"use server";

import { prisma } from "@/lib/prisma";
import { CreateCategorySchema } from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateCategoryfn(form) {
  const parsedBody = CreateCategorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Invalid category");
  }

  const { name, icon, type } = parsedBody.data;

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }
  const category = await prisma.Category.create({
    data: {
      userId: user.id,
      name,
      icon,
      ...(type && { type }),
    },
  });
  return category;
}
