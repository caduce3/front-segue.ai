// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2, UserPen } from "lucide-react";
// import { toast } from "sonner"
import { OPCOES_TIPO_PASTA } from "@/components/_constants/pastas";
import { renderIcon } from "@/services/render-icon";
// import { DeleteConfirmationModal } from "@/components/card-deletar";

export interface EquipeDirigenteTableRowProps {
  userEquipeDirigente: {
    id: string;
    nome: string;
    email: string;
    telefone: number;
    ano: string;
    igrejaId: string;
    createdAt: string;
    updatedAt: string;
    pasta:
      | "FINANCAS"
      | "PADRE"
      | "PAROQUIA"
      | "FINANCAS"
      | "POS"
      | "MONTAGEM"
      | "PALESTRA"
      | "FICHAS";
    igreja: {
      id: string;
      nome: string;
      email: string;
    };
  };
}

const EquipeDirigenteTableRow = ({
  userEquipeDirigente,
}: EquipeDirigenteTableRowProps) => {
  //   const [isModalOpen, setIsModalOpen] = useState(false);
  //   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  //   const handleDetailsClick = () => {
  //     setIsModalOpen(true);
  //   };

  //   const handleCloseModal = () => {
  //     setIsModalOpen(false);
  //   };

  //   const handleDeleteClick = () => {
  //     queryClient.invalidateQueries({
  //       predicate: (query) => query.queryKey.includes("transactions"),
  //     });
  //     setIsDeleteModalOpen(true);
  //   };

  //   const handleCancelDelete = () => {
  //     setIsDeleteModalOpen(false);
  //   };

  //   const handleConfirmDelete = async () => {
  //     try {
  //       await deletarTransaction({
  //         id: transactions.id,
  //         idUserEquipeDirigente: idUserEquipeDirigente,
  //       });
  //       setIsDeleteModalOpen(false);
  //       toast.success("Transação deletada com sucesso!");
  //     } catch (error) {
  //       toast.error("Erro ao deletar transação");
  //       console.error("Erro ao deletar transação:", error);
  //     }
  //   };

  return (
    <>
      <TableRow>
        <TableCell className="w-full">
          <div className="flex">
            <div className="flex items-center mr-4">
              {renderIcon(userEquipeDirigente?.pasta)}
            </div>
            <div className="flex flex-col text-left">
              <p className="text-base">{userEquipeDirigente?.nome}</p>
              <div className="flex">
                <p className="text-sm text-gray-400">
                  {
                    OPCOES_TIPO_PASTA.find(
                      (pasta) => pasta.value === userEquipeDirigente.pasta 
                    )?.label || "Pasta não definida" // Fallback caso não encontre
                  }
                </p>
                <p className="text-sm text-gray-400">{", "+userEquipeDirigente?.ano}</p>
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell className="flex">
          <Button variant="ghost" size="sm" className="text-[#71717A]">
            <UserPen className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="ml-1 text-[#71717A]">
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      {/* <EditarTransactionSheet
        id={transactions.id}
        igrejaId={transactions.igrejaId}
        idUserEquipeDirigente={idUserEquipeDirigente}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      /> */}

      {/* <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      /> */}
    </>
  );
};

export default EquipeDirigenteTableRow;
