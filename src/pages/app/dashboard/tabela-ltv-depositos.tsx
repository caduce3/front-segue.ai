import { TabelaLtvDepositosBody } from "@/api/charts/dashboard/ltv-depositos-total";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { renderTableRow } from "./render-table-row";

export function TabelaLtvDepositos() {
    const startDate = "2024-01-02";
    const endDate = "2024-12-31";

    const months = [
        "Janeiro de 2024", "Fevereiro de 2024", "Março de 2024", "Abril de 2024", "Maio de 2024", "Junho de 2024",
        "Julho de 2024", "Agosto de 2024", "Setembro de 2024", "Outubro de 2024", "Novembro de 2024", "Dezembro de 2024"
    ] as const;

    const { data, isLoading } = useQuery({
        queryKey: ["tabela_ltv_depositos_saques", startDate, endDate],
        queryFn: async () => {
            return await TabelaLtvDepositosBody({ startDate, endDate });
        },
        enabled: !!startDate && !!endDate,
    });

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    if (!data) {
        return <div>Nenhum dado encontrado.</div>;
    }

    function processMonthData(monthKey: string, data: any) {
        const monthlyData = data[`${monthKey.toLowerCase()} de 2024`];
        const depositData = monthlyData.depositAmountPerMonth;
        const withdrawalData = monthlyData.depositWithdrawalsPerMonth;
    
        // Mapear os meses do ano
        return months.map((month) => {
            const key = month.split(" ")[0]; // Extrair o mês do string
    
            // Acessando valores de depósitos e saques
            const depositStats = depositData[key] || { amount: 0, percentage: 0 };
            const withdrawalStats = withdrawalData[key] || { withdrawals: 0, percentage: 0 };
    
            return {
                month,
                depositAmount: parseFloat(depositStats.amount.toFixed(2)),
                depositPercentage: parseFloat(depositStats.percentage.toFixed(2)),
                depositWithdrawals: parseFloat(withdrawalStats.withdrawals.toFixed(2)),
                depositWithdrawalsPercentage: parseFloat(withdrawalStats.percentage.toFixed(2)),
            };
        });
    }

    const dadosJaneiro = processMonthData("janeiro", data);
    const dadosFevereiro = processMonthData("fevereiro", data);
    const dadosMarco = processMonthData("março", data);
    const dadosAbril = processMonthData("abril", data);
    const dadosMaio = processMonthData("maio", data);
    const dadosJunho = processMonthData("junho", data);
    const dadosJulho = processMonthData("julho", data);
    const dadosAgosto = processMonthData("agosto", data);
    const dadosSetembro = processMonthData("setembro", data);
    const dadosOutubro = processMonthData("outubro", data);
    const dadosNovembro = processMonthData("novembro", data);
    const dadosDezembro = processMonthData("dezembro", data);

    return (
        <Card className="rounded-xl">
    <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Tabela Ticket Médio</CardTitle>
        </div>
    </CardHeader>
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className=""></TableHead>
                {dadosJaneiro.map((mes, index) => (
                    <React.Fragment key={index}>
                        <TableHead className="border text-center" colSpan={2}>{mes.month}</TableHead>
                    </React.Fragment>
                ))}
            </TableRow>
            <TableRow>
                <TableHead className="border">Mês</TableHead>
                {Array(12)
                    .fill(null)
                    .map((_, index) => (
                        <React.Fragment key={index}>
                            <TableHead>Depósito</TableHead>
                            <TableHead className="border-r">Saque</TableHead>
                        </React.Fragment>
                    ))}
            </TableRow>
        </TableHeader>
        <TableBody>
            {renderTableRow("Janeiro", dadosJaneiro)}
            {renderTableRow("Fevereiro", dadosFevereiro)}
            {renderTableRow("Março", dadosMarco)}
            {renderTableRow("Abril", dadosAbril)}
            {renderTableRow("Maio", dadosMaio)}
            {renderTableRow("Junho", dadosJunho)}
            {renderTableRow("Julho", dadosJulho)}
            {renderTableRow("Agosto", dadosAgosto)}
            {renderTableRow("Setembro", dadosSetembro)}
            {renderTableRow("Outubro", dadosOutubro)}
            {renderTableRow("Novembro", dadosNovembro)}
            {renderTableRow("Dezembro", dadosDezembro)}
        </TableBody>
    </Table>
</Card>

    );
}
