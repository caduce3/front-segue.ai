import { Button } from "@/components/ui/button";
import { LogInIcon, RocketIcon } from "lucide-react";
import fundoSgm from "@/assets/fundoSgm2.png";
import { useNavigate } from "react-router-dom";

const Apresentation = () => {
  const navigate = useNavigate();

  const navigateLogin = () => {
    navigate("/sign-in");
  };

  return (
    <div className="grid h-full grid-cols-1 md:grid-cols-[3fr_1.5fr]">
      {/* ESQUERDA */}
      <div className="mx-auto flex h-full w-full max-w-[550px] flex-col justify-center p-8">
        <div className="mb-8 flex items-end">
          <RocketIcon size={50} className="mr-2 text-[#E2B815]" />
          <h1 className="text-4xl font-bold">Segue.ai</h1>
        </div>
        <h2 className="mb-3 text-4xl font-bold">Bem-vindo</h2>
        <p className="text-muted-foreground mb-8">
          O Segue.ai é uma plataforma de gestão desenvolvida para apoiar o
          movimento Segue-me. Utilizando inteligência artificial, ela permite
          que a equipe dirigente acompanhe suas movimentações financeiras e
          recebam insights personalizados, facilitando o controle e a
          organização do movimento na sua paróquia.
        </p>
        <Button variant="outline" className="w-full cursor-pointer" onClick={navigateLogin}>
          <LogInIcon size={20} className="mr-2" />
          Fazer login ou Cadastrar Paróquia
        </Button>
      </div>
      {/* DIREITA */}
      <div className="relative hidden h-full w-full md:block">
        <img src={fundoSgm} alt="Trofeu.bet" className="object-cover" />
      </div>
    </div>
  );
};

export default Apresentation;
