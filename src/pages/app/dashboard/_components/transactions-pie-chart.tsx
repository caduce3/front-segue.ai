"use client";

import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { pegarBalancoGeral } from "@/api/transactions/pegar-balanco-geral";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import TransactionsPieChartSkeleton from "./transactions-pie-chart-skeleton";

interface TrnsactionsPieChartProps {
  dateRange: { from: Date; to: Date };
  igrejaId: string;
  idUserEquipeDirigente: string;
}

const OPCOES_TIPO_TRANSACAO_OBJ = {
  DEPOSITO: { value: "DEPOSITO", label: "Depósito" },
  DESPESA: { value: "DESPESA", label: "Despesa" },
  INVESTIMENTO: { value: "INVESTIMENTO", label: "Investimento" },
};

const chartConfig: ChartConfig = {
  [OPCOES_TIPO_TRANSACAO_OBJ.INVESTIMENTO.value]: {
    label: OPCOES_TIPO_TRANSACAO_OBJ.INVESTIMENTO.label,
    color: "#FFFFFF",
  },
  [OPCOES_TIPO_TRANSACAO_OBJ.DESPESA.value]: {
    label: OPCOES_TIPO_TRANSACAO_OBJ.DESPESA.label,
    color: "#E93030",
  },
  [OPCOES_TIPO_TRANSACAO_OBJ.DEPOSITO.value]: {
    label: OPCOES_TIPO_TRANSACAO_OBJ.DEPOSITO.label,
    color: "#55B02E",
  },
} satisfies ChartConfig;

const TransactionPieChart = ({
  dateRange,
  igrejaId,
  idUserEquipeDirigente,
}: TrnsactionsPieChartProps) => {
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

  const totalDepositos = data?.total.totalDepositos || 0;
  const totalInvestimentos = data?.total.totalInvestimentos || 0;
  const totalDespesas = data?.total.totalDespesas || 0;
  const total = totalDepositos + totalDespesas + totalInvestimentos;

  const porcentagemDepositos = parseFloat(
    ((totalDepositos / total) * 100).toFixed(2)
  );
  const porcentagemInvestimentos = parseFloat(
    ((totalInvestimentos / total) * 100).toFixed(2)
  );
  const porcentagemDespesas = parseFloat(
    ((totalDespesas / total) * 100).toFixed(2)
  );

  // Dados para o gráfico de pizza
  const chartData = [
    {
      name: OPCOES_TIPO_TRANSACAO_OBJ.INVESTIMENTO.label,
      value: porcentagemInvestimentos,
      fill: "#FFFFFF",
    },
    {
      name: OPCOES_TIPO_TRANSACAO_OBJ.DEPOSITO.label,
      value: porcentagemDepositos,
      fill: "#55B02E",
    },
    {
      name: OPCOES_TIPO_TRANSACAO_OBJ.DESPESA.label,
      value: porcentagemDespesas,
      fill: "#E93030",
    },
  ];

  return (
    <>
      {
        // Se estiver carregando, exibe o esqueleto
        isLoading ? (
          <TransactionsPieChartSkeleton />
        ) : (
          <Card className="flex flex-col">
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px] sm:max-h-[300px] md:max-h-[350px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={80}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 text-sm w-full mt-4">
              <div className="flex flex-col gap-4 leading-none">
                {/* Investimentos */}
                <div className="flex items-center justify-between w-full text-center sm:text-left">
                  <div className="flex items-center gap-2 w-full">
                    <div className="bg-[#171618] p-2 rounded-md">
                      <PiggyBankIcon size={18} color="#FFFFFF" />
                    </div>
                    <span className="text-[#71717A] text-base mr-1">
                      Investimentos
                    </span>
                  </div>
                  <span className="text-white text-base font-bold">
                    {porcentagemInvestimentos}%
                  </span>
                </div>

                {/* Ganhos */}
                <div className="flex items-center justify-between w-full text-center sm:text-left">
                  <div className="flex items-center gap-2 w-full">
                    <div className="bg-[#171618] p-2 rounded-md">
                      <TrendingUpIcon size={18} color="#22C55E" />
                    </div>
                    <span className="text-[#71717A] text-base">Ganhos</span>
                  </div>
                  <span className="text-white text-base font-bold">
                    {porcentagemDepositos}%
                  </span>
                </div>

                {/* Gastos */}
                <div className="flex items-center justify-between w-full text-center sm:text-left">
                  <div className="flex items-center gap-2 w-full">
                    <div className="bg-[#171618] p-2 rounded-md">
                      <TrendingDownIcon size={18} color="#E93030" />
                    </div>
                    <span className="text-[#71717A] text-base">Gastos</span>
                  </div>
                  <span className="text-white text-base font-bold">
                    {porcentagemDespesas}%
                  </span>
                </div>
              </div>
            </CardFooter>
          </Card>
        )
      }
    </>
  );
};

export default TransactionPieChart;
