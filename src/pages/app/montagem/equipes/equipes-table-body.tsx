import { TableCell, TableRow } from "@/components/ui/table";
import { capitalizeName } from "@/services/formated-captalize-name";
import FichasTypeBadgeCirculos from "../../fichas/_components/type-badge-circulos";
import { Button } from "@/components/ui/button";
import { NotepadText, Puzzle, UserPen } from "lucide-react";
import { EquipesFicha } from "../../fichas/_components/equipe-fichas/equipe-fichas";
import EditarFichaSheet from "../../fichas/_components/sheet-edit-fichas";
import { AtualizarEquipeAnualModal } from "./card-atualizar-equipe-anual";
import { useState } from "react";

export interface FichasMontagemTableRowProps {
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
    status: "ATIVO" | "INATIVO";
    equipeAtual:
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
      | "MINI_MERCADO"
      | "CARAVANA"
      | "NENHUMA";
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
  pasta: string;
}

const FichasMontagemTableRow = ({
  fichas,
  idUserEquipeDirigente,
  pasta,
}: FichasMontagemTableRowProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetEquipesClose, setIsSheetEquipesClose] = useState(false);
  const [isModalAtualizarEquipeAnualOpen, setIsModalAtualizarEquipeAnualOpen] =
    useState(false);

  const handleEquipesDetails = () => {
    setIsSheetEquipesClose(true);
  };

  const handleCloseEquipesDetails = () => {
    setIsSheetEquipesClose(false);
  };

  const handleDetailsClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAtualizarEquipeAnualClick = () => {
    setIsModalAtualizarEquipeAnualOpen(true);
  };

  const handleAtualizarEquipeAnualClickCloseModal = () => {
    setIsModalAtualizarEquipeAnualOpen(false);
  };
  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          {capitalizeName(fichas.nomeJovem)}
        </TableCell>

        <TableCell>
          <FichasTypeBadgeCirculos fichas={fichas} />
        </TableCell>
        <TableCell className="flex justify-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#71717A]"
            onClick={handleEquipesDetails}
          >
            <NotepadText className="h-4 w-4" />
          </Button>
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
            onClick={handleAtualizarEquipeAnualClick}
            disabled={pasta !== "MONTAGEM"}
          >
            <Puzzle className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      <EquipesFicha
        igrejaId={fichas.igrejaId}
        idUserEquipeDirigente={idUserEquipeDirigente}
        fichaId={fichas.id}
        pasta={pasta}
        isOpen={isSheetEquipesClose}
        onClose={handleCloseEquipesDetails}
      />

      <EditarFichaSheet
        id={fichas.id}
        igrejaId={fichas.igrejaId}
        idUserEquipeDirigente={idUserEquipeDirigente}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pasta={pasta}
      />

      <AtualizarEquipeAnualModal
        id={fichas.id}
        idUserEquipeDirigente={idUserEquipeDirigente}
        igrejaId={fichas.igrejaId}
        isOpen={isModalAtualizarEquipeAnualOpen}
        onClose={handleAtualizarEquipeAnualClickCloseModal}
        pasta={pasta}
      />
    </>
  );
};

export default FichasMontagemTableRow;
