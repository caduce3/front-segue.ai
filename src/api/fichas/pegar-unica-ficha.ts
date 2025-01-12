import { api } from "@/lib/axios";

export interface PegarUnicaFichaBody {
  id: string;
  igrejaId: string;
  idUserEquipeDirigente: string;
}

export interface PegarUnicaFichaResponse {
  ficha: {
    id: string;
    nomePastaFichas: string;
    dataRecebimento: string;
    nomeJovem: string;
    email: string;
    telefone: string;
    endereco: string;
    dataNascimento: string;
    naturalidade: string;
    filiacaoPai: string;
    filiacaoMae: string;
    escolaridade: string;
    religiao: string;
    igrejaFrequenta: string;
    sacramentos: string;
    pastoral: string;
    nomeConvidadoPor: string;
    telefoneConvidadoPor: string;
    enderecoConvidadoPor: string;
    observacoes: string;
    anoEncontro: string;
    corCirculoOrigem:
      | "VERMELHO"
      | "AZUL"
      | "AMARELO"
      | "VERDE"
      | "LARANJA"
      | "ROSA";
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
    funcaoEquipeAtual: "COORDENADOR" | "EQUIPISTA" | "ED" | "APOIO";
    FichaEquipe: {
      id: string;
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
      funcao: "COORDENADOR" | "EQUIPISTA" | "ED" | "APOIO";
      avaliacao: "NEGATIVO" | "POSITIVO" | "NORMAL";
      observacoes: string;
      createdAt: string;
      updatedAt: string;
      fichaId: string;
    }[];
  };
}

export async function pegarUnicaFicha({
  id,
  igrejaId,
  idUserEquipeDirigente,
}: PegarUnicaFichaBody) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await api.post<PegarUnicaFichaResponse>(
      "/pegar_unica_ficha",
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
