import { env } from "@/env";

export interface GetRelatorioFtdsBody {
    page: number;
    dataInicial: string;
    dataFinal: string;
    utm_campaign: string;
    utm_content: string;
    utm_source: string;
    sortDirection: "asc" | "desc";
    sortField: "registros" | "valor_ftd" | "ftds";
}

export interface GetRelatorioFtdsResponse {
    totalRegistros: number;
    totalFtds: number;
    totalValorFtd: number;
    totalItens: number;
    totalPages: number;
    currentPage: number;
    relatorioFtds: {
        id_registro: number;
        utm_source: string;
        ftds: number;
        registros: number;
        valor_ftd: number | null;
        utm_content: string;
        utm_campaign: string;
    }[] | null;
}

export async function getRelatorioFtds({ page, dataInicial, dataFinal, utm_campaign, utm_content, utm_source, sortDirection, sortField }: GetRelatorioFtdsBody): Promise<GetRelatorioFtdsResponse> {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await fetch(env.VITE_URL_BANCO_TRAFEGO, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page,
                dataInicial,
                dataFinal,
                utm_campaign,
                utm_content,
                utm_source,
                sortDirection, 
                sortField
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao conectar com o servidor');
        }

        const [data]: GetRelatorioFtdsResponse[] = await response.json();
        return data;
    } catch (error: any) {
        if (error.message) {
            throw new Error(error.message);
        } else {
            throw new Error('Erro ao conectar com o servidor');
        }
    }
}
