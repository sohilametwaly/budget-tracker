import { Button } from "@/components/UI/button";
import CreateTransactionDialog from "@/components/CreateTransactionDialog";
import Overview from "@/components/Overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

async function page() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.User.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <div className="h-full bg-background w-[98%] md:w-[90%] m-auto">
      <div className="border-b bg-card ">
        <div className="container w-full flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-2xl font-bold md:text-3xl">
            Hello,{user.firstName}! 👋
          </p>
          <div className=" flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant="outline"
                  className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
                >
                  New Income 🤑
                </Button>
              }
              type={"income"}
            />
            <CreateTransactionDialog
              trigger={
                <Button
                  variant="outline"
                  className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
                >
                  New Expense 😤
                </Button>
              }
              type={"expense"}
            />
          </div>
        </div>
      </div>

      <Overview userSettings={userSettings} />
    </div>
  );
}

export default page;
