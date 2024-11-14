import { jwtDecode } from "jwt-decode"

interface MyTokenPayload {
    id: string;
    sector: string;
}

type AllowedSectors = "DESENVOLVIMENTO" | "GERENCIAL" | "TRAFEGO" | "RISCO" | "FINANCEIRO" | "AFILIADOS" | "USER";

export const verifyAccessByJwt = (token: string, allowedSectors: AllowedSectors[]) => {

    if (!token || token == '') {
        return null;
    }

    const decodToken = jwtDecode<MyTokenPayload>(token);

    if (!allowedSectors.includes(decodToken.sector as AllowedSectors)) {
        return false;
    }

    return true;
}