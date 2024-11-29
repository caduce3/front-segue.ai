import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { gastoPorCategoria } from "@/api/transactions/gastos-por-categoria";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/services/formated-currency-brl";
import { OPCOES_CATEGORIA_TRANSACAO } from "@/components/_constants/transactions-traducoes";

interface GastosPorCategoriaProps {
  dateRange: { from: Date; to: Date };
  igrejaId: string;
  idUserEquipeDirigente: string;
}

const GastosPorCategoria = ({
  dateRange,
  igrejaId,
  idUserEquipeDirigente,
}: GastosPorCategoriaProps) => {
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
          ) : (data?.gastosPorCategoria ?? []).length > 0 ? (
            <div className="space-y-4">
              {data?.gastosPorCategoria.slice(0, 4).map((gasto, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-white opacity-90 mb-2">
                      <span className="text-white opacity-90 mb-1">
                        {OPCOES_CATEGORIA_TRANSACAO.find(
                          (categoria) => categoria.value === gasto.categoria
                        )?.label ?? gasto.categoria}
                      </span>
                    </p>
                    <p className="text-white opacity-70">
                      {gasto.porcentagem.toFixed(2)}%
                    </p>
                  </div>
                  <Progress
                    value={gasto.porcentagem}
                    className="h-2 bg-white bg-opacity-10"
                  />
                  <p className="text-white opacity-90 text-sm mt-1">
                    {formatCurrency(gasto.total)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white opacity-70">Nenhum dado disponível.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GastosPorCategoria;
