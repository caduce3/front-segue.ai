import { api } from "@/lib/axios";

export interface PegarBalancoGeralBody {
  igrejaId: string;
  idUserEquipeDirigente: string;
  dateInit: string;
  dateFinish: string;
}

export interface PegarBalancoGeralResponse {
  total: {
    totalDepositos: number;
    totalInvestimentos: number;
    totalDespesas: number;
    balancoGeral: number;
  };
}

export async function pegarBalancoGeral({
  igrejaId,
  idUserEquipeDirigente,
  dateInit,
  dateFinish,
}: PegarBalancoGeralBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post<PegarBalancoGeralResponse>(
      "/somar_valor_total_tipo_transaction",
      { igrejaId, idUserEquipeDirigente, dateInit, dateFinish },
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
