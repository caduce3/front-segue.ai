import { api } from "@/lib/axios";

export interface RegisterIgrejaBody {
  nome: string;
  cnpj: string;
  email: string;
  senha: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
}

export async function registerIgreja({
  nome,
  cnpj,
  email,
  senha,
  telefone,
  endereco,
  cidade,
  estado,
  cep,
}: RegisterIgrejaBody) {
  try {
    const response = await api.post("/cadastrar_igreja", {
      nome,
      cnpj,
      email,
      senha,
      telefone,
      endereco,
      cidade,
      estado,
      cep,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error registering user:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Erro ao cadastrar igreja."
      );
    } else {
      throw new Error("Erro ao conectar com o servidor");
    }
  }
}
