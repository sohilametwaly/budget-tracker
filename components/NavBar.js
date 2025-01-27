"use client";
import Link from "next/link";
import Logo from "./logo";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import ThemeSwitch from "./themeSwitch";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./UI/button";
import { Menu } from "lucide-react";
import { Button } from "./UI/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./UI/sheet";

const links = [
  {
    title: "Dashboard",
    linkPath: "/",
  },
  {
    title: "Transactions",
    linkPath: "/transactions",
  },
  {
    title: "Manage",
    linkPath: "/manage",
  },
];

function NavBar() {
  return (
    <>
      <div className="hidden md:block bg-card border-b ">
        <DesktopNavbar />
      </div>
      <div className="hidden max-md:block bg-card border-b">
        <MobileNavbar />
      </div>
    </>
  );
}

function SheetComponent() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {links.map((link) => {
            return (
              <div
                className="grid grid-cols-4 items-center gap-4"
                key={link.title}
              >
                <NavBarItem linkPath={link.linkPath} title={link.title} />
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileNavbar() {
  return (
    <header className="flex justify-between p-2 items-center pl-9 pr-12 pt-4 pb-4">
      <SheetComponent />
      <Logo />
      <div className="flex p-2 gap-4 items-center">
        <ThemeSwitch />
        <UserButton />
      </div>
    </header>
  );
}

function DesktopNavbar() {
  return (
    <header className="flex  justify-between p-2 items-center pl-7 pr-12 pt-4 pb-4">
      <div className="flex items-start gap-10">
        <Logo />
        <ul className="flex justify-between gap-4 lg:text-xl max-md:text-sm">
          {links.map((link) => (
            <NavBarItem
              key={link.title}
              linkPath={link.linkPath}
              title={link.title}
            />
          ))}
        </ul>
      </div>
      <div className="flex p-2 gap-4 items-center">
        <ThemeSwitch />
        <UserButton />
      </div>
    </header>
  );
}

function NavBarItem({ linkPath, title }) {
  const path = usePathname();
  return (
    <li className="flex flex-col gap-3">
      <Link
        href={linkPath}
        className={cn(
          buttonVariants({
            variant: "ghost",
          }),
          "w-full text-lg justify-start text-muted-foreground hover:text-foreground",
          path == linkPath ? "text-foreground" : ""
        )}
      >
        {title}
      </Link>
      <div
        className={
          path == linkPath
            ? "relative left-1/2 h-[2px] w-[80%] -translate-x-1/2 roundex-xl bg-foreground md:block"
            : ""
        }
      ></div>
    </li>
  );
}

export default NavBar;
