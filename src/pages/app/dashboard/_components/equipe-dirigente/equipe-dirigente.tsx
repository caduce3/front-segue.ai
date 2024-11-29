import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { TableBody } from "@/components/ui/table";
import { pegarEquipeDirigente } from "@/api/equipe-dirigente/pegar-equipe-dirigente";
import { EquipeDirigenteTableSkeleton } from "./equipe-dirigente-table-skeleton";
import EquipeDirigenteTableRow from "./equipe-dirigente-table-row";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface TableEquipeDirigenteProps {
  igrejaId: string;
  idUserEquipeDirigente: string;
}

export function EquipeDirigente({
  igrejaId,
  idUserEquipeDirigente,
}: TableEquipeDirigenteProps) {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") ?? 1;

  const { data, isLoading } = useQuery({
    queryKey: ["equipe-dirigente", page, igrejaId, idUserEquipeDirigente],
    queryFn: () =>
      pegarEquipeDirigente({
        page: Number(page),
        igrejaId,
        idUserEquipeDirigente,
      }),
  });

  return (
    <>
      {isLoading ? (
        <EquipeDirigenteTableSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <p className="text-white font-bold text-lg mb-4">
                Equipe Dirigente
              </p>
            </div>
            <hr />
          </CardHeader>
          <CardContent>
            <TableBody>
              {data &&
                data.equipeDirigenteList.map((equipeDirigente) => {
                  return (
                    <EquipeDirigenteTableRow
                      key={equipeDirigente.id}
                      userEquipeDirigente={equipeDirigente}
                    />
                  );
                })}
            </TableBody>
          </CardContent>
        </Card>
      )}
    </>
  );
}
