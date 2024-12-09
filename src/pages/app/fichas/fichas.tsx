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
import { pegarFichas } from "@/api/fichas/pegar-fichas";
import FichasTableRow from "./fichas-table-row";
import { FichasTableSkeleton } from "./fichas-table-skeleton";

export function Fichas() {
  const token = useAuthRedirect();
  const navigate = useNavigate();

  if (!token) {
    return null;
  }

  useEffect(() => {
    if (
      verifyAccessByJwt(token ?? "", ["FICHAS", "PADRE", "PAROQUIA"]) === false
    ) {
      navigate("/");
      toast.error("Você não tem permissão para acessar essa página");
    }
  }, [token, navigate]);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? 1;

  const { data: profileUser } = useQuery({
    queryKey: ["profileUser"],
    queryFn: getProfileUser,
    staleTime: Infinity,
  });

  const { igrejaId, idUserEquipeDirigente } = profileUser
    ? getUserProfileData(profileUser)
    : { igrejaId: "", idUserEquipeDirigente: "" };

  const { data, isLoading } = useQuery({
    queryKey: ["fichas", page, igrejaId, idUserEquipeDirigente],
    queryFn: () =>
      pegarFichas({
        page: Number(page),
        igrejaId,
        idUserEquipeDirigente,
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
        <h1 className="text-3xl font-bold tracking-tight mr-3">Fichas</h1>
        {/* <CadastrarTransactionDialog /> */}
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

              <TableHead className="hidden xl:table-cell text-white">
                Endereço
              </TableHead>

              <TableHead className="hidden md:table-cell text-white">
                Círculo de Origem
              </TableHead>

              <TableHead className="text-white text-center pr-4">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.fichasList.map((fichas) => {
                return <FichasTableRow key={fichas.id} fichas={fichas} />;
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
