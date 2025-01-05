import { api } from "@/lib/axios";

export interface PegarUnicaEquipeFichaBody {
  id: string;
  igrejaId: string;
  idUserEquipeDirigente: string;
}

export interface PegarUnicaEquipeFichaResponse {
  fichaEquipe: {
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
      | "CARAVANA";
    ano: string;
    funcao: "EQUIPISTA" | "COORDENADOR" | "ED" | "APOIO";
    avaliacao: "NEGATIVA" | "POSITIVA" | "NEUTRA";
    observacoes: string;
    tipoEncontro: "PRIMEIRA_ETAPA" | "CARAVANA" | "SEGUNDA_ETAPA";
  };
}

export async function pegarUnicaEquipeFicha({
  id,
  igrejaId,
  idUserEquipeDirigente,
}: PegarUnicaEquipeFichaBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post<PegarUnicaEquipeFichaResponse>(
      "/pegar_unica_equipe_ficha",
      { id, igrejaId, idUserEquipeDirigente },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Erro de autenticação");
    } else {
      throw new Error("Erro ao conectar com o servidor");
    }
  }
}
