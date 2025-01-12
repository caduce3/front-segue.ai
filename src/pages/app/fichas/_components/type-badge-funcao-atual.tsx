import { Badge } from "@/components/ui/badge";
import { CircleIcon } from "lucide-react";

interface FichasEquipe {
  id: string;
  equipe:
    | "ANIMACAO"
    | "VIGILIA_PAROQUIAL"
    | "LITURGIA"
    | "CANTO"
    | "ESTACIONAMENTO"
    | "VISITACAO"
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
    | "NENHUMA"
    | "CG"
    | "PROVER"
    | "ESPIRITUALIZADORA";
  ano: string;
  funcao: "COORDENADOR" | "EQUIPISTA" | "ED" | "APOIO";
  avaliacao: "NEGATIVO" | "POSITIVO" | "NORMAL";
  observacoes: string;
  createdAt: string;
  updatedAt: string;
  fichaId: string;
}

interface Fichas {
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
  FichaEquipe: FichasEquipe[];
  funcaoEquipeAtual: "COORDENADOR" | "EQUIPISTA" | "APOIO" | "ED";
}

interface FichasFuncaoBadgeProps {
  fichas: Fichas;
}

const FichasFuncaoBadge = ({ fichas }: FichasFuncaoBadgeProps) => {
  const { funcaoEquipeAtual } = fichas;

  const renderBadge = (bgColor: string, textColor: string, label: string) => (
    <Badge
      className={`${bgColor}  font-bold ${textColor} hover:bg-muted`} // Usando !important para forçar o fundo branco
    >
      <CircleIcon className="mr-2 fill-current" size={10} />
      {label}
    </Badge>
  );

  switch (funcaoEquipeAtual) {
    case "COORDENADOR":
      return renderBadge("bg-yellow-500", "text-[#000000]", "Coordenador"); // Ouro
    case "APOIO":
      return renderBadge("bg-slate-600", "text-[#000000]", "Apoio"); // Prata
    case "EQUIPISTA":
      return renderBadge("bg-slate-300", "text-[#000000]", "Equipista"); // Preto
    default:
      return null;
  }
};

export default FichasFuncaoBadge;
