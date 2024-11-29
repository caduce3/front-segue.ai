import { api } from "@/lib/axios";

export interface DeletarUserEquipeDirigenteBody {
  igrejaId: string;
  idUserEquipeDirigente: string;
}

export interface DeletarUserEquipeDirigenteResponse {
  boolean: boolean;
}

export async function deletarUserEquipeDirigente({
  igrejaId,
  idUserEquipeDirigente,
}: DeletarUserEquipeDirigenteBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post<DeletarUserEquipeDirigenteResponse>(
      `/deletar_user_equipe_dirigente`,
      { igrejaId, idUserEquipeDirigente },
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
