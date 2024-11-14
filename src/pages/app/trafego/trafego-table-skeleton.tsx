import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export function TrafegoTableSkeleton() {
    return (
        <Table className="border rounded-md">
            <TableHeader>
                <TableRow>
                    <TableHead>UTM Source</TableHead>
                    <TableHead>UTM Campaign</TableHead>
                    <TableHead>Registros</TableHead>
                    <TableHead className="hidden lg:table-cell">FTDs</TableHead>
                    <TableHead className="hidden md:table-cell">Valor FTD</TableHead>
                    <TableHead className="hidden sm:table-cell">UTM Content</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 10 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Skeleton className="h-3 w-3" />
                        </TableCell>
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
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
