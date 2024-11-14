import { jwtDecode } from "jwt-decode";

interface MyTokenPayload {
    id: string;
    sector: "DESENVOLVIMENTO" | "GERENCIAL" | "TRAFEGO" | "RISCO" | "FINANCEIRO" | "AFILIADOS" | "USER";
}

export const signInBySector = (token: string) => {
    if (!token) {
        return null;
    }

    const decodedToken = jwtDecode<MyTokenPayload>(token);

    const sectorsMap: { [key: string]: string } = {
        DESENVOLVIMENTO: "/",
        GERENCIAL: "/",
        TRAFEGO: "/trafego",
        RISCO: "/trafego",
        FINANCEIRO: "/trafego",
        AFILIADOS: "/trafego",
        USER: "/trafego",
    };

    // Verifica se o setor é válido e retorna o valor correspondente
    return sectorsMap[decodedToken.sector] || false;
};
