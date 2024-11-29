import { api } from "@/lib/axios";

export interface GastoPorCategoriaBody {
  igrejaId: string;
  idUserEquipeDirigente: string;
  dateInit: string;
  dateFinish: string;
}

export interface GastoPorCategoriaResponse {
  gastosPorCategoria: {
    categoria: string;
    total: number;
    porcentagem: number;
  }[];
}

export async function gastoPorCategoria({
  igrejaId,
  idUserEquipeDirigente,
  dateInit,
  dateFinish,
}: GastoPorCategoriaBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post<GastoPorCategoriaResponse>(
      "/gastos_por_categoria",
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
