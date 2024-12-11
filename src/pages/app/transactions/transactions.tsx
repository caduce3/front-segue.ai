import { Helmet } from "react-helmet-async";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { verifyAccessByJwt } from "@/services/verify-access-page-by-jwt";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { pegarTransactions } from "@/api/transactions/pegar-transactions";
import { useQuery } from "@tanstack/react-query";
import { getProfileUser } from "@/api/get-profile-user";
import { TransactionsTableSkeleton } from "./transactions-table-skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TransactionsTableRow from "./transactions-table-row";
import { Pagination } from "@/components/pagination";
import CadastrarTransactionDialog from "./_components/sheet-add-transaction";
import { getUserProfileData } from "@/services/acessar-dados-perfil-user";

export function Transactions() {
  const token = useAuthRedirect();
  const navigate = useNavigate();

  if (!token) {
    return null;
  }

  useEffect(() => {
    if (
      verifyAccessByJwt(token ?? "", ["FINANCAS", "PADRE", "PAROQUIA"]) ===
      false
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
    queryKey: ["transactions", page, igrejaId, idUserEquipeDirigente],
    queryFn: () =>
      pegarTransactions({
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
        <h1 className="text-3xl font-bold tracking-tight mr-3">Transações</h1>
        <CadastrarTransactionDialog />
      </div>
      <Helmet title="Finanças" />
      {isLoading ? (
        <TransactionsTableSkeleton />
      ) : (
        <Table className="border mt-5">
          <TableHeader className="bg-[#171618]">
            <TableRow>
              <TableHead className="text-white">Nome</TableHead>
              <TableHead className="hidden lg:table-cell text-white">
                Tipo
              </TableHead>
              <TableHead className="hidden md:table-cell text-white">
                Categoria
              </TableHead>
              <TableHead className="hidden sm:table-cell text-white">
                Método
              </TableHead>
              <TableHead className="hidden sm:table-cell text-white">
                Data
              </TableHead>
              <TableHead className="hidden sm:table-cell text-white">
                Valor
              </TableHead>
              <TableHead className="text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.transactionsList.map((transactions) => {
                return (
                  <TransactionsTableRow
                    key={transactions.id}
                    transactions={transactions}
                    pasta={profileUser?.pasta ?? ""}
                    idUserEquipeDirigente={idUserEquipeDirigente}
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
