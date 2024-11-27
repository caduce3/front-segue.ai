import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LoaderIcon } from "lucide-react";

const TransactionsPieChartSkeleton = () => {
  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0 flex justify-center items-center p-10">
        <LoaderIcon className="animate-spin text-[#FFFFFF] w-10 h-10" />
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm w-full">
        <div className="flex flex-col gap-3 leading-none p-3">
          {/* Skeleton placeholder */}
          <Skeleton style={{ height: 30, width: 300 }} />
          <Skeleton style={{ height: 30, width: 300 }} />
          <Skeleton style={{ height: 30, width: 300 }} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default TransactionsPieChartSkeleton;
