import CurrencyComboBox from "@/components/CurrencyComboBox";
import { CategoriesCard } from "../../../components/CategoriesCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { TrendingDown, TrendingUp } from "lucide-react";
function page() {
  return (
    <div className="flex flex-wrap w-full gap-4 ">
      <div className="border-b w-full container p-6 px-16 gap-2 flex flex-col">
        <h3 className="text-3xl font-bold ">Manage</h3>
        <p className="text-muted-foreground text-md">
          Manage your account settings and categories
        </p>
      </div>
      <Card className="w-[90%] m-auto">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription className="text-muted-foreground">
            Set your default currency for transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyComboBox />
        </CardContent>
      </Card>
      <div className="flex flex-col items-center justify-center m-auto w-[90%] gap-2">
        <CategoriesCard
          categoryType={"Income"}
          categoryIcon={
            <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
          }
        />
        <CategoriesCard
          categoryType={"Expense"}
          categoryIcon={
            <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
          }
        />
      </div>
    </div>
  );
}

export default page;
