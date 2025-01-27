import { PiggyBank } from "lucide-react";

function Logo() {
  return (
    <div className="flex gap-2  items-center">
      <PiggyBank color="orange" size={35} className="hidden md:block" />
      <h3 className="font-bold text-3xl bg-gradient-to-r from-yellow-200 to-orange-500 bg-clip-text text-transparent">
        BudgetTracker
      </h3>
    </div>
  );
}

export default Logo;
