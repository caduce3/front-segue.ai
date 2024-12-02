import { api } from "@/lib/axios";

export interface CadastrarUserEquipeDirigenteBody {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  ano: string;
  igrejaId: string;
  pasta: "PALESTRA" | "FINANCAS" | "MONTAGEM" | "FICHAS" | "PADRE" | "POS";
}

export async function cadastrarUserEquipeDirigente({
  nome,
  email,
  senha,
  telefone,
  ano,
  igrejaId,
  pasta,
}: CadastrarUserEquipeDirigenteBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post(
      "/cadastrar_equipe_dirigente",
      {
        nome,
        email,
        senha,
        telefone,
        ano,
        igrejaId,
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
        error.response.data?.message || "Erro ao cadastrar usuário da ED."
      );
    } else {
      throw new Error("Erro ao conectar com o servidor");
    }
  }
}
