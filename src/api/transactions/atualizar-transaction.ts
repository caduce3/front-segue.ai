import { api } from "@/lib/axios";

export interface AtualizarTransactionBody {
  nome?: string;
  tipo?: string;
  valor?: number;
  categoria?:
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
  date?: Date;
  descricao?: string;
  igrejaId: string;
  idUserEquipeDirigente: string;
  id: string;
}

export async function atualizarTransaction({
  nome,
  tipo,
  valor,
  categoria,
  metodoPagamento,
  date,
  descricao,
  igrejaId,
  idUserEquipeDirigente,
  id,
}: AtualizarTransactionBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.put(
      "/atualizar_transaction",
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
        id,
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
        error.response.data?.message || "Erro ao atualizar transação."
      );
    } else {
      throw new Error("Erro ao conectar com o servidor");
    }
  }
}
