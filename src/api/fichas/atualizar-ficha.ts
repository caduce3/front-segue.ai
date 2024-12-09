import { api } from "@/lib/axios";

export interface AtualizarFichaBody {
  id: string;
  igrejaId: string;
  idUserEquipeDirigente: string;
  nomePastaFichas?: string;
  dataRecebimento?: string;
  nomeJovem?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  naturalidade?: string;
  filiacaoPai?: string;
  filiacaoMae?: string;
  escolaridade?:
    | "DOUTORADO"
    | "ENSINO_FUNDAMENTAL"
    | "ENSINO_FUNDAMENTAL_INCOMPLETO"
    | "ENSINO_MEDIO"
    | "ENSINO_MEDIO_INCOMPLETO"
    | "ENSINO_SUPERIOR_COMPLETO"
    | "ENSINO_SUPERIOR_INCOMPLETO"
    | "MESTRADO"
    | "POS_DOUTORADO"
    | "POS_GRADUACAO";
  religiao?: string;
  igrejaFrequenta?: string;
  sacramentos?: "BATISMO" | "CRISMA" | "EUCARISTIA" | "NENHUM";
  pastoral?:
    | "POVO_DA_RUA"
    | "CARIDADE"
    | "CATEQUESE"
    | "COMUNICACAO"
    | "FAMILIA"
    | "JOVENS"
    | "LITURGIA"
    | "MUSICA"
    | "SAUDE"
    | "OUTRO";
  nomeConvidadoPor?: string;
  telefoneConvidadoPor?: string;
  enderecoConvidadoPor?: string;
  observacoes?: string;
  anoEncontro?: string;
  corCirculoOrigem?: string;
}

export async function atualizarFicha({
  id,
  igrejaId,
  idUserEquipeDirigente,
  nomePastaFichas,
  dataRecebimento,
  nomeJovem,
  email,
  telefone,
  endereco,
  naturalidade,
  filiacaoPai,
  filiacaoMae,
  escolaridade,
  religiao,
  igrejaFrequenta,
  sacramentos,
  pastoral,
  nomeConvidadoPor,
  telefoneConvidadoPor,
  enderecoConvidadoPor,
  observacoes,
  anoEncontro,
  corCirculoOrigem,
}: AtualizarFichaBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.put(
      "/atualizar_ficha",
      {
        id,
        igrejaId,
        idUserEquipeDirigente,
        nomePastaFichas,
        dataRecebimento,
        nomeJovem,
        email,
        telefone,
        endereco,
        naturalidade,
        filiacaoPai,
        filiacaoMae,
        escolaridade,
        religiao,
        igrejaFrequenta,
        sacramentos,
        pastoral,
        nomeConvidadoPor,
        telefoneConvidadoPor,
        enderecoConvidadoPor,
        observacoes,
        anoEncontro,
        corCirculoOrigem,
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
        error.response.data?.message || "Erro ao atualizar a ficha."
      );
    } else {
      throw new Error("Erro ao conectar com o servidor");
    }
  }
}
