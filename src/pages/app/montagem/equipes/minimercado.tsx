import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pegarFichasMontagem } from "@/api/_montagem/pegar-fichas-montagem";
import FichasMontagemTableRow from "./equipes-table-body";
import FichasMontagemTableRowSkeleton from "./skeleton-equipes-montages";

interface MontagemMiniMercadoProps {
  igrejaId: string;
  idUserEquipeDirigente: string;
  pasta: string;
}

export function MontagemMiniMercado({
  igrejaId,
  idUserEquipeDirigente,
  pasta,
}: MontagemMiniMercadoProps) {
  const equipeAtual = "MINI_MERCADO";
  const page = 1;

  const { data, isLoading } = useQuery({
    queryKey: [
      "fichas-montagem",
      page,
      igrejaId,
      idUserEquipeDirigente,
      equipeAtual,
    ],
    queryFn: () =>
      pegarFichasMontagem({
        page: Number(page),
        igrejaId,
        idUserEquipeDirigente,
        equipeAtual,
      }),
  });

  return (
    <div className="mt-5 p-5">
      {isLoading ? (
        <FichasMontagemTableRowSkeleton />
      ) : (
        <>
          <h3 className="text-xl font-bold mt-5 text-center">Mini-Mercado</h3>
          <Table className="border mt-5">
            <TableHeader className="bg-[#171618]">
              <TableRow>
                <TableHead className="text-white">Nome</TableHead>

                <TableHead className="text-white">Função</TableHead>

                <TableHead className=" text-white">Identificacão</TableHead>

                <TableHead className=" text-white text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data.fichasList.map((fichas) => {
                  return (
                    <FichasMontagemTableRow
                      key={fichas.id}
                      fichas={fichas}
                      pasta={pasta}
                      idUserEquipeDirigente={idUserEquipeDirigente}
                    />
                  );
                })}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}
