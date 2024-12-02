import { api } from "@/lib/axios";

export interface PegarUnicoUserEquipeDirigenteBody {
  id: string;
  igrejaId: string;
  idUserEquipeDirigente: string;
}

export interface PegarUnicoUserEquipeDirigenteResponse {
  id: string;
  nome: string;
  email: string;
  telefone: number;
  ano: string;
  igrejaId: string;
  status: "ATIVO" | "INATIVO";
  createdAt: string;
  updatedAt: string;
  pasta:
    | "FINANCAS"
    | "PADRE"
    | "PAROQUIA"
    | "FINANCAS"
    | "POS"
    | "MONTAGEM"
    | "PALESTRA"
    | "FICHAS";
}

export async function pegarUnicoUserEquipeDirigente({
  id,
  igrejaId,
  idUserEquipeDirigente,
}: PegarUnicoUserEquipeDirigenteBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post<PegarUnicoUserEquipeDirigenteResponse>(
      "/pegar_unico_user_equipe_dirigente",
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
