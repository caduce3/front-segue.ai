import { api } from "@/lib/axios";

export interface CadastrarEquipeFichaFichaBody {
  igrejaId: string;
  idUserEquipeDirigente: string;
  fichaId: string;
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
    | "MINI_MERCADO";
  ano: string;
  funcao: "EQUIPISTA" | "COORDENADOR" | "ED" | "APOIO";
  avaliacao: "NEGATIVA" | "POSITIVA" | "NEUTRA";
  observacoes?: string;
}

export async function cadastrarEquipeFichaFichaBody({
  igrejaId,
  idUserEquipeDirigente,
  fichaId,
  equipe,
  ano,
  funcao,
  avaliacao,
  observacoes,
}: CadastrarEquipeFichaFichaBody) {
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
