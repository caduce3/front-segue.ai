import { api } from "@/lib/axios";

export interface PegarFichasMontagemBody {
  page: number;
  igrejaId: string;
  idUserEquipeDirigente: string;
  nomePastaFichas?: string;
  nomeJovem?: string;
  anoEncontro?: string;
  corCirculoOrigem?:
    | "AMARELO"
    | "AZUL"
    | "LARANJA"
    | "ROSA"
    | "VERDE"
    | "VERMELHO";
}

export interface PegarFichasMontagemResponse {
  totalItens: number;
  totalPages: number;
  currentPage: number;
  fichasList: {
    id: string;
    nomePastaFichas: string;
    dataRecebimento: string;
    nomeJovem: string;
    email: string;
    telefone: string;
    endereco: string;
    naturalidade: string;
    filiacaoPai: string;
    filiacaoMae: string;
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
    religiao: string;
    igrejaFrequenta: string;
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
    nomeConvidadoPor: string;
    telefoneConvidadoPor: string;
    enderecoConvidadoPor: string;
    observacoes: string;
    anoEncontro: string;
    corCirculoOrigem: string;
    createdAt: string;
    updatedAt: string;
    igrejaId: string;
    status: "ATIVO" | "INATIVO";
    equipeAtual:
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
      | "NENHUMA";
    FichaEquipe: {
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
        | "MINI_MERCADO";
      ano: string;
      funcao: "COORDENADOR" | "EQUIPISTA" | "ED";
      avaliacao: "NEGATIVO" | "POSITIVO" | "NORMAL";
      observacoes: string;
      createdAt: string;
      updatedAt: string;
      fichaId: string;
    }[];
  }[];
}

export async function pegarFichasMontagem({
  page,
  igrejaId,
  idUserEquipeDirigente,
  nomePastaFichas,
  nomeJovem,
  anoEncontro,
  corCirculoOrigem,
}: PegarFichasMontagemBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post<PegarFichasMontagemResponse>(
      "/pegar_fichas_montagem",
      {
        page,
        igrejaId,
        idUserEquipeDirigente,
        nomePastaFichas,
        nomeJovem,
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
      throw new Error(error.response.data?.message || "Erro de autenticação");
    } else {
      throw new Error("Erro ao conectar com o servidor");
    }
  }
}
