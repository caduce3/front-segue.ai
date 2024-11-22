import { Badge } from "@/components/ui/badge";
import { CircleIcon } from "lucide-react";

interface TransactionTypeBadgeProps {
  transaction: {
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

const TransactionTypeBadge = ({ transaction }: TransactionTypeBadgeProps) => {
  const transactionType = transaction.tipo;

  if (transactionType === "DEPOSITO") {
    return (
      <Badge className="bg-green-500 bg-opacity-10 font-bold text-green-500 hover:bg-muted">
        <CircleIcon className="mr-2" size={10} style={{ fill: "#55b02e" }} />
        Depósito
      </Badge>
    );
  }

  if (transactionType === "DESPESA") {
    return (
      <Badge className="bg-red-500 bg-opacity-10 font-bold text-red-500 hover:bg-muted">
        <CircleIcon className="mr-2" size={10} style={{ fill: "#FF0000" }} />
        Despesa
      </Badge>
    );
  }

  if (transactionType === "INVESTIMENTO") {
    return (
      <Badge className="bg-white bg-opacity-10 font-bold text-white hover:bg-muted">
        <CircleIcon className="mr-2" size={10} style={{ fill: "#FFFFFF" }} />
        Investimento
      </Badge>
    );
  }

  return (
    <Badge className="bg-gray-500 bg-opacity-10 font-bold text-gray-500 hover:bg-muted">
      <CircleIcon className="mr-2" size={10} style={{ fill: "#AAAAAA" }} />
      Tipo Não Definido
    </Badge>
  );
};

export default TransactionTypeBadge;
