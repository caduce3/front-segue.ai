import { Helmet } from "react-helmet-async";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { DatePickerWithRange } from "@/components/date-ranger-picker";
import SummaryCards from "./_components/summary-cards";
import { getProfileUser } from "@/api/get-profile-user";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import TransactionPieChart from "./_components/transactions-pie-chart";
import GastosPorCategoria from "./_components/transactions-gastos-por-categoria";
import { EquipeDirigente } from "./_components/equipe-dirigente/equipe-dirigente";
import { getUserProfileData } from "@/services/acessar-dados-perfil-user";
import GastosPorCategoriaBarChart from "./_components/transactions--gastos-categoria-bar-chart";

export function Dashboard() {
  const token = useAuthRedirect();

  if (!token) {
    return null;
  }

  const { data: profileUser } = useQuery({
    queryKey: ["profileUser"],
    queryFn: getProfileUser,
    staleTime: Infinity,
  });

  const { igrejaId, idUserEquipeDirigente } = profileUser
    ? getUserProfileData(profileUser)
    : { igrejaId: "", idUserEquipeDirigente: "" };
  const pastaUserLogado = profileUser?.pasta;

  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(new Date().getFullYear(), 11, 31),
  });

  return (
    <>
      <Helmet title="Dashboard" />
      <div className="shadow-lg p-4 w-full">
        {/* Cabeçalho */}
        <div className="col-span-12 flex justify-between mb-5">
          <h1 className="text-3xl font-bold tracking-tight mr-3">Dashboard</h1>
          <DatePickerWithRange
            value={{ from: dateRange.from, to: dateRange.to }}
            onChange={(range) => {
              if (range?.from && range?.to) {
                setDateRange({ from: range.from, to: range.to });
              }
            }}
          />
        </div>

        <SummaryCards
          igrejaId={igrejaId}
          idUserEquipeDirigente={idUserEquipeDirigente}
          dateRange={dateRange}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mt-6 mb-6">
          <TransactionPieChart
            igrejaId={igrejaId}
            idUserEquipeDirigente={idUserEquipeDirigente}
            dateRange={dateRange}
          />
          <GastosPorCategoria
            igrejaId={igrejaId}
            idUserEquipeDirigente={idUserEquipeDirigente}
            dateRange={dateRange}
          />
          <GastosPorCategoriaBarChart
            igrejaId={igrejaId}
            idUserEquipeDirigente={idUserEquipeDirigente}
            dateRange={dateRange}
          />
        </div>

        {pastaUserLogado && (
          <EquipeDirigente
            igrejaId={igrejaId}
            idUserEquipeDirigente={idUserEquipeDirigente}
            pastaUserLogado={pastaUserLogado}
          />
        )}
      </div>
    </>
  );
}
