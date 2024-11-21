import { Separator } from "./ui/separator";
import {
  CalendarCheck,
  ChartNoAxesCombined,
  Coins,
  NotepadText,
  Puzzle,
  Rocket,
  RocketIcon
} from "lucide-react";
import { NavLink } from "./nav-link";
import AccountMenu from "./account-menu";
import { useQuery } from "@tanstack/react-query";
import { getProfileUser } from "@/api/get-profile-user";

const Header = () => {
  const { data: profileUser } = useQuery({
    queryKey: ["profileUser"],
    queryFn: getProfileUser,
    staleTime: Infinity,
  });

  const pasta = profileUser?.pasta;

  const canViewAllItems = pasta === "PAROQUIA" || pasta === "PADRE" || pasta === 'FINANCAS';
  const canViewOnlyFinancas = pasta === "PAROQUIA";

  return (
    <div className="border-b ">
      <div className="flex h-16 items-center gap-6 px-6 justify-between">
        <div className="flex items-end">
          <RocketIcon size={30} className="mr-2 text-[#E2B815]" />
          <h1 className="text-2xl font-bold">Segue.ai</h1>
        </div>

        <div className="hidden sm:flex items-center space-x-4 lg:space-x-6">
          <Separator orientation="vertical" className="h-6" />

          <nav className="flex items-center space-x-4 lg:space-x-6">
            {/* Se o usuário pode ver todos os itens */}
            {canViewAllItems && (
              <>
                <NavLink to="/">
                  <ChartNoAxesCombined className="h-4 w-4" />
                  Dashboard
                </NavLink>
                <NavLink to="/financas">
                  <Coins className="h-4 w-4" />
                  Finanças
                </NavLink>
                <NavLink to="/fichas">
                  <NotepadText className="h-4 w-4" />
                  Fichas
                </NavLink>
                <NavLink to="/pos">
                  <Rocket className="h-4 w-4" />
                  Pós
                </NavLink>
                <NavLink to="/montagem">
                  <Puzzle className="h-4 w-4" />
                  Montagem
                </NavLink>
                <NavLink to="/assinatura">
                  <CalendarCheck className="h-4 w-4" />
                  Assinatura
                </NavLink>
              </>
            )}

            {/* Se o usuário só pode ver o item "Tráfego" */}
            {canViewOnlyFinancas && (
              <NavLink to="/financas">
                <Rocket className="h-4 w-4" />
                Finanças
              </NavLink>
            )}
          </nav>
        </div>

        {/* Account Menu */}
        <div className="ml-auto sm:flex items-center gap-2">
          <AccountMenu />
        </div>
      </div>
    </div>
  );
};

export default Header;
