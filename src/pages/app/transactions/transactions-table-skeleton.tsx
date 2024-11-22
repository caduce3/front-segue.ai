import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Search } from "lucide-react";

export function TransactionsTableSkeleton() {
  return (
    <Table className="border rounded-md">
      <TableCaption>Lista de Transações.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="hidden lg:table-cell">Categoria</TableHead>
          <TableHead className="hidden md:table-cell">Método</TableHead>
          <TableHead className="hidden sm:table-cell">Data</TableHead>
          <TableHead className="hidden sm:table-cell">Valor</TableHead>
          <TableHead>Detalhes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-3 w-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell>
              <Button disabled variant="outline" size="sm">
                <Search className="h-3 w-3" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
