import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OPCOES_CORES_CIRCULOS } from "@/components/_constants/fichas-traducoes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const fichasFilterSchema = z.object({
  nomePastaFichas: z.string().optional(),
  noveJovem: z.string().optional(),
  corCirculoOrigem: z.string().optional(),
  anoEncontro: z.string().optional(),
});

type FichasFilterSchema = z.infer<typeof fichasFilterSchema>;

const FichasTableFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const nomePastaFichas = searchParams.get("nomePastaFichas");
  const noveJovem = searchParams.get("noveJovem");
  const corCirculoOrigem = searchParams.get("corCirculoOrigem");
  const anoEncontro = searchParams.get("anoEncontro");

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<FichasFilterSchema>({
      resolver: zodResolver(fichasFilterSchema),
      defaultValues: {
        nomePastaFichas: nomePastaFichas ?? "",
        noveJovem: noveJovem ?? "",
        corCirculoOrigem: corCirculoOrigem ?? "",
        anoEncontro: anoEncontro ?? "",
      },
    });

  function handleFilter(data: FichasFilterSchema) {
    setSearchParams((state) => {
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          state.set(key, String(value));
        } else {
          state.delete(key);
        }
      });

      state.set("page", "1");
      return state;
    });
    setIsOpen(false);
  }

  function handleClearFilters() {
    reset({
      nomePastaFichas: "",
      noveJovem: "",
    });
    setSearchParams({});
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-between w-38 sm:w-40 rounded-full font-bold mr-2"
          onClick={() => setIsOpen(true)}
        >
          <span className="text-sm font-semibold">Filtros</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleFilter)}
          className="flex flex-col gap-4 p-4"
        >
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-4 w-full">
              <Label>Nome jovem / casal fichas</Label>
              <Input
                placeholder="Digite o nome do jovem ou casal fichas..."
                className="h-9 w-full"
                {...register("nomePastaFichas")}
              />
            </div>

            <div className="flex flex-col gap-4 w-full">
              <Label>Nome do jovem</Label>
              <Input
                placeholder="Digite o nome do jovem que fez o encontro..."
                className="h-9 w-full"
                {...register("noveJovem")}
              />
            </div>

            <div className="flex flex-col gap-4 w-full">
              <Label>Cor do círculo de origem</Label>
              <Select
                value={watch("corCirculoOrigem") || "all"} // Define o valor selecionado com "all" como padrão
                onValueChange={(value) =>
                  setValue("corCirculoOrigem", value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue>
                    {/* Placeholder dinâmico baseado no valor selecionado */}
                    {watch("corCirculoOrigem")
                      ? OPCOES_CORES_CIRCULOS.find(
                          (option) => option.value === watch("corCirculoOrigem")
                        )?.label || "Todas as cores"
                      : "Todas as cores"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {/* Opção "TODOS" com valor "all" */}
                  <SelectItem value="all">Todas as cores</SelectItem>
                  {OPCOES_CORES_CIRCULOS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <Label>Ano do encontro</Label>
              <Input
                placeholder="Ano em que fez o encontro..."
                className="h-9 w-full"
                {...register("anoEncontro")}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              className="flex-1"
            >
              <Search className="mr-2 h-4 w-4" />
              Filtrar resultados
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleClearFilters}
            >
              <X className="mr-2 h-4 w-4" />
              Remover filtros
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FichasTableFilters;
