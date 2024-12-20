import { api } from "@/lib/axios";

export interface DeletarTransactionBody {
  id: string;
  idUserEquipeDirigente: string;
}

export interface DeletarTransactionResponse {
  boolean: boolean;
}

export async function deletarTransaction({
  id,
  idUserEquipeDirigente,
}: DeletarTransactionBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post<DeletarTransactionResponse>(
      `/deletar_transaction`,
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
