import { Helmet } from "react-helmet-async";
import {
    Table,
    TableBody, 
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { useQuery } from "@tanstack/react-query";
import { getRelatorioFtds } from "@/api/trafego/get-relatorio-ftds";
import { useNavigate, useSearchParams } from "react-router-dom";
import RelatorioTrafegoFtdsTableRow from "./trafego-table-row";
import { Pagination } from "@/components/pagination";
import { TrafegoTableSkeleton } from "./trafego-table-skeleton";
import { verifyAccessByJwt } from "@/services/verify-access-page-by-jwt";
import { useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import * as React from "react";
import TrafegoTableFilters from "./trafego-table-filters";
import { CardTotalGeral } from "@/components/card-total";
import { ArrowDownUp, ChevronsUpDown, Coins, HandCoins } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RelatorioTrafego() {
    const token = useAuthRedirect();
    const navigate = useNavigate();

    useEffect(() => {
        if (verifyAccessByJwt(token ?? '', ["GERENCIAL", "DESENVOLVIMENTO", "TRAFEGO"]) === false) {
            navigate("/");
            toast.error("Você não tem permissão para acessar essa página");
        }
    }, [token, navigate]); 

    const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
        from: new Date(2024, 6, 1, 0, 0),
        to: new Date(2024, 6, 31, 23, 59)
    });
    
    const dataInicial = format(dateRange.from, "dd-MM-yyyy HH:mm");
    const dataFinal = format(dateRange.to, "dd-MM-yyyy HH:mm");

    const [utmCampaign, setUtmCampaign] = React.useState<string>('');
    const [utmContent, setUtmContent] = React.useState<string>('');
    const [utmSource, setUtmSource] = React.useState<string>('');
    const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");
    const [sortField, setSortField] = React.useState<"registros" | "valor_ftd" | "ftds">("registros");

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') ?? 1;

    const { data, isLoading } = useQuery({
        queryKey: ['relatorio-ftds', page, dataInicial, dataFinal, utmCampaign, utmContent, utmSource, sortDirection, sortField],
        queryFn: () => getRelatorioFtds(
            { 
                page: Number(page), 
                dataInicial, 
                dataFinal, 
                utm_campaign: utmCampaign, 
                utm_content: utmContent, 
                utm_source: utmSource,
                sortDirection,
                sortField
            }
        ),
    });

    function handlePaginate(page: number) {
        setSearchParams(prev => {
            prev.set('page', (page).toString());
            return prev;
        });
    }

    function toggleSortDirection(sortField: "registros" | "valor_ftd" | "ftds") {
        setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
        setSortField(sortField);
    }
    

    return (
        <>
            <Helmet title="Tráfego" />
            <div className="flex flex-row gap-4 items-center">
                <h1 className="text-3xl font-bold tracking-tight">Relatório FTD</h1>
                <TrafegoTableFilters
                    dateRange={dateRange} 
                    setDateRange={setDateRange} 
                    utmCampaign={utmCampaign} 
                    setUtmCampaign={setUtmCampaign} 
                    utmContent={utmContent}
                    setUtmContent={setUtmContent}
                    utmSource={utmSource}
                    setUtmSource={setUtmSource}
                 />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <CardTotalGeral 
                    cardTitle="Registros" 
                    totalValue={data?.totalRegistros ?? 0} 
                    Icon={ArrowDownUp}
                />
                <CardTotalGeral 
                    cardTitle="FTDs" 
                    totalValue={data?.totalFtds ?? 0} 
                    Icon={HandCoins} 
                />
                <CardTotalGeral 
                    cardTitle="Valor FTD" 
                    totalValue={data?.totalValorFtd ?? 0} 
                    Icon={Coins} 
                    format={true}
                />
            </div>

            
            {isLoading ? <TrafegoTableSkeleton />
            :
            <Table className="bg-[#18181B] rounded-xl">
                <TableHeader>
                    <TableRow>
                        <TableHead>UTM Source</TableHead>
                        <TableHead>UTM Campaign</TableHead>
                        <TableHead className="hidden md:table-cell">
                            <div className="flex items-center gap-2">
                                Registros
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    className="flex items-center bg-[#00000000] hover:bg-[#00000000] rounded-lg border-none p-1" 
                                    onClick={() => toggleSortDirection("registros")}
                                >
                                    <ChevronsUpDown className="h-3 w-3" />
                                </Button>
                            </div>
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                            <div className="flex items-center gap-2">
                                FTDs
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    className="flex items-center bg-[#00000000] hover:bg-[#00000000] rounded-lg border-none p-1" 
                                    onClick={() => toggleSortDirection("ftds")}
                                >
                                    <ChevronsUpDown className="h-3 w-3" />
                                </Button>
                            </div>
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                            <div className="flex items-center gap-2">
                                Valor FTD
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    className="flex items-center bg-[#00000000] hover:bg-[#00000000] rounded-lg border-none p-1" 
                                    onClick={() => toggleSortDirection("valor_ftd")}
                                >
                                    <ChevronsUpDown className="h-3 w-3" />
                                </Button>
                            </div>
                        </TableHead>
                        <TableHead className="">UTM Content</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data && data.relatorioFtds?.map(relatorio => {
                        return <RelatorioTrafegoFtdsTableRow key={relatorio.id_registro} relatorioFTDs={relatorio} />;
                    })}
                </TableBody>
            </Table>
            }
            {data && (
                <Pagination currentPage={data.currentPage} totalPages={data.totalPages} totalItens={data.totalItens} onPageChange={handlePaginate} />
            )}
        </>
    )
}
