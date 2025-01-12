import { api } from "@/lib/axios";

export interface AtualizarEquipeFichaBody {
  id: string;
  igrejaId: string;
  idUserEquipeDirigente: string;
  equipe?:
    | "ANIMACAO"
    | "VIGILIA_PAROQUIAL"
    | "LITURGIA"
    | "CANTO"
    | "ESTACIONAMENTO"
    | "VISITACAO"
    | "LANCHE"
    | "COZINHA"
    | "SALA"
    | "FAXINA"
    | "ED_PALESTRA"
    | "ED_POS"
    | "ED_MONTAGEM"
    | "ED_FINANCAS"
    | "ED_FICHAS"
    | "CIRCULO"
    | "GRAFICA"
    | "MINI_MERCADO"
    | "CARAVANA"
    | "NENHUMA"
    | "CG"
    | "PROVER"
    | "ESPIRITUALIZADORA";
  ano?: string;
  funcao?: "EQUIPISTA" | "COORDENADOR" | "ED" | "APOIO";
  avaliacao?: "NEGATIVA" | "POSITIVA" | "NEUTRA";
  observacoes?: string;
  tipoEncontro?: "PRIMEIRA_ETAPA" | "CARAVANA" | "SEGUNDA_ETAPA";
}

export async function atualizarEquipeFicha({
  id,
  igrejaId,
  idUserEquipeDirigente,
  equipe,
  ano,
  funcao,
  avaliacao,
  observacoes,
  tipoEncontro,
}: AtualizarEquipeFichaBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.put(
      "/atualizar_equipe_ficha",
      {
        id,
        igrejaId,
        idUserEquipeDirigente,
        equipe,
        ano,
        funcao,
        avaliacao,
        observacoes,
        tipoEncontro,
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
        error.response.data?.message || "Erro ao atualizar a equipe da ficha."
      );
    } else {
      throw new Error("Erro ao conectar com o servidor");
    }
  }
}
