import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { gastoPorCategoria } from "@/api/transactions/gastos-por-categoria";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { OPCOES_CATEGORIA_TRANSACAO } from "@/components/_constants/transactions-traducoes";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";

interface GastosPorCategoriaBarChartProps {
  dateRange: { from: Date; to: Date };
  igrejaId: string;
  idUserEquipeDirigente: string;
}

const GastosPorCategoriaBarChart = ({
  dateRange,
  igrejaId,
  idUserEquipeDirigente,
}: GastosPorCategoriaBarChartProps) => {
  const dateInit = format(dateRange.from, "yyyy-MM-dd");
  const dateFinish = format(dateRange.to, "yyyy-MM-dd");

  const { data, isLoading } = useQuery({
    queryKey: [
      "gastos-por-categoria",
      igrejaId,
      idUserEquipeDirigente,
      dateInit,
      dateFinish,
    ],
    queryFn: async () => {
      return await gastoPorCategoria({
        igrejaId,
        idUserEquipeDirigente,
        dateInit,
        dateFinish,
      });
    },
    enabled:
      !!igrejaId && !!idUserEquipeDirigente && !!dateInit && !!dateFinish,
  });

  const chartData =
    data?.gastosPorCategoria?.map((gasto) => ({
      categoria:
        OPCOES_CATEGORIA_TRANSACAO.find((cat) => cat.value === gasto.categoria)
          ?.label ?? gasto.categoria,
      total: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(gasto.total),
      porcentagem: gasto.porcentagem.toFixed(2),
    })) ?? [];

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-white font-bold text-lg">Gastos por categoria</p>
          <hr className="sm:hidden mt-2 sm:mt-0" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-white opacity-70">Carregando...</p>
          ) : chartData.length > 0 ? (
            <ChartContainer className="aspect-square" config={{ layout: { label: "Vertical Layout" } }}>
              <BarChart
                data={chartData}
                layout="vertical"
                barCategoryGap="15"
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="categoria"
                  type="category"
                  tickLine={false}
                  tickMargin={0}
                  axisLine={false}
                  hide={true}
                />
                <XAxis dataKey="porcentagem" type="number" hide  />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="porcentagem"
                  layout="vertical"
                  fill="#FACC15"
                  radius={4}
                >
                  <LabelList
                    dataKey="categoria"
                    position="insideLeft"
                    offset={8}
                    className="fill-[--color-foreground]"
                    fontSize={12}
                  />
                  <LabelList
                    dataKey="total"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={10}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <p className="text-white opacity-70">Nenhum dado disponível.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GastosPorCategoriaBarChart;
