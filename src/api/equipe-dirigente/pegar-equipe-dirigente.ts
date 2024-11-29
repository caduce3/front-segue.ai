import { api } from "@/lib/axios";

export interface PegarEquipeDirigenteBody {
  page: number;
  igrejaId: string;
  idUserEquipeDirigente: string;
}

export interface PegarEquipeDirigenteResponse {
  totalItens: number;
  totalPages: number;
  currentPage: number;
  equipeDirigenteList: {
    id: string;
    nome: string;
    email: string;
    telefone: number;
    ano: string;
    igrejaId: string;
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
    igreja: {
      id: string;
      nome: string;
      email: string;
    };
  }[];
}

export async function pegarEquipeDirigente({
  page,
  igrejaId,
  idUserEquipeDirigente,
}: PegarEquipeDirigenteBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post<PegarEquipeDirigenteResponse>(
      "/pegar_equipe_dirigente",
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
