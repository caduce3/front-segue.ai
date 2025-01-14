import { api } from "@/lib/axios";

export interface CadastrarEquipeFichaBody {
  igrejaId: string;
  idUserEquipeDirigente: string;
  fichaId: string;
  equipe:
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
  ano: string;
  funcao: "EQUIPISTA" | "COORDENADOR" | "ED" | "APOIO";
  avaliacao: "NEGATIVA" | "POSITIVA" | "NEUTRA";
  tipoEncontro: "PRIMEIRA_ETAPA" | "CARAVANA" | "SEGUNDA_ETAPA";
  observacoes?: string;
}

export async function cadastrarEquipeFicha({
  igrejaId,
  idUserEquipeDirigente,
  fichaId,
  equipe,
  ano,
  funcao,
  avaliacao,
  observacoes,
  tipoEncontro,
}: CadastrarEquipeFichaBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post(
      "/cadastrar_equipe_ficha",
      {
        igrejaId,
        idUserEquipeDirigente,
        fichaId,
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
        error.response.data?.message || "Erro ao cadastrar a equipe na ficha."
      );
    } else {
      throw new Error("Erro ao conectar com o servidor");
    }
  }
}
