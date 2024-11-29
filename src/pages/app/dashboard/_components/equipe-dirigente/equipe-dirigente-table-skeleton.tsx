import { TableRow, TableCell } from "@/components/ui/table";

export function EquipeDirigenteTableSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex">
          {/* Skeleton para o ícone */}
          <div className="flex items-center mr-4">
            <div className="bg-gray-300 rounded-lg h-8 w-8 animate-pulse"></div>
          </div>

          {/* Skeleton para o texto */}
          <div className="flex flex-col text-left">
            {/* Nome */}
            <div className="bg-gray-300 h-4 w-32 rounded animate-pulse mb-2"></div>
            {/* Pasta e Ano */}
            <div className="flex">
              <div className="bg-gray-300 h-3 w-20 rounded animate-pulse"></div>
              <div className="bg-gray-300 h-3 w-12 rounded animate-pulse ml-2"></div>
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell>
        {/* Skeleton para botões */}
        <div className="flex space-x-2">
          <div className="bg-gray-300 rounded h-8 w-8 animate-pulse"></div>
          <div className="bg-gray-300 rounded h-8 w-8 animate-pulse"></div>
        </div>
      </TableCell>
    </TableRow>
  );
}
