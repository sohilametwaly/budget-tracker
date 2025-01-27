import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(req) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  let userSettings = await prisma.User.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    userSettings = await prisma.User.create({
      data: {
        userId: user.id,
        currency: "USD",
      },
    });
  }

  revalidatePath("/");
  return Response.json(userSettings);
}
