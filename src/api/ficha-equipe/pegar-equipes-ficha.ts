import { api } from "@/lib/axios";

export interface PegarEquipesFichaBody {
  pageEquipe: number;
  igrejaId: string;
  idUserEquipeDirigente: string;
  fichaId: string;
}

export interface PegarEquipesFichaResponse {
  totalItens: number;
  totalPages: number;
  currentPage: number;
  equipesFichaList: {
    id: string;
    equipe:
      | "ANIMACAO"
      | "VIGILIA_PAROQUIAL"
      | "LITURGIA"
      | "CANTO"
      | "ESTACIONAMENTO"
      | "TAXI"
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
      | "CG";
    ano: string;
    funcao: "EQUIPISTA" | "COORDENADOR" | "ED" | "APOIO";
    avaliacao: "NEGATIVA" | "POSITIVA" | "NEUTRA";
    observacoes: string;
    createdAt: string;
    updatedAt: string;
    tipoEncontro: "PRIMEIRA_ETAPA" | "CARAVANA" | "SEGUNDA_ETAPA";
  }[];
}

export async function pegarEquipesFicha({
  pageEquipe,
  igrejaId,
  idUserEquipeDirigente,
  fichaId,
}: PegarEquipesFichaBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post<PegarEquipesFichaResponse>(
      "/pegar_equipes_ficha",
      {
        pageEquipe,
        igrejaId,
        idUserEquipeDirigente,
        fichaId,
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
      throw new Error(error.response.data?.message || "Erro de autenticação");
    } else {
      throw new Error("Erro ao conectar com o servidor");
    }
  }
}
