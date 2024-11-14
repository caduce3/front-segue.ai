import { Helmet } from "react-helmet-async";
import { GraficoLtv } from "./grafico-ltv-jogadores";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { GraficoLtvDepositos } from "./grafico-ltv-depositos";
import { GraficoTicketMedio } from "./grafico-ticket-medio";
import { TabelaLtvDepositos } from "./tabela-ltv-depositos";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Coins, FileSpreadsheet, Users, Wallet } from "lucide-react";

export function Dashboard() {
    const token = useAuthRedirect();
    const [selectedChart, setSelectedChart] = useState<string>("");

    if (!token) {
        return null;
    }

    const renderChart = () => {
        switch (selectedChart) {
            case "LTVUsuarios":
                return <GraficoLtv />;
            case "LTVDepositos":
                return <GraficoLtvDepositos />;
            case "TicketMedio":
                return <GraficoTicketMedio />;
            case "TabelaDepositos":
                return <TabelaLtvDepositos />;
            default:
                return <p>Selecione um gráfico no menu acima.</p>;
        }
    };

    return (
        <>
            <Helmet title="Dashboard" />
            <div className="grid grid-cols-12 gap-4">
                {/* Título */}
                <div className="col-span-12 flex">
                    <h1 className="text-3xl font-bold tracking-tight mr-3">Dashboard</h1>
                    <DropdownMenu >
                        <DropdownMenuTrigger>
                            <Button className="px-4 py-2 bg-[#18181B] text-[#DAE7E4] rounded-xl hover:bg-[#27272A] hover:text-white transition duration-300 select-none items-center gap-2">
                                <ChevronDown className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-xl">
                            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Opções de Gráficos</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedChart("LTVUsuarios")} className="cursor-pointer hover:bg-[#27272A] hover:text-white transition duration-300">
                                <span className="flex text-xs font-normal">
                                    <Users className="mr-2 h-4 w-4"/>
                                    Gráfico LTV Jogadores
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedChart("LTVDepositos")} className="cursor-pointer hover:bg-[#27272A] hover:text-white transition duration-300">
                                <span className="flex text-xs font-normal">
                                    <Coins className="mr-2 h-4 w-4"/>
                                    Gráfico LTV Depósitos
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedChart("TicketMedio")} className="cursor-pointer hover:bg-[#27272A] hover:text-white transition duration-300">
                                <span className="flex text-xs font-normal">
                                    <Wallet className="mr-2 h-4 w-4"/>
                                    Gráfico Ticket Médio
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedChart("TabelaDepositos")} className="cursor-pointer hover:bg-[#27272A] hover:text-white transition duration-300">
                                <span className="flex text-xs font-normal">
                                    <FileSpreadsheet  className="mr-2 h-4 w-4"/>
                                    Tabela LTV Depósitos
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Área de exibição do gráfico */}
                <div className="col-span-12">{renderChart()}</div>
            </div>
        </>
    );
}
