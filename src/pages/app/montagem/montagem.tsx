import { Helmet } from "react-helmet-async";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { verifyAccessByJwt } from "@/services/verify-access-page-by-jwt";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getProfileUser } from "@/api/get-profile-user";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/pagination";
import { getUserProfileData } from "@/services/acessar-dados-perfil-user";
import FichasTableFilters from "../fichas/fichas-table-filters";
import CadastrarFichaSheet from "../fichas/_components/sheet-cadastrar-ficha";
import { FichasTableSkeleton } from "../fichas/fichas-table-skeleton";
import FichasTableRow from "../fichas/fichas-table-row";
import { pegarFichasMontagem } from "@/api/_montagem/pegar-fichas-montagem";

export function Montagem() {
  const token = useAuthRedirect();
  const navigate = useNavigate();

  if (!token) {
    return null;
  }

  useEffect(() => {
    if (
      verifyAccessByJwt(token ?? "", ["MONTAGEM", "PADRE", "PAROQUIA"]) ===
      false
    ) {
      navigate("/");
      toast.error("Você não tem permissão para acessar essa página");
    }
  }, [token, navigate]);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? 1;

  const nomePastaFichas = searchParams.get("nomePastaFichas") ?? undefined;
  const nomeJovem = searchParams.get("nomeJovem") ?? undefined;
  const corCirculoOrigem =
    (searchParams.get("corCirculoOrigem") as
      | "AMARELO"
      | "AZUL"
      | "LARANJA"
      | "ROSA"
      | "VERDE"
      | "VERMELHO"
      | undefined) ?? undefined;
  const anoEncontro = searchParams.get("anoEncontro") ?? undefined;

  const { data: profileUser } = useQuery({
    queryKey: ["profileUser"],
    queryFn: getProfileUser,
    staleTime: Infinity,
  });

  const { igrejaId, idUserEquipeDirigente } = profileUser
    ? getUserProfileData(profileUser)
    : { igrejaId: "", idUserEquipeDirigente: "" };

  const { data, isLoading } = useQuery({
    queryKey: [
      "fichas-montagem",
      page,
      igrejaId,
      idUserEquipeDirigente,
      nomePastaFichas,
      nomeJovem,
      corCirculoOrigem,
      anoEncontro,
    ],
    queryFn: () =>
      pegarFichasMontagem({
        page: Number(page),
        igrejaId,
        idUserEquipeDirigente,
        nomePastaFichas,
        nomeJovem,
        corCirculoOrigem,
        anoEncontro,
      }),
  });

  function handlePaginate(page: number) {
    setSearchParams((prev) => {
      prev.set("page", page.toString());

      return prev;
    });
  }

  return (
    <div className="shadow-lg p-4 w-full">
      <div className="col-span-12 flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Fichas</h1>
        <div className="flex">
          <FichasTableFilters />
          <CadastrarFichaSheet
            igrejaId={igrejaId}
            idUserEquipeDirigente={idUserEquipeDirigente}
            pasta={profileUser?.pasta ?? ""}
          />
        </div>
      </div>
      <Helmet title="Fichas" />
      {isLoading ? (
        <FichasTableSkeleton />
      ) : (
        <Table className="border mt-5">
          <TableHeader className="bg-[#171618]">
            <TableRow>
              <TableHead className="text-white">Nome</TableHead>

              <TableHead className="hidden md:table-cell text-white">
                E-mail
              </TableHead>

              <TableHead className="hidden md:table-cell text-white">
                Telefone
              </TableHead>

              {profileUser?.pasta === "MONTAGEM" ? (
                <TableHead className="hidden md:table-cell text-white">
                  Equipe Atual
                </TableHead>
              ) : (
                <TableHead className="hidden md:table-cell text-white">
                  Endereço
                </TableHead>
              )}

              <TableHead className="hidden md:table-cell text-white">
                Círculo de Origem
              </TableHead>

              <TableHead className="text-white text-center pr-4">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.fichasList.map((fichas) => {
                return (
                  <FichasTableRow
                    key={fichas.id}
                    fichas={fichas}
                    idUserEquipeDirigente={profileUser?.id ?? ""}
                    pasta={profileUser?.pasta ?? ""}
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
  );
}
