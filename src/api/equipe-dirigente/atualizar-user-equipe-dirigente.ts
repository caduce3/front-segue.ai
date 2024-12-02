import { api } from "@/lib/axios";

export interface PegarUnicoUserEquipeDirigenteBody {
  id: string;
  igrejaId: string;
  idUserEquipeDirigente: string;
  nome?: string;
  email?: string;
  telefone?: string;
  ano?: string;
  status?: "ATIVO" | "INATIVO";
  pasta?:
    | "FINANCAS"
    | "PADRE"
    | "PAROQUIA"
    | "FINANCAS"
    | "POS"
    | "MONTAGEM"
    | "PALESTRA"
    | "FICHAS";
}

export async function atualizarUnicoUserEquipeDirigente({
  id,
  igrejaId,
  idUserEquipeDirigente,
  nome,
  email,
  telefone,
  ano,
  status,
  pasta,
}: PegarUnicoUserEquipeDirigenteBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.put(
      "/atualizar_user_equipe_dirigente",
      {
        id,
        igrejaId,
        idUserEquipeDirigente,
        nome,
        email,
        telefone,
        ano,
        status,
        pasta,
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
        error.response.data?.message || "Erro ao atualizar usuário da ED."
      );
    } else {
      throw new Error("Erro ao conectar com o servidor");
    }
  }
}
