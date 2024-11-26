import { api } from "@/lib/axios";

export interface PegarUnicaTransactionBody {
  id: string;
  igrejaId: string;
  idUserEquipeDirigente: string;
}

export interface PegarUnicaTransactionResponse {
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
  };
}

export async function pegarUnicaTransaction({
  id,
  igrejaId,
  idUserEquipeDirigente,
}: PegarUnicaTransactionBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post<PegarUnicaTransactionResponse>(
      "/pegar_unica_transaction",
      { id, igrejaId, idUserEquipeDirigente },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Erro de autenticação");
    } else {
      throw new Error("Erro ao conectar com o servidor");
    }
  }
}
