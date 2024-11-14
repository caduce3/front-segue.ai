import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/services/formated-currency-brl";

export interface RelatorioFtdTrafegoTableRowProps {
    relatorioFTDs: {
        id_registro: number;
        utm_source: string;
        ftds: number;
        registros: number;
        valor_ftd: number | null;
        utm_content: string;
        utm_campaign: string;
    }
}

const RelatorioTrafegoFtdsTableRow = ({ relatorioFTDs }: RelatorioFtdTrafegoTableRowProps) => {

    return ( 
        <TableRow className="bg-[#18181B] rounded-xl">
            <TableCell className="font-medium text-xs font-mono">{relatorioFTDs.utm_source === "" ? "Não informado" : relatorioFTDs.utm_source}</TableCell>
            <TableCell className="w-[500px]">{relatorioFTDs.utm_campaign === "" ? "Não informado" : relatorioFTDs.utm_campaign}</TableCell>
            <TableCell className="hidden md:table-cell">{relatorioFTDs.registros === null ? "Não informado" : relatorioFTDs.registros}</TableCell>
            <TableCell className="hidden sm:table-cell">{relatorioFTDs.ftds === null ? "Não informado" : relatorioFTDs.ftds}</TableCell>
            <TableCell className="hidden md:table-cell">{relatorioFTDs.valor_ftd === null ? "Não informado" : formatCurrency(relatorioFTDs.valor_ftd)}</TableCell>
            <TableCell className="" >{relatorioFTDs.utm_content === "" ? "Não informado" : relatorioFTDs.utm_content}</TableCell>
        </TableRow>
    );
}
 
export default RelatorioTrafegoFtdsTableRow;
