import { api } from "@/lib/axios";

export interface CadastrarFichaBody {
  igrejaId: string;
  idUserEquipeDirigente: string;
  nomePastaFichas: string;
  dataRecebimento: Date;
  nomeJovem: string;
  email: string;
  telefone: string;
  endereco: string;
  dataNascimento: Date;
  naturalidade: string;
  filiacaoPai?: string;
  filiacaoMae?: string;
  escolaridade:
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
  sacramentos: "BATISMO" | "CRISMA" | "EUCARISTIA" | "NENHUM";
  pastoral:
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
  anoEncontro: string;
  corCirculoOrigem:
    | "VERMELHO"
    | "AZUL"
    | "AMARELO"
    | "VERDE"
    | "LARANJA"
    | "ROSA";
}

export async function cadastrarFicha({
  igrejaId,
  idUserEquipeDirigente,
  nomePastaFichas,
  dataRecebimento,
  nomeJovem,
  email,
  telefone,
  endereco,
  dataNascimento,
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
}: CadastrarFichaBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post(
      "/cadastrar_ficha",
      {
        igrejaId,
        idUserEquipeDirigente,
        nomePastaFichas,
        dataRecebimento,
        nomeJovem,
        email,
        telefone,
        endereco,
        dataNascimento,
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
        error.response.data?.message || "Erro ao cadastrar a ficha."
      );
    } else {
      throw new Error("Erro ao conectar com o servidor");
    }
  }
}
