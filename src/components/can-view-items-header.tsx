import {
  Megaphone,
  CalendarCheck,
  ChartNoAxesCombined,
  DollarSign,
  NotepadText,
  Puzzle,
  CirclePlay,
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

// Mapeamento dos valores de pasta para os ícones correspondentes
const pastaIcons: Record<string, React.ElementType> = {
  FINANCAS: DollarSign,
  FICHAS: NotepadText,
  POS: CirclePlay,
  MONTAGEM: Puzzle,
  PALESTRA: Megaphone,
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
  const iconClass = "h-4 w-4"; // Classe para o ícone com espaçamento

  // Obter o ícone correspondente à pasta
  const Icon = pastaIcons[pasta];

  return (
    <>
      {["FINANCAS", "FICHAS", "POS", "MONTAGEM", "PALESTRA"].includes(pasta) ? (
        <>
          <NavLink to="/">
            <ChartNoAxesCombined className={iconClass} />
            Dashboard
          </NavLink>
          <NavLink to={`/${pasta.toLowerCase()}`}>
            <Icon className={iconClass} />
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
            <DollarSign className={iconClass} />
            Finanças
          </NavLink>
          <NavLink to="/fichas">
            <NotepadText className={iconClass} />
            Fichas
          </NavLink>
          <NavLink to="/pos">
            <CirclePlay className={iconClass} />
            {pastaNames.POS} {/* Usando o nome formatado */}
          </NavLink>
          <NavLink to="/montagem">
            <Puzzle className={iconClass} />
            Montagem
          </NavLink>
          <NavLink to="/palestra">
            <Megaphone className={iconClass} />
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
