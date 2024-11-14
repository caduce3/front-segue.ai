import { TableCell, TableRow } from "@/components/ui/table";
import React from "react";

// Ajuste da função renderTableRow
export const renderTableRow = (mes: string, dadosMes: Array<{ depositAmount: number; depositWithdrawals: number }>) => (
    <TableRow key={mes}>
        <TableCell className="border-r font-semibold">{mes}</TableCell>
        {dadosMes.map((item, index) => (
            <React.Fragment key={index}>
                <TableCell className={`text-green-500 font-mono text-sm ${item.depositAmount === 0 ? '' : 'border-r'}`}>
                    {item.depositAmount === 0 
                        ? '' 
                        : item.depositAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </TableCell>
                <TableCell className={`text-red-500 font-mono text-sm ${item.depositWithdrawals === 0 ? '' : 'border-r'}`}>
                    {item.depositWithdrawals === 0 
                        ? '' 
                        : item.depositWithdrawals.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </TableCell>
            </React.Fragment>
        ))}
    </TableRow>


);
