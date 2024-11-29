import {
  Book,
  CalendarCheck,
  ChartNoAxesCombined,
  Coins,
  NotepadText,
  Puzzle,
  Rocket,
} from "lucide-react";
import { NavLink } from "./nav-link";

// Mapeamento dos valores de pasta para nomes com acentuação correta
const pastaNames: Record<string, string> = {
  FINANCAS: "Finanças",
  FICHAS: "Fichas",
  POS: "Pós",
  MONTAGEM: "Montagem",
  PALESTRA: "Palestra",
  PADRE: "Padre",
  PAROQUIA: "Paróquia",
};

export function canViewAll(
  pasta:
    | "FINANCAS"
    | "FICHAS"
    | "POS"
    | "MONTAGEM"
    | "PALESTRA"
    | "PADRE"
    | "PAROQUIA"
) {
  const iconClass = "h-4 w-4 mr-2"; // Classe para o ícone com espaçamento

  return (
    <>
      {["FINANCAS", "FICHAS", "POS", "MONTAGEM", "PALESTRA"].includes(pasta) ? (
        <>
          <NavLink to="/">
            <ChartNoAxesCombined className={iconClass} />
            Dashboard
          </NavLink>
          <NavLink to={`/${pasta.toLowerCase()}`}>
            <Rocket className={iconClass} />
            {pastaNames[pasta]} {/* Usando o nome formatado */}
          </NavLink>
          <NavLink to="/assinatura">
            <CalendarCheck className={iconClass} />
            Assinatura
          </NavLink>
        </>
      ) : (
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <ChartNoAxesCombined className={iconClass} />
            Dashboard
          </NavLink>
          <NavLink to="/financas">
            <Coins className={iconClass} />
            Finanças
          </NavLink>
          <NavLink to="/fichas">
            <NotepadText className={iconClass} />
            Fichas
          </NavLink>
          <NavLink to="/pos">
            <Rocket className={iconClass} />
            {pastaNames.POS} {/* Usando o nome formatado */}
          </NavLink>
          <NavLink to="/montagem">
            <Puzzle className={iconClass} />
            Montagem
          </NavLink>
          <NavLink to="/palestra">
            <Book className={iconClass} />
            Palestra
          </NavLink>
          <NavLink to="/assinatura">
            <CalendarCheck className={iconClass} />
            Assinatura
          </NavLink>
        </nav>
      )}
    </>
  );
}
