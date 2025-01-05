import { TableCell, TableRow } from "@/components/ui/table";
import { capitalizeName } from "@/services/formated-captalize-name";
import FichasTypeBadgeCirculos from "../../fichas/_components/type-badge-circulos";

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
}

const FichasMontagemTableRow = ({ fichas }: FichasMontagemTableRowProps) => {
  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          {capitalizeName(fichas.nomeJovem)}
        </TableCell>

        <TableCell>
          <FichasTypeBadgeCirculos fichas={fichas} />
        </TableCell>
      </TableRow>
    </>
  );
};

export default FichasMontagemTableRow;
