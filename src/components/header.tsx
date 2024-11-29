import { Separator } from "./ui/separator";
import { RocketIcon } from "lucide-react";
import AccountMenu from "./account-menu";
import { useQuery } from "@tanstack/react-query";
import { getProfileUser } from "@/api/get-profile-user";
import { canViewAll } from "./can-view-items-header";

const Header = () => {
  const { data: profileUser } = useQuery({
    queryKey: ["profileUser"],
    queryFn: getProfileUser,
    staleTime: Infinity,
  });

  const pasta = profileUser?.pasta;

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
            {pasta && canViewAll(pasta)}
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
