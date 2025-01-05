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
}

interface FichasTypeBadgeCirculosProps {
  fichas: Fichas;
}

const FichasTypeBadgeCirculos = ({ fichas }: FichasTypeBadgeCirculosProps) => {
  const fichasType = fichas.corCirculoOrigem;
  const anoEncontro = fichas.anoEncontro;

  const renderBadge = (
    bgColor: string,
    textColor: string,
    fill: string,
    label: string
  ) => (
    <Badge
      className={`${bgColor} bg-opacity-10 font-bold ${textColor} hover:bg-muted`}
    >
      <CircleIcon className="mr-2" size={10} style={{ fill }} />
      {label} {anoEncontro ? `de ${anoEncontro}` : ""}
    </Badge>
  );

  switch (fichasType) {
    case "AMARELO":
      return renderBadge(
        "bg-yellow-500",
        "text-yellow-500",
        "#FFD700",
        "Amarelo"
      );
    case "VERDE":
      return renderBadge("bg-green-500", "text-green-500", "#55b02e", "Verde");
    case "VERMELHO":
      return renderBadge("bg-red-500", "text-red-500", "#FF0000", "Vermelho");
    case "ROSA":
      return renderBadge("bg-pink-500", "text-pink-500", "#FF69B4", "Rosa");
    case "LARANJA":
      return renderBadge(
        "bg-orange-500",
        "text-orange-500",
        "#FFA500",
        "Laranja"
      );
    case "AZUL":
      return renderBadge("bg-blue-500", "text-blue-500", "#1E90FF", "Azul");
    default:
      return renderBadge(
        "bg-gray-500",
        "text-gray-500",
        "#AAAAAA",
        "Tipo Não Definido"
      );
  }
};

export default FichasTypeBadgeCirculos;
