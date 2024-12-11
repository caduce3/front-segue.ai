import {
  Megaphone,
  CalendarCheck,
  ChartNoAxesCombined,
  DollarSign,
  NotepadText,
  Puzzle,
  CirclePlay,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { DropdownMenuItem } from "./ui/dropdown-menu"; // Importando o DropdownMenuItem

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

export function CanViemItemsAccountMenu(
  pasta:
    | "FINANCAS"
    | "FICHAS"
    | "POS"
    | "MONTAGEM"
    | "PALESTRA"
    | "PADRE"
    | "PAROQUIA"
) {
  const iconClass = "h-4 w-4 mr-1"; // Classe para o ícone com espaçamento

  // Obter o ícone correspondente à pasta
  const Icon = pastaIcons[pasta];

  return (
    <>
      {["FINANCAS", "FICHAS", "POS", "MONTAGEM", "PALESTRA"].includes(pasta) ? (
        <>
          <DropdownMenuItem className="cursor-pointer">
            <NavLink to="/" className="flex items-center">
              <ChartNoAxesCombined className={iconClass} />
              Dashboard
            </NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <NavLink
              to={`/${pasta.toLowerCase()}`}
              className="flex items-center"
            >
              {Icon && <Icon className={iconClass} />}
              {pastaNames[pasta]} {/* Usando o nome formatado */}
            </NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <NavLink to="/assinatura" className="flex items-center">
              <CalendarCheck className={iconClass} />
              Assinatura
            </NavLink>
          </DropdownMenuItem>
        </>
      ) : (
        <nav className="flex flex-col space-y-1">
          <DropdownMenuItem className="cursor-pointer">
            <NavLink to="/" className="flex items-center">
              <ChartNoAxesCombined className={iconClass} />
              Dashboard
            </NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <NavLink to="/financas" className="flex items-center">
              <DollarSign className={iconClass} />
              Finanças
            </NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <NavLink to="/fichas" className="flex items-center">
              <NotepadText className={iconClass} />
              Fichas
            </NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <NavLink to="/pos" className="flex items-center">
              <CirclePlay className={iconClass} />
              {pastaNames.POS} {/* Usando o nome formatado */}
            </NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <NavLink to="/montagem" className="flex items-center">
              <Puzzle className={iconClass} />
              Montagem
            </NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <NavLink to="/palestra" className="flex items-center">
              <Megaphone className={iconClass} />
              Palestra
            </NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <NavLink to="/assinatura" className="flex items-center">
              <CalendarCheck className={iconClass} />
              Assinatura
            </NavLink>
          </DropdownMenuItem>
        </nav>
      )}
    </>
  );
}
