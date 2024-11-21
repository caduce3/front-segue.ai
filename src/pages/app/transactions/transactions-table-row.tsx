import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { capitalizeName } from "@/services/formated-captalize-name";
import { Trash2, UserPen } from "lucide-react";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";

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
  //   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  //   const handleDetailsClick = () => {
  //     setIsModalOpen(true);
  //   };

  //   const handleCloseModal = () => {
  //     setIsModalOpen(false);
  //   };

  //   const handleDeleteClick = () => {
  //     queryClient.invalidateQueries({
  //       predicate: (query) => query.queryKey.includes("funcionarios"),
  //     });
  //     setIsDeleteModalOpen(true);
  //   };

  //   const handleCancelDelete = () => {
  //     setIsDeleteModalOpen(false);
  //   };

  //   const handleConfirmDelete = async () => {
  //     try {
  //       await deletarFuncionario({ id: funcionarios.id });
  //       setIsDeleteModalOpen(false);
  //       toast.success("Colaborador deletado com sucesso!");
  //     } catch (error) {
  //       toast.error("Erro ao deletar colaborador");
  //       console.error("Erro ao deletar funcionário:", error);
  //     }
  //   };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          {capitalizeName(transactions.nome)}
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          {transactions.tipo}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {transactions.tipo}
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          {capitalizeName(transactions.categoria)}
        </TableCell>
        <TableCell>
          <Button variant="outline" size="sm">
            <UserPen className="h-4 w-4" />
            <span className="sr-only">Detalhes do usuário</span>
          </Button>
          <Button variant="secondary" size="sm" className="ml-1">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Deletar usuário</span>
          </Button>
        </TableCell>
      </TableRow>

      {/* {isModalOpen && (
        <FuncionarioDetailsDialog
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          funcionarioId={funcionarios.id}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      /> */}
    </>
  );
};

export default TransactionsTableRow;
