import { api } from "@/lib/axios";

export interface CadastrarTransactionBody {
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
  metodoPagamento:
    | "PIX"
    | "DINHEIRO"
    | "CARTAO_CREDITO"
    | "CARTAO_DEBITO"
    | "TRANSFERENCIA_BANCARIA"
    | "BOLETO_BANCARIO"
    | "OUTRO";
  date: Date;
  descricao?: string;
  igrejaId: string;
  idUserEquipeDirigente: string;
}

export async function cadastrarTransaction({
  nome,
  tipo,
  valor,
  categoria,
  metodoPagamento,
  date,
  descricao,
  igrejaId,
  idUserEquipeDirigente,
}: CadastrarTransactionBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post(
      "/cadastrar_transaction",
      {
        nome,
        tipo,
        valor,
        categoria,
        metodoPagamento,
        date,
        descricao,
        igrejaId,
        idUserEquipeDirigente,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Erro ao cadastrar transação."
      );
    } else {
      throw new Error("Erro ao conectar com o servidor");
    }
  }
}
