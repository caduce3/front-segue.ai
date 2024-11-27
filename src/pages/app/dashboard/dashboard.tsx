import { Helmet } from "react-helmet-async";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { DatePickerWithRange } from "@/components/date-ranger-picker";
import SummaryCards from "./_components/summary-cards";
import { getProfileUser } from "@/api/get-profile-user";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import TransactionPieChart from "./_components/transactions-pie-chart";

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

  let igrejaId = "";
  let idUserEquipeDirigente = "";
  if (profileUser && "igrejaId" in profileUser) {
    igrejaId = profileUser.igrejaId;
    idUserEquipeDirigente = profileUser.id;
  }

  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(new Date().getFullYear(), 11, 31),
  });

  return (
    <>
      <Helmet title="Dashboard" />
      <div className="shadow-lg p-4 w-full">
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
        
        <div className="grid grid-cols-[2fr,1fr]">
          <SummaryCards
            igrejaId={igrejaId}
            idUserEquipeDirigente={idUserEquipeDirigente}
            dateRange={dateRange}
          />
        </div>
        <div className="grid grid-cols-[1fr,3fr] gap-6 mt-6">
          <div className="col-span-1">
            <TransactionPieChart
              igrejaId={igrejaId}
              idUserEquipeDirigente={idUserEquipeDirigente}
              dateRange={dateRange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
