import { ChevronDown, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { getProfileUser } from "@/api/get-profile-user";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { Dialog } from "./ui/dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { CanViemItemsAccountMenu } from "./can-view-items-account-menu";

const AccountMenu = () => {
  const navigate = useNavigate();
  const token = useAuthRedirect();

  if (!token) {
    return null;
  }

  const { data: profileUser, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profileUser"],
    queryFn: getProfileUser,
    staleTime: Infinity,
  });

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove o token do armazenamento local
    navigate("/sign-in"); // Redireciona para a página de login
  };

  // Lógica de visibilidade com base no setor do usuário
  const pasta = profileUser?.pasta;

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex select-none items-center gap-5 rounded-xl p-6"
          >
            <div className="flex">
              <Avatar className="mr-2 bg-white text-black h-8 w-8">
                <AvatarFallback className="bg-white text-black h-8">
                  {profileUser?.nome
                    ? profileUser.nome
                        .split(" ")
                        .map((n) => n.charAt(0).toUpperCase())
                        .join("")
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <p className="text-xs">{profileUser?.nome}</p>
                <p className="text-xs text-gray-400">{profileUser?.email}</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl">
          <DropdownMenuLabel className="flex flex-col">
            <span>
              {isLoadingProfile ? (
                <Skeleton className="h-4 w-40" />
              ) : (
                profileUser?.nome
              )}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {profileUser?.email}
            </span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {pasta && CanViemItemsAccountMenu(pasta)}

          <DropdownMenuItem
            className="text-rose-500 dark:text-rose-400 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
};

export default AccountMenu;
