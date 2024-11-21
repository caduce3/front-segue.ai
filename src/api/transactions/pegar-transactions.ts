import { api } from "@/lib/axios";

export interface PegarTransactionsBody {
  page: number;
  igrejaId: string;
  idUserEquipeDirigente: string;
}

export interface PegarTransactionsResponse {
  totalItens: number;
  totalPages: number;
  currentPage: number;
  transactionsList: {
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
  }[];
}

export async function pegarTransactions({
  page,
  igrejaId,
  idUserEquipeDirigente,
}: PegarTransactionsBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post<PegarTransactionsResponse>(
      "/pegar_transactions",
      { page, igrejaId, idUserEquipeDirigente },
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
