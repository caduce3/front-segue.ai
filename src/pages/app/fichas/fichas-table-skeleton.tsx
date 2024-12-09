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
import { ExternalLink, Trash2 } from "lucide-react";

export function FichasTableSkeleton() {
  return (
    <Table className="border rounded-md">
      <TableCaption>Lista das Fichas.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="hidden lg:table-cell">E-mail</TableHead>
          <TableHead className="hidden md:table-cell">Telefone</TableHead>
          <TableHead className="hidden sm:table-cell">Endereço</TableHead>
          <TableHead className="hidden sm:table-cell">Círculo de Origem</TableHead>
          <TableHead>Ações</TableHead>
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
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell className="hidden xl:table-cell">
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell>
              <Button disabled variant="outline" size="sm">
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Button disabled variant="outline" size="sm">
                <Trash2 className="h-3 w-3" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
