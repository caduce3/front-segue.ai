import { pegarBalancoGeral } from "@/api/transactions/pegar-balanco-geral";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import CadastrarTransactionDialog from "../../transactions/_components/sheet-add-transaction";
import SummaryCard from "./summary-card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface SummaryCardProps {
  dateRange: { from: Date; to: Date };
  igrejaId: string;
  idUserEquipeDirigente: string;
}

const SummaryCards = ({
  dateRange,
  igrejaId,
  idUserEquipeDirigente,
}: SummaryCardProps) => {

  const dateInit = format(dateRange.from, "yyyy-MM-dd");
  const dateFinish = format(dateRange.to, "yyyy-MM-dd");

  const { data, isLoading } = useQuery({
    queryKey: [
      "cards-balanco-geral",
      igrejaId,
      idUserEquipeDirigente,
      dateInit,
      dateFinish,
    ],
    queryFn: async () => {
      return await pegarBalancoGeral({
        igrejaId,
        idUserEquipeDirigente,
        dateInit,
        dateFinish,
      });
    },
    enabled:
      !!igrejaId && !!idUserEquipeDirigente && !!dateInit && !!dateFinish,
  });

  return (
    <div className="space-y-6">
      <Card className="bg-white bg-opacity-5">
        <CardHeader>
          <WalletIcon size={16} />
          <p className="text-white opacity-70">Saldo</p>
        </CardHeader>
        <CardContent className="flex justify-between">
          <p className="text-2xl sm:text-4xl font-bold">
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(data?.total.balancoGeral || 0)}
          </p>
          <CadastrarTransactionDialog />
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-6">
        {isLoading ? (
          <Skeleton className="h-20" />
        ) : (
          <SummaryCard
            icon={<PiggyBankIcon size={16} />}
            title="Investido"
            amount={data?.total.totalInvestimentos || 0}
          />
        )}

        {isLoading ? (
          <Skeleton className="h-20" />
        ) : (
          <SummaryCard
            icon={<TrendingUpIcon className="text-green-500" size={16} />}
            title="Receita"
            amount={data?.total.totalDepositos || 0}
          />
        )}

        {isLoading ? (
          <Skeleton className="h-20" />
        ) : (
          <SummaryCard
            icon={<TrendingDownIcon className="text-red-500" size={16} />}
            title="Despesas"
            amount={data?.total.totalDespesas || 0}
          />
        )}
      </div>
    </div>
  );
};

export default SummaryCards;
