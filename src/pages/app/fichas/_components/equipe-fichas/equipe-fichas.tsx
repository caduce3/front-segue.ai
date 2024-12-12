import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/pagination";
import { pegarEquipesFicha } from "@/api/ficha-equipe/pegar-equipes-ficha";
import { FichasTableSkeleton } from "../../fichas-table-skeleton";
import EquipesFichaTableRow from "./equipe-fichas-table-row";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface PegarEquipesFichaProps {
  igrejaId: string;
  idUserEquipeDirigente: string;
  fichaId: string;
  pasta: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EquipesFicha({
  igrejaId,
  idUserEquipeDirigente,
  fichaId,
  pasta,
  isOpen,
  onClose,
}: PegarEquipesFichaProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageEquipe = searchParams.get("pageEquipe") ?? 1;

  const { data, isLoading } = useQuery({
    queryKey: [
      "equipes-ficha",
      pageEquipe,
      igrejaId,
      idUserEquipeDirigente,
      fichaId,
    ],
    queryFn: () =>
      pegarEquipesFicha({
        pageEquipe: Number(pageEquipe),
        igrejaId,
        idUserEquipeDirigente,
        fichaId,
      }),
  });

  function handlePaginate(pageEquipe: number) {
    setSearchParams((prev) => {
      prev.set("pageEquipe", pageEquipe.toString());
      return prev;
    });
  }

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="overflow-y-auto max-h-[calc(100vh-100px)]"
      >
        <div className="shadow-lg p-4 w-full">
          <div className="col-span-12 flex justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Equipes </h1>
            <div className="flex">
              {/* <FichasTableFilters />
          <CadastrarFichaSheet
            igrejaId={igrejaId}
            idUserEquipeDirigente={idUserEquipeDirigente}
            pasta={profileUser?.pasta ?? ""}
          /> */}
            </div>
          </div>
          {isLoading ? (
            <FichasTableSkeleton />
          ) : (
            <Table className="border mt-5">
              <TableHeader className="bg-[#171618]">
                <TableRow>
                  <TableHead className="text-white">Equipe</TableHead>

                  <TableHead className="hidden md:table-cell text-white">
                    Ano
                  </TableHead>

                  <TableHead className="hidden md:table-cell text-white">
                    Função
                  </TableHead>

                  <TableHead className="hidden xl:table-cell text-white">
                    Avaliação
                  </TableHead>

                  <TableHead className="hidden md:table-cell text-white">
                    Observações
                  </TableHead>

                  <TableHead className="text-white text-center pr-4">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data &&
                  data.equipesFichaList.map((equipesFichas) => {
                    return (
                      <EquipesFichaTableRow
                        key={equipesFichas.id}
                        equipesFichaList={equipesFichas}
                        idUserEquipeDirigente={idUserEquipeDirigente}
                        pasta={pasta}
                      />
                    );
                  })}
              </TableBody>
            </Table>
          )}
          {data && (
            <Pagination
              currentPage={data.currentPage}
              totalPages={data.totalPages}
              totalItens={data.totalItens}
              onPageChange={handlePaginate}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
