import { api } from "@/lib/axios";

interface Igreja {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  createdAt: string;
  updatedAt: string;
  status: "ATIVO" | "INATIVO";
  pasta:
    | "PAROQUIA"
    | "PADRE"
    | "FINANCAS"
    | "MONTAGEM"
    | "POS"
    | "PALESTRA"
    | "FICHAS";
}

interface EquipeDirigente {
  id: string;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  ano: string;
  igrejaId: string;
  status: "ATIVO" | "INATIVO";
  createdAt: string;
  updatedAt: string;
  pasta:
    | "PAROQUIA"
    | "PADRE"
    | "FINANCAS"
    | "MONTAGEM"
    | "POS"
    | "PALESTRA"
    | "FICHAS";
}

export interface GetProfileUserResponse {
  usuario: Igreja | EquipeDirigente;
}

export async function getProfileUser() {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.get<GetProfileUserResponse>("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);

    return response.data.usuario; // Retorna apenas o objeto `user`
  } catch (error) {
    throw new Error("Failed to fetch user profile");
  }
}
