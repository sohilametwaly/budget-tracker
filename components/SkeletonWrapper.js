import { cn } from "@/lib/utils";
import { Skeleton } from "./UI/skeleton";

function SkeletonWrapper({ children, isLoading, fullWidth = true }) {
  if (!isLoading) return children;
  return (
    <Skeleton className={cn(fullWidth && "w-full")}>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
}

export default SkeletonWrapper;
