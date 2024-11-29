import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
}

const SummaryCard = ({ icon, title, amount }: SummaryCardProps) => {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-4">
        {icon}
        <p className="opacity text-muted-foreground text-xs sm:text-lg">{title}</p>
      </CardHeader>
      <CardContent>
        <p className="text-xs sm:text-lg font-bold">
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </p>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
