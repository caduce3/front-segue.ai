import { ChartNoAxesCombined, ChevronDown, Dices, LogOut, Rocket, UserRoundPen, Users } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { getProfileUser } from "@/api/get-profile-user";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { UserProfileDialog } from "./user-profile-dialog";
import { NavLink } from "./nav-link";

const AccountMenu = () => {
    const navigate = useNavigate();
    const token = useAuthRedirect();

    if (!token) {
        return null;
    }

    const { data: profileUser, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profileUser'],
        queryFn: getProfileUser,
        staleTime: Infinity
    });

    const handleLogout = () => {
        localStorage.removeItem('authToken');  // Remove o token do armazenamento local
        navigate('/sign-in');  // Redireciona para a página de login
    };

    // Lógica de visibilidade com base no setor do usuário
    const pasta = profileUser?.pasta;

    const canViewAllItems = pasta === 'PAROQUIA' || pasta === 'PADRE';
    const canViewOnlyFinancas = pasta === 'FINANCAS' ;

    return (
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex select-none items-center gap-2 rounded-xl">
                        <ChevronDown className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                    <DropdownMenuLabel className="flex flex-col">
                        <span>{isLoadingProfile ? <Skeleton className="h-4 w-40"/> : profileUser?.nome }</span>
                        <span className="text-xs font-normal text-muted-foreground">{profileUser?.email}</span>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {/* Se o usuário pode ver todos os itens */}
                    {canViewAllItems && (
                        <>
                            <DropdownMenuItem className="cursor-pointer">
                                <NavLink to="/" className="flex items-center">
                                    <ChartNoAxesCombined className="mr-2 h-4 w-4" />
                                    Dashboard
                                </NavLink>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <NavLink to="/financas" className="flex items-center">
                                    <Dices className="mr-2 h-4 w-4"/>
                                    Finanças
                                </NavLink>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <NavLink to="/fichas" className="flex items-center">
                                    <Users className="mr-2 h-4 w-4"/>
                                    Fichas
                                </NavLink>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <NavLink to="/pos" className="flex items-center">
                                    <Rocket className="mr-2 h-4 w-4"/>
                                    Pós
                                </NavLink>
                            </DropdownMenuItem>
                        </>
                    )}

                    {/* Se o usuário só pode ver o item "Tráfego" */}
                    {canViewOnlyFinancas && (
                        <DropdownMenuItem className="cursor-pointer">
                            <NavLink to="/trafego" className="flex items-center">
                                <Rocket className="mr-2 h-4 w-4"/>
                                Finanças
                            </NavLink>
                        </DropdownMenuItem>
                    )}

                    {/* Perfil e Logout sempre visíveis */}
                    <DialogTrigger asChild>
                        <DropdownMenuItem className="cursor-pointer">
                            <UserRoundPen className="mr-2 h-4 w-4"/>
                            <span>Meu perfil</span>
                        </DropdownMenuItem>
                    </DialogTrigger>

                    <DropdownMenuItem className="text-rose-500 dark:text-rose-400 cursor-pointer" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4"/>
                        <span>Sair</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <UserProfileDialog />
        </Dialog>
    );
}

export default AccountMenu;
