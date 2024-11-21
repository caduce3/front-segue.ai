import { jwtDecode } from "jwt-decode"

interface MyTokenPayload {
    id: string;
    pasta: string;
}

type AllowedPastas = "PAROQUIA" | "PADRE" | "FINANCAS" | "POS" | "MONTAGEM" | "FICHAS" | "PALESTRA";

export const verifyAccessByJwt = (token: string, allowedPastas: AllowedPastas[]) => {

    if (!token || token == '') {
        return null;
    }

    const decodToken = jwtDecode<MyTokenPayload>(token);

    if (!allowedPastas.includes(decodToken.pasta as AllowedPastas)) {
        return false;
    }

    return true;
}