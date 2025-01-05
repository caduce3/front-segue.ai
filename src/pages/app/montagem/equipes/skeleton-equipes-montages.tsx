import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton"; // Crie ou importe um componente Skeleton

const FichasMontagemTableRowSkeleton = () => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <Skeleton className="h-6 w-32" /> {/* Nome do jovem */}
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-24 rounded-full" /> {/* Badge do círculo */}
      </TableCell>
    </TableRow>
  );
};

export default FichasMontagemTableRowSkeleton;
