import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";

import { Separator } from "@/components/UI/separator";
import { Button } from "@/components/UI/button";
import Logo from "@/components/logo";
import Link from "next/link";
import CurrencyComboBox from "@/components/CurrencyComboBox";

async function page() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container flex flex-col max-w-2xl items-center">
      <div>
        <h1 className="text-center text-3xl font-bold">
          Welcome, {user.firstName}! 👋
        </h1>
        <h2 className="text-center text-muted-foreground mt-4">
          Let&apos;s get started by setting up your currency
        </h2>
        <h3 className="text-center text-muted-foreground mt-1 mb-3">
          {" "}
          You can change these settings any time
        </h3>
      </div>
      <Separator />
      <Card className="w-full mt-3">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your default currency for transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyComboBox />
        </CardContent>
      </Card>
      <Separator className="m-2 " />
      <Button className="w-full mb-7 mt-1" asChild>
        <Link href="/">I&apos;m done! Take me to the dashboard</Link>
      </Button>
      <Logo className="mt-8" />
    </div>
  );
}

export default page;
