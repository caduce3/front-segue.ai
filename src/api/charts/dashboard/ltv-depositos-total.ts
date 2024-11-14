import { api } from "@/lib/axios";

export interface TabelaLtvDepositosBody {
    startDate: string;
    endDate: string;
}

interface MonthlyDepositWithDrawalsData {
    totalAmount: number;
    depositAmountPerMonth: { [key: string]: { amount: number; percentage: number } };
    totalWithdrawals: number;
    depositWithdrawalsPerMonth: { [key: string]: { withdrawals: number; percentage: number } };
}

export interface TabelaLtvDepositosResponse {
    [key: string]: MonthlyDepositWithDrawalsData;
}


export async function TabelaLtvDepositosBody({ startDate, endDate }: TabelaLtvDepositosBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<TabelaLtvDepositosResponse>("/retornando_todos_ltv_deposits", {
            startDate,
            endDate
        }, {
            headers: {
                Authorization: `Bearer ${token}`
        }})
        
        console.log("RESPONSE: ", response.data);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || 'Erro de autenticação');
        } else {
            throw new Error('Erro ao conectar com o servidor');
        }
    }
}
