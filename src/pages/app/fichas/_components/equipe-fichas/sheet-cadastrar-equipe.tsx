import {
  cadastrarEquipeFicha,
  CadastrarEquipeFichaBody,
} from "@/api/ficha-equipe/cadastrar-equipe-ficha";
import {
  OPCOES_AVALIACAO,
  OPCOES_EQUIPES,
  OPCOES_FUNCAO,
  OPCOES_TIPO_ENCONTRO,
} from "@/components/_constants/equipe-fichas-traducoes";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { queryClient } from "@/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { NotepadText } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface CadastrarEquipeFichaSheetProps {
  igrejaId: string;
  idUserEquipeDirigente: string;
  pasta:
    | "FINANCAS"
    | "PADRE"
    | "POS"
    | "PALESTRA"
    | "PAROQUIA"
    | "MONTAGEM"
    | "FICHAS"
    | "";
  fichaId: string;
}

const cadastrarEquipeFichaSchema = z.object({
  equipe: z.enum(
    [
      "ANIMACAO",
      "VIGILIA_PAROQUIAL",
      "LITURGIA",
      "CANTO",
      "ESTACIONAMENTO",
      "TAXI",
      "LANCHE",
      "COZINHA",
      "SALA",
      "FAXINA",
      "ED_PALESTRA",
      "ED_POS",
      "ED_MONTAGEM",
      "ED_FINANCAS",
      "ED_FICHAS",
      "CIRCULO",
      "GRAFICA",
      "MINI_MERCADO",
      "CARAVANA",
    ],
    {
      message: "Equipe inválida",
    }
  ),
  ano: z
    .string()
    .trim()
    .min(4, { message: "Ano é obrigatório" })
    .max(4, { message: "Ano é obrigatório" }),
  funcao: z.enum(["EQUIPISTA", "COORDENADOR", "ED", "APOIO"], {
    message: "Função inválida",
  }),
  avaliacao: z.enum(["NEGATIVA", "POSITIVA", "NEUTRA"], {
    message: "Função inválida",
  }),
  observacoes: z.string().nullable().optional(),
  tipoEncontro: z.enum(["PRIMEIRA_ETAPA", "CARAVANA", "SEGUNDA_ETAPA"], {
    message: "Tipo de encontro inválido",
  }),
});

type CadastrarEquipeFichaFormValues = z.infer<
  typeof cadastrarEquipeFichaSchema
>;

const CadastrarEquipeFichaSheet = ({
  igrejaId,
  idUserEquipeDirigente,
  pasta,
  fichaId,
}: CadastrarEquipeFichaSheetProps) => {
  const form = useForm<CadastrarEquipeFichaFormValues>({
    resolver: zodResolver(cadastrarEquipeFichaSchema),
    defaultValues: {
      tipoEncontro: "PRIMEIRA_ETAPA",
      equipe: "ANIMACAO",
      ano: "",
      funcao: "EQUIPISTA",
      avaliacao: "NEUTRA",
      observacoes: "",
    },
  });

  const { reset } = form;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: cadastrarEquipeFichaFn } = useMutation({
    mutationFn: cadastrarEquipeFicha,
  });

  const [isOpen, setIsOpen] = useState(false);

  async function onSubmit(values: CadastrarEquipeFichaFormValues) {
    setIsSubmitting(true);

    try {
      const payload: CadastrarEquipeFichaBody = {
        igrejaId,
        idUserEquipeDirigente,
        fichaId: fichaId,
        ...values,
        observacoes: values.observacoes || undefined,
      };

      await cadastrarEquipeFichaFn(payload);
      toast.success("Equipe cadastrada com sucesso!");

      queryClient.invalidateQueries({ queryKey: ["equipes-ficha"] });

      reset();
      setIsOpen(false);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao cadastrar a equipe na ficha.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="flex items-center justify-between w-38 sm:w-40 rounded-full font-bold"
          disabled={pasta !== "FICHAS"}
        >
          <span className="text-xs sm:text-sm font-bold">Cadastrar Equipe</span>
          <NotepadText className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto ">
        <SheetHeader>
          <SheetTitle>Cadastrar Ficha</SheetTitle>
        </SheetHeader>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="tipoEncontro"
              render={({ field }) => (
                <FormItem className="w-full p-2">
                  <FormLabel>Tipo Encontro</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de encontro" />
                      </SelectTrigger>
                      <SelectContent>
                        {OPCOES_TIPO_ENCONTRO.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="equipe"
              render={({ field }) => (
                <FormItem className="w-full p-2">
                  <FormLabel>Equipe</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a equipe" />
                      </SelectTrigger>
                      <SelectContent>
                        {OPCOES_EQUIPES.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ano"
              render={({ field }) => (
                <FormItem className="w-full p-2">
                  <FormLabel>Ano do encontro</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o ano que fezo segue-me..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="funcao"
              render={({ field }) => (
                <FormItem className="w-full p-2">
                  <FormLabel>Função</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de função" />
                      </SelectTrigger>
                      <SelectContent>
                        {OPCOES_FUNCAO.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avaliacao"
              render={({ field }) => (
                <FormItem className="w-full p-2">
                  <FormLabel>Avaliação</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de avaliação" />
                      </SelectTrigger>
                      <SelectContent>
                        {OPCOES_AVALIACAO.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem className="w-full p-2">
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite as observações..."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Cancelar</Button>
              </SheetClose>
              <Button type="submit" disabled={isSubmitting}>
                Salvar
              </Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};

export default CadastrarEquipeFichaSheet;
