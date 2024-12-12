import { deletarEquipeFicha } from "@/api/ficha-equipe/deletar-equipe-ficha";
import { DeleteConfirmationModal } from "@/components/card-deletar";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { queryClient } from "@/lib/react-query";
import { capitalizeName } from "@/services/formated-captalize-name";
import { Trash2, UserPen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface FichasTableRowProps {
  equipesFichaList: {
    id: string;
    equipe:
      | "ANIMACAO"
      | "VIGILIA_PAROQUIAL"
      | "LITURGIA"
      | "CANTO"
      | "ESTACIONAMENTO"
      | "TAXI"
      | "LANCHE"
      | "COZINHA"
      | "SALA"
      | "FAXINA"
      | "ED_PALESTRA"
      | "ED_POS"
      | "ED_MONTAGEM"
      | "ED_FINANCAS"
      | "ED_FICHAS"
      | "CIRCULO"
      | "GRAFICA"
      | "MINI_MERCADO";
    ano: string;
    funcao: "EQUIPISTA" | "COORDENADOR" | "ED" | "APOIO";
    avaliacao: "NEGATIVA" | "POSITIVA" | "NEUTRA";
    observacoes: string;
    createdAt: string;
    updatedAt: string;
  };
  idUserEquipeDirigente: string;
  pasta: string;
  igrejaId: string;
}

const EquipesFichaTableRow = ({
  equipesFichaList,
  idUserEquipeDirigente,
  pasta,
  igrejaId,
}: FichasTableRowProps) => {
  //   const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  //   const handleDetailsClick = () => {
  //     setIsModalOpen(true);
  //   };

  //   const handleCloseModal = () => {
  //     setIsModalOpen(false);
  //   };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletarEquipeFicha({
        id: equipesFichaList.id,
        idUserEquipeDirigente: idUserEquipeDirigente,
        igrejaId: igrejaId,
      });
      setIsDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["equipes-ficha"] });
      toast.success("Equipe deletada da ficha com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar equipe da ficha");
      console.error("Erro ao deletar equipe da ficha:", error);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          {capitalizeName(equipesFichaList.equipe)}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {equipesFichaList.ano}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {capitalizeName(equipesFichaList.funcao)}
        </TableCell>
        <TableCell className="hidden xl:table-cell">
          {capitalizeName(equipesFichaList.avaliacao)}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {capitalizeName(equipesFichaList.observacoes)}
        </TableCell>

        <TableCell className="flex justify-center space-x-2">
          <Button variant="ghost" size="sm" className="text-[#71717A]">
            <UserPen className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#71717A]"
            disabled={pasta !== "FICHAS"}
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      {/* <EditarFichaSheet
        id={fichas.id}
        igrejaId={fichas.igrejaId}
        idUserEquipeDirigente={idUserEquipeDirigente}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pasta={pasta}
      />

      
       */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default EquipesFichaTableRow;
