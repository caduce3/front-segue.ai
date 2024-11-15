import { jwtDecode } from "jwt-decode";

interface MyTokenPayload {
    id: string;
    pasta: 'PAROQUIA' | 'PADRE' | 'FINANCAS' | 'MONTAGEM' | 'POS' | 'PALESTRA' | 'FICHAS';
}

export const signInByPasta = (token: string) => {
    if (!token) {
        return null;
    }

    const decodedToken = jwtDecode<MyTokenPayload>(token);

    const pastaMap: { [key: string]: string } = {
        PAROQUIA: "/",
        PADRE: "/",
        FINANCAS: "/financas",
        MONTAGEM: "/montagem",
        POS: "/pos",
        PALESTRA: "/palestra",
        FICHAS: "/fichas",
    };

    // Verifica se o setor é válido e retorna o valor correspondente
    return pastaMap[decodedToken.pasta] || false;
};
