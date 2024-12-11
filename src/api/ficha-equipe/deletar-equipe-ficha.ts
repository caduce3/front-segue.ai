import { api } from "@/lib/axios";

export interface DeletarEquipeFichaFichaBody {
  id: string;
  idUserEquipeDirigente: string;
  igrejaId: string;
}

export interface DeletarEquipeFichaResponse {
  boolean: boolean;
}

export async function deletarEquipeFicha({
  id,
  idUserEquipeDirigente,
  igrejaId,
}: DeletarEquipeFichaFichaBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post<DeletarEquipeFichaResponse>(
      `/deletar_equipe_ficha`,
      { id, idUserEquipeDirigente, igrejaId },
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
