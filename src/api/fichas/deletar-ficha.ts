import { api } from "@/lib/axios";

export interface DeletarFichaBody {
  id: string;
  idUserEquipeDirigente: string;
}

export interface DeletarFichaResponse {
  boolean: boolean;
}

export async function deletarFicha({
  id,
  idUserEquipeDirigente,
}: DeletarFichaBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post<DeletarFichaResponse>(
      `/deletar_ficha`,
      { id, idUserEquipeDirigente },
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
