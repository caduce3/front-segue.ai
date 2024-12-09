import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { capitalizeName } from "@/services/formated-captalize-name";
import { Trash2, UserPen } from "lucide-react";
import FichasTypeBadgeCirculos from "./_components/type-badge-circulos";
import EditarFichaSheet from "./_components/sheet-edit-fichas";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/card-deletar";
import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";
import { deletarFicha } from "@/api/fichas/deletar-ficha";

export interface FichasTableRowProps {
  fichas: {
    id: string;
    nomePastaFichas: string;
    dataRecebimento: string;
    nomeJovem: string;
    email: string;
    telefone: string;
    endereco: string;
    naturalidade: string;
    filiacaoPai: string;
    filiacaoMae: string;
    escolaridade: string;
    religiao: string;
    igrejaFrequenta: string;
    sacramentos: string;
    pastoral: string;
    nomeConvidadoPor: string;
    telefoneConvidadoPor: string;
    enderecoConvidadoPor: string;
    observacoes: string;
    anoEncontro: string;
    corCirculoOrigem: string;
    createdAt: string;
    updatedAt: string;
    igrejaId: string;
    FichaEquipe: {
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
      funcao: "COORDENADOR" | "EQUIPISTA" | "ED";
      avaliacao: "NEGATIVO" | "POSITIVO" | "NORMAL";
      observacoes: string;
      createdAt: string;
      updatedAt: string;
      fichaId: string;
    }[];
  };
  idUserEquipeDirigente: string;
}

const FichasTableRow = ({
  fichas,
  idUserEquipeDirigente,
}: FichasTableRowProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDetailsClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletarFicha({
        id: fichas.id,
        idUserEquipeDirigente: idUserEquipeDirigente,
      });
      setIsDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
      toast.success("Ficha deletada com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar ficha");
      console.error("Erro ao deletar ficha:", error);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          {capitalizeName(fichas.nomeJovem)}
        </TableCell>

        <TableCell className="hidden md:table-cell">{fichas.email}</TableCell>

        <TableCell className="hidden md:table-cell">
          {fichas.telefone}
        </TableCell>

        <TableCell className="hidden xl:table-cell">
          {fichas.endereco}
        </TableCell>

        <TableCell className="hidden md:table-cell">
          <FichasTypeBadgeCirculos fichas={fichas} />
        </TableCell>

        <TableCell className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#71717A]"
            onClick={handleDetailsClick}
          >
            <UserPen className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#71717A]"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      <EditarFichaSheet
        id={fichas.id}
        igrejaId={fichas.igrejaId}
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

export default FichasTableRow;
