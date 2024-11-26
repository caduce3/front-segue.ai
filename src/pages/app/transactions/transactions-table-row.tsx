import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { capitalizeName } from "@/services/formated-captalize-name";
import { ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";
import { formatCurrency } from "@/services/formated-currency-brl";
import {
  OPCOES_METODO_PAGAMENTO_TRANSACAO,
  OPCOES_CATEGORIA_TRANSACAO,
} from "@/components/_constants/transactions-traducoes";
import TransactionTypeBadge from "./_components/type-badge";
import { DeleteConfirmationModal } from "@/components/card-deletar";
import { deletarTransaction } from "@/api/transactions/deletar-transaction";
import { getProfileUser } from "@/api/get-profile-user";
import { useQuery } from "@tanstack/react-query";
import EditarTransactionSheet from "./_components/sheet-edit-transaction";

export interface TransactionsTableRowProps {
  transactions: {
    id: string;
    nome: string;
    tipo: string;
    valor: number;
    categoria:
      | "PATROCINIO"
      | "TRANSPORTE"
      | "DOACAO"
      | "COMIDA"
      | "BINGO"
      | "OUTRO";
    descricao: string;
    metodoPagamento:
      | "PIX"
      | "DINHEIRO"
      | "CARTAO_CREDITO"
      | "CARTAO_DEBITO"
      | "TRANSFERENCIA_BANCARIA"
      | "BOLETO_BANCARIO"
      | "OUTRO";
    date: string;
    createdAt: string;
    updatedAt: string;
    igrejaId: string;
    igreja: {
      id: string;
      nome: string;
      email: string;
    };
  };
}

const TransactionsTableRow = ({ transactions }: TransactionsTableRowProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDetailsClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const { data: profileUser } = useQuery({
    queryKey: ["profileUser"],
    queryFn: getProfileUser,
    staleTime: Infinity,
  });

  let idUserEquipeDirigente = "";
  if (profileUser && "igrejaId" in profileUser) {
    idUserEquipeDirigente = profileUser.id;
  }

  const handleDeleteClick = () => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey.includes("transactions"),
    });
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletarTransaction({
        id: transactions.id,
        idUserEquipeDirigente: idUserEquipeDirigente,
      });
      setIsDeleteModalOpen(false);
      toast.success("Transação deletada com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar transação");
      console.error("Erro ao deletar transação:", error);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          {capitalizeName(transactions.nome)}
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          <TransactionTypeBadge transaction={transactions} />
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {
            OPCOES_CATEGORIA_TRANSACAO.find(
              (categoria) => categoria.value === transactions.categoria
            )?.label || "Categoria não definida" // Fallback caso não encontre
          }
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          {
            OPCOES_METODO_PAGAMENTO_TRANSACAO.find(
              (metodoPagamento) =>
                metodoPagamento.value === transactions.metodoPagamento
            )?.label || "Categoria não definida" // Fallback caso
          }
        </TableCell>
        <TableCell className="hidden sm:table-cell text-[#71717A]">
          {
            // Verifica se a data é válida antes de tentar formatá-la
            !isNaN(new Date(transactions.date).getTime())
              ? new Date(transactions.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "Data inválida"
          }
        </TableCell>

        <TableCell className="hidden sm:table-cell">
          {formatCurrency(transactions.valor)}
        </TableCell>
        <TableCell>
          <Button variant="ghost" size="sm" className="text-[#71717A]" onClick={handleDetailsClick}>
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 text-[#71717A]"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      <EditarTransactionSheet
        id={transactions.id}
        igrejaId={transactions.igrejaId}
        idUserEquipeDirigente={idUserEquipeDirigente}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default TransactionsTableRow;
